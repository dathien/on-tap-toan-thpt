const fs = require('fs');
let content = fs.readFileSync('src/pages/QuestionEditor.tsx', 'utf-8');

const startRegex = /let newQuestion: Question; \/\/ Keep this variable unused to bypass old code removal properly if needed\./;

// I'll just find the exact block to remove.
content = content.replace(/let newQuestion: Question; \/\/ Keep this variable unused[\s\S]*?addQuestion\(newQuestion\);\s*\}/, "");

fs.writeFileSync('src/pages/QuestionEditor.tsx', content);
