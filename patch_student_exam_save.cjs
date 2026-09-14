const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');

code = code.replace(
  "updateQuestion(updatedQ.id, updatedQ);\n            setEditingQuestion(null);",
  `updateQuestion(updatedQ.id, updatedQ);
            
            // Also update the current exam version so it takes effect immediately
            if (version) {
              const newQuestions = version.questions.map(q => q.id === updatedQ.id ? updatedQ : q);
              useAppStore.getState().updateExamVersion(version.id, { questions: newQuestions });
            }
            
            setEditingQuestion(null);`
);

fs.writeFileSync('src/pages/StudentExam.tsx', code);
console.log("Patched");
