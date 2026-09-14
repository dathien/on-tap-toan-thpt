const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

if (!code.includes('_importError?: boolean;')) {
    code = code.replace(
        "tags: string[];",
        "tags: string[];\n  _importError?: boolean;\n  _importMessage?: string;"
    );
    fs.writeFileSync('src/types/index.ts', code);
    console.log("Patched types 2");
}
