const fs = require('fs');
let code = fs.readFileSync('src/pages/TeacherResults.tsx', 'utf8');

code = code.replace(
  /<div className=\{clsx\("text-xl font-bold", attempt.score >= 8 \? "text-emerald-600" : attempt.score >= 6.5 \? "text-indigo-600" : attempt.score >= 5 \? "text-amber-500" : "text-red-500"\)\}>\s*\{attempt.score.toFixed\(1\)\}\s*<\/div>/g,
  `<div className="flex items-center gap-4">
    {attempt.antiCheatEvents?.length > 0 && (
      <div className="text-red-500 flex items-center gap-1 text-sm bg-red-50 px-2 py-1 rounded-lg" title="Phát hiện mở nhiều tab">
        <AlertCircle size={16} /> <span className="hidden sm:inline">Vi phạm</span>
      </div>
    )}
    <div className={clsx("text-xl font-bold", attempt.score >= 8 ? "text-emerald-600" : attempt.score >= 6.5 ? "text-indigo-600" : attempt.score >= 5 ? "text-amber-500" : "text-red-500")}>
      {attempt.score.toFixed(1)}
    </div>
  </div>`
);

fs.writeFileSync('src/pages/TeacherResults.tsx', code);
