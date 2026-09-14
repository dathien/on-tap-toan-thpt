const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const regex = /const getQuestions = \(count: number\) => \{[\s\S]*?count: count[\s\S]*?\}\);[\s\S]*?\};/;

const replacement = `const getQuestions = (count: number) => {
    if (session?.questions && session.questions.length > 0) {
        // Randomly pull from the pre-generated pool
        const shuffled = [...session.questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    return fetchQuestions(questions, {
        gradeId: currentGrade,
        questionTypes: ['MCQ_SINGLE'],
        count: count
    });
  };`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched 6");
