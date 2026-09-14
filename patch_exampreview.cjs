const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamPreview.tsx', 'utf8');

if (!code.includes("import { getQuestions }")) {
    code = code.replace(
        "import { validateQuestionVisual } from '../utils/visualValidator';",
        "import { validateQuestionVisual } from '../utils/visualValidator';\nimport { getQuestions } from '../utils/questionSelector';"
    );
}

const filterOld = `    // Filter questions by config's grade and validate visual
    const rawPool = allQuestions.filter(q => q.grade_id === examConfig.grade && validateQuestionVisual(q).valid);`;

const filterNew = `    // Filter questions by config's grade, scope, and validate visual
    let rawPool = getQuestions(allQuestions, {
      gradeId: examConfig.grade,
      topicIds: examConfig.topicIds,
      lessonIds: examConfig.lessonIds,
    });
    rawPool = rawPool.filter(q => validateQuestionVisual(q).valid);`;

code = code.replace(filterOld, filterNew);

fs.writeFileSync('src/pages/ExamPreview.tsx', code);
console.log("Patched ExamPreview filtering");
