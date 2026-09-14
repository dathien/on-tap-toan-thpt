const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

code = code.replace(
  '<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">',
  `<div className="mb-4">
        <button 
          onClick={() => setView('HOME')} 
          className="flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          LỘ TRÌNH TỰ HỌC
        </button>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">`
);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
