const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');

code = code.replace(
    "import { AlertTriangle } from 'lucide-react';",
    "import { AlertTriangle, Edit } from 'lucide-react';"
);

code = code.replace(
    "import { validateQuestionVisual } from '../utils/visualValidator';",
    "import { validateQuestionVisual } from '../utils/visualValidator';\nimport { QuestionEditorModal } from '../components/QuestionEditorModal';"
);

fs.writeFileSync('src/pages/StudentExam.tsx', code);
console.log("Final fix StudentExam");
