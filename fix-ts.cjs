const fs = require('fs');

let demo = fs.readFileSync('src/data/demoQuestions.ts', 'utf-8');
demo = demo.replace(/question_type: 'MCQ_SINGLE',/g, "question_type: 'MCQ_SINGLE' as const,");
demo = demo.replace(/question_type: 'TRUE_FALSE_GROUP',/g, "question_type: 'TRUE_FALSE_GROUP' as const,");
demo = demo.replace(/question_type: 'SHORT_ANSWER',/g, "question_type: 'SHORT_ANSWER' as const,");
demo = demo.replace(/difficulty: 1,/g, "difficulty: 1 as const,");
demo = demo.replace(/difficulty: 2,/g, "difficulty: 2 as const,");
demo = demo.replace(/difficulty: 3,/g, "difficulty: 3 as const,");
fs.writeFileSync('src/data/demoQuestions.ts', demo);
console.log("Fixed demoQuestions.ts types");

let examPrev = fs.readFileSync('src/pages/ExamPreview.tsx', 'utf-8');
if (!examPrev.includes("import { isDuplicateQuestion }")) {
  examPrev = examPrev.replace("import { shuffleArray } from '../utils/shuffle';", "import { shuffleArray } from '../utils/shuffle';\nimport { isDuplicateQuestion } from '../utils/textSanitizer';");
  fs.writeFileSync('src/pages/ExamPreview.tsx', examPrev);
  console.log("Fixed ExamPreview.tsx import");
}
