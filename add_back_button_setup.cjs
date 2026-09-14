const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

code = code.replace(
  '<div className="max-w-3xl mx-auto space-y-8 pb-12 mt-8">',
  `<div className="max-w-3xl mx-auto space-y-8 pb-12 mt-8 animate-fade-in">
        <button 
          onClick={() => setView('HOME')} 
          className="flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-2 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          QUAY LẠI TỔNG QUAN
        </button>`
);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
