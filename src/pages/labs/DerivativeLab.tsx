import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import * as math from 'mathjs';
import { MathText } from '../../components/MathText';

export function DerivativeLab({ onBack }: { onBack: () => void }) {
  const [funcStr, setFuncStr] = useState('x^2');
  const [x0, setX0] = useState('1');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    try {
      const expr = math.parse(funcStr);
      const deriv = math.derivative(expr, 'x');
      const derivStr = deriv.toString();
      
      const val = deriv.evaluate({ x: parseFloat(x0) });
      const fVal = expr.evaluate({ x: parseFloat(x0) });
      
      setResult({
        deriv: derivStr,
        fVal: fVal,
        val: val
      });
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
        <h2 className="text-xl font-bold text-slate-800 shrink-0">Đạo hàm & Tiếp tuyến</h2>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <label className="font-semibold text-slate-700 w-16">f(x) =</label>
              <input type="text" className="flex-1 px-3 py-2 border rounded-lg" value={funcStr} onChange={e => setFuncStr(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <label className="font-semibold text-slate-700 w-16">x₀ =</label>
              <input type="number" className="flex-1 px-3 py-2 border rounded-lg" value={x0} onChange={e => setX0(e.target.value)} />
            </div>
            <button onClick={handleCalculate} className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold">
              TÍNH ĐẠO HÀM
            </button>
          </div>

          {result && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 text-lg">
              <p><MathText text={`f'(x) = ${result.deriv}`} /></p>
              <p><MathText text={`f'(${x0}) = ${result.val}`} /></p>
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="font-semibold mb-2">Phương trình tiếp tuyến tại $x_0 = {x0}$:</p>
                <MathText text={`y = ${result.val}(x - ${x0}) + ${result.fVal}`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
