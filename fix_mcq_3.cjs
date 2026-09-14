const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf8');

// Fix mcq-visual-3
content = content.replace(
    '{ x: -1.15, y: 1.08, dashedToAxis: true, labelX: "-1", labelY: "1" }',
    '{ x: -1.15, y: 1.08, dashedToAxis: true, labelX: "-1", labelY: "2" }'
);
content = content.replace(
    '{ x: 1.15, y: -1.08, dashedToAxis: true, labelX: "1", labelY: "-1" }',
    '{ x: 1.15, y: -1.08, dashedToAxis: true, labelX: "1", labelY: "-2" }'
);

fs.writeFileSync('src/data/demoQuestions.ts', content);
console.log("Fixed mcq-visual-3");
