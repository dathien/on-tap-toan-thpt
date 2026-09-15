const fs = require('fs');
let code = fs.readFileSync('src/utils/mathNormalizer.ts', 'utf-8');
code = code.replace(/v = v\.replace\(\/\(\^\|\[\^\\\\\]\)\\btan\\b\/g, "\\$1\\\\tan"\);/, 
  'v = v.replace(/(^|[^\\\\])\\btan\\b/g, "$1\\\\tan");\n' +
  '  v = v.replace(/(^|[^\\\\])\\bsqrt\\b/g, "$1\\\\sqrt");\n' +
  '  v = v.replace(/(^|[^\\\\])\\bfrac\\b/g, "$1\\\\frac");\n' +
  '  v = v.replace(/(^|[^\\\\])\\bvec\\b/g, "$1\\\\vec");\n' +
  '  v = v.replace(/(^|[^\\\\])\\boverrightarrow\\b/g, "$1\\\\overrightarrow");\n' +
  '  v = v.replace(/(^|[^\\\\])\\bint\\b/g, "$1\\\\int");\n' +
  '  v = v.replace(/(^|[^\\\\])\\bsum\\b/g, "$1\\\\sum");'
);
fs.writeFileSync('src/utils/mathNormalizer.ts', code);
