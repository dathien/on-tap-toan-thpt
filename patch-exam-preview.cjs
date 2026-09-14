const fs = require('fs');
let content = fs.readFileSync('src/pages/ExamPreview.tsx', 'utf-8');

// 1. Add visualValidator import
if (!content.includes('validateQuestionVisual')) {
  content = content.replace(
    "import { isDuplicateQuestion } from '../utils/textSanitizer';",
    "import { isDuplicateQuestion } from '../utils/textSanitizer';\nimport { validateQuestionVisual } from '../utils/visualValidator';"
  );
}

// 2. Add state for error
const stateRegex = /const \[versionId, setVersionId\] = useState<string \| null>\(null\);/;
content = content.replace(
  stateRegex,
  `const [versionId, setVersionId] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ part: string, required: number, actual: number } | null>(null);`
);

// 3. Rewrite useEffect logic
const useEffectRegex = /useEffect\(\(\) => \{[\s\S]*?addExamVersion\(newVersion\);\s*setVersionId\(newVersion\.id\);\s*\}, \[examConfig, configId, examVersions, addExamVersion\]\);/;

const newUseEffect = `useEffect(() => {
    if (!examConfig) return;

    // Check if we already created a version
    const existing = examVersions.find(v => v.examConfigId === configId);
    if (existing) {
      setVersionId(existing.id);
      return;
    }

    // Generate new version based on config
    let selectedQuestions: Question[] = [];
    
    // Filter questions by config's grade and validate visual
    const rawPool = allQuestions.filter(q => q.grade_id === examConfig.grade && validateQuestionVisual(q).valid);
    const pool: Question[] = [];
    for (const q of rawPool) {
      if (!pool.some(existing => isDuplicateQuestion(existing, q))) {
        pool.push(q);
      }
    }

    if (examConfig.parts.includes('I')) {
      let iQ = pool.filter(q => q.question_type === 'MCQ_SINGLE');
      if (examConfig.shuffleQuestions) iQ = shuffleArray(iQ);
      const count = examConfig.type === 'THUONG_XUYEN' ? 10 : 12;
      
      if (iQ.length < count) {
        setErrorDetails({ part: 'I (Trắc nghiệm nhiều phương án)', required: count, actual: iQ.length });
        return;
      }
      
      let finalIQ = iQ.slice(0, count);

      if (examConfig.shuffleOptions) {
        finalIQ = finalIQ.map(q => {
          const mcq = q as McqQuestion;
          return {
            ...mcq,
            options: shuffleArray(mcq.options)
          };
        });
      }
      selectedQuestions = [...selectedQuestions, ...finalIQ];
    }

    if (examConfig.parts.includes('II')) {
      let iiQ = pool.filter(q => q.question_type === 'TRUE_FALSE_GROUP');
      if (examConfig.shuffleQuestions) iiQ = shuffleArray(iiQ);
      const count = 4;
      if (iiQ.length < count) {
        setErrorDetails({ part: 'II (Đúng/Sai)', required: count, actual: iiQ.length });
        return;
      }
      selectedQuestions = [...selectedQuestions, ...iiQ.slice(0, count)];
    }

    if (examConfig.parts.includes('III')) {
      let iiiQ = pool.filter(q => q.question_type === 'SHORT_ANSWER');
      if (examConfig.shuffleQuestions) iiiQ = shuffleArray(iiiQ);
      const count = 6;
      if (iiiQ.length < count) {
        setErrorDetails({ part: 'III (Trả lời ngắn)', required: count, actual: iiiQ.length });
        return;
      }
      selectedQuestions = [...selectedQuestions, ...iiiQ.slice(0, count)];
    }

    const newVersion: ExamVersion = {
      id: uuidv4(),
      examConfigId: examConfig.id,
      questions: selectedQuestions,
    };

    addExamVersion(newVersion);
    setVersionId(newVersion.id);

  }, [examConfig, configId, examVersions, addExamVersion, allQuestions]);`;

content = content.replace(useEffectRegex, newUseEffect);

// 4. Update the render UI to show the error state
const renderRegex = /if \(!versionId\) return <div>Đang tạo đề\.\.\.<\/div>;/;
const newRender = `if (errorDetails) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Không đủ câu hỏi hợp lệ</h2>
          <p className="text-slate-600 text-lg">
            Ngân hàng hiện có <strong>{errorDetails.actual} / {errorDetails.required}</strong> câu hợp lệ cho phần {errorDetails.part}.<br/>
            Cần bổ sung thêm <strong>{errorDetails.required - errorDetails.actual}</strong> câu.
          </p>
          <div className="pt-6 border-t border-slate-100 flex justify-center gap-4">
            <button 
              onClick={() => navigate('/bank')}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Bổ sung câu hỏi
            </button>
            <button 
              onClick={() => navigate('/exam/create')}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              Đổi phạm vi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!versionId) return <div>Đang tạo đề...</div>;`;

content = content.replace(renderRegex, newRender);

fs.writeFileSync('src/pages/ExamPreview.tsx', content);
