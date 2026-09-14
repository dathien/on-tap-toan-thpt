const fs = require('fs');
let code = fs.readFileSync('src/store/useAppStore.ts', 'utf8');

if (!code.includes('import { validateQuestionMath }')) {
    code = code.replace(
        "import { demoQuestions } from '../data/demoQuestions';",
        "import { demoQuestions } from '../data/demoQuestions';\nimport { validateQuestionMath } from '../utils/mathValidator';"
    );
    
    code = code.replace(
        "questions: demoQuestions,",
        "questions: demoQuestions.filter(q => validateQuestionMath(q).isValid),"
    );
    
    code = code.replace(
        "persistedState.questions = demoQuestions;",
        "persistedState.questions = demoQuestions.filter(q => validateQuestionMath(q).isValid);"
    );
    
    fs.writeFileSync('src/store/useAppStore.ts', code);
    console.log("Patched store");
}
