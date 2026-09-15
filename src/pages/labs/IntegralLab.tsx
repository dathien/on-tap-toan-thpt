import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import { QuestionContentRenderer } from '../../components/QuestionContentRenderer';
import * as math from 'mathjs';

export function IntegralLab({ onBack }: { onBack: () => void }) {
  const [funcStr, setFuncStr] = useState('x^2');
  const [a, setA] = useState('0');
  const [b, setB] = useState('2');
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    try {
      const expr = math.compile(funcStr);
      let sum = 0;
      const start = parseFloat(a);
      const end = parseFloat(b);
      const n = 1000;
      const dx = (end - start) / n;
      for (let i = 0; i < n; i++) {
        const x = start + i * dx + dx / 2;
        sum += expr.evaluate({ x }) * dx;
      }
      setResult(Math.round(sum * 10000) / 10000);
    } catch(e) {
      setResult(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center gap-4 flex-wrap">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shrink-0">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 shrink-0">Tích phân & Diện tích</h2>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <label className="font-semibold text-slate-700 w-16">f(x) =</label>
              <input type="text" className="flex-1 px-3 py-2 border rounded-lg" value={funcStr} onChange={e => setFuncStr(e.target.value)} />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-3 flex-1">
                <label className="font-semibold text-slate-700 w-16">Cận a =</label>
                <input type="number" className="flex-1 px-3 py-2 border rounded-lg" value={a} onChange={e => setA(e.target.value)} />
              </div>
              <div className="flex items-center gap-3 flex-1">
                <label className="font-semibold text-slate-700 w-16">Cận b =</label>
                <input type="number" className="flex-1 px-3 py-2 border rounded-lg" value={b} onChange={e => setB(e.target.value)} />
              </div>
            </div>
            <button onClick={handleCalculate} className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold">
              TÍNH TÍCH PHÂN
            </button>
          </div>

          {result !== null && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center space-y-4 text-2xl">
              <MathRenderer value={`\\int_{${a}}^{${b}} (${funcStr}) dx \\approx ${result}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
