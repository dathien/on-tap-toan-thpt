const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamList.tsx', 'utf8');

const importCurriculum = `import { curriculumData } from '../data/curriculum';\n`;
if (!code.includes("curriculumData")) {
    code = code.replace("import { ExamConfig, Grade } from '../types';", "import { ExamConfig, Grade } from '../types';\nimport { curriculumData } from '../data/curriculum';");
}

const renderScope = `
              <div className="text-sm text-slate-500 font-medium mb-3 line-clamp-1">
                {(() => {
                  let scopeStr = \`Khối \${exam.grade}\`;
                  if (exam.scopeType === 'LESSON' && exam.topicIds?.[0] && exam.lessonIds?.[0]) {
                     const topics = curriculumData[exam.grade as 10|11|12] || [];
                     const t = topics.find(t => t.id === exam.topicIds?.[0]);
                     const l = t?.lessons.find(l => l.id === exam.lessonIds?.[0]);
                     if (l) scopeStr += \` • Bài: \${l.name}\`;
                  } else if (exam.scopeType === 'TOPIC' && exam.topicIds?.[0]) {
                     const topics = curriculumData[exam.grade as 10|11|12] || [];
                     const t = topics.find(t => t.id === exam.topicIds?.[0]);
                     if (t) scopeStr += \` • Chủ đề: \${t.name}\`;
                  } else if (exam.scopeType === 'MULTI_TOPIC') {
                     scopeStr += \` • Nhiều chủ đề\`;
                  }
                  return scopeStr;
                })()}
              </div>
`;

code = code.replace(
    '<h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2" title={exam.name}>\n                {exam.name}\n              </h3>',
    `<h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2" title={exam.name}>\n                {exam.name}\n              </h3>\n${renderScope}`
);

fs.writeFileSync('src/pages/ExamList.tsx', code);
console.log("Patched ExamList");
