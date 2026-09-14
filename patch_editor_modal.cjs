const fs = require('fs');
let code = fs.readFileSync('src/components/QuestionEditorModal.tsx', 'utf8');

if (!code.includes('import { validateQuestionMath')) {
    code = code.replace(
        "import { useAppStore } from '../store/useAppStore';",
        "import { useAppStore } from '../store/useAppStore';\nimport { validateQuestionMath, ValidationResult } from '../utils/mathValidator';"
    );
}

if (!code.includes('const [validationResult, setValidationResult]')) {
    code = code.replace(
        "const [tempVisualData, setTempVisualData] = useState<string>(",
        "const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);\n  const [tempVisualData, setTempVisualData] = useState<string>("
    );
}

const buildCurrentQuestionCode = `
    const baseQuestion = {
        id: initialQuestion?.id || uuidv4(),
        subject_id: 'MATH',
        grade_id: 12 as any,
        topic_id: topic,
        lesson_id: '',
        question_type: questionType,
        difficulty: difficulty as any,
        content: content,
        visual: visual,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        explanation: explanation,
    };
    let currentQuestion: any;
    if (questionType === 'MCQ_SINGLE') {
      currentQuestion = { ...baseQuestion, question_type: 'MCQ_SINGLE', options: mcqOptions };
    } else if (questionType === 'TRUE_FALSE_GROUP') {
      currentQuestion = { ...baseQuestion, question_type: 'TRUE_FALSE_GROUP', statements: tfStatements };
    } else {
      currentQuestion = { ...baseQuestion, question_type: 'SHORT_ANSWER', correctAnswer: shortAnswer };
    }
`;

if (!code.includes('const handleValidate = () => {')) {
    code = code.replace(
        "const handleSave = () => {",
        `const handleValidate = () => {
    ${buildCurrentQuestionCode}
    const res = validateQuestionMath(currentQuestion as Question);
    setValidationResult(res);
    if (res.isValid) {
        alert("✅ Dữ liệu câu hỏi có vẻ hợp lệ về mặt Toán học.");
    }
  };

  const handleSave = () => {`
    );
}

// Add the warning UI if there are errors
if (!code.includes('validationResult && !validationResult.isValid')) {
    const warningUI = `
        {validationResult && !validationResult.isValid && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4 text-red-800">
                <div className="font-bold flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    ⚠️ CẢNH BÁO: Đáp án được chọn có thể không phù hợp với dữ liệu toán của câu hỏi!
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    {validationResult.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                    ))}
                </ul>
                <div className="mt-3 text-sm text-red-600 font-medium">Bạn vẫn có thể Lưu thay đổi nếu chắc chắn.</div>
            </div>
        )}
    `;
    code = code.replace(
        "{/* Form Controls */}",
        `${warningUI}\n          {/* Form Controls */}`
    );
}

if (!code.includes('KIỂM TRA ĐÁP ÁN')) {
    code = code.replace(
        `<button onClick={onCancel} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-sm">
               HỦY
           </button>`,
        `<button onClick={handleValidate} className="px-6 py-2.5 bg-amber-100 text-amber-700 font-bold rounded-xl hover:bg-amber-200 transition-colors shadow-sm mr-auto">
               KIỂM TRA TOÀN DIỆN
           </button>
           <button onClick={onCancel} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-sm">
               HỦY
           </button>`
    );
}

fs.writeFileSync('src/components/QuestionEditorModal.tsx', code);
console.log("Patched Editor Modal");
