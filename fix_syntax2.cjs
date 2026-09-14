const fs = require('fs');
let code = fs.readFileSync('src/pages/CreateExam.tsx', 'utf8');

const lines = code.split('\n');
const fixedLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  if (i === 226) {
    // This is the closing tag for "Thời gian làm bài"
    fixedLines.push(lines[i]);
    // Inject "Số lượng câu"
    fixedLines.push(`              <div>`);
    fixedLines.push(`                <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng câu (dự kiến)</label>`);
    fixedLines.push(`                <input type="number" min="1" max="100" value={targetCount} onChange={e => setTargetCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />`);
    fixedLines.push(`              </div>`);
  } else if (i >= 230 && i <= 242) {
    // Skip the badly injected lines
    continue;
  } else {
    fixedLines.push(lines[i]);
  }
}

fs.writeFileSync('src/pages/CreateExam.tsx', fixedLines.join('\n'));
