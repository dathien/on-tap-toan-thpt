const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamPreview.tsx', 'utf8');

const replacement = `
  const [versionId, setVersionId] = useState<string | null>(null);
  const [shortages, setShortages] = useState<{ part: string, required: number, actual: number }[]>([]);
  const [forceGenerate, setForceGenerate] = useState(false);

  useEffect(() => {
    if (!examConfig) return;

    // Check if we already created a version
    const existing = examVersions.find(v => v.examConfigId === configId);
    if (existing) {
      setVersionId(existing.id);
      return;
    }

    // Generate new version based on config
    let selectedQuestions: Question[] = [];
    
    // Filter questions by config's grade, scope, and validate visual
    let rawPool = getQuestions(allQuestions, {
      gradeId: examConfig.grade,
      topicIds: examConfig.topicIds,
      lessonIds: examConfig.lessonIds,
    });
    rawPool = rawPool.filter(q => validateQuestionVisual(q).valid);
    
    const pool: Question[] = [];
    for (const q of rawPool) {
      if (!pool.some(existing => isDuplicateQuestion(existing, q))) {
        pool.push(q);
      }
    }

    const currentShortages: { part: string, required: number, actual: number }[] = [];

    if (examConfig.parts.includes('I')) {
      let iQ = pool.filter(q => q.question_type === 'MCQ_SINGLE');
      if (examConfig.shuffleQuestions) iQ = shuffleArray(iQ);
      // Let's assume THUONG_XUYEN needs 10, otherwise 12 or whatever the user requested in parts, but wait, ExamBuilder allows arbitrary questionCount? No, ExamBuilder fixed it to 12 in CHUAN mode, but in LINH_HOAT, wait, where is the question count configured?
      // Ah, in ExamBuilder LINH_HOAT mode, wait, ExamConfig does not have \`questionCount\`!
      // Let's see ExamBuilder... ExamBuilder didn't have \`questionCount\` state for LINH_HOAT, wait, yes it does?
      // Wait, ExamBuilder only has \`duration\` and \`parts\`. So it always defaults to 12, 4, 6.
      // If the user wants to adjust count, they would need it in ExamConfig.
      // We will just use the hardcoded numbers for now as it was before.
      const count = examConfig.type === 'THUONG_XUYEN' ? 10 : 12;
      
      if (iQ.length < count && !forceGenerate) {
        currentShortages.push({ part: 'I (Trắc nghiệm nhiều phương án)', required: count, actual: iQ.length });
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
      if (iiQ.length < count && !forceGenerate) {
        currentShortages.push({ part: 'II (Đúng/Sai)', required: count, actual: iiQ.length });
      }
      selectedQuestions = [...selectedQuestions, ...iiQ.slice(0, count)];
    }

    if (examConfig.parts.includes('III')) {
      let iiiQ = pool.filter(q => q.question_type === 'SHORT_ANSWER');
      if (examConfig.shuffleQuestions) iiiQ = shuffleArray(iiiQ);
      const count = 6;
      if (iiiQ.length < count && !forceGenerate) {
        currentShortages.push({ part: 'III (Trả lời ngắn)', required: count, actual: iiiQ.length });
      }
      selectedQuestions = [...selectedQuestions, ...iiiQ.slice(0, count)];
    }

    if (currentShortages.length > 0 && !forceGenerate) {
      setShortages(currentShortages);
      return;
    }

    const newVersion: ExamVersion = {
      id: uuidv4(),
      examConfigId: examConfig.id,
      questions: selectedQuestions,
    };
    addExamVersion(newVersion);
    setVersionId(newVersion.id);
  }, [examConfig, configId, examVersions, addExamVersion, allQuestions, forceGenerate]);

  if (!examConfig) return <div>Đề không tồn tại.</div>;

  if (shortages.length > 0 && !forceGenerate) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Không đủ câu hỏi hợp lệ</h2>
          <div className="text-slate-600 text-lg space-y-2">
            <p>Ngân hàng câu hỏi hiện không đủ số lượng cho phạm vi bạn đã chọn:</p>
            <ul className="text-left bg-orange-50 p-4 rounded-xl space-y-2 text-orange-800 border border-orange-100 inline-block">
               {shortages.map((s, i) => (
                  <li key={i}>
                     Phần {s.part}: Có <b>{s.actual}/{s.required}</b> câu.
                  </li>
               ))}
            </ul>
            <p className="text-sm mt-4">Bạn có thể điều chỉnh phạm vi môn học để lấy thêm câu hỏi, hoặc vẫn tiếp tục tạo đề với số lượng câu hiện có.</p>
          </div>
          <div className="pt-6 border-t border-slate-100 flex justify-center gap-4">
            <button 
              onClick={() => navigate(\`/builder/\${examConfig.type}\`)}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              Đổi phạm vi
            </button>
            <button 
              onClick={() => setForceGenerate(true)}
              className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors"
            >
              Tiếp tục tạo với số câu hiện có
            </button>
          </div>
        </div>
      </div>
    );
  }
`;

code = code.replace(/const \[versionId, setVersionId\] = useState<string \| null>\(null\);[\s\S]*?(?=const version = examVersions\.find\(v => v\.id === versionId\);)/, replacement);

fs.writeFileSync('src/pages/ExamPreview.tsx', code);
console.log("Patched ExamPreview generation");
