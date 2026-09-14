const fs = require('fs');
let code = fs.readFileSync('src/pages/TreasureHunt.tsx', 'utf8');

const oldGrid = '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">';
const newGrid = '<div className="answers-grid mt-8">';
code = code.replace(oldGrid, newGrid);

const oldBtn = 'className={clsx(\n                    "text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all",\n                    btnClass\n                  )}';
const newBtn = 'className={clsx(\n                    "answer-option text-left p-4 rounded-xl border-2 transition-all",\n                    btnClass\n                  )}';
code = code.replace(oldBtn, newBtn);

const oldSpan1 = 'className={clsx(\n                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border",';
const newSpan1 = 'className={clsx(\n                    "answer-label w-7 h-7 rounded-full text-sm font-bold border",';
code = code.replace(oldSpan1, newSpan1);

const oldSpan2 = '<span className="font-medium pt-0.5">';
const newSpan2 = '<span className="answer-content font-medium pt-0.5">';
code = code.replace(oldSpan2, newSpan2);

fs.writeFileSync('src/pages/TreasureHunt.tsx', code);
console.log('done treasure');
