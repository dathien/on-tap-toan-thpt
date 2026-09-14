const fs = require('fs');
let content = fs.readFileSync('src/pages/QuestionEditor.tsx', 'utf-8');

// 1. imports
if (!content.includes('validateQuestionVisual')) {
  content = content.replace(
    "import { Question, McqQuestion, TrueFalseGroupQuestion, VisualType, VisualConfig } from '../types';",
    "import { Question, McqQuestion, TrueFalseGroupQuestion, VisualType, VisualConfig } from '../types';\nimport { validateQuestionVisual } from '../utils/visualValidator';"
  );
}

// 2. add state for validation modal
const stateRegex = /const \[tempVisualData, setTempVisualData\] = useState<string>\(''\);/;
content = content.replace(
  stateRegex,
  `const [tempVisualData, setTempVisualData] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);`
);

// 3. update handleSave
const handleSaveRegex = /const handleSave = \(\) => \{[\s\S]*?let newQuestion: Question;/;
const newHandleSave = `const saveQuestion = (forceDraft = false) => {
    const baseData = {
      id: isEditing ? id! : uuidv4(),
      subject_id: 'math',
      grade_id: currentGrade,
      topic_id: topic,
      lesson_id: 'lesson_1',
      difficulty: difficulty as 1 | 2 | 3 | 4,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      visual
    };

    let newQuestion: Question;
    
    if (questionType === 'MCQ_SINGLE') {
      newQuestion = { ...baseData, question_type: 'MCQ_SINGLE', options: mcqOptions };
    } else if (questionType === 'TRUE_FALSE_GROUP') {
      newQuestion = { ...baseData, question_type: 'TRUE_FALSE_GROUP', statements: tfStatements };
    } else {
      newQuestion = { ...baseData, question_type: 'SHORT_ANSWER', correctAnswer: shortAnswer.trim() };
    }

    if (isEditing) {
      updateQuestion(id!, newQuestion);
    } else {
      addQuestion(newQuestion);
    }
    navigate('/bank');
  };

  const handleSave = () => {
    if (!content.trim()) return alert("Vui lòng nhập nội dung câu hỏi");
    
    if (questionType === 'MCQ_SINGLE' && !mcqOptions.some(o => o.isCorrect)) return alert("Vui lòng chọn ít nhất 1 đáp án đúng");
    if (questionType === 'SHORT_ANSWER' && !shortAnswer.trim()) return alert("Vui lòng nhập đáp án cho câu hỏi ngắn");

    const vData = { content, visual } as any;
    const vCheck = validateQuestionVisual(vData);

    if (!vCheck.valid) {
      setValidationError(vCheck.reason || 'Lỗi dữ liệu hình ảnh');
      return;
    }

    saveQuestion(false);
  };

  let newQuestion: Question; // Keep this variable unused to bypass old code removal properly if needed.
`;
content = content.replace(handleSaveRegex, newHandleSave);

// 4. insert modal in render
const renderRegex = /<\/div>\s*<\/div>\s*<div className="mt-8 flex justify-end gap-4">/;
const newModal = `</div>
      </div>
      
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-red-600 mb-2">Lỗi dữ liệu câu hỏi</h3>
            <p className="text-slate-600 mb-6">
              {validationError === 'MISSING_VISUAL_FOR_TABLE_QUESTION' 
                ? 'Bạn đã đề cập đến bảng biến thiên trong nội dung câu hỏi, nhưng chưa thêm dữ liệu bảng biến thiên hoặc hình ảnh.'
                : 'Dữ liệu cấu trúc bảng biến thiên không hợp lệ (thiếu hàng x, y\\' hoặc y).'}
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setValidationError(null);
                  setShowVisualEditor(true);
                  setTempVisualType('VARIATION_TABLE');
                }}
                className="w-full py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                + Thêm bảng biến thiên / Hình ảnh
              </button>
              <button 
                onClick={() => {
                  setValidationError(null);
                  saveQuestion(true); // Save as draft/invalid
                }}
                className="w-full py-2.5 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Vẫn lưu (Câu hỏi sẽ bị bỏ qua trong đề thi)
              </button>
              <button 
                onClick={() => setValidationError(null)}
                className="w-full py-2.5 rounded-xl font-medium text-slate-500 hover:text-slate-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end gap-4">`;
content = content.replace(renderRegex, newModal);

fs.writeFileSync('src/pages/QuestionEditor.tsx', content);
