const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { ClassManagement }')) {
  code = code.replace(
    "import { TeacherResults } from './pages/TeacherResults';",
    "import { TeacherResults } from './pages/TeacherResults';\nimport { ClassManagement } from './pages/ClassManagement';"
  );
  
  code = code.replace(
    '<Route path="classes" element={<div className="p-4">Lớp học (Đang phát triển)</div>} />',
    '<Route path="classes" element={<ClassManagement />} />'
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
