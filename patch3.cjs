const fs = require('fs');
let code = fs.readFileSync('src/utils/mathNormalizer.ts', 'utf8');

code = code.replace(
  /const regex = new RegExp\(\`\(\\\\\\\\\\\\\$\\{cmd\\}\)\(\[a-zA-Z0-9\]\)\`, 'g'\);/,
  "const regex = new RegExp(`(\\\\\\\\${cmd})([a-zA-Z0-9])(?![a-zA-Z])`, 'g');"
);
// fallback if regex replace fails
if (!code.includes("(?![a-zA-Z])")) {
  code = code.split("\n").map(line => {
    if (line.includes("new RegExp") && line.includes("[a-zA-Z0-9]")) {
      return "    const regex = new RegExp(`(\\\\\\\\${cmd})([a-zA-Z0-9])(?![a-zA-Z])`, 'g');";
    }
    return line;
  }).join("\n");
}

fs.writeFileSync('src/utils/mathNormalizer.ts', code);
console.log("Patched 3!");
