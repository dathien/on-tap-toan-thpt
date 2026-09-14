const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add /exam-list if missing
if (!code.includes('<Route path="exam-list"')) {
    code = code.replace(
        '<Route path="materials" element={<ExamList />} />',
        '<Route path="materials" element={<ExamList />} />\n          <Route path="exam-list" element={<ExamList />} />'
    );
}

// Add /learning-path if missing
if (!code.includes('<Route path="learning-path"')) {
    code = code.replace(
        '<Route path="roadmap" element={<Roadmap />} />',
        '<Route path="roadmap" element={<Roadmap />} />\n          <Route path="learning-path" element={<Roadmap />} />'
    );
}

// Add /question-bank if missing
if (!code.includes('<Route path="question-bank"')) {
    code = code.replace(
        '<Route path="bank" element={<Bank />} />',
        '<Route path="bank" element={<Bank />} />\n          <Route path="question-bank" element={<Bank />} />'
    );
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx routes");
