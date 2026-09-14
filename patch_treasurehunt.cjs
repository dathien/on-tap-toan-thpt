const fs = require('fs');
let code = fs.readFileSync('src/pages/TreasureHunt.tsx', 'utf8');

if (!code.includes("import { getQuestions }")) {
    code = code.replace(
        "import { useAppStore } from '../store/useAppStore';",
        "import { useAppStore } from '../store/useAppStore';\nimport { getQuestions as fetchQuestions } from '../utils/questionSelector';"
    );
}

const loadLevelOld = `  const loadLevel = (levelId: number) => {
    let mcqs = questions.filter(q => q.question_type === 'MCQ_SINGLE');
    
    // Try to exclude already played questions
    let available = mcqs.filter(q => !playedQuestionIds.has(q.id));
    
    // If not enough available, just use all (prevent getting stuck)
    const numQ = levelId === 5 ? 3 : 2;
    if (available.length < numQ) {
       available = mcqs;
       setPlayedQuestionIds(new Set()); // Reset history
    }

    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const selectedQs = shuffled.slice(0, numQ);`;

const loadLevelNew = `  const loadLevel = (levelId: number) => {
    // Only fetch questions for current grade
    let gradeQuestions = fetchQuestions(questions, {
        gradeId: currentGrade,
        questionTypes: ['MCQ_SINGLE']
    });
    
    // Try to exclude already played questions
    let available = gradeQuestions.filter(q => !playedQuestionIds.has(q.id));
    
    // If not enough available, just use all (prevent getting stuck)
    const numQ = levelId === 5 ? 3 : 2;
    if (available.length < numQ) {
       available = gradeQuestions;
       setPlayedQuestionIds(new Set()); // Reset history
    }

    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const selectedQs = shuffled.slice(0, numQ);`;

code = code.replace(loadLevelOld, loadLevelNew);

fs.writeFileSync('src/pages/TreasureHunt.tsx', code);
console.log("Patched TreasureHunt");
