import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import { Question, QuestionType, McqOption, TrueFalseStatement } from '../types';
import { MathRenderer } from '../components/MathRenderer';
import { QuestionContentRenderer } from '../components/QuestionContentRenderer';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { VisualRenderer } from '../components/visuals/VisualRenderer';
import { VariationTableEditor } from '../components/visuals/VariationTableEditor';
import { validateVariationTable } from '../components/visuals/VariationTable';
import { VisualType, VisualConfig } from '../types';
import { validateQuestionVisual } from '../utils/visualValidator';

export function QuestionEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentGrade = useAppStore(state => state.currentGrade);
  const questions = useAppStore(state => state.questions);
  const addQuestion = useAppStore(state => state.addQuestion);
  const updateQuestion = useAppStore(state => state.updateQuestion);

  const isEditing = Boolean(id);
  const existingQuestion = isEditing ? questions.find(q => q.id === id) : null;

  const [questionType, setQuestionType] = useState<QuestionType>(existingQuestion?.question_type || 'MCQ_SINGLE');
  const [difficulty, setDifficulty] = useState<number>(existingQuestion?.difficulty || 1);
  const [content, setContent] = useState<string>(existingQuestion?.content || '');
  const [topic, setTopic] = useState<string>(existingQuestion?.topic_id || '');
  const [tags, setTags] = useState<string>(existingQuestion?.tags?.join(', ') || '');

  // MCQ State
  const [mcqOptions, setMcqOptions] = useState<McqOption[]>(
    existingQuestion?.question_type === 'MCQ_SINGLE' 
      ? existingQuestion.options 
      : [
          { id: uuidv4(), content: '', isCorrect: true },
          { id: uuidv4(), content: '', isCorrect: false },
          { id: uuidv4(), content: '', isCorrect: false },
          { id: uuidv4(), content: '', isCorrect: false },
        ]
  );

  // T/F State
  const [tfStatements, setTfStatements] = useState<TrueFalseStatement[]>(
    existingQuestion?.question_type === 'TRUE_FALSE_GROUP'
      ? existingQuestion.statements
      : [
          { id: uuidv4(), content: '', isTrue: true },
          { id: uuidv4(), content: '', isTrue: false },
          { id: uuidv4(), content: '', isTrue: false },
          { id: uuidv4(), content: '', isTrue: false },
        ]
  );

  // Short Answer State
  const [shortAnswer, setShortAnswer] = useState<string>(
    existingQuestion?.question_type === 'SHORT_ANSWER' ? existingQuestion.correctAnswer : ''
  );
  const [visual, setVisual] = useState<VisualConfig | undefined>(existingQuestion?.visual);
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [tempVisualType, setTempVisualType] = useState<VisualType>('NONE');
  const [tempVisualData, setTempVisualData] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);


  useEffect(() => {
    if (isEditing && !existingQuestion) {
      navigate('/bank');
    }
  }, [isEditing, existingQuestion, navigate]);

  const saveQuestion = (forceDraft = false) => {
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
      setValidationError(vCheck.reason || 'Dữ liệu không hợp lệ');
      return;
    }

    saveQuestion(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/bank')} className="text-slate-500 hover:text-slate-800">
          ← Quay lại
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          {isEditing ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Cài đặt chung</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dạng câu hỏi</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                  disabled={isEditing}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50"
                >
                  <option value="MCQ_SINGLE">Trắc nghiệm A, B, C, D</option>
                  <option value="TRUE_FALSE_GROUP">Đúng / Sai</option>
                  <option value="SHORT_ANSWER">Trả lời ngắn</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mức độ</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  >
                    <option value={1}>1. Nhận biết</option>
                    <option value={2}>2. Thông hiểu</option>
                    <option value={3}>3. Vận dụng</option>
                    <option value={4}>4. Vận dụng cao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Chủ đề (Topic)</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="VD: ham-so"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (cách nhau bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="VD: tich-phan, kho, hinh-khong-gian"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4">Nội dung câu hỏi (Hỗ trợ LaTeX)</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung... Dùng $ công thức $ cho inline, $$ công thức $$ cho block"
              className="w-full flex-1 min-h-[200px] px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
            />
          </div>
          {/* Visual Editor */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><ImageIcon size={20} /> Hình minh họa</h3>
              {!visual || visual.type === 'NONE' ? (
                <button type="button" onClick={() => { setShowVisualEditor(true); setTempVisualType('IMAGE'); }} className="text-indigo-600 font-bold text-sm hover:underline">+ THÊM HÌNH</button>
              ) : (
                <div className="flex gap-4">
                  <button type="button" onClick={() => { setShowVisualEditor(true); setTempVisualType(visual.type); setTempVisualData(JSON.stringify(visual, null, 2)); }} className="text-indigo-600 font-bold text-sm hover:underline">CHỈNH SỬA HÌNH</button>
                  <button type="button" onClick={() => setVisual(undefined)} className="text-red-600 font-bold text-sm hover:underline">XÓA HÌNH</button>
                </div>
              )}
            </div>
            
            {visual && visual.type !== 'NONE' && !showVisualEditor && (
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <VisualRenderer visual={visual} />
              </div>
            )}
            
            {showVisualEditor && (
              <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50/50 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại hình</label>
                  <select value={tempVisualType} onChange={(e) => setTempVisualType(e.target.value as VisualType)} className="w-full p-2 rounded-xl border border-slate-300 bg-white">
                    <option value="NONE">Không có</option>
                    <option value="IMAGE">Tải ảnh (hoặc URL)</option>
                    <option value="VARIATION_TABLE">Bảng biến thiên</option>
                    <option value="FUNCTION_GRAPH">Đồ thị hàm số</option>
                    <option value="GEOMETRY_2D">Hình học 2D</option>
                    <option value="GEOMETRY_3D">Hình học 3D</option>
                    <option value="OXY">Oxy</option>
                    <option value="OXYZ">Oxyz</option>
                  </select>
                </div>
                {tempVisualType === 'VARIATION_TABLE' ? (
                  <VariationTableEditor value={tempVisualData} onChange={setTempVisualData} />
                ) : tempVisualType !== 'NONE' ? (
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Dữ liệu cấu hình (JSON)</label>
                     <textarea value={tempVisualData} onChange={e => setTempVisualData(e.target.value)} rows={6} className="w-full p-2 font-mono text-sm rounded-xl border border-slate-300" placeholder={`{
  "type": "${tempVisualType}",
  "source": "https...",
  "data": {}
}`} />
                  </div>
                ) : null}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowVisualEditor(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600">Hủy</button>
                  <button type="button" onClick={() => {
                    try {
                      if (tempVisualType === 'NONE') { setVisual(undefined); }
                      else { 
                        const parsed = JSON.parse(tempVisualData);
                        if (tempVisualType === 'VARIATION_TABLE' && !validateVariationTable(parsed.data)) {
                          alert('Bảng biến thiên chưa đủ dữ liệu. Vui lòng kiểm tra lại cấu trúc JSON.');
                          return;
                        }
                        setVisual(parsed); 
                      }
                      setShowVisualEditor(false);
                    } catch(e) { alert('JSON không hợp lệ'); }
                  }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">Lưu hình</button>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[150px]">
            <h3 className="font-bold text-slate-800 mb-4">Xem trước nội dung</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 prose max-w-none">
              <QuestionContentRenderer content={sanitizeQuestionText(content) || 'Chưa có nội dung'} />
              <VisualRenderer visual={visual} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Thiết lập Đáp án</h3>

            {questionType === 'MCQ_SINGLE' && (
              <div className="space-y-3">
                {mcqOptions.map((opt, i) => (
                  <div key={opt.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <input
                      type="radio"
                      name="mcq-correct"
                      checked={opt.isCorrect}
                      onChange={() => setMcqOptions(mcqOptions.map(o => ({ ...o, isCorrect: o.id === opt.id })))}
                      className="mt-3 w-4 h-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-slate-600 mb-1 block">Phương án {['A','B','C','D'][i]}</span>
                      <textarea
                        value={opt.content}
                        onChange={(e) => setMcqOptions(mcqOptions.map(o => o.id === opt.id ? { ...o, content: e.target.value } : o))}
                        className="w-full px-3 py-2 text-sm rounded border border-slate-300 outline-none"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {questionType === 'TRUE_FALSE_GROUP' && (
              <div className="space-y-3">
                {tfStatements.map((stmt, i) => (
                  <div key={stmt.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex-1">
                      <span className="font-semibold text-slate-600 mb-1 block">Mệnh đề {['a','b','c','d'][i]}</span>
                      <textarea
                        value={stmt.content}
                        onChange={(e) => setTfStatements(tfStatements.map(o => o.id === stmt.id ? { ...o, content: e.target.value } : o))}
                        className="w-full px-3 py-2 text-sm rounded border border-slate-300 outline-none mb-2"
                        rows={2}
                      />
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={stmt.isTrue === true}
                            onChange={() => setTfStatements(tfStatements.map(o => o.id === stmt.id ? { ...o, isTrue: true } : o))}
                            className="text-emerald-600"
                          />
                          <span className="text-sm font-medium">Đúng</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={stmt.isTrue === false}
                            onChange={() => setTfStatements(tfStatements.map(o => o.id === stmt.id ? { ...o, isTrue: false } : o))}
                            className="text-orange-600"
                          />
                          <span className="text-sm font-medium">Sai</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {questionType === 'SHORT_ANSWER' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Đáp án chính xác</label>
                <input
                  type="text"
                  value={shortAnswer}
                  onChange={(e) => setShortAnswer(e.target.value)}
                  placeholder="Ví dụ: 12.5"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                />
                <p className="text-sm text-slate-500">Học sinh sẽ cần nhập chính xác chuỗi này để được điểm.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-red-600 mb-2">Lỗi dữ liệu câu hỏi</h3>
            <p className="text-slate-600 mb-6">
              {validationError === 'MISSING_VISUAL_FOR_TABLE_QUESTION' 
                ? 'Bạn đã đề cập đến bảng biến thiên trong nội dung câu hỏi, nhưng chưa thêm dữ liệu bảng biến thiên hoặc hình ảnh.'
                : 'Dữ liệu cấu trúc bảng biến thiên không hợp lệ (thiếu hàng x, y\' hoặc y).'}
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

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={() => navigate('/bank')}
          className="px-6 py-2.5 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
        >
          Lưu Câu Hỏi
        </button>
      </div>
    </div>
  );
}
