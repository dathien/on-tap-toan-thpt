const fs = require('fs');
const content = fs.readFileSync('src/pages/ExamEditor.tsx', 'utf-8');

const targetStr = `<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Danh sách câu hỏi ({version.questions.length})</h3>`;

const replacement = `{version.questions.some(q => q.tags?.includes('imported')) && (
        <div className="bg-indigo-50 rounded-2xl shadow-sm border border-indigo-200 p-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">Tổng kết nhận diện câu hỏi</h3>
            <div className="flex gap-8">
                <div className="text-indigo-800">
                    Đã nhận diện: <strong>{version.questions.length} câu</strong>
                </div>
                <div className="text-emerald-700 font-medium">
                    ✓ {version.questions.filter(q => !q._importError).length} câu hoàn chỉnh
                </div>
                {version.questions.filter(q => q._importError).length > 0 && (
                    <div className="text-orange-700 font-medium">
                        ⚠ {version.questions.filter(q => q._importError).length} câu cần kiểm tra
                    </div>
                )}
            </div>
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Danh sách câu hỏi ({version.questions.length})</h3>`;

const newContent = content.replace(targetStr, replacement);
fs.writeFileSync('src/pages/ExamEditor.tsx', newContent);
console.log("Patched ExamEditor");
