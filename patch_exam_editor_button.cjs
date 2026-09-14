const fs = require('fs');
const content = fs.readFileSync('src/pages/ExamEditor.tsx', 'utf-8');

const targetStr = `<h2 className="text-2xl font-bold text-slate-800">Chỉnh sửa Đề thi</h2>
      </div>`;

const replacement = `<h2 className="text-2xl font-bold text-slate-800">Chỉnh sửa Đề thi</h2>
      </div>
      <div className="flex justify-end mb-4">
         <button onClick={() => navigate('/exam-preview/' + exam.id)} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
            XEM TRƯỚC (PREVIEW)
         </button>
      </div>`;

const newContent = content.replace(targetStr, replacement);
fs.writeFileSync('src/pages/ExamEditor.tsx', newContent);
console.log("Patched ExamEditor button");
