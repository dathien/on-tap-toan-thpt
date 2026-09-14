const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');
code = code.replace(
    "import { Question, McqQuestion, TrueFalseGroupQuestion, ShortAnswerQuestion } from '../types';",
    "import { Question, McqQuestion, TrueFalseGroupQuestion, ShortAnswerQuestion } from '../types';\nimport { Edit } from 'lucide-react';\nimport { QuestionEditorModal } from '../components/QuestionEditorModal';"
);
fs.writeFileSync('src/pages/StudentExam.tsx', code);

let valCode = fs.readFileSync('src/utils/mathValidator.ts', 'utf8');
valCode = valCode.replace(
    `                if (isTrue === true) {
                    actualCorrectAnswers.push(opt.id);
                } else if (isTrue === false && opt.isCorrect) {
                    result.errors.push(\`Phương án "\${opt.content}" được đánh dấu ĐÚNG nhưng thực tế SAI theo dữ liệu BBT.\`);
                } else if (isTrue === true && !opt.isCorrect) {
                    result.errors.push(\`Phương án "\${opt.content}" là ĐÚNG thực tế nhưng bị đánh dấu SAI.\`);
                }`,
    `                if (isTrue === true) {
                    actualCorrectAnswers.push(opt.id);
                    if (!opt.isCorrect) {
                        result.errors.push(\`Phương án "\${opt.content}" là ĐÚNG thực tế nhưng bị đánh dấu SAI.\`);
                    }
                } else if (isTrue === false && opt.isCorrect) {
                    result.errors.push(\`Phương án "\${opt.content}" được đánh dấu ĐÚNG nhưng thực tế SAI theo dữ liệu BBT.\`);
                }`
);
fs.writeFileSync('src/utils/mathValidator.ts', valCode);
console.log("Forced fix");
