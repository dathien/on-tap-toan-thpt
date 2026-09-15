import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import { QuestionContentRenderer } from '../../components/QuestionContentRenderer';

export function VectorLab({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'oxy'|'oxyz'>('oxy');
  const [u, setU] = useState({ x: 1, y: 2, z: 0 });
  const [v, setV] = useState({ x: 3, y: 4, z: 0 });
  const [k, setK] = useState(2);

  const dot = u.x * v.x + u.y * v.y + (mode === 'oxyz' ? u.z * v.z : 0);
  const lenU = Math.sqrt(u.x*u.x + u.y*u.y + (mode === 'oxyz' ? u.z*u.z : 0));
  const lenV = Math.sqrt(v.x*v.x + v.y*v.y + (mode === 'oxyz' ? v.z*v.z : 0));
  const cosAngle = (lenU * lenV === 0) ? 0 : dot / (lenU * lenV);
  const angleDeg = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180 / Math.PI;

  const renderVec = (vec: any, name: string) => {
    if (mode === 'oxy') return `\\vec{${name}} = (${vec.x}; ${vec.y})`;
    return `\\vec{${name}} = (${vec.x}; ${vec.y}; ${vec.z})`;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center gap-4 flex-wrap">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shrink-0">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 shrink-0">Vector Lab</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setMode('oxy')} className={`px-4 py-1 rounded-md text-sm font-semibold ${mode === 'oxy' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Oxy</button>
          <button onClick={() => setMode('oxyz')} className={`px-4 py-1 rounded-md text-sm font-semibold ${mode === 'oxyz' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Oxyz</button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Tọa độ Vector</h3>
            
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Vector u:</label>
              <div className="flex gap-2">
                <input type="number" className="w-16 px-2 py-1 border rounded" value={u.x} onChange={e => setU({...u, x: +e.target.value})} placeholder="x" />
                <input type="number" className="w-16 px-2 py-1 border rounded" value={u.y} onChange={e => setU({...u, y: +e.target.value})} placeholder="y" />
                {mode === 'oxyz' && <input type="number" className="w-16 px-2 py-1 border rounded" value={u.z} onChange={e => setU({...u, z: +e.target.value})} placeholder="z" />}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Vector v:</label>
              <div className="flex gap-2">
                <input type="number" className="w-16 px-2 py-1 border rounded" value={v.x} onChange={e => setV({...v, x: +e.target.value})} placeholder="x" />
                <input type="number" className="w-16 px-2 py-1 border rounded" value={v.y} onChange={e => setV({...v, y: +e.target.value})} placeholder="y" />
                {mode === 'oxyz' && <input type="number" className="w-16 px-2 py-1 border rounded" value={v.z} onChange={e => setV({...v, z: +e.target.value})} placeholder="z" />}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Hệ số k:</label>
              <input type="number" className="w-16 px-2 py-1 border rounded block" value={k} onChange={e => setK(+e.target.value)} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Kết quả Tính toán</h3>
            <div className="space-y-3 text-lg">
              <MathRenderer value={`\\vec{u} + \\vec{v} = (${u.x + v.x}; ${u.y + v.y}${mode === 'oxyz' ? `; ${u.z + v.z}` : ''})`} />
              <MathRenderer value={`\\vec{u} - \\vec{v} = (${u.x - v.x}; ${u.y - v.y}${mode === 'oxyz' ? `; ${u.z - v.z}` : ''})`} />
              <MathRenderer value={`${k}\\vec{u} = (${k * u.x}; ${k * u.y}${mode === 'oxyz' ? `; ${k * u.z}` : ''})`} />
              <MathRenderer value={`|\\vec{u}| = ${lenU.toFixed(2)}`} />
              <MathRenderer value={`\\vec{u} \\cdot \\vec{v} = ${dot}`} />
              <MathRenderer value={`(\\vec{u}, \\vec{v}) \\approx ${angleDeg.toFixed(1)}^\\circ`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
