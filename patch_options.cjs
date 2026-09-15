const fs = require('fs');
let content = fs.readFileSync('src/utils/docxParser.ts', 'utf-8');

const targetStr = `        let hasAns = false;
        for (const k of optKeys) {
            const content = qDraft.options[k] ? qDraft.options[k].trim() : '';
            if (hasMeaningfulContent(content)) {
                const optId = uuidv4();
                optionsList.push({ id: optId, content: content });
                if (qDraft.correctAnswer === k || (qDraft.answerText && qDraft.answerText.toUpperCase().includes(k))) {
                    correctId = optId;
                    hasAns = true;
                }
            }
        }`;

const replaceStr = `        let hasAns = false;
        for (const k of optKeys) {
            const content = qDraft.options[k] ? qDraft.options[k].trim() : '';
            if (hasMeaningfulContent(content)) {
                const optId = uuidv4();
                const isCorrect = qDraft.correctAnswer === k || (qDraft.answerText && qDraft.answerText.toUpperCase().includes(k));
                optionsList.push({ id: optId, content: content, isCorrect: isCorrect });
                if (isCorrect) {
                    correctId = optId;
                    hasAns = true;
                }
            }
        }`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/utils/docxParser.ts', content);
  console.log("Patched docxParser optionsList!");
} else {
  console.log("Target string not found.");
}
