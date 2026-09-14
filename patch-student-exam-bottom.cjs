const fs = require('fs');
let content = fs.readFileSync('src/pages/StudentExam.tsx', 'utf-8');

const regexBottomNav = /\{\/\* Bottom Navigation \*\/\}\s*<div className="fixed bottom-0[\s\S]*?<\/div>\s*<\/div>\s*\);\s*\}/;

const newBottomNav = `{/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 md:p-4 pb-safe flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 gap-2">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
          className="flex-1 md:flex-none min-h-[44px] px-3 md:px-6 py-2 md:py-3 rounded-xl font-medium disabled:opacity-50 text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm md:text-base whitespace-nowrap"
        >
          ← Trước
        </button>
        
        <div className="text-sm font-medium text-slate-500 hidden md:block px-4">
          Đã làm: {Object.keys(answers).length} / {version.questions.length}
        </div>

        <button
          disabled={currentIndex === version.questions.length - 1}
          onClick={() => setCurrentIndex(prev => prev + 1)}
          className="flex-1 md:flex-none min-h-[44px] px-3 md:px-6 py-2 md:py-3 rounded-xl font-medium disabled:opacity-50 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors text-sm md:text-base whitespace-nowrap"
        >
          Tiếp →
        </button>

        <button
          onClick={handleSubmit}
          className="flex-1 md:hidden min-h-[44px] px-3 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors text-sm whitespace-nowrap"
        >
          Nộp bài
        </button>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận nộp bài</h3>
            {version.questions.length - Object.keys(answers).length > 0 ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
                <div className="flex gap-3">
                  <div className="text-amber-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800">Bạn chưa hoàn thành bài thi</p>
                    <p className="text-amber-700 text-sm mt-1">Đã làm: {Object.keys(answers).length}/{version.questions.length}</p>
                    <p className="text-amber-700 text-sm">Chưa làm: {version.questions.length - Object.keys(answers).length} câu.</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-600 mb-6">Bạn đã hoàn thành tất cả câu hỏi. Bạn có chắc chắn muốn nộp bài ngay bây giờ?</p>
            )}
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Quay lại
              </button>
              <button 
                onClick={() => handleConfirmSubmit(false)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

content = content.replace(regexBottomNav, newBottomNav);

fs.writeFileSync('src/pages/StudentExam.tsx', content);
