const fs = require('fs');
let content = fs.readFileSync('src/utils/docxParser.ts', 'utf-8');

const targetStr = `                statementsList.push({
                    id: uuidv4(),
                    content: content,
                    is_correct: isCorrect
                });`;

const replaceStr = `                statementsList.push({
                    id: uuidv4(),
                    content: content,
                    isTrue: isCorrect
                });`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/utils/docxParser.ts', content);
  console.log("Patched docxParser statementsList!");
} else {
  console.log("Target string not found for TF.");
}
