const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('ExamEditor')) {
    code = code.replace(
        "import { ExamPreview } from './pages/ExamPreview';",
        "import { ExamPreview } from './pages/ExamPreview';\nimport { ExamEditor } from './pages/ExamEditor';"
    );
    code = code.replace(
        "<Route path=\"exam-preview/:configId\" element={<ExamPreview />} />",
        "<Route path=\"exam-preview/:configId\" element={<ExamPreview />} />\n          <Route path=\"exam-editor/:id\" element={<ExamEditor />} />"
    );
    fs.writeFileSync('src/App.tsx', code);
    console.log("Routes added");
} else {
    console.log("Already added");
}
