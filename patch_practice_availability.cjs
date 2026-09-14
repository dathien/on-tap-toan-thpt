const fs = require('fs');
let code = fs.readFileSync('src/pages/PracticeConfig.tsx', 'utf8');

const dynamicAvailableCode = `
  // Calculate available dynamically
  const pool = getQuestions(allQuestions, {
    gradeId: currentGrade,
    topicId: scope === 'LESSON' || scope === 'TOPIC' ? topicId : undefined,
    lessonId: scope === 'LESSON' ? lessonId : undefined,
  });
  
  const availableI = pool.filter(q => q.question_type === 'MCQ_SINGLE').length;
  const availableII = pool.filter(q => q.question_type === 'TRUE_FALSE_GROUP').length;
  const availableIII = pool.filter(q => q.question_type === 'SHORT_ANSWER').length;

  let totalRequested = 0;
  let totalAvailableForRequested = 0;
  
  if (parts.includes('I')) {
    totalRequested += questionCount;
    totalAvailableForRequested += Math.min(questionCount, availableI);
  }
  if (parts.includes('II') && !isThuongXuyen) {
    totalRequested += 4;
    totalAvailableForRequested += Math.min(4, availableII);
  }
  if (parts.includes('III') && !isThuongXuyen) {
    totalRequested += 6;
    totalAvailableForRequested += Math.min(6, availableIII);
  }
`;

if (!code.includes('// Calculate available dynamically')) {
    code = code.replace(
        "const handleStartPractice = () => {",
        `${dynamicAvailableCode}\n\n  const handleStartPractice = () => {`
    );
}

// Now replace the button UI to include the warning.
const buttonUIOld = `        <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-slate-200">
          <button 
            onClick={() => navigate('/practice')}
            className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            HỦY
          </button>
          <button 
            onClick={handleStartPractice}
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm text-lg"
          >
            BẮT ĐẦU LUYỆN
          </button>
        </div>`;

const buttonUINew = `        <div className="mt-8 pt-8 border-t border-slate-200">
          {totalAvailableForRequested < totalRequested && (
             <div className="mb-4 bg-orange-50 border border-orange-200 p-4 rounded-xl text-orange-800 text-sm">
                <p className="font-bold mb-1 flex items-center gap-2">
                   <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   Ngân hàng câu hỏi chưa đủ
                </p>
                <p>Bạn yêu cầu <b>{totalRequested}</b> câu, nhưng hiện chỉ có <b>{totalAvailableForRequested}</b> câu phù hợp với bài học/chủ đề này.</p>
                <p className="mt-1">Hệ thống sẽ <b>không</b> lấy thêm câu từ bài khác để tránh sai nội dung. Bạn vẫn có thể luyện tập với số câu hiện có, hoặc quay lại chọn bài khác.</p>
             </div>
          )}
          <div className="flex justify-end gap-4">
            <button 
              onClick={() => navigate('/practice')}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              CHỌN BÀI KHÁC
            </button>
            <button 
              onClick={handleStartPractice}
              disabled={totalAvailableForRequested === 0}
              className={\`px-8 py-3 font-bold rounded-xl transition-colors shadow-sm text-lg \${totalAvailableForRequested === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}\`}
            >
              {totalAvailableForRequested < totalRequested && totalAvailableForRequested > 0 ? \`HỌC VỚI \${totalAvailableForRequested} CÂU\` : 'BẮT ĐẦU LUYỆN'}
            </button>
          </div>
        </div>`;

code = code.replace(buttonUIOld, buttonUINew);

fs.writeFileSync('src/pages/PracticeConfig.tsx', code);
console.log("Patched Practice UI");
