const fs = require('fs');
let code = fs.readFileSync('src/pages/WordImport.tsx', 'utf8');

if (!code.includes("import { getGridClass }")) {
    code = code.replace(
        "import { MathText } from '../components/MathText';",
        "import { MathText } from '../components/MathText';\nimport { getGridClass } from '../utils/layout';"
    );
}

code = code.replace(
    '<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">',
    '<div className={getGridClass((q as any).options) + " gap-3"}>'
);

fs.writeFileSync('src/pages/WordImport.tsx', code);
console.log("Patched WordImport");
