const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

if (!code.includes('explanation?: string;')) {
    code = code.replace(
        "visual?: VisualConfig;",
        "visual?: VisualConfig;\n  explanation?: string;"
    );
    fs.writeFileSync('src/types/index.ts', code);
    console.log('Types updated');
} else {
    console.log('Already updated');
}
