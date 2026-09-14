const fs = require('fs');
let code = fs.readFileSync('src/pages/TeacherResults.tsx', 'utf8');

// For student detail view
code = code.replace(
  "                      <div className=\"text-xl font-bold text-indigo-600\">{attempt.score.toFixed(1)}</div>",
  `                      <div className="flex items-center gap-4">
                        {attempt.antiCheatEvents?.length > 0 && (
                          <div className="text-red-500 flex items-center gap-1 text-sm bg-red-50 px-2 py-1 rounded-lg" title="Phát hiện mở nhiều tab">
                            <AlertCircle size={16} /> <span className="hidden sm:inline">Vi phạm</span>
                          </div>
                        )}
                        <div className="text-xl font-bold text-indigo-600">{attempt.score.toFixed(1)}</div>
                      </div>`
);

// We need to also modify the selectedExam attempts list
code = code.replace(
  "                      <div className=\"text-xl font-bold text-indigo-600\">{attempt.score.toFixed(1)}</div>",
  `                      <div className="flex items-center gap-4">
                        {attempt.antiCheatEvents?.length > 0 && (
                          <div className="text-red-500 flex items-center gap-1 text-sm bg-red-50 px-2 py-1 rounded-lg" title="Phát hiện mở nhiều tab">
                            <AlertCircle size={16} /> <span className="hidden sm:inline">Vi phạm</span>
                          </div>
                        )}
                        <div className="text-xl font-bold text-indigo-600">{attempt.score.toFixed(1)}</div>
                      </div>`
);

fs.writeFileSync('src/pages/TeacherResults.tsx', code);
