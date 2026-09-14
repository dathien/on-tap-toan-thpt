const fs = require('fs');

// 1. Fix Visual Validator
let valContent = fs.readFileSync('src/utils/visualValidator.ts', 'utf-8');
valContent = valContent.replace('q.visual.source || q.visual.imageFallback', 'q.visual.source');
fs.writeFileSync('src/utils/visualValidator.ts', valContent);

// 2. Rewrite QuestionEditor
let qe = fs.readFileSync('src/pages/QuestionEditor.tsx', 'utf-8');

// A. Fix import
qe = qe.replace(
  "import { VisualType, VisualConfig } from '../types';",
  "import { VisualType, VisualConfig } from '../types';\nimport { validateQuestionVisual } from '../utils/visualValidator';"
);

// B. Fix save logic wrapper since I messed up brackets.
// I'll just rewrite the component body of save.
const startIdx = qe.indexOf('  const saveQuestion = (forceDraft = false) => {');
const endIdx = qe.indexOf('  return (');
if (startIdx > -1 && endIdx > -1) {
  const newSaveBlock = `  const saveQuestion = (forceDraft = false) => {
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

`;
  qe = qe.substring(0, startIdx) + newSaveBlock + qe.substring(endIdx);
}

fs.writeFileSync('src/pages/QuestionEditor.tsx', qe);
