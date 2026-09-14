const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

if (!code.includes('partCounts?:')) {
    code = code.replace(
        "lessonIds?: string[];",
        "lessonIds?: string[];\n  partCounts?: { I: number; II: number; III: number };"
    );
    fs.writeFileSync('src/types/index.ts', code);
}
console.log("Patched types");
