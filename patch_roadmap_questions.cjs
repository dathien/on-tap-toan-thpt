const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

if (!code.includes("import { getQuestions as fetchQuestions }")) {
    code = code.replace(
        "import { useAppStore } from '../store/useAppStore';",
        "import { useAppStore } from '../store/useAppStore';\nimport { getQuestions as fetchQuestions } from '../utils/questionSelector';"
    );
}

const getQuestionsOld = `  const getQuestions = (count: number) => {
    // Just return some MCQ questions for demonstration
    return questions.filter(q => q.question_type === 'MCQ_SINGLE').slice(0, count);
  };`;

const getQuestionsNew = `  const getQuestions = (count: number) => {
    // Filter properly based on the current session lesson
    return fetchQuestions(questions, {
        gradeId: currentGrade,
        lessonId: session.id, // In roadmap, session.id corresponds to lesson.id (e.g., 'l13')
        questionTypes: ['MCQ_SINGLE'],
        count: count
    });
  };`;

code = code.replace(getQuestionsOld, getQuestionsNew);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched Roadmap");
