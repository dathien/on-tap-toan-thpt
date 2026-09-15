import React, { useState } from 'react';
import { ArrowLeft, Brain, RotateCcw } from 'lucide-react';
import { BlockMath } from 'react-katex';

export function LogicLab({ onBack }: { onBack: () => void }) {
  const [pText, setPText] = useState('2 là số chẵn');
  const [qText, setQText] = useState('3 là số nguyên tố');
  
  const [pVal, setPVal] = useState<boolean>(true);
  const [qVal, setQVal] = useState<boolean>(true);

  const resetData = () => {
    setPText('2 là số chẵn');
    setQText('3 là số nguyên tố');
    setPVal(true);
    setQVal(true);
  };

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Brain className="text-rose-600" />
            Lab Mệnh đề
          </h2>
        </div>
        <button onClick={resetData} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">
        {/* A. THÔNG SỐ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Mệnh đề đầu vào</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm">P</span>
                Mệnh đề P
              </label>
              <input 
                type="text" 
                value={pText} 
                onChange={(e) => setPText(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-slate-600">Giá trị chân lý:</span>
                <button onClick={() => setPVal(true)} className={`px-3 py-1 rounded-md text-sm font-medium ${pVal ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>Đúng</button>
                <button onClick={() => setPVal(false)} className={`px-3 py-1 rounded-md text-sm font-medium ${!pVal ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>Sai</button>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm">Q</span>
                Mệnh đề Q
              </label>
              <input 
                type="text" 
                value={qText} 
                onChange={(e) => setQText(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-slate-600">Giá trị chân lý:</span>
                <button onClick={() => setQVal(true)} className={`px-3 py-1 rounded-md text-sm font-medium ${qVal ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>Đúng</button>
                <button onClick={() => setQVal(false)} className={`px-3 py-1 rounded-md text-sm font-medium ${!qVal ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>Sai</button>
              </div>
            </div>
          </div>
        </div>

        {/* B. KẾT QUẢ & MÔ PHỎNG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">B. Bảng Giá Trị Chân Lý</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 border border-slate-200"><BlockMath math="P" /></th>
                    <th className="p-3 border border-slate-200"><BlockMath math="Q" /></th>
                    <th className="p-3 border border-slate-200"><BlockMath math="\neg P" /></th>
                    <th className="p-3 border border-slate-200"><BlockMath math="P \land Q" /></th>
                    <th className="p-3 border border-slate-200"><BlockMath math="P \lor Q" /></th>
                    <th className="p-3 border border-slate-200"><BlockMath math="P \Rightarrow Q" /></th>
                    <th className="p-3 border border-slate-200"><BlockMath math="P \Leftrightarrow Q" /></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [true, true], [true, false], [false, true], [false, false]
                  ].map(([rP, rQ], i) => {
                    const isCurrent = rP === pVal && rQ === qVal;
                    return (
                      <tr key={i} className={isCurrent ? 'bg-blue-50 font-bold' : ''}>
                        <td className="p-3 border border-slate-200 text-blue-700">{rP ? 'Đ' : 'S'}</td>
                        <td className="p-3 border border-slate-200 text-indigo-700">{rQ ? 'Đ' : 'S'}</td>
                        <td className="p-3 border border-slate-200">{!rP ? 'Đ' : 'S'}</td>
                        <td className="p-3 border border-slate-200">{rP && rQ ? 'Đ' : 'S'}</td>
                        <td className="p-3 border border-slate-200">{rP || rQ ? 'Đ' : 'S'}</td>
                        <td className="p-3 border border-slate-200">{(!rP || rQ) ? 'Đ' : 'S'}</td>
                        <td className="p-3 border border-slate-200">{rP === rQ ? 'Đ' : 'S'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-500 mt-4 italic">* Dòng được tô màu là giá trị tương ứng với P, Q hiện tại của bạn.</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6">C. Ý nghĩa các phép toán</h3>
            <div className="space-y-4 flex-1">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-4">
                <div className="w-16 shrink-0 text-center font-bold text-slate-700 border-r border-slate-200 pr-4"><BlockMath math="\neg P" /></div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">Mệnh đề phủ định</div>
                  <div className="text-slate-800">Không phải "{pText}"</div>
                  <div className={`mt-1 text-sm font-semibold ${!pVal ? 'text-green-600' : 'text-red-600'}`}>{!pVal ? '✓ ĐÚNG' : '✗ SAI'}</div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-4">
                <div className="w-16 shrink-0 text-center font-bold text-slate-700 border-r border-slate-200 pr-4"><BlockMath math="P \land Q" /></div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">Phép Hội (VÀ)</div>
                  <div className="text-slate-800">"{pText}" VÀ "{qText}"</div>
                  <div className={`mt-1 text-sm font-semibold ${pVal && qVal ? 'text-green-600' : 'text-red-600'}`}>{pVal && qVal ? '✓ ĐÚNG' : '✗ SAI'}</div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-4">
                <div className="w-16 shrink-0 text-center font-bold text-slate-700 border-r border-slate-200 pr-4"><BlockMath math="P \lor Q" /></div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">Phép Tuyển (HOẶC)</div>
                  <div className="text-slate-800">"{pText}" HOẶC "{qText}"</div>
                  <div className={`mt-1 text-sm font-semibold ${pVal || qVal ? 'text-green-600' : 'text-red-600'}`}>{pVal || qVal ? '✓ ĐÚNG' : '✗ SAI'}</div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-4">
                <div className="w-16 shrink-0 text-center font-bold text-slate-700 border-r border-slate-200 pr-4"><BlockMath math="P \Rightarrow Q" /></div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">Mệnh đề kéo theo (NẾU... THÌ)</div>
                  <div className="text-slate-800">Nếu "{pText}" thì "{qText}"</div>
                  <div className={`mt-1 text-sm font-semibold ${(!pVal || qVal) ? 'text-green-600' : 'text-red-600'}`}>{(!pVal || qVal) ? '✓ ĐÚNG' : '✗ SAI'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* D. KHÁM PHÁ */}
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-rose-800 mb-2">D. Khám phá</h3>
          <ul className="list-disc pl-5 space-y-2 text-rose-700">
            <li>Điều gì xảy ra với <strong className="font-mono">P ⇒ Q</strong> khi P là sai? Nó luôn ĐÚNG bất chấp Q. Hãy thử đổi P thành "Sai" và quan sát bảng!</li>
            <li>Phép Hội (<strong className="font-mono">∧</strong>) chỉ ĐÚNG khi nào?</li>
            <li>So sánh cột <strong className="font-mono">P ⇔ Q</strong> với cột "P và Q có cùng giá trị chân lý".</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
