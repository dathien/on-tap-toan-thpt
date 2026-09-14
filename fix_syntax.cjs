const fs = require('fs');
let code = fs.readFileSync('src/pages/CreateExam.tsx', 'utf8');

code = code.replace(`
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng câu (dự kiến)</label>
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={targetCount}
                  onChange={e => setTargetCount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />
          {/* Thiết lập nâng cao */}`, `
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng câu (dự kiến)</label>
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={targetCount}
                  onChange={e => setTargetCount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

          <div className="h-px bg-slate-100" />
          {/* Thiết lập nâng cao */}`);

fs.writeFileSync('src/pages/CreateExam.tsx', code);
