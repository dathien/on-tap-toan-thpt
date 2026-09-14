const fs = require('fs');
const content = fs.readFileSync('src/data/demoQuestions.ts', 'utf8');
const matches = content.match(/id: `(?:mcq|tf|sa)[^`]+`/g);
console.log("Total questions: " + (matches ? matches.length : 0));
