const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const regex = /<ChevronLeft className="w-5 h-5 mr-1" \/>\s*LỘ TRÌNH TỰ HỌC\s*<\/button>\s*<\/div>/;

const replacement = `<ChevronLeft className="w-5 h-5 mr-1" />
          LỘ TRÌNH TỰ HỌC
        </button>
      </div>
      {session.name && (
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{session.name}</h2>
      )}`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched 7");
