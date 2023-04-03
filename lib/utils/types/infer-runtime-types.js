// Infer runtime types from https://github.com/fhinkel/type-profile/tree/main
const inspector = require('inspector')
const { inspect } = require('util')

function deepLog(x) {
  console.log(inspect(x, {showHidden: false, depth: null, colors: true}))
}

inspector.Session.prototype.postAsync = function(...args) {
  let session = this;
  return new Promise(
    function(resolve, reject) {
      session.post(...args,
        function(error, result) {
          if (error !== null) {
            reject(error);
          } else if (result.exceptionDetails !== undefined) {
            reject(result.exceptionDetails.exception.description);
          } else {
            resolve(result);
          }
        });
    });
};

async function collectTypeProfile(source) {
  // Open a new inspector session.
  const session = new inspector.Session();
  let typeProfile = "";
  try {
    session.connect();
    // Enable relevant inspector domains.
    await session.postAsync('Runtime.enable');
    await session.postAsync('Profiler.enable');
    await session.postAsync('Profiler.startTypeProfile');
    // Compile script.
    let { scriptId } = await session.postAsync('Runtime.compileScript', {
      expression: source,
      sourceURL: "test",
      persistScript: true
    });
    // Execute script.
    await session.postAsync('Runtime.runScript', { scriptId });
    let { result } = await session.postAsync('Profiler.takeTypeProfile');
    console.log('result')
    deepLog(result);
    [{ entries: typeProfile }] = result.filter(x => x.scriptId == scriptId);   
  } finally {
    // Close session and return.
    session.disconnect();
  }
  return typeProfile;
}

function MarkUpCode(entries, source) {
  // Sort in reverse order so we can replace entries without invalidating
  // the other offsets.
  entries = entries.sort((a, b) => b.offset - a.offset);

  for (let entry of entries) {
    source = source.slice(0, entry.offset) + typeAnnotation(entry.types) +
      source.slice(entry.offset);
  }
  return source;
}

function typeAnnotation(types) {
  return `<font color="red"><b>/*${types.map(t => t.name).join(', ')}*/</b></font>`;
}

// Reformat string for HTML.
function Escape(string) {
  console.log(string);
  return [
    ["&", "&amp;"],
    [" ", "&nbsp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ["\r\n", "<br/>"],
    ["\n", "<br/>"],
    ["\"", "&quot;"],
  ].reduce(
    function(string, [pattern, replacement]) {
      return string.replace(new RegExp(pattern, "g"), replacement);
    }, string);
}

const source = `
(function() {
  function foo(x) {
    if (x < 2) {
      return 42;
    }
    return "What are the return types of foo?";
  }

  class Rectangle {};

  foo({});
  foo(1);
  foo(1.5);
  foo("some string");
  foo(true);
  foo(new Rectangle());
})();
`

collectTypeProfile(source).then((typeProfile) => {
  console.log('typeProfile', typeProfile)
  const codeWithTypes = MarkUpCode(typeProfile, source);
  console.log('codeWithTypes', codeWithTypes)
})