import React, { useState } from 'react';
import { Question } from '../types';
import { QuestionEditorModal } from './QuestionEditorModal';
import { MathRenderer } from './MathRenderer';
import { QuestionContentRenderer } from './QuestionContentRenderer';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { Edit, Trash2, Plus, Copy } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  questions: Question[];
  onChange: (qs: Question[]) => void;
}

export function ManualQuestionForm({ questions, onChange }: Props) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null | 'NEW'>(null);

  const handleSave = (mode: 'UPDATE_BANK' | 'ONLY_IN_EXAM', newQ: Question) => {
    if (editingQuestion === 'NEW') {
      onChange([...questions, { ...newQ, id: uuidv4() }]);
    } else {
      onChange(questions.map(q => q.id === newQ.id ? newQ : q));
    }
    setEditingQuestion(null);
  };

  const handleCopy = (q: Question) => {
    onChange([...questions, { ...q, id: uuidv4() }]);
  };

  const handleRemove = (id: string) => {
    onChange(questions.filter(q => q.id !== id));
  };

  return (
    <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-800">Danh sách câu hỏi ({questions.length})</h4>
        <button 
          type="button" 
          onClick={() => setEditingQuestion('NEW')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 transition-colors"
        >
          <Plus size={18} /> THÊM CÂU MỚI
        </button>
      </div>

      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            Chưa có câu hỏi nào. Nhấn "Thêm câu mới" để bắt đầu.
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={q.id} className="p-4 bg-white rounded-xl border border-slate-200 flex gap-4 group">
              <div className="font-bold text-slate-400 w-8 text-center pt-1">{idx + 1}</div>
              <div className="flex-1">
                <div className="text-slate-800 line-clamp-2 mb-2">
                   <QuestionContentRenderer content={sanitizeQuestionText(q.content)} />
                </div>
                {q.visual && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Có hình/bảng</span>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => setEditingQuestion(q)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg"><Edit size={18} /></button>
                <button type="button" onClick={() => handleCopy(q)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Copy size={18} /></button>
                <button type="button" onClick={() => handleRemove(q.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingQuestion && (
        <QuestionEditorModal
          initialQuestion={editingQuestion === 'NEW' ? undefined : editingQuestion}
          onCancel={() => setEditingQuestion(null)}
          onSave={handleSave}
          isEmbedded={true}
        />
      )}
    </div>
  );
}
