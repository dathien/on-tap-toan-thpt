const fs = require('fs');
let code = fs.readFileSync('src/utils/mathNormalizer.ts', 'utf8');

code = code.replace(
  "const regex = new RegExp(`(\\\\\\$\\{cmd\\})([a-zA-Z0-9])`, 'g');",
  "const regex = new RegExp(`(\\\\\\$\\{cmd\\})([a-zA-Z0-9])(?![a-zA-Z])`, 'g');"
);

fs.writeFileSync('src/utils/mathNormalizer.ts', code);
console.log("Patched 2!");
