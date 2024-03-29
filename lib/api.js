
module.exports = function(comments) {
  var buf = [];

  comments.forEach(function(comment){
    if (comment.isPrivate) return;
    if (comment.ignore) return;
    var ctx = comment.ctx;
    var desc = comment.description;
    if (!ctx) return;
    if (~desc.text.indexOf('Module dependencies')) return;
    if (!ctx.text.indexOf('module.exports')) return;
    buf.push('### ' + context(comment));
    buf.push('');
    buf.push(desc.text.trim().replace(/^/gm, '  '));
    buf.push('');
  });

  buf = buf
    .join('\n')
    .replace(/^ *#/gm, '')

  var code = buf.match(/^( {4}[^\n]+\n*)+/gm) || [];

  code.forEach(function(block){
    var code = block.replace(/^ {4}/gm, '');
    buf = buf.replace(block, '```js\n' + code.trimRight() + '\n```\n\n');
  });

  return toc(buf) + '\n\n' + buf;
};

function toc(str) {
  return headings(str).map(function(h){
    var clean = h.title.replace(/\(.*?\)/, '()');
    return '  - [' + clean + '](#' + slug(h.title) + ')';
  }).join('\n');
}

function slug(str) {
  return str.replace(/\W+/g, '').toLowerCase();
}

function headings(str) {
  return (str.match(/^#+ *([^\n]+)/gm) || []).map(function(str){
    str = str.replace(/^(#+) */, '');
    return {
      title: str,
      level: RegExp.$1.length
    }
  });
}

function context(comment) {
  var ctx = comment.ctx;
  var tags = comment.tags;

  var alias = tags.map(function(tag) {
    return tag.tagType === 'alias' && tag.tagValue
  }).filter(Boolean);

  switch (ctx.type) {
    case 'function':
      var name = alias.pop() || ctx.name;
      return name + '(' + params(tags) + ')'
    case 'method':
      var name = alias.pop() || (ctx.cons || ctx.receiver) + '.' + ctx.name;
      return name + '(' + params(tags) + ')';
    default:
      return alias.pop() || ctx.text;
  }
}

function params(tags) {
  return tags.filter(function(tag){
    return tag.tagType == 'param';
  }).map(function(param){
    return param.name + ':' + param.types.join('|');
  }).join(', ');
}
