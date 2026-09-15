import React, { useState, useMemo } from 'react';
import { ArrowLeft, PieChart, RotateCcw } from 'lucide-react';
import { BlockMath } from 'react-katex';

export function SetLab({ onBack, mode }: { onBack: () => void, mode: 'SET' | 'OPERATIONS' }) {
  const [uStr, setUStr] = useState('1, 2, 3, 4, 5, 6, 7, 8');
  const [aStr, setAStr] = useState('1, 2, 3, 4');
  const [bStr, setBStr] = useState('3, 4, 5, 6');
  
  const [operation, setOperation] = useState<'A' | 'B' | 'A_UNION_B' | 'A_INTERSECT_B' | 'A_MINUS_B' | 'B_MINUS_A' | 'COMP_A'>('A_UNION_B');

  const parseSet = (str: string) => {
    return Array.from(new Set(str.split(',').map(s => s.trim()).filter(s => s !== '')));
  };

  const U = parseSet(uStr);
  let A = parseSet(aStr).filter(x => U.includes(x));
  let B = parseSet(bStr).filter(x => U.includes(x));

  const A_only = A.filter(x => !B.includes(x));
  const B_only = B.filter(x => !A.includes(x));
  const intersection = A.filter(x => B.includes(x));
  const none = U.filter(x => !A.includes(x) && !B.includes(x));

  const resetData = () => {
    setUStr('1, 2, 3, 4, 5, 6, 7, 8');
    setAStr('1, 2, 3, 4');
    setBStr('3, 4, 5, 6');
    setOperation('A_UNION_B');
  };

  const getResult = () => {
    switch (operation) {
      case 'A': return A;
      case 'B': return B;
      case 'A_UNION_B': return Array.from(new Set([...A, ...B]));
      case 'A_INTERSECT_B': return intersection;
      case 'A_MINUS_B': return A_only;
      case 'B_MINUS_A': return B_only;
      case 'COMP_A': return U.filter(x => !A.includes(x));
      default: return [];
    }
  };

  const result = getResult();

  const isHighlighted = (element: string, region: 'A_ONLY' | 'B_ONLY' | 'INTERSECT' | 'NONE') => {
    if (operation === 'A') return region === 'A_ONLY' || region === 'INTERSECT';
    if (operation === 'B') return region === 'B_ONLY' || region === 'INTERSECT';
    if (operation === 'A_UNION_B') return region !== 'NONE';
    if (operation === 'A_INTERSECT_B') return region === 'INTERSECT';
    if (operation === 'A_MINUS_B') return region === 'A_ONLY';
    if (operation === 'B_MINUS_A') return region === 'B_ONLY';
    if (operation === 'COMP_A') return region === 'B_ONLY' || region === 'NONE';
    return false;
  };

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PieChart className="text-orange-600" />
            {mode === 'SET' ? 'Lab Tập Hợp' : 'Lab Phép Toán Tập Hợp'}
          </h2>
        </div>
        <button onClick={resetData} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">
        {/* A. THÔNG SỐ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Thông số tập hợp</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold text-slate-700 w-24">Tập Vũ Trụ U:</label>
              <input 
                type="text" 
                value={uStr} 
                onChange={(e) => setUStr(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="Ví dụ: 1, 2, 3, a, b"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold text-slate-700 w-24">Tập A:</label>
              <input 
                type="text" 
                value={aStr} 
                onChange={(e) => setAStr(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold text-slate-700 w-24">Tập B:</label>
              <input 
                type="text" 
                value={bStr} 
                onChange={(e) => setBStr(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <p className="text-sm text-slate-500 italic">* Các phần tử cách nhau bởi dấu phẩy. Các phần tử của A, B không thuộc U sẽ bị bỏ qua.</p>
          </div>
        </div>

        {/* B. KẾT QUẢ & MÔ PHỎNG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6">B. Biểu đồ Venn</h3>
            <div className="flex-1 relative min-h-[300px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-4">
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
                {/* U Background */}
                <rect x="10" y="10" width="380" height="280" rx="10" fill={isHighlighted('any', 'NONE') ? 'rgba(245, 158, 11, 0.2)' : 'white'} stroke="#cbd5e1" strokeWidth="2" />
                <text x="25" y="35" className="font-bold text-lg fill-slate-500">U</text>
                
                {/* Sets */}
                <g>
                  {/* A_ONLY */}
                  <path d="M 160 150 m -100 0 a 100 100 0 1 1 200 0 a 100 100 0 0 1 -200 0 z" fill={isHighlighted('any', 'A_ONLY') ? 'rgba(59, 130, 246, 0.3)' : 'transparent'} />
                  {/* B_ONLY */}
                  <path d="M 240 150 m -100 0 a 100 100 0 1 1 200 0 a 100 100 0 0 1 -200 0 z" fill={isHighlighted('any', 'B_ONLY') ? 'rgba(99, 102, 241, 0.3)' : 'transparent'} />
                  
                  {/* Intersection */}
                  <clipPath id="clipA"><circle cx="160" cy="150" r="100" /></clipPath>
                  <circle cx="240" cy="150" r="100" fill={isHighlighted('any', 'INTERSECT') ? 'rgba(139, 92, 246, 0.5)' : 'transparent'} clipPath="url(#clipA)" />
                  
                  <circle cx="160" cy="150" r="100" fill="none" stroke="#3b82f6" strokeWidth="3" />
                  <circle cx="240" cy="150" r="100" fill="none" stroke="#6366f1" strokeWidth="3" />
                </g>

                {/* Labels */}
                <text x="70" y="70" className="font-bold text-xl fill-blue-700">A</text>
                <text x="310" y="70" className="font-bold text-xl fill-indigo-700">B</text>

                {/* Elements */}
                <text x="110" y="160" className="font-medium text-sm fill-blue-900 text-center" textAnchor="middle">{A_only.slice(0,4).join(', ') + (A_only.length>4?'...':'')}</text>
                <text x="200" y="160" className="font-bold text-sm fill-purple-900 text-center" textAnchor="middle">{intersection.slice(0,3).join(', ') + (intersection.length>3?'...':'')}</text>
                <text x="290" y="160" className="font-medium text-sm fill-indigo-900 text-center" textAnchor="middle">{B_only.slice(0,4).join(', ') + (B_only.length>4?'...':'')}</text>
                <text x="200" y="270" className="font-medium text-sm fill-slate-700 text-center" textAnchor="middle">{none.slice(0,5).join(', ') + (none.length>5?'...':'')}</text>
              </svg>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6">C. Các phép toán</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => setOperation('A_UNION_B')} className={`p-3 rounded-lg border font-medium text-center ${operation === 'A_UNION_B' ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>A ∪ B</button>
              <button onClick={() => setOperation('A_INTERSECT_B')} className={`p-3 rounded-lg border font-medium text-center ${operation === 'A_INTERSECT_B' ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>A ∩ B</button>
              <button onClick={() => setOperation('A_MINUS_B')} className={`p-3 rounded-lg border font-medium text-center ${operation === 'A_MINUS_B' ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>A \ B</button>
              <button onClick={() => setOperation('B_MINUS_A')} className={`p-3 rounded-lg border font-medium text-center ${operation === 'B_MINUS_A' ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>B \ A</button>
              <button onClick={() => setOperation('COMP_A')} className={`p-3 rounded-lg border font-medium text-center ${operation === 'COMP_A' ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>C<sub>U</sub>A</button>
            </div>

            <div className="flex-1 bg-slate-800 text-white p-6 rounded-xl font-mono flex flex-col justify-center">
              <div className="text-slate-400 mb-2">Kết quả:</div>
              <div className="text-2xl leading-relaxed break-words">
                {operation === 'A_UNION_B' && <BlockMath math="A \cup B = \{..." />}
                {operation === 'A_INTERSECT_B' && <BlockMath math="A \cap B = \{..." />}
                {operation === 'A_MINUS_B' && <BlockMath math="A \setminus B = \{..." />}
                {operation === 'B_MINUS_A' && <BlockMath math="B \setminus A = \{..." />}
                {operation === 'COMP_A' && <BlockMath math="C_U A = \{..." />}
                <div className="mt-2 text-green-400">
                  {`{ ${result.join(', ')} }`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* D. KHÁM PHÁ */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-orange-800 mb-2">D. Khám phá</h3>
          <ul className="list-disc pl-5 space-y-2 text-orange-700">
            <li>Khi A ⊂ B (A là tập con của B), hãy thử nhập A = {`{1, 2}`} và B = {`{1, 2, 3}`}. Quan sát kết quả của A ∩ B và A ∪ B.</li>
            <li>Phần bù của A (C<sub>U</sub>A) chứa những phần tử nào? Nó có liên quan gì đến tập vũ trụ U?</li>
            <li>A \ B có giống B \ A không?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
