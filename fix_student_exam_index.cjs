const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');

code = code.replace(
  "{ type: 'MULTIPLE_TAB', questionId: currentQ.id, timestamp: Date.now(), tabId: detectedTabId }",
  "{ type: 'MULTIPLE_TAB', questionId: currentQ.id, questionIndex: currentIndex + 1, timestamp: Date.now(), tabId: detectedTabId }"
);

fs.writeFileSync('src/pages/StudentExam.tsx', code);
