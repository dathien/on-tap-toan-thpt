const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');

const oldGrid = '<div className="grid grid-cols-1 gap-3">';
const newGrid = '<div className="answers-grid">';
code = code.replace(oldGrid, newGrid);

// Fix options button
code = code.replace(/<button\n\s*key=\{opt\.id\}\n\s*onClick=\{[\s\S]*?className=\{`flex items-start text-left p-4 rounded-xl border-2 transition-all \$\{([\s\S]*?)\}`\}/g,
`<button
                      key={opt.id}
                      onClick={() => setAnswer(currentQuestion.id, opt.id)}
                      className={\`answer-option text-left p-4 rounded-xl border-2 transition-all \$\{$1}\`}
                    >`);

// Fix labels
code = code.replace(/<span className=\{`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0 \$\{([\s\S]*?)\}`\}>/g, 
`<span className={\`answer-label w-8 h-8 rounded-full font-bold mr-4 \$\{$1}\`}>`);

// Fix content span
code = code.replace(/<div className="mt-1 flex-1 overflow-x-auto">\s*<MathText text=\{opt.content\} \/>\s*<\/div>/g, 
`<div className="answer-content font-medium pt-0.5">
                        <MathText text={opt.content} />
                      </div>`);

// Also fix TRUE_FALSE_GROUP
code = code.replace(/<div className="flex gap-3 mb-4">\s*<span className="font-bold text-slate-600">\{labels\[i\]\}\)<\/span>\s*<div className="flex-1 overflow-x-auto"><MathText text=\{stmt\.content\} \/><\/div>\s*<\/div>/g,
`<div className="answer-option mb-4 border-none p-0">
                        <span className="answer-label font-bold text-slate-600">{labels[i]})</span>
                        <div className="answer-content font-medium"><MathText text={stmt.content} /></div>
                      </div>`);

// Also fix QUESTION TEXT
// `<div className="text-lg font-medium text-slate-800 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">`
code = code.replace(/<div className="text-lg font-medium text-slate-800 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">\s*<MathText text=\{currentQuestion.content\} \/>\s*<\/div>/g,
`<div className="question-card text-lg font-medium text-slate-800 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="question-content question-text">
                <MathText text={currentQuestion.content} />
              </div>
            </div>`);

fs.writeFileSync('src/pages/StudentExam.tsx', code);
console.log('done student-exam');
