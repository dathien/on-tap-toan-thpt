const fs = require('fs');
const content = fs.readFileSync('src/pages/Roadmap.tsx', 'utf-8');
const lines = content.split('\n');
let setupLines = [];
let capture = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("if (view === 'SETUP')")) {
    capture = true;
  }
  if (capture) {
    setupLines.push(lines[i]);
    if (lines[i].includes("const getQuestions = (count: number) => {")) {
      break;
    }
  }
}
console.log(setupLines.join('\n'));
