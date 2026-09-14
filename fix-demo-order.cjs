const fs = require('fs');
let code = fs.readFileSync('src/pages/ClassManagement.tsx', 'utf8');

code = code.replace(
  /let count = classStudents\.length;\s*if \(isDemo\) {[\s\S]*?}\s*const isDemo = store\.classes\.find\(c => c\.id === classId\)\?\.isDemo;/,
  `const isDemo = store.classes.find(c => c.id === classId)?.isDemo;
    let count = classStudents.length;
    if (isDemo) {
      if (classId === 'c_12a1') count = 40;
      else if (classId === 'c_11a1') count = 38;
      else if (classId === 'c_10a1') count = 35;
    }`
);

fs.writeFileSync('src/pages/ClassManagement.tsx', code);
