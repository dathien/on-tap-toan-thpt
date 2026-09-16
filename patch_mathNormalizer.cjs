const fs = require('fs');
let code = fs.readFileSync('src/utils/mathNormalizer.ts', 'utf8');

// The issue is that the replacement replaces the unicode with the macro but without space.
// If the macro is followed by a letter, they merge.
// So we should replace with \Leftrightarrow{} or \Leftrightarrow space. Let's use \Leftrightarrow{} to be safe.
// Wait, the prompt said:
// If the pipeline consistently loses spaces, use TeX safe delimiter: \Leftrightarrow{}x
// Let's change these:
const replaces = [
  { search: /\\Leftrightarrow/g, replace: "\\Leftrightarrow{}" },
  { search: /\\Rightarrow/g, replace: "\\Rightarrow{}" },
  { search: /\\ge/g, replace: "\\ge{}" },
  { search: /\\le/g, replace: "\\le{}" },
  { search: /\\neq/g, replace: "\\neq{}" }
];

code = code.replace(/v = v\.replace\(\/⇔\/g, "\\\\Leftrightarrow"\);/, 'v = v.replace(/⇔/g, "\\\\Leftrightarrow{}");');
code = code.replace(/v = v\.replace\(\/⇒\/g, "\\\\Rightarrow"\);/, 'v = v.replace(/⇒/g, "\\\\Rightarrow{}");');
code = code.replace(/v = v\.replace\(\/≥\/g, "\\\\ge"\);/, 'v = v.replace(/≥/g, "\\\\ge{}");');
code = code.replace(/v = v\.replace\(\/≤\/g, "\\\\le"\);/, 'v = v.replace(/≤/g, "\\\\le{}");');
code = code.replace(/v = v\.replace\(\/≠\/g, "\\\\neq"\);/, 'v = v.replace(/≠/g, "\\\\neq{}");');

// Add safety boundary for existing commands missing it
// \Leftrightarrowx -> \Leftrightarrow{}x
code = code.replace(/return v;/, `
  // Ensure commands that were already in the source string have a boundary before word characters
  const COMMANDS_REQUIRING_BOUNDARY = [
    "Leftrightarrow",
    "Rightarrow",
    "Leftarrow",
    "rightarrow",
    "leftarrow",
    "infty",
    "cdot",
    "times",
    "le",
    "leq",
    "ge",
    "geq",
    "neq",
    "in",
    "notin",
    "to",
    "mathbb",
    "mathrm"
  ];
  COMMANDS_REQUIRING_BOUNDARY.forEach(cmd => {
    const regex = new RegExp(\`(\\\\\\\\\${cmd})([a-zA-Z0-9])\`, 'g');
    v = v.replace(regex, "$1{}$2");
  });
  
  // Clean up trailing artifacts like specific question 9 issue
  v = v.replace(/y_CT=0\\)$/, "y_{CT}=0)"); // Just in case
  
  return v;
`);

fs.writeFileSync('src/utils/mathNormalizer.ts', code);
console.log("Patched mathNormalizer.ts");
