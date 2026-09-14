const fs = require('fs');
let code = fs.readFileSync('src/pages/TreasureHunt.tsx', 'utf8');

const treasureButtonsOriginal = /<div className="flex flex-wrap justify-center gap-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}\s*return null;/;

const treasureButtonsNew = `
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-left grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={20}/> Đã vững:</h4>
              <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                <li>Tính đơn điệu của hàm số</li>
                <li>Công thức đạo hàm cơ bản</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><XCircle className="text-red-500" size={20}/> Cần luyện thêm:</h4>
              <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                <li>Cực trị hàm số lượng giác</li>
                <li>Hàm ẩn</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
             <button className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors">
               LUYỆN PHẦN YẾU
             </button>
             <button onClick={() => {
                setCurrentLevel(1);
                setXp(0);
                setStreak(0);
                setMaxStreak(0);
                setCorrectCount(0);
                setTotalAttempted(0);
                setGameState('MAP');
             }} className="px-6 py-3 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors">
               CHƠI LẠI
             </button>
             <button className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
               CHỌN BÀI KHÁC
             </button>
             <button onClick={() => window.location.href = '/roadmap'} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
               QUAY VỀ LỘ TRÌNH
             </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
`;

code = code.replace(treasureButtonsOriginal, treasureButtonsNew);

// Add react router dom to imports if needed
if (!code.includes("import { useNavigate }")) {
   code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useNavigate } from 'react-router-dom';");
   code = code.replace("const { currentGrade, questions } = useAppStore();", "const { currentGrade, questions } = useAppStore();\n  const navigate = useNavigate();");
   // replace window.location.href with navigate
   code = code.replace("window.location.href = '/roadmap'", "navigate('/roadmap')");
}

fs.writeFileSync('src/pages/TreasureHunt.tsx', code);
console.log('done');
