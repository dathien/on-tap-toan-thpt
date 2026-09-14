const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

// fix question text
code = code.replace(/<div className="mb-4 text-slate-800 text-lg">\s*<MathText text=\{sanitizeQuestionText\(q\.content\)\} \/>\s*<\/div>/g,
`<div className="question-content question-text mb-4 text-slate-800 text-lg">
                        <MathText text={sanitizeQuestionText(q.content)} />
                      </div>`);

// fix answers labels
code = code.replace(/className=\{clsx\(\n\s*"w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border",\n\s*quizAnswers\[q\.id\] === opt\.id \? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 text-slate-500 border-slate-200"\n\s*\)\}/g,
`className={clsx(
                              "answer-label w-6 h-6 rounded-full font-bold border text-sm",
                              quizAnswers[q.id] === opt.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 text-slate-500 border-slate-200"
                            )}`);
                            
// fix answers text
code = code.replace(/<span className="text-slate-700 font-medium pt-0.5">\s*<MathText text=\{sanitizeQuestionText\(opt\.content\)\} \/>\s*<\/span>/g,
`<span className="answer-content text-slate-700 font-medium pt-0.5">
                              <MathText text={sanitizeQuestionText(opt.content)} />
                            </span>`);
                            
fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log('done fixing labels');
