const fs = require('fs');

let layout = fs.readFileSync('src/components/Layout.tsx', 'utf-8');
// Replace "Ôn tập • Kiểm tra • Thi" with settings.description
layout = layout.replace(
  /<p className="text-xs text-indigo-300 mt-1 uppercase tracking-wider mb-4">Ôn tập • Kiểm tra • Thi<\/p>/g,
  '<p className="text-xs text-indigo-300 mt-1 uppercase tracking-wider mb-4 line-clamp-2">{settings.description}</p>'
);

fs.writeFileSync('src/components/Layout.tsx', layout);
