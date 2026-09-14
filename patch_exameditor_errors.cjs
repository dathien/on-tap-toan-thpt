const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamEditor.tsx', 'utf8');

const replacement = `
                          <div className="text-slate-800 line-clamp-2 mb-2">
                             <MathText text={sanitizeQuestionText(q.content)} />
                          </div>
                          
                          {q._importError && (
                             <div className="mb-2 p-2 bg-red-50 text-red-700 text-sm font-semibold rounded-lg border border-red-200 inline-flex items-center gap-2">
                                ⚠️ CẦN KIỂM TRA: {q._importMessage}
                             </div>
                          )}
`;

if (!code.includes("CẦN KIỂM TRA")) {
    code = code.replace(
        /<div className="text-slate-800 line-clamp-2 mb-2">\s*<MathText text=\{sanitizeQuestionText\(q\.content\)\} \/>\s*<\/div>/,
        replacement
    );
    fs.writeFileSync('src/pages/ExamEditor.tsx', code);
    console.log("Patched ExamEditor errors");
}
