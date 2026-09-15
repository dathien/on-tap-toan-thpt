import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Question } from '../types';
import { MathRenderer } from './MathRenderer';
import { QuestionContentRenderer } from './QuestionContentRenderer';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { Check, Search, Sparkles } from 'lucide-react';

interface Props {
  selectedQuestions: Question[];
  onChange: (qs: Question[]) => void;
  targetCount: number;
}

export function QuestionBankSelector({ selectedQuestions, onChange, targetCount }: Props) {
  const allQuestions = useAppStore(state => state.questions);
  const topics = useAppStore(state => (state as any).topics) || [];
  
  const [grade, setGrade] = useState<number>(12);
  const [topicId, setTopicId] = useState<string>('ALL');
  const [lessonId, setLessonId] = useState<string>('ALL');
  const [diff, setDiff] = useState<string>('ALL');
  const [qType, setQType] = useState<string>('ALL');
  
  const filtered = useMemo(() => {
    return allQuestions.filter(q => {
      const matchGrade = q.grade_id === grade;
      const matchTopic = topicId === 'ALL' || q.topic_id === topicId;
      const matchLesson = lessonId === 'ALL' || q.lesson_id === lessonId;
      const matchDiff = diff === 'ALL' || q.difficulty.toString() === diff;
      const matchType = qType === 'ALL' || q.question_type === qType;
      
      return matchGrade && matchTopic && matchLesson && matchDiff && matchType;
    });
  }, [allQuestions, grade, topicId, lessonId, diff, qType]);

  const handleAutoPick = () => {
    // Shuffle and pick targetCount
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    onChange(shuffled.slice(0, targetCount));
  };

  const toggleSelect = (q: Question) => {
    if (selectedQuestions.some(sq => sq.id === q.id)) {
      onChange(selectedQuestions.filter(sq => sq.id !== q.id));
    } else {
      onChange([...selectedQuestions, q]);
    }
  };

  return (
    <div className="mt-4 bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-6">
       <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
         <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp</label>
            <select value={grade} onChange={e => setGrade(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm">
               <option value={10}>Lớp 10</option>
               <option value={11}>Lớp 11</option>
               <option value={12}>Lớp 12</option>
            </select>
         </div>
         <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề</label>
            <select value={topicId} onChange={e => { setTopicId(e.target.value); setLessonId('ALL'); }} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm">
               <option value="ALL">Tất cả chủ đề</option>
               {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
         </div>
         <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bài học</label>
            <select value={lessonId} onChange={e => setLessonId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" disabled={topicId === 'ALL'}>
               <option value="ALL">Tất cả bài học</option>
               {topics.find(t => t.id === topicId)?.lessons?.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
         </div>
         <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Loại câu</label>
            <select value={qType} onChange={e => setQType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm">
               <option value="ALL">Tất cả</option>
               <option value="MCQ_SINGLE">Trắc nghiệm</option>
               <option value="TRUE_FALSE_GROUP">Đúng/Sai</option>
               <option value="SHORT_ANSWER">Trả lời ngắn</option>
            </select>
         </div>
         <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Độ khó</label>
            <select value={diff} onChange={e => setDiff(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm">
               <option value="ALL">Tất cả</option>
               <option value="1">Nhận biết</option>
               <option value="2">Thông hiểu</option>
               <option value="3">Vận dụng</option>
               <option value="4">Vận dụng cao</option>
            </select>
         </div>
       </div>

       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div>
             <span className="font-bold text-slate-800">Tìm thấy {filtered.length} câu phù hợp</span>
             <div className="text-sm text-slate-500">Đã chọn {selectedQuestions.length} câu</div>
          </div>
          <button 
             type="button" 
             onClick={handleAutoPick}
             disabled={filtered.length === 0}
             className="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 flex items-center gap-2 disabled:opacity-50"
          >
             <Sparkles size={16} /> CHỌN TỰ ĐỘNG ({targetCount} câu)
          </button>
       </div>

       <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filtered.slice(0, 100).map(q => {
             const isSelected = selectedQuestions.some(sq => sq.id === q.id);
             return (
               <div key={q.id} onClick={() => toggleSelect(q)} className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex gap-4 ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                 <div className="pt-1">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                       {isSelected && <Check size={16} />}
                    </div>
                 </div>
                 <div className="flex-1">
                    <div className="text-sm font-bold text-slate-500 mb-1">Mức độ {q.difficulty} • {q.question_type}</div>
                    <div className="text-slate-800 line-clamp-3">
                       <QuestionContentRenderer content={sanitizeQuestionText(q.content)} />
                    </div>
                 </div>
               </div>
             );
          })}
          {filtered.length > 100 && (
             <div className="text-center py-4 text-slate-500 text-sm font-medium">
                Và {filtered.length - 100} câu hỏi khác... Vui lòng thu hẹp bộ lọc.
             </div>
          )}
       </div>
    </div>
  );
}
