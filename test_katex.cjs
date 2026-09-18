const katex = require('katex');
try {
  console.log("TEST 1:", katex.renderToString("f'(x)=0\\Leftrightarrow{}x^2-4=0\\Leftrightarrow{}x=-2"));
} catch (e) { console.error("ERR 1:", e.message); }
