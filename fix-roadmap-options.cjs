const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

// Replace question texts
code = code.replace(/<div className="text-lg font-medium text-slate-800 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">\s*<MathText text=\{sanitizeQuestionText\(q\.content\)\} \/>\s*<\/div>/g,
`<div className="question-card text-lg font-medium text-slate-800 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="question-content question-text">
                        <MathText text={sanitizeQuestionText(q.content)} />
                      </div>
                    </div>`);
code = code.replace(/<div className="font-medium text-slate-800 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">\s*<MathText text=\{sanitizeQuestionText\(q\.content\)\} \/>\s*<\/div>/g,
`<div className="question-card font-medium text-slate-800 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                              <div className="question-content question-text">
                                <MathText text={sanitizeQuestionText(q.content)} />
                              </div>
                            </div>`);

// Replace grids
code = code.replace(/<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">/g, '<div className="answers-grid mt-4">');

// Replace labels (there are three instances)
code = code.replace(/<label \n\s*key=\{opt\.id\}\n\s*className=\{clsx\(\n\s*"flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",\n\s*quizAnswers\[q\.id\] === opt\.id \n\s*\? "border-indigo-600 bg-indigo-50" \n\s*: "border-slate-100 hover:border-indigo-200 bg-white"\n\s*\)\}\n\s*>/g,
`<label 
                                  key={opt.id}
                                  className={clsx(
                                    "answer-option p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    quizAnswers[q.id] === opt.id 
                                      ? "border-indigo-600 bg-indigo-50" 
                                      : "border-slate-100 hover:border-indigo-200 bg-white"
                                  )}
                                >`);
code = code.replace(/<label \n\s*key=\{opt\.id\}\n\s*className=\{clsx\(\n\s*"flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",\n\s*quizAnswers\[q\.id\] === opt\.id \n\s*\? "border-indigo-600 bg-indigo-50" \n\s*: "border-slate-100 hover:border-indigo-200 bg-white"\n\s*\)\}\n\s*>/g,
`<label 
                            key={opt.id}
                            className={clsx(
                              "answer-option p-4 rounded-xl border-2 cursor-pointer transition-all",
                              quizAnswers[q.id] === opt.id 
                                ? "border-indigo-600 bg-indigo-50" 
                                : "border-slate-100 hover:border-indigo-200 bg-white"
                            )}
                          >`);
// A 3rd time if necessary
code = code.replace(/<label \n\s*key=\{opt\.id\}\n\s*className=\{clsx\(\n\s*"flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",\n\s*quizAnswers\[q\.id\] === opt\.id \n\s*\? "border-indigo-600 bg-indigo-50" \n\s*: "border-slate-100 hover:border-indigo-200 bg-white"\n\s*\)\}\n\s*>/g,
`<label 
                            key={opt.id}
                            className={clsx(
                              "answer-option p-4 rounded-xl border-2 cursor-pointer transition-all",
                              quizAnswers[q.id] === opt.id 
                                ? "border-indigo-600 bg-indigo-50" 
                                : "border-slate-100 hover:border-indigo-200 bg-white"
                            )}
                          >`);

code = code.replace(/<span className=\{clsx\(\n\s*"w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border",\n\s*quizAnswers\[q\.id\] === opt\.id\n\s*\? "bg-indigo-600 text-white border-indigo-600"\n\s*: "bg-slate-100 text-slate-500 border-slate-200"\n\s*\)\}\n\s*>/g,
`<span className={clsx(
                                    "answer-label w-6 h-6 rounded-full font-bold border text-sm",
                                    quizAnswers[q.id] === opt.id
                                      ? "bg-indigo-600 text-white border-indigo-600"
                                      : "bg-slate-100 text-slate-500 border-slate-200"
                                  )}
                                >`);

code = code.replace(/<span className="flex-1 mt-0.5 text-sm font-medium">\n\s*<MathText text=\{sanitizeQuestionText\(opt\.content\)\} \/>\n\s*<\/span>/g,
`<span className="answer-content mt-0.5 text-sm font-medium">
                                    <MathText text={sanitizeQuestionText(opt.content)} />
                                  </span>`);
                                  
fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log('done roadmap');
