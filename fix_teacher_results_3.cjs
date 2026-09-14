const fs = require('fs');
let code = fs.readFileSync('src/pages/TeacherResults.tsx', 'utf8');

code = code.replace(
  "<div className=\"text-sm text-slate-500 mt-1\">{attempt.timeSpent} phút • {new Date(attempt.date).toLocaleDateString('vi-VN')}</div>",
  `<div className="text-sm text-slate-500 mt-1">{attempt.timeSpent} phút • {new Date(attempt.date).toLocaleDateString('vi-VN')}</div>
                        {attempt.antiCheatEvents?.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {attempt.antiCheatEvents.map((evt: any, i: number) => (
                              <div key={i} className="text-xs font-medium text-red-600 bg-red-50 inline-block px-2 py-1 rounded">
                                ⚠️ Cảnh báo: Phát hiện mở nhiều tab tại câu {evt.questionId || 'đang làm'} lúc {new Date(evt.timestamp).toLocaleTimeString('vi-VN')}
                              </div>
                            ))}
                          </div>
                        )}`
);

// Do the same for student attempt list
code = code.replace(
  "<div className=\"text-sm text-slate-500 mt-1\">{new Date(attempt.date).toLocaleDateString('vi-VN')} • {attempt.timeSpent} phút</div>",
  `<div className="text-sm text-slate-500 mt-1">{new Date(attempt.date).toLocaleDateString('vi-VN')} • {attempt.timeSpent} phút</div>
                        {attempt.antiCheatEvents?.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {attempt.antiCheatEvents.map((evt: any, i: number) => (
                              <div key={i} className="text-xs font-medium text-red-600 bg-red-50 inline-block px-2 py-1 rounded">
                                ⚠️ Cảnh báo: Phát hiện mở nhiều tab tại câu {evt.questionId || 'đang làm'} lúc {new Date(evt.timestamp).toLocaleTimeString('vi-VN')}
                              </div>
                            ))}
                          </div>
                        )}`
);

fs.writeFileSync('src/pages/TeacherResults.tsx', code);
