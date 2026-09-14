const fs = require('fs');

const filesToPatch = [
    'src/pages/StudentExam.tsx',
    'src/pages/Roadmap.tsx',
    'src/pages/TreasureHunt.tsx'
];

for (const file of filesToPatch) {
    let code = fs.readFileSync(file, 'utf8');
    
    if (!code.includes("import { getGridClass }")) {
        code = code.replace(
            "import { MathText } from '../components/MathText';",
            "import { MathText } from '../components/MathText';\nimport { getGridClass } from '../utils/layout';"
        );
    }
    
    // In StudentExam.tsx
    if (file.includes('StudentExam.tsx')) {
        code = code.replace(
            '<div className="answers-grid">',
            '<div className={getGridClass(currentQuestion.options)}>'
        );
    }
    
    // In Roadmap.tsx
    if (file.includes('Roadmap.tsx')) {
        // There are multiple `<div className="answers-grid mt-4">`
        code = code.replace(
            /<div className="answers-grid mt-4">/g,
            '<div className={getGridClass(q.options) + " mt-4"}>'
        );
        code = code.replace(
            '<div className={getGridClass(q.options) + " mt-4"}>\n                        <div className="text-sm font-bold',
            '<div className="answers-grid mt-4">\n                        <div className="text-sm font-bold'
        ); // Wait, are there other answers-grid?
    }
    
    // In TreasureHunt.tsx
    if (file.includes('TreasureHunt.tsx')) {
        code = code.replace(
            '<div className="answers-grid mt-8">',
            '<div className={getGridClass(q.options) + " mt-8"}>'
        );
    }

    fs.writeFileSync(file, code);
}
console.log("Patched grids");
