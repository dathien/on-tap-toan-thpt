const katex = require('katex');
console.log("1:", katex.renderToString("D=R\\{1\\}", { throwOnError: false }));
console.log("2:", katex.renderToString("D=R\\\\{1}", { throwOnError: false }));
console.log("3:", katex.renderToString("D=R\\backslash\\{1\\}", { throwOnError: false }));
