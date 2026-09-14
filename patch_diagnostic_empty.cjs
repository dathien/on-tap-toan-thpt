const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const regex = /\{!quizSubmitted \? \(\n\s*<>\n\s*<div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">/;

const replacement = `{!quizSubmitted ? (
            diagnosticQuestions.length === 0 ? (
                <div className="text-center p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Chưa có đủ câu hỏi phù hợp cho bài học này.</h3>
                  <button 
                    onClick={() => {
                        // Keep session alive but return to setup so they can change grade/topic
                        setView('SETUP');
                    }}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700"
                  >
                    Quay lại thiết lập
                  </button>
                </div>
            ) : (
            <>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched diagnostic empty state");
