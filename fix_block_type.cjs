const fs = require('fs');
let code = fs.readFileSync('src/components/QuestionContentRenderer.tsx', 'utf-8');
code = code.replace(/const blocks = \[\];/g, 'const blocks: { type: "text" | "math", value: string, displayMode?: boolean }[] = [];');
fs.writeFileSync('src/components/QuestionContentRenderer.tsx', code);
