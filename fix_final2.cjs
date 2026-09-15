const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf8');

content = content.replace(/question_type: 'MCQ_SINGLE' as const,\n  difficulty: \(\(i \% 4\) \+ 1\) as 1\|2\|3\|4,/g, "question_type: 'MCQ_SINGLE' as const,\n  difficulty: ((i % 4) + 1) as 1|2|3|4,\n  tags: [],");

fs.writeFileSync('src/data/demoQuestions.ts', content);
