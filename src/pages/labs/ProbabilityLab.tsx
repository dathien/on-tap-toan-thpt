import React, { useState } from 'react';
import { ArrowLeft, Dices, RotateCcw, Play } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function ProbabilityLab({ onBack }: { onBack: () => void }) {
  const [numTrials, setNumTrials] = useState<number>(100);
  const [probSuccess, setProbSuccess] = useState<number>(0.5); // Ví dụ: Tung đồng xu
  
  const [results, setResults] = useState<{success: number, fail: number, history: any[]}>({ success: 0, fail: 0, history: [] });

  const runSimulation = () => {
    let success = 0;
    let fail = 0;
    for (let i = 0; i < numTrials; i++) {
      if (Math.random() < probSuccess) {
        success++;
      } else {
        fail++;
      }
    }
    
    setResults({
      success,
      fail,
      history: [
        { name: 'Thành công (Biến cố A)', value: success, fill: '#10b981' },
        { name: 'Thất bại (Biến cố $\\overline{A}$)', value: fail, fill: '#ef4444' }
      ]
    });
  };

  const resetData = () => {
    setNumTrials(100);
    setProbSuccess(0.5);
    setResults({ success: 0, fail: 0, history: [] });
  };

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Dices className="text-violet-600" />
            Lab Xác Suất Thực Nghiệm
          </h2>
        </div>
        <button onClick={resetData} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
        {/* A. THÔNG SỐ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Thiết lập thực nghiệm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 mb-2 block">Xác suất lý thuyết của biến cố A: <MathRenderer value={`P(A) = ${probSuccess}`} className="inline" /></label>
                <input 
                  type="range" 
                  min="0" max="1" step="0.05"
                  value={probSuccess} 
                  onChange={e => setProbSuccess(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-sm text-slate-500 mt-1">
                  <span>0 (Không thể)</span>
                  <span>0.5 (Đồng xu)</span>
                  <span>1 (Chắc chắn)</span>
                </div>
              </div>
              
              <div>
                <label className="font-semibold text-slate-700 mb-2 block">Số lần thử nghiệm (N):</label>
                <input 
                  type="number" 
                  min="1" max="100000"
                  value={numTrials} 
                  onChange={e => setNumTrials(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button 
                onClick={runSimulation}
                className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-bold text-lg hover:bg-violet-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Play size={24} /> BẮT ĐẦU THỰC NGHIỆM
              </button>
            </div>
          </div>
        </div>

        {/* B. KẾT QUẢ & MÔ PHỎNG */}
        {results.history.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-bold text-slate-800 mb-6 w-full text-left">B. Biểu đồ Tần số</h3>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.history} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" tickFormatter={(val) => val.includes('Thành công') ? 'Thành công (A)' : 'Thất bại'} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">C. Kết quả tính toán</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600 font-medium">Tổng số lần thử (N)</span>
                    <span className="font-bold text-slate-800 text-xl">{numTrials}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-700 font-medium">Số lần A xảy ra (k)</span>
                    <span className="font-bold text-emerald-800 text-xl">{results.success}</span>
                  </div>

                  <div className="p-4 bg-violet-50 border border-violet-100 rounded-lg mt-4">
                    <div className="text-sm text-violet-600 font-bold mb-2">XÁC SUẤT THỰC NGHIỆM</div>
                    <div className="text-2xl text-violet-800 flex items-center justify-center py-2">
                      <MathRenderer value={`P_{tn}(A) = \\frac{${results.success}}{${numTrials}} \\approx ${(results.success / numTrials).toFixed(4)}`} />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-sm text-slate-600 font-bold mb-2">SO SÁNH LÝ THUYẾT</div>
                    <div className="text-lg text-slate-800 flex items-center justify-center py-2">
                      <MathRenderer value={`| P_{tn}(A) - P(A) | = | ${(results.success / numTrials).toFixed(4)} - ${probSuccess} | = ${Math.abs(results.success / numTrials - probSuccess).toFixed(4)}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* D. KHÁM PHÁ */}
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-violet-800 mb-2">D. Khám phá Định luật số lớn</h3>
          <ul className="list-disc pl-5 space-y-2 text-violet-700">
            <li>Hãy thử chạy với N = 10 lần. Sai số giữa xác suất thực nghiệm và lý thuyết là bao nhiêu?</li>
            <li>Sau đó, tăng N lên 1,000 rồi 10,000 lần. Bạn thấy sai số thay đổi thế nào?</li>
            <li>Khi số lần thử nghiệm N càng lớn, xác suất thực nghiệm sẽ tiến càng gần đến xác suất lý thuyết. Đây là cốt lõi của xác suất thống kê!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
