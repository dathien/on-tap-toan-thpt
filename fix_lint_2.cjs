const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

code = code.replace(
    /const generateRoadmapQuestions = \(\) => \{/,
    'function generateRoadmapQuestions() {'
);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Fixed generateRoadmapQuestions");
