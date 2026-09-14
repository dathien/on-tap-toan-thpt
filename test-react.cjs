// just write a small test to see if backslash gets swallowed anywhere
const katex = require('katex');
console.log(katex.renderToString("$-\\infty$"));
console.log(katex.renderToString("-\\infty"));
