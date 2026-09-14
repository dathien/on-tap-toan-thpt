const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

// 1. generateUnitsForTopic signature
code = code.replace(
    /const generateUnitsForTopic = \(topic: string\): LearningUnit\[\] => \{/,
    'const generateUnitsForTopic = (topic: string, abilityLevel?: string): LearningUnit[] => {'
);

// 2. handlePreview usage before declaration
// handlePreview is declared as:
// const handlePreview = () => {
//   const qs = generateRoadmapQuestions();
//   setProposedQuestions(qs);
//   setShowPreview(true);
// };
// Let's change it to a standard function so it gets hoisted
code = code.replace(
    /const handlePreview = \(\) => \{/,
    'function handlePreview() {'
);

// 3. QuestionEditorModal props
code = code.replace(
    /question=\{editingQuestion\}\n\s*onClose=\{/,
    'initialQuestion={editingQuestion}\n            onCancel={'
);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Fixed lint errors");
