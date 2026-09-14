const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamEditor.tsx', 'utf8');

// I will just format the file and find the missing tag using a linter or manual fix
// Let's just add the missing </div> before the <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
code = code.replace(
    /<\/div>\n\n      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">/,
    "</div>\n      </div>\n\n      <div className=\"bg-white rounded-2xl shadow-sm border border-slate-200 p-6\">"
);

fs.writeFileSync('src/pages/ExamEditor.tsx', code);
console.log("Fixed tags");
