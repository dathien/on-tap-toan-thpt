const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf8');

// Fix mcq-visual-1
content = content.replace(
    'Hàm số nghịch biến trên khoảng $(0; 2)$',
    'Hàm số nghịch biến trên khoảng $(0; 1)$'
);

// Are there other math errors? 
// The test script only failed on mcq-visual-1. 
// Valid: 1, Invalid: 1. This means mcq-visual-2 passed. 
// Let's write back
fs.writeFileSync('src/data/demoQuestions.ts', content);
console.log("Patched demoQuestions.ts");
