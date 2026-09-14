const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

if (!code.includes('forcedZeroQuestions')) {
    code = code.replace(
        "focusEvents: { event: 'blur' | 'focus'; timestamp: number }[];",
        "focusEvents: { event: 'blur' | 'focus'; timestamp: number }[];\n  antiCheatEvents?: { type: 'MULTIPLE_TAB'; questionId?: string; timestamp: number; tabId: string }[];\n  forcedZeroQuestions?: Record<string, boolean>;"
    );
    fs.writeFileSync('src/types/index.ts', code);
    console.log('Types updated');
} else {
    console.log('Already updated');
}
