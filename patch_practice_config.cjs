const fs = require('fs');
let code = fs.readFileSync('src/pages/PracticeConfig.tsx', 'utf8');

if (!code.includes('import { getQuestions }')) {
    code = code.replace(
        "import { useAppStore } from '../store/useAppStore';",
        "import { useAppStore } from '../store/useAppStore';\nimport { getQuestions } from '../utils/questionSelector';"
    );
}

const poolLogicOld = `    const pool = allQuestions.filter(q => q.grade_id === currentGrade);
    
    // Naive shuffle
    const shuffleArray = (array: any[]) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };`;

const poolLogicNew = `    const pool = getQuestions(allQuestions, {
      gradeId: currentGrade,
      topicId: scope === 'LESSON' || scope === 'TOPIC' ? topicId : undefined,
      lessonId: scope === 'LESSON' ? lessonId : undefined,
    });
    
    const shuffleArray = (array: any[]) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };`;

code = code.replace(poolLogicOld, poolLogicNew);

fs.writeFileSync('src/pages/PracticeConfig.tsx', code);
console.log("Patched PracticeConfig");
