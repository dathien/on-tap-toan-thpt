const fs = require('fs');

let demo = fs.readFileSync('src/data/demoQuestions.ts', 'utf-8');
demo = demo.replace(/grade_id: 12,/g, "grade_id: 12 as const,");
fs.writeFileSync('src/data/demoQuestions.ts', demo);
console.log("Fixed demoQuestions.ts grades");

let examPrev = fs.readFileSync('src/pages/ExamPreview.tsx', 'utf-8');
if (!examPrev.includes("isDuplicateQuestion")) {
  examPrev = examPrev.replace("import { v4 as uuidv4 } from 'uuid';", "import { v4 as uuidv4 } from 'uuid';\nimport { isDuplicateQuestion } from '../utils/textSanitizer';");
  fs.writeFileSync('src/pages/ExamPreview.tsx', examPrev);
  console.log("Fixed ExamPreview.tsx import 2");
} else if (!examPrev.includes("import { isDuplicateQuestion }")) {
  // if it has the usage but not the import
  examPrev = examPrev.replace("import { v4 as uuidv4 } from 'uuid';", "import { v4 as uuidv4 } from 'uuid';\nimport { isDuplicateQuestion } from '../utils/textSanitizer';");
  fs.writeFileSync('src/pages/ExamPreview.tsx', examPrev);
  console.log("Fixed ExamPreview.tsx import 3");
}
