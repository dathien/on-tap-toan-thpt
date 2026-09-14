import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ExamConfig, ExamVersion, Question } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Edit, Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { MathText } from '../components/MathText';
import { curriculumData } from '../data/curriculum';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { VisualRenderer } from '../components/visuals/VisualRenderer';
import { QuestionEditorModal } from '../components/QuestionEditorModal';

export function ExamEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const exams = useAppStore(state => state.exams);
  const examVersions = useAppStore(state => state.examVersions);
  const updateExam = useAppStore(state => state.updateExam);
  const addExamVersion = useAppStore(state => state.addExamVersion);
  const updateExamVersion = useAppStore(state => state.updateExamVersion);
  
  const allQuestions = useAppStore(state => state.questions);
  const updateQuestion = useAppStore(state => state.updateQuestion);
  const addQuestion = useAppStore(state => state.addQuestion);

  const [exam, setExam] = useState<ExamConfig | null>(null);
  const [version, setVersion] = useState<ExamVersion | null>(null);
  
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  useEffect(() => {
    const config = exams.find(e => e.id === id);
    if (!config) return;
    setExam(config);
    
    // Find the latest version or create one
    let currentVersion = examVersions.find(v => v.examConfigId === config.id);
    if (!currentVersion) {
        // Quick fallback if version doesn't exist
        currentVersion = {
            id: uuidv4(),
            examConfigId: config.id,
            questions: []
        };
        addExamVersion(currentVersion);
    }
    setVersion(currentVersion);
  }, [id, exams, examVersions, addExamVersion]);

  if (!exam || !version) return <div className="p-8">Đang tải...</div>;

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


  const handleUpdateConfig = (updates: Partial<ExamConfig>) => {
    updateExam(exam.id, updates);
  };

  const handleUpdateQuestions = (newQuestions: Question[]) => {
    updateExamVersion(version.id, { questions: newQuestions });
  };

  const moveQuestion = (index: number, direction: 'UP' | 'DOWN') => {
    const newQuestions = [...version.questions];
    if (direction === 'UP' && index > 0) {
        [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
    } else if (direction === 'DOWN' && index < newQuestions.length - 1) {
        [newQuestions[index + 1], newQuestions[index]] = [newQuestions[index], newQuestions[index + 1]];
    }
    handleUpdateQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này khỏi đề?")) {
        const newQuestions = [...version.questions];
        newQuestions.splice(index, 1);
        handleUpdateQuestions(newQuestions);
    }
  };

  
  const handleSaveQuestion = (mode: 'UPDATE_BANK' | 'ONLY_IN_EXAM', rawQ: Question) => {
     const q = { ...rawQ };
     delete q._importError;
     delete q._importMessage;
     
     if (mode === 'UPDATE_BANK') {

         // Update the original question in the bank
         updateQuestion(q.id, q);
         
         // Also update it in the current version just in case
         const newQuestions = version.questions.map(vq => vq.id === q.id ? q : vq);
         handleUpdateQuestions(newQuestions);
     } else {
         // Add new isolated question to the store so it can be referenced
         addQuestion(q);
         
         // Replace the old question in this exam version with the new one
         const newQuestions = version.questions.map(vq => vq.id === editingQuestion?.id ? q : vq);
         handleUpdateQuestions(newQuestions);
     }
     setEditingQuestion(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/exam-list')} className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
              <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Chỉnh sửa Đề thi</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Tên đề thi</label>
             <input type="text" value={exam.name} onChange={e => handleUpdateConfig({ name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
         </div>
         <div className="grid grid-cols-2 gap-4">
             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Thời gian (phút)</label>
                 <input type="number" value={exam.durationMinutes} onChange={e => handleUpdateConfig({ durationMinutes: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
             </div>
             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Loại đề</label>
                 <select value={exam.type} onChange={e => handleUpdateConfig({ type: e.target.value as any })} className="w-full px-3 py-2 rounded-xl border border-slate-300">
                     <option value="THUONG_XUYEN">Thường xuyên</option>
                     <option value="GIUA_KY">Giữa kỳ</option>
                     <option value="CUOI_KY">Cuối kỳ</option>
                     <option value="TOT_NGHIEP">Tốt nghiệp</option>
                 </select>
             </div>
         
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

      </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Danh sách câu hỏi ({version.questions.length})</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100">
                  <Plus size={18} /> Thêm câu hỏi
              </button>
          </div>

          <div className="space-y-4">
              {version.questions.map((q, idx) => (
                  <div key={q.id + '_' + idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex gap-4 group">
                      <div className="flex flex-col gap-1 items-center justify-center border-r border-slate-200 pr-4">
                          <button onClick={() => moveQuestion(idx, 'UP')} disabled={idx === 0} className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"><ArrowUp size={16} /></button>
                          <span className="font-bold text-slate-600">{idx + 1}</span>
                          <button onClick={() => moveQuestion(idx, 'DOWN')} disabled={idx === version.questions.length - 1} className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"><ArrowDown size={16} /></button>
                      </div>
                      
                      <div className="flex-1">
                          
                          <div className="text-slate-800 line-clamp-2 mb-2">
                             <MathText text={sanitizeQuestionText(q.content)} />
                          </div>
                          
                          {q._importError && (
                             <div className="mb-2 p-2 bg-red-50 text-red-700 text-sm font-semibold rounded-lg border border-red-200 inline-flex items-center gap-2">
                                ⚠️ CẦN KIỂM TRA: {q._importMessage}
                             </div>
                          )}

                          {q.visual && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Có hình/bảng</span>}
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingQuestion(q)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg"><Edit size={18} /></button>
                          <button onClick={() => removeQuestion(idx)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                  </div>
              ))}
              {version.questions.length === 0 && (
                  <div className="text-center p-8 text-slate-500">Đề này chưa có câu hỏi nào.</div>
              )}
          </div>
      </div>

      {editingQuestion && (
          <QuestionEditorModal
            initialQuestion={editingQuestion}
            onCancel={() => setEditingQuestion(null)}
            onSave={handleSaveQuestion}
            isEmbedded={true}
          />
      )}
    </div>
  );
}
