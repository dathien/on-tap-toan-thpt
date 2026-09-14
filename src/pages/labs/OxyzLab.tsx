import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function OxyzLab({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center gap-4 flex-wrap">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shrink-0">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 shrink-0">Hình học Không gian Oxyz</h2>
      </div>

      <div className="flex-1 relative bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-2xl text-center space-y-8">
          <h3 className="text-xl font-bold text-slate-800">Mô phỏng không gian Oxyz</h3>
          <p className="text-slate-600">Trực quan hóa khối chóp S.ABCD trong không gian 3 chiều</p>
          
          <div className="bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-8 border border-slate-200 mx-auto max-w-sm">
             <svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-md">
               <polygon points="100,20 40,150 160,150" fill="rgba(79, 70, 229, 0.1)" stroke="#4F46E5" strokeWidth="2" strokeLinejoin="round" />
               <polygon points="100,20 160,150 130,120" fill="rgba(6, 182, 212, 0.1)" stroke="#06B6D4" strokeWidth="2" strokeLinejoin="round" />
               <line x1="100" y1="20" x2="80" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
               <line x1="40" y1="150" x2="80" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
               <line x1="160" y1="150" x2="80" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
               <line x1="130" y1="120" x2="80" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
               <circle cx="100" cy="20" r="3" fill="#172033" />
               <circle cx="40" cy="150" r="3" fill="#172033" />
               <circle cx="160" cy="150" r="3" fill="#172033" />
               <circle cx="130" cy="120" r="3" fill="#172033" />
               <circle cx="80" cy="120" r="3" fill="#94a3b8" />
               <text x="95" y="15" fill="#172033" fontSize="12" fontWeight="bold">S</text>
               <text x="25" y="160" fill="#172033" fontSize="12" fontWeight="bold">A</text>
               <text x="165" y="160" fill="#172033" fontSize="12" fontWeight="bold">B</text>
               <text x="135" y="115" fill="#172033" fontSize="12" fontWeight="bold">C</text>
               <text x="65" y="115" fill="#94a3b8" fontSize="12" fontWeight="bold">D</text>
             </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
