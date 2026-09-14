import React, { useState } from 'react';
import { LineChart, Axis3D, Shapes, Target, Triangle, Maximize } from 'lucide-react';
import { FunctionGraphLab } from './labs/FunctionGraphLab';
import { FunctionAnalysisLab } from './labs/FunctionAnalysisLab';
import { DerivativeLab } from './labs/DerivativeLab';
import { IntegralLab } from './labs/IntegralLab';
import { VectorLab } from './labs/VectorLab';
import { OxyzLab } from './labs/OxyzLab';

export function MathLab() {
  const [activeLab, setActiveLab] = useState<string | null>(null);

  const tools = [
    { id: 'function-graph', name: 'Đồ thị hàm số', icon: LineChart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'function-analysis', name: 'Khảo sát hàm số', icon: Target, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'derivative', name: 'Đạo hàm', icon: Maximize, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'integral', name: 'Tích phân', icon: Shapes, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'vector', name: 'Vector', icon: Triangle, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'oxyz', name: 'Oxyz', icon: Axis3D, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  const renderActiveLab = () => {
    switch (activeLab) {
      case 'function-graph': return <FunctionGraphLab onBack={() => setActiveLab(null)} />;
      case 'function-analysis': return <FunctionAnalysisLab onBack={() => setActiveLab(null)} />;
      case 'derivative': return <DerivativeLab onBack={() => setActiveLab(null)} />;
      case 'integral': return <IntegralLab onBack={() => setActiveLab(null)} />;
      case 'vector': return <VectorLab onBack={() => setActiveLab(null)} />;
      case 'oxyz': return <OxyzLab onBack={() => setActiveLab(null)} />;
      default: return null;
    }
  };

  if (activeLab) {
    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
        {renderActiveLab()}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#172033]">Phòng Lab Toán học</h2>
        <p className="text-slate-500 mt-2 text-lg">Khám phá và trực quan hóa các mô hình toán học.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {tools.map(tool => (
          <button 
            key={tool.id} 
            onClick={() => setActiveLab(tool.id)}
            className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.bg} ${tool.color}`}>
              <tool.icon size={24} />
            </div>
            <span className="font-semibold text-slate-700 text-sm text-center">{tool.name}</span>
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Đồ thị hàm số: y = x³ - 3x</h3>
          <div className="bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-200">
            <svg viewBox="-5 -5 10 10" className="w-full max-w-sm h-auto drop-shadow-md">
              <g stroke="#e2e8f0" strokeWidth="0.1">
                {[-4, -3, -2, -1, 1, 2, 3, 4].map(i => (
                  <React.Fragment key={i}>
                    <line x1={i} y1="-5" x2={i} y2="5" />
                    <line x1="-5" y1={i} x2="5" y2={i} />
                  </React.Fragment>
                ))}
              </g>
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#94a3b8" strokeWidth="0.15" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#94a3b8" strokeWidth="0.15" />
              <path 
                d="M -3 18 L -2.5 8.125 L -2 2 L -1.5 -1.125 L -1 -2 L -0.5 -1.375 L 0 0 L 0.5 1.375 L 1 2 L 1.5 1.125 L 2 -2 L 2.5 -8.125 L 3 -18" 
                fill="none" 
                stroke="#4F46E5" 
                strokeWidth="0.15" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Hình học không gian: Hình chóp S.ABCD</h3>
          <div className="bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-200">
             <svg viewBox="0 0 200 200" className="w-full max-w-sm h-auto">
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
