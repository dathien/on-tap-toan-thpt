import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Zap, BookOpen, Bookmark, GraduationCap } from 'lucide-react';

export function Review() {
  const navigate = useNavigate();
  const currentGrade = useAppStore(state => state.currentGrade);

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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#172033]">Ôn tập Toán {currentGrade}</h2>
        <p className="text-slate-500 mt-2 text-lg">Chọn lộ trình ôn tập để củng cố kiến thức và luyện tập.</p>
      </div>

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
                onClick={() => navigate(`/review-space/${tpl.id}`)}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${tpl.btnColor}`}
              >
                VÀO ÔN TẬP
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
