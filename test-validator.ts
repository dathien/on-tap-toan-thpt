import { demoQuestions } from './src/data/demoQuestions';
import { validateQuestionMath } from './src/utils/mathValidator';

let validCount = 0;
let invalidCount = 0;
demoQuestions.forEach(q => {
    if (q.visual?.type === 'VARIATION_TABLE') {
        const res = validateQuestionMath(q);
        if (!res.isValid) {
            console.log(`[INVALID] ${q.id}:`);
            console.log(res.errors);
            invalidCount++;
        } else {
            validCount++;
        }
    }
});
console.log(`Valid: ${validCount}, Invalid: ${invalidCount}`);
