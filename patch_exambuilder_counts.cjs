const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamBuilder.tsx', 'utf8');

if (!code.includes('const [partCounts, setPartCounts] = useState')) {
    code = code.replace(
        "const [shuffleOptions, setShuffleOptions] = useState(true);",
        "const [shuffleOptions, setShuffleOptions] = useState(true);\n  const [partCounts, setPartCounts] = useState({ I: 12, II: 4, III: 6 });"
    );
    
    // reset partCounts when mode changes to CHUAN
    code = code.replace(
        "setParts(isThuongXuyen ? ['I'] : ['I', 'II', 'III']);",
        "setParts(isThuongXuyen ? ['I'] : ['I', 'II', 'III']);\n      setPartCounts({ I: isThuongXuyen ? 10 : 12, II: 4, III: 6 });"
    );

    code = code.replace(
        "lessonIds: scopeType === 'LESSON' ? [selectedLesson] : undefined,",
        "lessonIds: scopeType === 'LESSON' ? [selectedLesson] : undefined,\n      partCounts: mode === 'LINH_HOAT' ? partCounts : undefined,"
    );

    // Now render the number inputs next to the checkboxes if mode is LINH_HOAT
    const p1 = `<div className="font-semibold text-slate-800">Trắc nghiệm ABCD (Phần I)</div>
            </label>`;
    const p1New = `<div className="font-semibold text-slate-800">Trắc nghiệm ABCD (Phần I)</div>
            </label>
            {parts.includes('I') && mode === 'LINH_HOAT' && (
              <div className="pl-12 flex items-center gap-3">
                 <span className="text-sm text-slate-500">Số câu:</span>
                 <input type="number" min="1" max="50" value={partCounts.I} onChange={e => setPartCounts({...partCounts, I: parseInt(e.target.value) || 0})} className="w-20 px-3 py-1 rounded-lg border border-slate-300 outline-none" />
              </div>
            )}`;
            
    const p2 = `<div className="font-semibold text-slate-800">Trắc nghiệm Đúng / Sai (Phần II)</div>
                </label>`;
    const p2New = `<div className="font-semibold text-slate-800">Trắc nghiệm Đúng / Sai (Phần II)</div>
                </label>
                {parts.includes('II') && mode === 'LINH_HOAT' && (
                  <div className="pl-12 flex items-center gap-3">
                     <span className="text-sm text-slate-500">Số câu:</span>
                     <input type="number" min="1" max="20" value={partCounts.II} onChange={e => setPartCounts({...partCounts, II: parseInt(e.target.value) || 0})} className="w-20 px-3 py-1 rounded-lg border border-slate-300 outline-none" />
                  </div>
                )}`;

    const p3 = `<div className="font-semibold text-slate-800">Trả lời ngắn (Phần III)</div>
                </label>`;
    const p3New = `<div className="font-semibold text-slate-800">Trả lời ngắn (Phần III)</div>
                </label>
                {parts.includes('III') && mode === 'LINH_HOAT' && (
                  <div className="pl-12 flex items-center gap-3">
                     <span className="text-sm text-slate-500">Số câu:</span>
                     <input type="number" min="1" max="20" value={partCounts.III} onChange={e => setPartCounts({...partCounts, III: parseInt(e.target.value) || 0})} className="w-20 px-3 py-1 rounded-lg border border-slate-300 outline-none" />
                  </div>
                )}`;

    code = code.replace(p1, p1New);
    code = code.replace(p2, p2New);
    code = code.replace(p3, p3New);

    fs.writeFileSync('src/pages/ExamBuilder.tsx', code);
    console.log("Patched ExamBuilder with counts");
}
