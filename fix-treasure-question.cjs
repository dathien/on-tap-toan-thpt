const fs = require('fs');
let code = fs.readFileSync('src/pages/TreasureHunt.tsx', 'utf8');

const oldQ = '<div className="text-lg text-slate-800 mb-6">\n            <MathText text={sanitizeQuestionText(q.content)} />\n          </div>';
const newQ = '<div className="question-content question-text text-lg text-slate-800 mb-6">\n            <MathText text={sanitizeQuestionText(q.content)} />\n          </div>';
code = code.replace(oldQ, newQ);

// and also the wrapper card
code = code.replace('<div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">', '<div className="question-card bg-white p-8 rounded-2xl shadow-sm border border-slate-200">');

fs.writeFileSync('src/pages/TreasureHunt.tsx', code);
console.log('done treasure q');
