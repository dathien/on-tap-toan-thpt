import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import { Question } from '../types';
import { MathRenderer } from '../components/MathRenderer';
import { QuestionContentRenderer } from '../components/QuestionContentRenderer';
import { getGridClass } from '../utils/layout';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { VisualRenderer } from '../components/visuals/VisualRenderer';
import { UploadCloud, CheckCircle, XCircle, FileText, Loader2, ArrowRight } from 'lucide-react';

export function WordImport() {
  const navigate = useNavigate();
  const currentGrade = useAppStore(state => state.currentGrade);
  const addQuestion = useAppStore(state => state.addQuestion);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<Question[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.endsWith('.docx')) {
      setFile(selected);
      setError(null);
    } else {
      setFile(null);
      setError('Vui lòng chọn file định dạng .docx hợp lệ.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse-docx', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Lỗi xử lý file');
      }

      const data = await response.json();
      
      // Transform raw JSON into complete Question objects
      const questions: Question[] = (data.questions || []).map((q: any) => {
        const baseId = uuidv4();
        const baseData = {
          id: baseId,
          subject_id: 'math',
          grade_id: currentGrade,
          topic_id: 'imported', // default topic
          lesson_id: 'imported',
          difficulty: 2 as 1 | 2 | 3 | 4, // default to 'Thông hiểu'
          content: q.content || '',
          tags: ['imported'],
        };

        if (q.question_type === 'MCQ_SINGLE') {
          return {
            ...baseData,
            question_type: 'MCQ_SINGLE',
            options: (q.options || []).map((o: any) => ({
              id: uuidv4(),
              content: o.content || '',
              isCorrect: o.isCorrect || false
            }))
          };
        } else if (q.question_type === 'TRUE_FALSE_GROUP') {
          return {
            ...baseData,
            question_type: 'TRUE_FALSE_GROUP',
            statements: (q.statements || []).map((s: any) => ({
              id: uuidv4(),
              content: s.content || '',
              isTrue: s.isTrue || false
            }))
          };
        } else {
          return {
            ...baseData,
            question_type: 'SHORT_ANSWER',
            correctAnswer: q.correctAnswer || ''
          };
        }
      });

      setParsedQuestions(questions);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi kết nối máy chủ phân tích AI.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAll = () => {
    if (!parsedQuestions) return;
    // Iterate and save
    parsedQuestions.forEach(q => addQuestion(q));
    alert(`Đã lưu thành công ${parsedQuestions.length} câu hỏi vào ngân hàng Toán ${currentGrade}!`);
    navigate('/bank');
  };

  const getTypeLabel = (t: string) => {
    switch(t) {
      case 'MCQ_SINGLE': return 'A, B, C, D';
      case 'TRUE_FALSE_GROUP': return 'Đúng / Sai';
      case 'SHORT_ANSWER': return 'Trả lời ngắn';
      default: return t;
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/bank')} className="text-slate-500 hover:text-slate-800">
          ← Quay lại
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Nhập đề từ Word (Sử dụng AI)</h2>
      </div>

      {!parsedQuestions ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-2xl mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <UploadCloud size={40} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Tải lên file Word (.docx)</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Hệ thống AI sẽ tự động đọc cấu trúc đề, chuyển đổi công thức OMML sang LaTeX và nhận diện dạng câu hỏi.
          </p>

          <input 
            type="file" 
            accept=".docx" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 mb-6 cursor-pointer transition-colors ${
              file ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3 text-indigo-700 font-medium">
                <FileText size={24} />
                <span>{file.name}</span>
              </div>
            ) : (
              <div className="text-slate-500 font-medium">Nhấp để chọn file từ máy tính</div>
            )}
          </div>

          {error && (
            <div className="text-orange-600 mb-6 font-medium flex justify-center items-center gap-2">
              <XCircle size={18} />
              {error}
            </div>
          )}

          <button
            disabled={!file || isUploading}
            onClick={handleUpload}
            className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex justify-center items-center gap-2 shadow-sm"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Đang dùng AI phân tích...
              </>
            ) : (
              <>
                Bắt đầu phân tích
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-indigo-900">AI đã nhận diện được {parsedQuestions.length} câu hỏi</h3>
              <p className="text-indigo-700 text-sm mt-1">Vui lòng kiểm tra lại trước khi lưu vào ngân hàng khối {currentGrade}.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setParsedQuestions(null)}
                className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Tải file khác
              </button>
              <button 
                onClick={handleSaveAll}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <CheckCircle size={20} />
                Lưu vào Ngân hàng
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {parsedQuestions.map((q, index) => (
              <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <span className="font-bold text-slate-800">Câu {index + 1}</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg">
                    {getTypeLabel(q.question_type)}
                  </span>
                </div>
                
                <div className="text-slate-800 mb-6">
                  <QuestionContentRenderer content={sanitizeQuestionText(q.content)} />
                  <VisualRenderer visual={q.visual} />
                </div>

                {q.question_type === 'MCQ_SINGLE' && (
                  <div className={getGridClass((q as any).options) + " gap-3"}>
                    {q.options.map((opt: any, i: number) => (
                      <div key={opt.id} className={`answer-option p-4 rounded-xl border-2 ${opt.isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                        <span className={`answer-label w-6 h-6 rounded-full font-bold text-sm ${opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                          {['A','B','C','D'][i]}
                        </span>
                        <div className="answer-content text-sm"><QuestionContentRenderer content={opt.content} /></div>
                      </div>
                    ))}
                  </div>
                )}

                {q.question_type === 'TRUE_FALSE_GROUP' && (
                  <div className="space-y-3">
                    {q.statements.map((stmt: any, i: number) => (
                      <div key={stmt.id} className="answer-option p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <span className="answer-label font-bold text-slate-500">{['a','b','c','d'][i]})</span>
                        <div className="answer-content text-sm"><QuestionContentRenderer content={stmt.content} /></div>
                        <span className={`px-3 py-1 rounded-md text-sm font-bold ${stmt.isTrue ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                          {stmt.isTrue ? 'ĐÚNG' : 'SAI'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {q.question_type === 'SHORT_ANSWER' && (
                  <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50">
                    <span className="text-sm font-medium text-indigo-700 block mb-1">Đáp án:</span>
                    <span className="text-xl font-bold text-slate-800">{q.correctAnswer}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
