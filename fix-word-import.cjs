const fs = require('fs');
let code = fs.readFileSync('src/pages/WordImport.tsx', 'utf8');

// fix options
code = code.replace(/<div key=\{opt.id\} className=\{`p-4 rounded-xl border-2 flex items-start gap-3 \$\{opt.isCorrect \? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50'\}`\}>\s*<span className=\{`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shrink-0 \$\{opt.isCorrect \? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'\}`\}>\s*\{\[\'A\',\'B\',\'C\',\'D\'\]\[i\]\}\s*<\/span>\s*<div className="flex-1 overflow-x-auto text-sm"><MathText text=\{opt.content\} \/><\/div>\s*<\/div>/g,
`<div key={opt.id} className={\`answer-option p-4 rounded-xl border-2 \${opt.isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50'}\`}>
                        <span className={\`answer-label w-6 h-6 rounded-full font-bold text-sm \${opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}\`}>
                          {['A','B','C','D'][i]}
                        </span>
                        <div className="answer-content text-sm"><MathText text={opt.content} /></div>
                      </div>`);

// fix true/false
code = code.replace(/<div key=\{stmt.id\} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">\s*<span className="font-bold text-slate-500">\{\[\'a\',\'b\',\'c\',\'d\'\]\[i\]\}\)<\/span>\s*<div className="flex-1 overflow-x-auto text-sm"><MathText text=\{stmt.content\} \/><\/div>\s*<span className=\{`px-3 py-1 rounded-md text-sm font-bold \$\{stmt.isTrue \? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'\}`\}>\s*\{stmt.isTrue \? 'ĐÚNG' : 'SAI'\}\s*<\/span>\s*<\/div>/g,
`<div key={stmt.id} className="answer-option p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <span className="answer-label font-bold text-slate-500">{['a','b','c','d'][i]})</span>
                        <div className="answer-content text-sm"><MathText text={stmt.content} /></div>
                        <span className={\`px-3 py-1 rounded-md text-sm font-bold \${stmt.isTrue ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}\`}>
                          {stmt.isTrue ? 'ĐÚNG' : 'SAI'}
                        </span>
                      </div>`);

// fix questions
code = code.replace(/<div className="flex-1 overflow-x-auto text-slate-700 font-medium">\s*<MathText text=\{q.content\} \/>\s*<\/div>/g,
`<div className="question-content question-text text-slate-700 font-medium">
                        <MathText text={q.content} />
                      </div>`);
code = code.replace(/<div className="text-lg font-medium text-slate-800 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">/g, '<div className="question-card text-lg font-medium text-slate-800 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">');

fs.writeFileSync('src/pages/WordImport.tsx', code);
console.log('done word');
