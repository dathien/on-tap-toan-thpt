const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');

code = code.replace(/className=\{`answer-option text-left p-4 rounded-xl border-2 transition-all \$\{\n\s*isSelected \? 'border-indigo-600 bg-indigo-50\/50' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'\n\s*\}`\}\n\s*>\n\s*>/g,
`className={\`answer-option text-left p-4 rounded-xl border-2 transition-all \${
                        isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                      }\`}
                    >`);

fs.writeFileSync('src/pages/StudentExam.tsx', code);
console.log('done');
