const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf8');

// The error says missing tags on grade 10 and 11 objects (lines 220, 247, 288, 305, 322, 339, 356)
// Since these are all the mapped arrays, I'll just find options: [ and prepend tags: [], if it's missing.
// I will just use regex to replace `content: \`...\`,` with `content: \`...\`,\n  tags: [],` inside the new objects.
// Let's just do it directly on the generated arrays
content = content.replace(/content: \`([^\`]+)\`,(\n\s*)options: \[/g, "content: \`$1\`,\n  tags: [],$2options: [");

fs.writeFileSync('src/data/demoQuestions.ts', content);
