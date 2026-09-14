const fs = require('fs');

let settings = fs.readFileSync('src/pages/Settings.tsx', 'utf-8');
settings = settings.replace(
  /<label className="block text-sm font-medium text-slate-700 mb-1">\s*Mô tả\s*<\/label>/g,
  '<label className="block text-sm font-medium text-slate-700 mb-1">\n              Slogan / Mô tả\n            </label>'
);
fs.writeFileSync('src/pages/Settings.tsx', settings);
