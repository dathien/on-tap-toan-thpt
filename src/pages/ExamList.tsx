import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { FileText, Trash2, ExternalLink, Clock, Play } from 'lucide-react';
import { ExamConfig } from '../types';

export function ExamList() {
  const navigate = useNavigate();
  const { currentGrade, exams, deleteExam } = useAppStore();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const gradeExams = exams.filter(e => e.grade === currentGrade).reverse();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'THUONG_XUYEN': return 'Thường xuyên';
      case 'GIUA_KY': return 'Giữa kỳ';
      case 'CUOI_KY': return 'Cuối kỳ';
      case 'TOT_NGHIEP': return 'Tốt nghiệp';
      default: return 'Khác';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'THUONG_XUYEN': return 'bg-indigo-100 text-indigo-700';
      case 'GIUA_KY': return 'bg-cyan-100 text-cyan-700';
      case 'CUOI_KY': return 'bg-amber-100 text-amber-700';
      case 'TOT_NGHIEP': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleDelete = (id: string) => {
    deleteExam(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#172033]">Kho Đề Thi</h2>
          <p className="text-slate-500 mt-2 text-lg">Quản lý các đề kiểm tra đã tạo cho Khối {currentGrade}.</p>
        </div>
        <button 
          onClick={() => navigate('/create')}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + TẠO ĐỀ MỚI
        </button>
      </div>

      {gradeExams.length === 0 ? (
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Chưa có đề nào được tạo</h3>
          <p className="text-slate-500 mb-6">Bạn chưa tạo đề kiểm tra nào cho Khối {currentGrade}.</p>
          <button 
            onClick={() => navigate('/create')}
            className="px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Tạo đề ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradeExams.map((exam: ExamConfig) => (
            <div key={exam.id} className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getTypeColor(exam.type)}`}>
                  {getTypeLabel(exam.type)}
                </span>
                
                {deleteConfirm === exam.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDelete(exam.id)} className="text-xs font-bold text-red-600 hover:underline">Xóa</button>
                    <span className="text-slate-300">|</span>
                    <button onClick={() => setDeleteConfirm(null)} className="text-xs font-bold text-slate-500 hover:underline">Hủy</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setDeleteConfirm(exam.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2" title={exam.name}>
                {exam.name}
              </h3>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600 font-medium mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock size={16} className="text-slate-400" />
                  {exam.durationMinutes} phút
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText size={16} className="text-slate-400" />
                  {exam.parts.length} Phần
                </span>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/exam-preview/${exam.id}`)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl transition-colors"
                >
                  <ExternalLink size={18} />
                  <span>Xem</span>
                </button>
                <button
                  onClick={() => navigate('/exam')}
                  className="flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold rounded-xl transition-colors"
                >
                  <Play size={18} />
                  <span>Mở thi</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
