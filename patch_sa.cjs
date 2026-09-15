const fs = require('fs');
let content = fs.readFileSync('src/utils/docxParser.ts', 'utf-8');

const targetStr = `            question_type: 'SHORT_ANSWER',
            correct_answer: qDraft.answerText.replace(/,/g, '.').trim()
        };
        
        if (!shortQ.correct_answer) {`;

const replaceStr = `            question_type: 'SHORT_ANSWER',
            correctAnswer: qDraft.answerText.replace(/,/g, '.').trim()
        };
        
        if (!shortQ.correctAnswer) {`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/utils/docxParser.ts', content);
  console.log("Patched docxParser SA!");
} else {
  console.log("Target string not found for SA.");
}
