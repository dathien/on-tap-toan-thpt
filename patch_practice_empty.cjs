const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const regex = /\{!quizSubmitted \? \(\n\s*<>\n\s*\{practiceQuestions\.map\(\(q, i\) => \(/;

const replacement = `{!quizSubmitted ? (
                      practiceQuestions.length === 0 ? (
                        <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-slate-600 mb-4 font-medium">Chưa có câu hỏi luyện tập nào cho bài này.</p>
                          <button 
                            onClick={nextUnitOrAssessment}
                            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                          >
                            Bỏ qua & Đi tiếp
                          </button>
                        </div>
                      ) : (
                      <>
                        {practiceQuestions.map((q, i) => (`

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched practice empty state");
