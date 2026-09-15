import React, { useState } from 'react';
import { ArrowLeft, BarChart3, RotateCcw } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import * as math from 'mathjs';

export function StatisticsLab({ onBack }: { onBack: () => void }) {
  const [dataInput, setDataInput] = useState('7, 5, 8, 9, 6, 8, 7, 10, 8, 5');
  
  let rawNumbers: number[] = [];
  let sortedNumbers: number[] = [];
  let mean = 0, median = 0, mode: number[] = [], variance = 0, stdDev = 0, range = 0, q1 = 0, q2 = 0, q3 = 0, iqr = 0;
  let chartData: any[] = [];
  let error = '';

  try {
    rawNumbers = dataInput.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
    if (rawNumbers.length > 0) {
      sortedNumbers = [...rawNumbers].sort((a, b) => a - b);
      mean = math.mean(rawNumbers);
      median = math.median(rawNumbers);
      mode = math.mode(rawNumbers);
      variance = math.variance(rawNumbers, 'uncorrected') as number; // population variance
      stdDev = math.std(rawNumbers, 'uncorrected') as number;
      range = sortedNumbers[sortedNumbers.length - 1] - sortedNumbers[0];
      
      const p25 = math.quantileSeq(sortedNumbers, 0.25);
      const p50 = math.quantileSeq(sortedNumbers, 0.5);
      const p75 = math.quantileSeq(sortedNumbers, 0.75);
      q1 = typeof p25 === 'number' ? p25 : p25[0];
      q2 = typeof p50 === 'number' ? p50 : p50[0];
      q3 = typeof p75 === 'number' ? p75 : p75[0];
      iqr = q3 - q1;

      const freqMap = new Map();
      rawNumbers.forEach(n => freqMap.set(n, (freqMap.get(n) || 0) + 1));
      const uniqueKeys = Array.from(freqMap.keys()).sort((a,b) => a-b);
      chartData = uniqueKeys.map(k => ({ name: k.toString(), freq: freqMap.get(k) }));
    }
  } catch (e) {
    error = 'Dữ liệu không hợp lệ';
  }

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-teal-600" />
            Lab Các số đặc trưng thống kê
          </h2>
        </div>
        <button onClick={() => setDataInput('7, 5, 8, 9, 6, 8, 7, 10, 8, 5')} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
        {/* A. THÔNG SỐ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Mẫu số liệu (không ghép nhóm)</h3>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700">Nhập các giá trị (cách nhau bởi dấu phẩy):</label>
            <input 
              type="text" 
              value={dataInput} 
              onChange={e => setDataInput(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-teal-500 text-lg font-mono"
            />
            {error && <span className="text-red-500 text-sm">{error}</span>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
            Ví dụ: 
            <button onClick={() => setDataInput('1, 2, 3, 4, 5, 6, 7, 8, 9, 10')} className="hover:text-teal-600 underline">1,2,3..10</button>
            <button onClick={() => setDataInput('1, 1, 1, 5, 9, 9, 9')} className="hover:text-teal-600 underline">Cực trị</button>
            <button onClick={() => setDataInput('5, 5, 5, 5, 5, 5')} className="hover:text-teal-600 underline">Hằng số</button>
          </div>
        </div>

        {rawNumbers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-bold text-slate-800 mb-6 w-full text-left">B. Biểu đồ Tần số</h3>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="freq" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Tần số" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full mt-6 text-sm text-slate-600">
                <strong>Số liệu đã sắp xếp: </strong> 
                <span className="font-mono bg-slate-100 px-2 py-1 rounded">{sortedNumbers.join(', ')}</span>
                <span className="ml-2 font-bold text-teal-700">(n = {rawNumbers.length})</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">C. Các số đặc trưng</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-2 border-b border-slate-100 pb-1">Đo lường xu hướng trung tâm</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-teal-50 border border-teal-100 rounded-lg">
                        <span className="text-teal-800 font-medium block">Số trung bình (<MathRenderer value="\\bar{x}" className="inline" />)</span>
                        <span className="font-bold text-teal-900 text-xl">{mean.toFixed(2)}</span>
                      </div>
                      <div className="p-3 bg-teal-50 border border-teal-100 rounded-lg">
                        <span className="text-teal-800 font-medium block">Trung vị (<MathRenderer value="M_e" className="inline" />)</span>
                        <span className="font-bold text-teal-900 text-xl">{median}</span>
                      </div>
                      <div className="p-3 bg-teal-50 border border-teal-100 rounded-lg col-span-2">
                        <span className="text-teal-800 font-medium block">Mốt (<MathRenderer value="M_o" className="inline" />)</span>
                        <span className="font-bold text-teal-900 text-xl">{mode.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-2 border-b border-slate-100 pb-1">Đo lường độ phân tán</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                        <span className="text-rose-800 font-medium block">Khoảng biến thiên (<MathRenderer value="R" className="inline" />)</span>
                        <span className="font-bold text-rose-900 text-xl">{range}</span>
                      </div>
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                        <span className="text-rose-800 font-medium block">Khoảng tứ phân vị (<MathRenderer value="\\Delta_Q" className="inline" />)</span>
                        <span className="font-bold text-rose-900 text-xl">{iqr}</span>
                        <div className="text-xs mt-1 text-rose-700">Q1={q1}, Q2={q2}, Q3={q3}</div>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <span className="text-blue-800 font-medium block">Phương sai (<MathRenderer value="s^2" className="inline" />)</span>
                        <span className="font-bold text-blue-900 text-xl">{variance.toFixed(2)}</span>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <span className="text-blue-800 font-medium block">Độ lệch chuẩn (<MathRenderer value="s" className="inline" />)</span>
                        <span className="font-bold text-blue-900 text-xl">{stdDev.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
