const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

code = code.replace(/getGridClass\(q\.options\)/g, "getGridClass((q as any).options)");
fs.writeFileSync('src/pages/Roadmap.tsx', code);

let sel = fs.readFileSync('src/utils/questionSelector.ts', 'utf8');
sel = sel.replace(
    'filtered = filtered.filter(q => filter.difficulty.includes(q.difficulty));',
    'filtered = filtered.filter(q => (filter.difficulty as number[]).includes(q.difficulty));'
);
fs.writeFileSync('src/utils/questionSelector.ts', sel);

console.log("Fixed build errors");
