const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');

code = code.replace(
    "const updateAttempt = useAppStore(state => state.updateAttempt);",
    "const updateAttempt = useAppStore(state => state.updateAttempt);\n  const isTeacherMode = useAppStore(state => state.isTeacherMode);\n  const [editingQuestion, setEditingQuestion] = React.useState<any>(null);\n  const updateQuestion = useAppStore(state => state.updateQuestion);"
);

if (!code.includes('import { QuestionEditorModal }')) {
    code = code.replace(
        "import { validateQuestionVisual }",
        "import { QuestionEditorModal } from '../components/QuestionEditorModal';\nimport { validateQuestionVisual }"
    );
}

if (!code.includes('import { Edit }') && !code.includes('Edit,')) {
    code = code.replace(
        "import { AlertTriangle } from 'lucide-react';",
        "import { AlertTriangle, Edit } from 'lucide-react';"
    );
}

fs.writeFileSync('src/pages/StudentExam.tsx', code);
console.log("Fixed StudentExam");
