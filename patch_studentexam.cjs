const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');

const importCurriculum = `import { curriculumData } from '../data/curriculum';\n`;
if (!code.includes("curriculumData")) {
    code = code.replace("import { ExamVersion, Question,", "import { ExamVersion, Question,\n  McqQuestion, TrueFalseGroupQuestion, ShortAnswerQuestion } from '../types';\nimport { curriculumData } from '../data/curriculum';");
}

const renderScopeInfo = `
            <div className="text-xs md:text-sm text-slate-500 font-medium mt-1">
               {(() => {
                  let scopeStr = \`Khối \${config.grade} • \${config.durationMinutes} phút\`;
                  if (config.scopeType === 'LESSON' && config.topicIds?.[0] && config.lessonIds?.[0]) {
                     const topics = curriculumData[config.grade as 10|11|12] || [];
                     const t = topics.find(t => t.id === config.topicIds?.[0]);
                     const l = t?.lessons.find(l => l.id === config.lessonIds?.[0]);
                     if (t) scopeStr += \` • Chủ đề: \${t.name}\`;
                     if (l) scopeStr += \` • Bài: \${l.name}\`;
                  } else if (config.scopeType === 'TOPIC' && config.topicIds?.[0]) {
                     const topics = curriculumData[config.grade as 10|11|12] || [];
                     const t = topics.find(t => t.id === config.topicIds?.[0]);
                     if (t) scopeStr += \` • Chủ đề: \${t.name}\`;
                  } else if (config.scopeType === 'MULTI_TOPIC') {
                     scopeStr += \` • Nhiều chủ đề\`;
                  }
                  return scopeStr;
               })()}
            </div>
`;

code = code.replace(
    '<h1 className="font-bold text-slate-800 line-clamp-1 uppercase">{config.name}</h1>',
    `<h1 className="font-bold text-slate-800 line-clamp-1 uppercase text-sm md:text-base">{config.name}</h1>${renderScopeInfo}`
);

fs.writeFileSync('src/pages/StudentExam.tsx', code);
console.log("Patched StudentExam");
