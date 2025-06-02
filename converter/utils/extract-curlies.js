function extractOutermostCurlyBrackets(str) {
  const matches = [];
  let count = 0;
  let start = -1;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '{') {
      if (count === 0) {
        start = i;
      }
      count++;
    } else if (str[i] === '}') {
      count--;
      if (count === 0 && start !== -1) {
        matches.push(str.substring(start, i + 1));
        start = -1;
      }
    }
  }
  return matches;
}

module.exports = {
  extractOutermostCurlyBrackets
}