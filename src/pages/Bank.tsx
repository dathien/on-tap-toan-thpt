import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { MathRenderer } from '../components/MathRenderer';
import { QuestionContentRenderer } from '../components/QuestionContentRenderer';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { VisualRenderer } from '../components/visuals/VisualRenderer';
import { QuestionEditorModal } from '../components/QuestionEditorModal';
import { Question } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function Bank() {
  const navigate = useNavigate();
  const allQuestions = useAppStore(state => state.questions);
  const deleteQuestion = useAppStore(state => state.deleteQuestion);
  const currentGrade = useAppStore(state => state.currentGrade);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterDiff, setFilterDiff] = useState<string>('ALL');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const updateQuestion = useAppStore(state => state.updateQuestion);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchGrade = q.grade_id === currentGrade;
      const matchSearch = q.content.toLowerCase().includes(search.toLowerCase()) || q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchType = filterType === 'ALL' || q.question_type === filterType;
      const matchDiff = filterDiff === 'ALL' || q.difficulty.toString() === filterDiff;
      return matchGrade && matchSearch && matchType && matchDiff;
    });
  }, [allQuestions, currentGrade, search, filterType, filterDiff]);

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      deleteQuestion(id);
    }
  };

  const getDifficultyLabel = (d: number) => {
    switch(d) {
      case 1: return 'Nhận biết';
      case 2: return 'Thông hiểu';
      case 3: return 'Vận dụng';
      case 4: return 'Vận dụng cao';
      default: return 'Không xác định';
    }
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
    <>
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ngân hàng câu hỏi Toán {currentGrade}</h2>
          <p className="text-slate-500 mt-1">Quản lý và cập nhật kho câu hỏi cho các kỳ thi.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/bank/import')}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span>Nhập từ Word</span>
          </button>
          <button
            onClick={() => navigate('/bank/add')}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Thêm thủ công</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung, chủ đề, tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-base"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-base bg-white"
            >
              <option value="ALL">Tất cả dạng câu</option>
              <option value="MCQ_SINGLE">A, B, C, D</option>
              <option value="TRUE_FALSE_GROUP">Đúng / Sai</option>
              <option value="SHORT_ANSWER">Trả lời ngắn</option>
            </select>
          </div>
          <div>
            <select
              value={filterDiff}
              onChange={(e) => setFilterDiff(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-base bg-white"
            >
              <option value="ALL">Tất cả mức độ</option>
              <option value="1">Nhận biết</option>
              <option value="2">Thông hiểu</option>
              <option value="3">Vận dụng</option>
              <option value="4">Vận dụng cao</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-y-auto p-4 space-y-4 h-full">
          {filteredQuestions.length === 0 ? (
            <div className="text-center text-slate-500 py-12">
              Không tìm thấy câu hỏi nào phù hợp.
            </div>
          ) : (
            filteredQuestions.map((q, idx) => (
              <div key={q.id} className="border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors group">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                      {getTypeLabel(q.question_type)}
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md">
                      {getDifficultyLabel(q.difficulty)}
                    </span>
                    {q.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-500 text-xs rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingQuestion(q)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        const copy = { ...q, id: uuidv4() };
                        useAppStore.getState().addQuestion(copy);
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Sao chép"
                    >
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(q.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-slate-800 line-clamp-3">
                  <QuestionContentRenderer content={sanitizeQuestionText(q.content)} />
                  <VisualRenderer visual={q.visual} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    
      {editingQuestion && (
        <QuestionEditorModal
          initialQuestion={editingQuestion}
          onCancel={() => setEditingQuestion(null)}
          onSave={(mode, updatedQ) => {
            updateQuestion(updatedQ.id, updatedQ);
            setEditingQuestion(null);
          }}
        />
      )}
    </>
  );
}
