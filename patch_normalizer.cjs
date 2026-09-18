const fs = require('fs');
let code = fs.readFileSync('src/utils/mathNormalizer.ts', 'utf8');

// Add cleanup of zero-width and control characters
const stripInvisibles = `
  // Strip zero-width spaces and control characters (except newline/tab)
  v = v.replace(/[\\u200B-\\u200D\\uFEFF\\u200E\\u200F]/g, '');
`;

code = code.replace('let v = String(value).trim();', 'let v = String(value).trim();\n' + stripInvisibles);

// Fix y_CT everywhere, not just at the end
code = code.replace(/v = v\.replace\(\/y_CT=0\\\\\)\\\$\/, "y_\{CT\}=0\)"\);/, 'v = v.replace(/y_CT=0\\b/g, "y_{CT}=0");');
// wait, the old one was: v = v.replace(/y_CT=0\)$/, "y_{CT}=0)");
code = code.replace('v = v.replace(/y_CT=0\\)$/, "y_{CT}=0)");', 'v = v.replace(/y_CT=0/g, "y_{CT}=0");');

fs.writeFileSync('src/utils/mathNormalizer.ts', code);
console.log("Patched!");
