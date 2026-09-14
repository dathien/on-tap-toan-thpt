const fs = require('fs');
let code = fs.readFileSync('src/pages/TeacherResults.tsx', 'utf8');

code = code.replace(
  'const exams = isDemoMode ? DEMO_EXAMS : store.exams;',
  'const exams: any[] = isDemoMode ? DEMO_EXAMS : store.exams;'
);

code = code.replace(
  'let filtered = exams;',
  'let filtered: any[] = exams;'
);

fs.writeFileSync('src/pages/TeacherResults.tsx', code);
