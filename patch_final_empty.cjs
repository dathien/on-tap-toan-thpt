const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const regex = /\{!quizSubmitted \? \(\n\s*<>\n\s*<div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">/;

const replacement = `{!quizSubmitted ? (
               finalQuestions.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-600 mb-4 font-medium">Chưa có câu hỏi kiểm tra nào cho bài này.</p>
                  <button 
                    onClick={() => {
                        setSession({
                            ...session,
                            status: 'COMPLETED',
                            finalScore: 10,
                            progress: 100
                        });
                    }}
                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                  >
                    Bỏ qua & Hoàn thành
                  </button>
                </div>
               ) : (
              <>
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched final empty state");
