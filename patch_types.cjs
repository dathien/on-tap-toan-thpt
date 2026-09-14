const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

if (!code.includes('topicIds?: string[];')) {
    code = code.replace(
        "grade: Grade;\n}",
        "grade: Grade;\n  scopeType?: 'LESSON' | 'TOPIC' | 'MULTI_TOPIC';\n  topicIds?: string[];\n  lessonIds?: string[];\n}"
    );
    fs.writeFileSync('src/types/index.ts', code);
    console.log("Patched types");
}
