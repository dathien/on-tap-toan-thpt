const fs = require('fs');
let content = fs.readFileSync('src/data/mockTheory.ts', 'utf-8');
content = content.replace(/-\\infty/g, "-\\\\infty");
content = content.replace(/\+\\infty/g, "+\\\\infty");
fs.writeFileSync('src/data/mockTheory.ts', content);
