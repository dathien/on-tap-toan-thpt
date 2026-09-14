const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamEditor.tsx', 'utf8');

const importCurriculum = `import { curriculumData } from '../data/curriculum';\n`;
if (!code.includes("curriculumData")) {
    code = code.replace("import { MathText } from '../components/MathText';", "import { MathText } from '../components/MathText';\nimport { curriculumData } from '../data/curriculum';");
}

const warningsLogic = `
  const topics = curriculumData[exam?.grade as 10|11|12] || [];
  
  const outOfScopeQuestions = version?.questions.filter(q => {
      if (exam?.grade !== q.grade_id) return true;
      if (exam?.scopeType === 'LESSON' && exam?.lessonIds?.[0]) {
          return exam.lessonIds[0] !== q.lesson_id;
      }
      if (exam?.scopeType === 'TOPIC' && exam?.topicIds?.[0]) {
          return exam.topicIds[0] !== q.topic_id;
      }
      if (exam?.scopeType === 'MULTI_TOPIC' && exam?.topicIds?.length) {
          return !exam.topicIds.includes(q.topic_id);
      }
      return false;
  }) || [];
`;

code = code.replace("if (!exam || !version) return <div className=\"p-8\">Đang tải...</div>;", "if (!exam || !version) return <div className=\"p-8\">Đang tải...</div>;\n" + warningsLogic);

const uiFields = `
         <div className="md:col-span-2 pt-4 border-t border-slate-100">
             <h3 className="text-sm font-bold text-slate-700 mb-3">Phạm vi ôn tập</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Khối lớp</label>
                     <select value={exam.grade} onChange={e => handleUpdateConfig({ grade: Number(e.target.value) as any })} className="w-full px-3 py-2 rounded-xl border border-slate-300">
                         <option value={10}>Khối 10</option>
                         <option value={11}>Khối 11</option>
                         <option value={12}>Khối 12</option>
                     </select>
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Phạm vi</label>
                     <select value={exam.scopeType || 'LESSON'} onChange={e => handleUpdateConfig({ scopeType: e.target.value as any })} className="w-full px-3 py-2 rounded-xl border border-slate-300">
                         <option value="LESSON">Một bài học</option>
                         <option value="TOPIC">Một chủ đề</option>
                         <option value="MULTI_TOPIC">Nhiều chủ đề</option>
                     </select>
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Chủ đề</label>
                     {exam.scopeType !== 'MULTI_TOPIC' ? (
                       <select value={exam.topicIds?.[0] || ''} onChange={e => handleUpdateConfig({ topicIds: [e.target.value] })} className="w-full px-3 py-2 rounded-xl border border-slate-300">
                           {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                       </select>
                     ) : (
                       <div className="text-sm text-slate-500 py-2">Đã chọn {exam.topicIds?.length || 0} chủ đề</div>
                     )}
                 </div>
                 {exam.scopeType === 'LESSON' && (
                     <div className="md:col-span-3">
                         <label className="block text-sm font-medium text-slate-700 mb-1">Bài học</label>
                         <select value={exam.lessonIds?.[0] || ''} onChange={e => handleUpdateConfig({ lessonIds: [e.target.value] })} className="w-full px-3 py-2 rounded-xl border border-slate-300">
                             {topics.find(t => t.id === exam.topicIds?.[0])?.lessons.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                         </select>
                     </div>
                 )}
             </div>
             
             {outOfScopeQuestions.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200 flex gap-3">
                   <div className="text-orange-600">⚠️</div>
                   <div>
                       <p className="font-bold text-orange-800 text-sm">Cảnh báo phạm vi</p>
                       <p className="text-orange-700 text-sm">Có {outOfScopeQuestions.length} câu hỏi trong đề không thuộc phạm vi môn học mới đã chọn. Vui lòng kiểm tra lại danh sách câu hỏi bên dưới.</p>
                   </div>
                </div>
             )}
         </div>
`;

code = code.replace("</div>\n      </div>\n\n      <div className=\"bg-white rounded-2xl", uiFields + "\n      </div>\n\n      <div className=\"bg-white rounded-2xl");

fs.writeFileSync('src/pages/ExamEditor.tsx', code);
console.log("Patched ExamEditor");
