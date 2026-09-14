const fs = require('fs');

let demo = fs.readFileSync('src/data/demoQuestions.ts', 'utf-8');
demo = demo.replace(/'-\\infty'/g, "'-\\\\infty'");
demo = demo.replace(/'\+\\infty'/g, "'+\\\\infty'");
fs.writeFileSync('src/data/demoQuestions.ts', demo);

let mock = fs.readFileSync('src/data/mockTheory.ts', 'utf-8');
mock = mock.replace(/"-\\infty"/g, '"-\\\\infty"');
mock = mock.replace(/"\+\\infty"/g, '"+\\\\infty"');
fs.writeFileSync('src/data/mockTheory.ts', mock);
