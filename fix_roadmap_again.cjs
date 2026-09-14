const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

code = code.replace(
    "const { currentGrade, questions } = useAppStore();",
    "const { currentGrade, questions, isTeacherMode, updateQuestion } = useAppStore();\n  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);"
);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Fixed Roadmap");
