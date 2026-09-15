const katex = require('katex');
try {
  console.log(katex.renderToString("D=R\\{1\\}", { throwOnError: false }));
} catch (e) { console.log("Error 1"); }
try {
  console.log(katex.renderToString("D=R\\\\{1\\\\}", { throwOnError: false }));
} catch (e) { console.log("Error 2"); }
