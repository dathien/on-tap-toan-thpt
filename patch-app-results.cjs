const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "import { Roadmap } from './pages/Roadmap';",
  "import { Roadmap } from './pages/Roadmap';\nimport { TeacherResults } from './pages/TeacherResults';"
);

content = content.replace(
  '<Route path="results" element={<div className="p-4">Kết quả học tập (Đang phát triển)</div>} />',
  '<Route path="results" element={<TeacherResults />} />'
);

fs.writeFileSync('src/App.tsx', content);
