import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Question, QuestionType, McqOption, TrueFalseStatement, VisualConfig } from '../types';
import { MathText } from './MathText';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { VisualRenderer } from './visuals/VisualRenderer';
import { VariationTableEditor } from './visuals/VariationTableEditor';
import { validateVariationTable } from './visuals/VariationTable';
import { useAppStore } from '../store/useAppStore';
import { validateQuestionMath, ValidationResult } from '../utils/mathValidator';
import clsx from 'clsx';

interface QuestionEditorModalProps {
  initialQuestion?: Question;
  onSave: (mode: 'UPDATE_BANK' | 'ONLY_IN_EXAM', question: Question) => void;
  onCancel: () => void;
  // If true, it asks the user whether to save globally or locally. If false, it just passes back the updated question.
  isEmbedded?: boolean;
}

export function QuestionEditorModal({ initialQuestion, onSave, onCancel, isEmbedded = false }: QuestionEditorModalProps) {
  const [questionType, setQuestionType] = useState<QuestionType>(initialQuestion?.question_type || 'MCQ_SINGLE');
  const [difficulty, setDifficulty] = useState<number>(initialQuestion?.difficulty || 1);
  const [content, setContent] = useState<string>(initialQuestion?.content || '');
  const [topic, setTopic] = useState<string>(initialQuestion?.topic_id || '');
  const [tags, setTags] = useState<string>(initialQuestion?.tags?.join(', ') || '');
  const [explanation, setExplanation] = useState<string>(initialQuestion?.explanation || '');

  // MCQ State
  const [mcqOptions, setMcqOptions] = useState<McqOption[]>(
    initialQuestion?.question_type === 'MCQ_SINGLE'
      ? initialQuestion.options
      : [
          { id: uuidv4(), content: '', isCorrect: true },
          { id: uuidv4(), content: '', isCorrect: false },
          { id: uuidv4(), content: '', isCorrect: false },
          { id: uuidv4(), content: '', isCorrect: false },
        ]
  );

  // T/F State
  const [tfStatements, setTfStatements] = useState<TrueFalseStatement[]>(
    initialQuestion?.question_type === 'TRUE_FALSE_GROUP'
      ? initialQuestion.statements
      : [
          { id: uuidv4(), content: '', isTrue: true },
          { id: uuidv4(), content: '', isTrue: false },
          { id: uuidv4(), content: '', isTrue: false },
          { id: uuidv4(), content: '', isTrue: false },
        ]
  );

  // SA State
  const [shortAnswer, setShortAnswer] = useState<string>(
    initialQuestion?.question_type === 'SHORT_ANSWER' ? initialQuestion.correctAnswer : ''
  );

  const [visual, setVisual] = useState<VisualConfig | undefined>(initialQuestion?.visual);
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [tempVisualType, setTempVisualType] = useState<string>(initialQuestion?.visual?.type || 'NONE');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [tempVisualData, setTempVisualData] = useState<string>(
    initialQuestion?.visual ? JSON.stringify(initialQuestion.visual, null, 2) : ''
  );
  
  const [showPreviewAnswers, setShowPreviewAnswers] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  const handleValidate = () => {
    
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

    const res = validateQuestionMath(currentQuestion as Question);
    setValidationResult(res);
    if (res.isValid) {
        alert("✅ Dữ liệu câu hỏi có vẻ hợp lệ về mặt Toán học.");
    }
  };

  const handleSave = () => {
    // Validation
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    if (questionType === 'MCQ_SINGLE') {
      const hasCorrect = mcqOptions.some(o => o.isCorrect);
      if (!hasCorrect) {
        alert('Phải có đúng 1 đáp án đúng cho câu trắc nghiệm.');
        return;
      }
      if (mcqOptions.some(o => !o.content.trim())) {
        alert('Vui lòng điền đủ 4 đáp án ABCD.');
        return;
      }
    } else if (questionType === 'TRUE_FALSE_GROUP') {
      if (tfStatements.some(s => !s.content.trim())) {
        alert('Vui lòng điền đủ nội dung 4 mệnh đề Đúng/Sai.');
        return;
      }
    } else if (questionType === 'SHORT_ANSWER') {
      if (!shortAnswer.trim()) {
        alert('Vui lòng nhập đáp án cho câu trả lời ngắn.');
        return;
      }
    }

    if (isEmbedded) {
        setShowSavePrompt(true);
    } else {
        performSave('UPDATE_BANK');
    }
  };

  const performSave = (mode: 'UPDATE_BANK' | 'ONLY_IN_EXAM') => {
    const baseQuestion = {
        id: (mode === 'ONLY_IN_EXAM') ? uuidv4() : (initialQuestion?.id || uuidv4()),
        subject_id: 'MATH',
        grade_id: 12 as any, // default for now, could be passed in
        topic_id: topic,
        lesson_id: '',
        question_type: questionType,
        difficulty: difficulty as any,
        content: content,
        visual: visual,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        explanation: explanation,
    };

    let newQuestion: Question;
    if (questionType === 'MCQ_SINGLE') {
      newQuestion = { ...baseQuestion, question_type: 'MCQ_SINGLE', options: mcqOptions };
    } else if (questionType === 'TRUE_FALSE_GROUP') {
      newQuestion = { ...baseQuestion, question_type: 'TRUE_FALSE_GROUP', statements: tfStatements };
    } else {
      newQuestion = { ...baseQuestion, question_type: 'SHORT_ANSWER', correctAnswer: shortAnswer };
    }

    onSave(mode, newQuestion);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl my-auto flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">
            {initialQuestion ? 'Chỉnh sửa Câu hỏi' : 'Tạo câu hỏi mới'}
          </h2>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50">
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại câu hỏi</label>
                  <select value={questionType} onChange={(e) => setQuestionType(e.target.value as QuestionType)} className="w-full px-3 py-2 rounded-xl border border-slate-200">
                    <option value="MCQ_SINGLE">Trắc nghiệm ABCD</option>
                    <option value="TRUE_FALSE_GROUP">Đúng / Sai</option>
                    <option value="SHORT_ANSWER">Trả lời ngắn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mức độ</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200">
                    <option value={1}>Nhận biết</option>
                    <option value={2}>Thông hiểu</option>
                    <option value={3}>Vận dụng</option>
                    <option value={4}>Vận dụng cao</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung câu hỏi (hỗ trợ LaTeX)</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm"
                  placeholder="Nhập nội dung câu hỏi..."
                />
              </div>

              <div>
                 <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">Hình ảnh / Đồ thị / Bảng biến thiên</label>
                    <button onClick={() => setShowVisualEditor(true)} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100">
                        {visual ? 'Sửa hình' : 'Thêm hình'}
                    </button>
                 </div>
                 {visual && (
                     <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-sm font-semibold text-slate-600">Kiểu: {visual.type}</span>
                        <button onClick={() => setVisual(undefined)} className="text-xs font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded">Xóa hình</button>
                     </div>
                 )}
              </div>
            </div>

            {/* Answer Settings based on type */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Thiết lập Đáp án</h3>
              
              {questionType === 'MCQ_SINGLE' && (
              <div className="space-y-3">
                {mcqOptions.map((opt, i) => (
                  <div key={opt.id} className={clsx("flex items-start gap-3 p-3 rounded-xl border transition-colors", opt.isCorrect ? "border-indigo-300 bg-indigo-50/50" : "border-slate-200 bg-slate-50")}>
                    <input
                      type="radio"
                      name="mcq-correct"
                      checked={opt.isCorrect}
                      onChange={() => setMcqOptions(mcqOptions.map(o => ({ ...o, isCorrect: o.id === opt.id })))}
                      className="mt-3 w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className={clsx("font-semibold mb-1 block", opt.isCorrect ? "text-indigo-700" : "text-slate-600")}>Phương án {['A','B','C','D'][i]} {opt.isCorrect && '(Đáp án đúng)'}</span>
                      <textarea
                        value={opt.content}
                        onChange={(e) => setMcqOptions(mcqOptions.map(o => o.id === opt.id ? { ...o, content: e.target.value } : o))}
                        className="w-full px-3 py-2 text-sm rounded border border-slate-300 outline-none focus:ring-1 focus:ring-indigo-500"
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
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-600">Mệnh đề {['a','b','c','d'][i]}</span>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                                <input
                                type="radio"
                                checked={stmt.isTrue === true}
                                onChange={() => setTfStatements(tfStatements.map(o => o.id === stmt.id ? { ...o, isTrue: true } : o))}
                                className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                                <span className="text-sm font-bold text-emerald-700">Đúng</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                                <input
                                type="radio"
                                checked={stmt.isTrue === false}
                                onChange={() => setTfStatements(tfStatements.map(o => o.id === stmt.id ? { ...o, isTrue: false } : o))}
                                className="text-rose-600 focus:ring-rose-500 cursor-pointer"
                                />
                                <span className="text-sm font-bold text-rose-700">Sai</span>
                            </label>
                        </div>
                      </div>
                      <textarea
                        value={stmt.content}
                        onChange={(e) => setTfStatements(tfStatements.map(o => o.id === stmt.id ? { ...o, content: e.target.value } : o))}
                        className="w-full px-3 py-2 text-sm rounded border border-slate-300 outline-none focus:ring-1 focus:ring-indigo-500"
                        rows={2}
                      />
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ví dụ: 12.5"
                />
              </div>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
               <label className="block text-sm font-bold text-slate-800 mb-2">Lời giải / Giải thích</label>
               <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 h-24 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm"
                  placeholder="Nhập lời giải hoặc giải thích đáp án (hỗ trợ LaTeX)..."
               />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full max-h-[800px]">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-slate-800">Xem trước (Preview)</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showPreviewAnswers} onChange={e => setShowPreviewAnswers(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm font-semibold text-indigo-600">HIỂN THỊ ĐÁP ÁN CHO GV</span>
                </label>
              </div>
              <div className="p-5 overflow-y-auto flex-1">
                <div className="question-content question-text text-slate-800 text-lg mb-4">
                  <MathText text={sanitizeQuestionText(content) || 'Nội dung câu hỏi...'} />
                </div>
                {visual && (
                  <div className="mb-6 flex justify-center">
                    <VisualRenderer visual={visual} />
                  </div>
                )}
                
                {/* Options Preview */}
                <div className="mt-4">
                    {questionType === 'MCQ_SINGLE' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {mcqOptions.map((opt, i) => (
                                <div key={opt.id} className={clsx("p-4 rounded-xl border-2 transition-colors", showPreviewAnswers && opt.isCorrect ? "border-indigo-500 bg-indigo-50" : "border-slate-100 bg-white")}>
                                    <span className="font-bold text-slate-700 mr-2">{['A.', 'B.', 'C.', 'D.'][i]}</span>
                                    <MathText text={sanitizeQuestionText(opt.content)} />
                                </div>
                            ))}
                        </div>
                    )}
                    {questionType === 'TRUE_FALSE_GROUP' && (
                        <div className="space-y-4">
                            {tfStatements.map((stmt, i) => (
                                <div key={stmt.id} className={clsx("flex gap-3 p-4 rounded-xl border-2", showPreviewAnswers ? (stmt.isTrue ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50") : "border-slate-100 bg-white")}>
                                    <div className="font-bold text-slate-700">{['a)', 'b)', 'c)', 'd)'][i]}</div>
                                    <div className="flex-1"><MathText text={sanitizeQuestionText(stmt.content)} /></div>
                                    {showPreviewAnswers && (
                                        <div className={clsx("font-bold text-sm", stmt.isTrue ? "text-emerald-700" : "text-rose-700")}>{stmt.isTrue ? "ĐÚNG" : "SAI"}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {questionType === 'SHORT_ANSWER' && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-center">
                            {showPreviewAnswers ? <span className="font-bold text-indigo-700">Đáp án: {shortAnswer}</span> : <span className="text-slate-400">Học sinh nhập đáp án vào đây</span>}
                        </div>
                    )}
                </div>

                {showPreviewAnswers && explanation && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="font-bold text-amber-800 mb-2">Lời giải:</div>
                        <div className="text-amber-900"><MathText text={explanation} /></div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-200 bg-white shrink-0 flex justify-end gap-4 rounded-b-2xl">
           <button onClick={onCancel} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
               HỦY
           </button>
           <button onClick={handleSave} className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
               LƯU THAY ĐỔI
           </button>
        </div>
      </div>

      {showSavePrompt && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center animate-in zoom-in-95">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Áp dụng thay đổi ở đâu?</h3>
                  <p className="text-sm text-slate-600 mb-6">Bạn đang sửa câu hỏi thuộc Ngân hàng. Bạn muốn cập nhật câu gốc hay chỉ lưu cho đề này?</p>
                  
                  <div className="space-y-3">
                      <button onClick={() => { setShowSavePrompt(false); performSave('UPDATE_BANK'); }} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">
                          CẬP NHẬT NGÂN HÀNG GỐC
                      </button>
                      <button onClick={() => { setShowSavePrompt(false); performSave('ONLY_IN_EXAM'); }} className="w-full py-3 bg-slate-100 text-indigo-700 font-bold rounded-xl hover:bg-slate-200 border border-slate-200">
                          CHỈ SỬA TRONG ĐỀ NÀY
                      </button>
                      <button onClick={() => setShowSavePrompt(false)} className="w-full py-3 bg-white text-slate-500 font-bold rounded-xl hover:bg-slate-50 border border-slate-200 mt-2">
                          HỦY
                      </button>
                  </div>
              </div>
          </div>
      )}

      {showVisualEditor && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Sửa Visual Data</h3>
            <textarea
               value={tempVisualData}
               onChange={e => setTempVisualData(e.target.value)}
               className="w-full h-64 font-mono text-sm border border-slate-200 p-2 rounded-xl mb-4"
               placeholder={`{\n  "type": "NONE"\n}`}
            />
            <div className="flex justify-end gap-3">
               <button onClick={() => setShowVisualEditor(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-lg">Hủy</button>
               <button onClick={() => {
                   try {
                       if (!tempVisualData.trim()) {
                           setVisual(undefined);
                       } else {
                           setVisual(JSON.parse(tempVisualData));
                       }
                       setShowVisualEditor(false);
                   } catch(e) {
                       alert('JSON không hợp lệ');
                   }
               }} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg">Lưu Hình</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
