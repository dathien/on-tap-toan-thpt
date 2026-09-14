const fs = require('fs');
let content = fs.readFileSync('src/pages/StudentResult.tsx', 'utf-8');

// We need to patch the stats calculation
const oldStatsCalc = `    version.questions.forEach(q => {
      const ans = attempt.answers[q.id];
      levelStats[q.difficulty].total += 1;
      typeStats[q.question_type].total += 1;

      if (ans === undefined || ans === null || ans === '') {
        unanswered += 1;
      } else {
        let isCorrect = false;
        if (q.question_type === 'MCQ_SINGLE') {
          const correctOpt = q.options.find(o => o.isCorrect);
          isCorrect = correctOpt && correctOpt.id === ans;
        } else if (q.question_type === 'SHORT_ANSWER') {
          isCorrect = String(ans).trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        } else if (q.question_type === 'TRUE_FALSE_GROUP') {
          // Check if at least some were correct - simplify by considering 4/4 correct as full correct for stats
          const ansMap = ans as Record<string, boolean>;
          let correctStmts = 0;
          q.statements.forEach(stmt => {
            if (ansMap[stmt.id] === stmt.isTrue) correctStmts++;
          });
          isCorrect = correctStmts === q.statements.length;
        }
        
        if (isCorrect) {
          correct += 1;
          levelStats[q.difficulty].correct += 1;
          typeStats[q.question_type].correct += 1;
        } else {
          wrong += 1;
        }
      }
    });`;

const newStatsCalc = `    version.questions.forEach(q => {
      const ans = attempt.answers[q.id];
      const diff = (q.difficulty as 1|2|3|4) || 2;
      const type = q.question_type || 'MCQ_SINGLE';
      
      if (!levelStats[diff]) levelStats[diff] = { correct: 0, total: 0 };
      if (!typeStats[type as keyof typeof typeStats]) typeStats[type as keyof typeof typeStats] = { correct: 0, total: 0 };

      levelStats[diff].total += 1;
      typeStats[type as keyof typeof typeStats].total += 1;

      if (ans === undefined || ans === null || ans === '') {
        unanswered += 1;
      } else {
        let isCorrect = false;
        if (q.question_type === 'MCQ_SINGLE') {
          const correctOpt = q.options?.find(o => o.isCorrect);
          isCorrect = correctOpt && correctOpt.id === ans;
        } else if (q.question_type === 'SHORT_ANSWER') {
          isCorrect = String(ans).trim().toLowerCase() === (q.correctAnswer || '').trim().toLowerCase();
        } else if (q.question_type === 'TRUE_FALSE_GROUP') {
          const ansMap = (ans as Record<string, boolean>) || {};
          let correctStmts = 0;
          if (q.statements) {
            q.statements.forEach(stmt => {
              if (ansMap[stmt.id] === stmt.isTrue) correctStmts++;
            });
            isCorrect = correctStmts === q.statements.length;
          }
        }
        
        if (isCorrect) {
          correct += 1;
          levelStats[diff].correct += 1;
          typeStats[type as keyof typeof typeStats].correct += 1;
        } else {
          wrong += 1;
        }
      }
    });`;

if (content.includes('levelStats[q.difficulty].total += 1;')) {
    content = content.replace(oldStatsCalc, newStatsCalc);
    fs.writeFileSync('src/pages/StudentResult.tsx', content);
    console.log("Patched successfully");
} else {
    console.log("Could not find the target string to replace");
}
