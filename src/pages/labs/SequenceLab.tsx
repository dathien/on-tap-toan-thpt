import React, { useState } from 'react';
import { ArrowLeft, AlignEndHorizontal, RotateCcw, Play } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

export function SequenceLab({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'csc'|'csn'>('csc');
  
  // CSC
  const [u1_csc, setU1_csc] = useState(2);
  const [d, setD] = useState(3);
  
  // CSN
  const [u1_csn, setU1_csn] = useState(2);
  const [q, setQ] = useState(2);
  
  const [n, setN] = useState(10); // số hạng cần tính

  const resetData = () => {
    if (mode === 'csc') {
      setU1_csc(2);
      setD(3);
      setN(10);
    } else {
      setU1_csn(2);
      setQ(2);
      setN(10);
    }
  };

  const generateData = () => {
    const data = [];
    if (mode === 'csc') {
      let sum = 0;
      for (let i = 1; i <= n; i++) {
        const val = u1_csc + (i - 1) * d;
        sum += val;
        data.push({ n: i, value: val, sum });
      }
    } else {
      let sum = 0;
      for (let i = 1; i <= n; i++) {
        const val = u1_csn * Math.pow(q, i - 1);
        sum += val;
        // Limit display for massive numbers in CSN
        data.push({ n: i, value: Math.min(val, 1e9), sum: Math.min(sum, 1e9), exactVal: val, exactSum: sum });
      }
    }
    return data;
  };

  const data = generateData();
  const un = data[data.length - 1];

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlignEndHorizontal className="text-amber-600" />
            Lab Dãy số (Cấp số cộng / Cấp số nhân)
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-lg ml-4">
            <button onClick={() => setMode('csc')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${mode === 'csc' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Cấp Số Cộng</button>
            <button onClick={() => setMode('csn')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${mode === 'csn' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Cấp Số Nhân</button>
          </div>
        </div>
        <button onClick={resetData} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
        {/* A. THÔNG SỐ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Tham số cơ sở</h3>
          <div className="flex flex-wrap items-center gap-8">
            {mode === 'csc' ? (
              <>
                <div className="flex flex-col gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg w-full max-w-[200px]">
                  <label className="font-bold text-amber-800">Số hạng đầu <MathRenderer value="u_1" className="inline" /></label>
                  <input type="number" value={u1_csc} onChange={e => setU1_csc(Number(e.target.value) || 0)} className="w-full px-3 py-2 border border-amber-300 rounded outline-none" />
                </div>
                <div className="flex flex-col gap-2 p-4 bg-orange-50 border border-orange-200 rounded-lg w-full max-w-[200px]">
                  <label className="font-bold text-orange-800">Công sai <MathRenderer value="d" className="inline" /></label>
                  <input type="number" value={d} onChange={e => setD(Number(e.target.value) || 0)} className="w-full px-3 py-2 border border-orange-300 rounded outline-none" />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg w-full max-w-[200px]">
                  <label className="font-bold text-amber-800">Số hạng đầu <MathRenderer value="u_1" className="inline" /></label>
                  <input type="number" value={u1_csn} onChange={e => setU1_csn(Number(e.target.value) || 0)} className="w-full px-3 py-2 border border-amber-300 rounded outline-none" />
                </div>
                <div className="flex flex-col gap-2 p-4 bg-red-50 border border-red-200 rounded-lg w-full max-w-[200px]">
                  <label className="font-bold text-red-800">Công bội <MathRenderer value="q" className="inline" /></label>
                  <input type="number" value={q} onChange={e => setQ(Number(e.target.value) || 0)} className="w-full px-3 py-2 border border-red-300 rounded outline-none" />
                </div>
              </>
            )}

            <div className="flex flex-col gap-2 p-4 bg-slate-100 border border-slate-300 rounded-lg w-full max-w-[200px]">
              <label className="font-bold text-slate-700">Số lượng phần tử <MathRenderer value="n" className="inline" /></label>
              <input type="number" min="2" max={mode === 'csn' ? 30 : 100} value={n} onChange={e => setN(Number(e.target.value) || 2)} className="w-full px-3 py-2 border border-slate-300 rounded outline-none" />
            </div>
          </div>
        </div>

        {/* B. KẾT QUẢ & MÔ PHỎNG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-800 mb-6 w-full text-left">B. Biểu đồ tăng trưởng</h3>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="n" tickFormatter={(val) => `u${val}`} />
                  <YAxis />
                  <Tooltip formatter={(value, name, props) => {
                    const exact = mode === 'csc' ? value : props.payload.exactVal;
                    return [exact, "Giá trị"];
                  }} />
                  <Bar dataKey="value" fill={mode === 'csc' ? "#f59e0b" : "#ef4444"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">C. Tính toán (tại <MathRenderer value={`n=${n}`} className="inline" />)</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2">
                  <div className="text-sm text-slate-600 font-bold">CÔNG THỨC SỐ HẠNG TỔNG QUÁT:</div>
                  <div className="text-xl text-slate-800">
                    {mode === 'csc' ? (
                      <MathRenderer value={`u_n = u_1 + (n-1)d`} />
                    ) : (
                      <MathRenderer value={`u_n = u_1 \\cdot q^{n-1}`} />
                    )}
                  </div>
                  <div className="text-emerald-700 font-bold mt-2">
                    <MathRenderer value={`u_{${n}} = ${mode === 'csc' ? un.value : un.exactVal}`} />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2">
                  <div className="text-sm text-slate-600 font-bold">TỔNG N SỐ HẠNG ĐẦU TIÊN:</div>
                  <div className="text-xl text-slate-800">
                    {mode === 'csc' ? (
                      <MathRenderer value={`S_n = \\frac{n(u_1 + u_n)}{2}`} />
                    ) : (
                      <MathRenderer value={`S_n = u_1 \\frac{1 - q^n}{1 - q}`} />
                    )}
                  </div>
                  <div className="text-blue-700 font-bold mt-2">
                    <MathRenderer value={`S_{${n}} = ${mode === 'csc' ? un.sum : un.exactSum}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex-1">
              <h3 className="text-lg font-bold text-amber-800 mb-2">D. Khám phá</h3>
              <ul className="list-disc pl-5 space-y-2 text-amber-700">
                {mode === 'csc' ? (
                  <>
                    <li>Công sai <MathRenderer value="d < 0" className="inline" /> sẽ làm dãy số tăng hay giảm? (Hãy thử nhập d = -2).</li>
                    <li>Sự thay đổi của các cột trên biểu đồ là một đường thẳng (tuyến tính) vì cấp số cộng tăng đều.</li>
                  </>
                ) : (
                  <>
                    <li>Điều gì xảy ra khi công bội <MathRenderer value="q" className="inline" /> là số âm (ví dụ q = -2)? (Dãy số đan dấu).</li>
                    <li>Khi <MathRenderer value="0 < q < 1" className="inline" /> (ví dụ q = 0.5), đồ thị có hình dạng như thế nào so với q &gt; 1?</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
