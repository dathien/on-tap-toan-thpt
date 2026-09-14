const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamList.tsx', 'utf8');

// add examVersions state
if (!code.includes("const examVersions = useAppStore")) {
    code = code.replace(
        "const exams = useAppStore((state) => state.exams);",
        "const exams = useAppStore((state) => state.exams);\n  const examVersions = useAppStore(state => state.examVersions);"
    );
}

// replace Parts with Parts & Questions
const toReplace = `<span className="flex items-center gap-1.5">
                  <FileText size={16} className="text-slate-400" />
                  {exam.parts.length} Phần
                </span>`;

const replaceWith = `<span className="flex items-center gap-1.5">
                  <FileText size={16} className="text-slate-400" />
                  {exam.parts.length} Phần
                </span>
                <span className="flex items-center gap-1.5 text-indigo-600">
                  {(() => {
                     const version = examVersions.find(v => v.examConfigId === exam.id);
                     if (version) return \`\${version.questions.length} câu\`;
                     return 'Chưa tạo câu hỏi';
                  })()}
                </span>`;

if (code.includes(toReplace)) {
    code = code.replace(toReplace, replaceWith);
    fs.writeFileSync('src/pages/ExamList.tsx', code);
    console.log("Patched ExamList question count");
} else {
    console.log("Target not found");
}
