import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Plus, Play, Zap, BookOpen, Bookmark, GraduationCap } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { currentGrade, exams, attempts } = useAppStore();

  const totalExams = exams.filter(e => e.grade === currentGrade).length;
  const totalAttempts = attempts.filter(a => exams.find(e => e.id === a.examVersionId)?.grade === currentGrade).length;
  const completedAttempts = attempts.filter(a => a.score !== null);
  const avgScore = completedAttempts.length > 0 
    ? (completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length).toFixed(1) 
    : '—';

  const quickTemplates = [
    {
      id: 'thuong-xuyen',
      icon: Zap,
      title: 'THƯỜNG XUYÊN',
      time: '15 phút',
      desc: '10 câu ABCD',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      btnColor: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
    },
    {
      id: 'giua-ky',
      icon: BookOpen,
      title: 'GIỮA KỲ',
      time: '90 phút',
      desc: '3 phần',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-100',
      btnColor: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
    },
    {
      id: 'cuoi-ky',
      icon: Bookmark,
      title: 'CUỐI KỲ',
      time: '90 phút',
      desc: '3 phần',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      btnColor: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
    },
    {
      id: 'tot-nghiep',
      icon: GraduationCap,
      title: 'TỐT NGHIỆP',
      time: '90 phút',
      desc: '12 + 4×4 + 6',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      btnColor: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[20px] shadow-sm border border-slate-200">
        <div>
          <h2 className="text-3xl font-bold text-[#172033] mb-2">Xin chào Giáo viên</h2>
          <p className="text-slate-500 text-lg">Quản lý ôn tập, kiểm tra và theo dõi kết quả học sinh.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => navigate('/create')}
            className="px-6 py-3 bg-[#4F46E5] text-white font-bold rounded-xl hover:bg-[#4338CA] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus size={20} />
            TẠO ĐỀ MỚI
          </button>
          <button 
            onClick={() => navigate('/review')}
            className="px-6 py-3 bg-white text-[#4F46E5] border-2 border-[#4F46E5] font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            <Play size={20} />
            BẮT ĐẦU ÔN TẬP
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-200 flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">KHỐI ĐANG LÀM VIỆC</h3>
          <p className="text-4xl font-bold text-[#172033]">{currentGrade}</p>
        </div>
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-200 flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">ĐỀ ĐÃ TẠO</h3>
          <p className="text-4xl font-bold text-[#172033]">{totalExams}</p>
        </div>
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-200 flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">LƯỢT LÀM</h3>
          <p className="text-4xl font-bold text-[#172033]">{totalAttempts}</p>
        </div>
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-200 flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">ĐIỂM TRUNG BÌNH</h3>
          <p className="text-4xl font-bold text-[#172033]">{avgScore}</p>
        </div>
      </div>

      {/* Quick Review */}
      <div>
        <h3 className="text-xl font-bold text-[#172033] mb-6 flex items-center gap-2">
          MẪU ÔN TẬP NHANH
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickTemplates.map(tpl => (
            <div key={tpl.id} className={`bg-white rounded-[20px] shadow-sm border-2 ${tpl.borderColor} p-6 flex flex-col transition-transform hover:-translate-y-1 duration-200`}>
              <div className={`w-14 h-14 rounded-2xl ${tpl.bgColor} ${tpl.color} flex items-center justify-center mb-6`}>
                <tpl.icon size={28} />
              </div>
              <h4 className="text-lg font-bold text-[#172033] mb-2">{tpl.title}</h4>
              <p className="text-slate-600 font-medium mb-1">{tpl.time}</p>
              <p className="text-slate-500 mb-8">{tpl.desc}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <button 
                  onClick={() => navigate(`/builder/${tpl.id}`)}
                  className={`w-full py-3 rounded-xl font-bold transition-colors ${tpl.btnColor}`}
                >
                  TẠO BÀI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
