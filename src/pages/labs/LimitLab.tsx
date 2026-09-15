import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRightToLine, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import * as math from 'mathjs';
import * as d3 from 'd3';

export function LimitLab({ onBack }: { onBack: () => void }) {
  const [func, setFunc] = useState('(x^2 - 1)/(x - 1)');
  const [limitPoint, setLimitPoint] = useState(1);
  const [approach, setApproach] = useState<'both' | 'left' | 'right'>('both');
  
  const [expr, setExpr] = useState('(x^2 - 1)/(x - 1)');
  const [error, setError] = useState('');

  const [scale, setScale] = useState(60); // px per unit
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries.length > 0) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height
        });
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDraw = () => {
    try {
      const compiled = math.compile(func);
      compiled.evaluate({ x: limitPoint + 0.1 });
      setExpr(func);
      setError('');
    } catch (e) {
      setError('Biểu thức không hợp lệ.');
    }
  };

  // Limit approximation
  let L = NaN;
  let valuesLeft: any[] = [];
  let valuesRight: any[] = [];
  try {
    const compiled = math.compile(expr);
    // test limits
    const tL = compiled.evaluate({ x: limitPoint - 0.000001 });
    const tR = compiled.evaluate({ x: limitPoint + 0.000001 });
    L = (tL + tR) / 2;

    [0.1, 0.01, 0.001].forEach(d => {
      valuesLeft.push({ x: limitPoint - d, y: compiled.evaluate({ x: limitPoint - d }) });
      valuesRight.push({ x: limitPoint + d, y: compiled.evaluate({ x: limitPoint + d }) });
    });
  } catch (e) {}

  useEffect(() => {
    if (!svgRef.current) return;
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const cx = width / 2 + offset.x;
    const cy = height / 2 + offset.y;
    const toSvgX = (x: number) => cx + x * scale;
    const toSvgY = (y: number) => cy - y * scale;
    const fromSvgX = (sx: number) => (sx - cx) / scale;

    const g = svg.append("g");

    // Grid
    const startGridX = Math.floor(fromSvgX(0));
    const endGridX = Math.ceil(fromSvgX(width));
    const startGridY = Math.floor((cy - height) / scale);
    const endGridY = Math.ceil(cy / scale);

    for (let x = startGridX; x <= endGridX; x++) {
      g.append("line").attr("x1", toSvgX(x)).attr("y1", 0).attr("x2", toSvgX(x)).attr("y2", height).attr("stroke", "#e2e8f0").attr("stroke-width", 1);
    }
    for (let y = startGridY; y <= endGridY; y++) {
      g.append("line").attr("x1", 0).attr("y1", toSvgY(y)).attr("x2", width).attr("y2", toSvgY(y)).attr("stroke", "#e2e8f0").attr("stroke-width", 1);
    }

    // Axes
    g.append("line").attr("x1", 0).attr("y1", cy).attr("x2", width).attr("y2", cy).attr("stroke", "#64748b").attr("stroke-width", 2);
    g.append("line").attr("x1", cx).attr("y1", 0).attr("x2", cx).attr("y2", height).attr("stroke", "#64748b").attr("stroke-width", 2);

    // Graph
    try {
      const compiled = math.compile(expr);
      let pathD = '';
      let isFirst = true;
      const step = (fromSvgX(width) - fromSvgX(0)) / 200;
      for (let x = fromSvgX(0); x <= fromSvgX(width); x += step) {
        if (Math.abs(x - limitPoint) < 0.05) continue; // skip hole
        const y = compiled.evaluate({ x });
        const sx = toSvgX(x);
        const sy = toSvgY(y);
        
        if (sy > -height && sy < height * 2) {
          if (isFirst) {
            pathD += `M ${sx} ${sy} `;
            isFirst = false;
          } else {
            pathD += `L ${sx} ${sy} `;
          }
        } else {
          isFirst = true;
        }
      }
      if (pathD) {
        g.append("path").attr("d", pathD).attr("fill", "none").attr("stroke", "#0284c7").attr("stroke-width", 3);
      }

      // Hole or point
      const exactY = compiled.evaluate({ x: limitPoint });
      g.append("circle")
        .attr("cx", toSvgX(limitPoint))
        .attr("cy", toSvgY(L))
        .attr("r", 5)
        .attr("fill", isNaN(exactY) ? "white" : "#0284c7")
        .attr("stroke", "#0284c7")
        .attr("stroke-width", 2);
        
      // Limit approach arrows
      if (approach === 'both' || approach === 'left') {
        g.append("line").attr("x1", toSvgX(limitPoint - 1)).attr("y1", toSvgY(compiled.evaluate({ x: limitPoint - 1 }))).attr("x2", toSvgX(limitPoint - 0.2)).attr("y2", toSvgY(compiled.evaluate({ x: limitPoint - 0.2 }))).attr("stroke", "#ef4444").attr("stroke-width", 3).attr("marker-end", "url(#arrow)");
      }
      if (approach === 'both' || approach === 'right') {
        g.append("line").attr("x1", toSvgX(limitPoint + 1)).attr("y1", toSvgY(compiled.evaluate({ x: limitPoint + 1 }))).attr("x2", toSvgX(limitPoint + 0.2)).attr("y2", toSvgY(compiled.evaluate({ x: limitPoint + 0.2 }))).attr("stroke", "#10b981").attr("stroke-width", 3).attr("marker-end", "url(#arrow)");
      }

    } catch (e) {}

    // Defs
    svg.append("defs").append("marker").attr("id", "arrow").attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto-start-reverse").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "#64748b");

  }, [expr, limitPoint, approach, scale, offset, dimensions]);

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ArrowRightToLine className="text-rose-600" />
            Lab Giới hạn hàm số
          </h2>
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
        {/* A. THÔNG SỐ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Tham số giới hạn</h3>
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
              <label className="font-semibold text-slate-700">Hàm số f(x) =</label>
              <input type="text" value={func} onChange={e => setFunc(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500 font-mono" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-700">Tiến tới x₀ =</label>
              <input type="number" step="0.5" value={limitPoint} onChange={e => setLimitPoint(Number(e.target.value) || 0)} className="w-24 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500 font-mono text-center" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-700">Hướng tiến:</label>
              <select value={approach} onChange={e => setApproach(e.target.value as any)} className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500">
                <option value="both">Hai phía (x → x₀)</option>
                <option value="left">Trái (x → x₀⁻)</option>
                <option value="right">Phải (x → x₀⁺)</option>
              </select>
            </div>
            <button onClick={handleDraw} className="px-6 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 h-[42px]">
              Tính Giới Hạn
            </button>
          </div>
          {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2 w-full text-left">B. Đồ thị tiến tới giới hạn</h3>
            <div ref={containerRef} className="w-full h-[350px] border border-slate-200 rounded-lg overflow-hidden bg-slate-50 touch-none">
              <svg ref={svgRef} className="w-full h-full cursor-move"></svg>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">C. Bảng giá trị x tiến tới {limitPoint}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {(approach === 'both' || approach === 'left') && (
                  <div className="border border-red-200 rounded-lg overflow-hidden">
                    <div className="bg-red-50 text-red-800 font-bold p-2 text-center text-sm border-b border-red-200">Bên TRÁI (x → {limitPoint}⁻)</div>
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr><th className="p-2 text-center border-r border-slate-200">x</th><th className="p-2 text-center">f(x)</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {valuesLeft.map((v, i) => (
                          <tr key={i}><td className="p-2 text-center font-mono border-r border-slate-100">{v.x.toFixed(4)}</td><td className="p-2 text-center font-mono">{v.y.toFixed(4)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {(approach === 'both' || approach === 'right') && (
                  <div className="border border-emerald-200 rounded-lg overflow-hidden">
                    <div className="bg-emerald-50 text-emerald-800 font-bold p-2 text-center text-sm border-b border-emerald-200">Bên PHẢI (x → {limitPoint}⁺)</div>
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr><th className="p-2 text-center border-r border-slate-200">x</th><th className="p-2 text-center">f(x)</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {valuesRight.map((v, i) => (
                          <tr key={i}><td className="p-2 text-center font-mono border-r border-slate-100">{v.x.toFixed(4)}</td><td className="p-2 text-center font-mono">{v.y.toFixed(4)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-lg flex justify-center items-center">
                <span className="text-xl text-rose-900 font-bold">
                  {approach === 'both' ? `\\lim_{x \\to ${limitPoint}} f(x)` : approach === 'left' ? `\\lim_{x \\to ${limitPoint}^-} f(x)` : `\\lim_{x \\to ${limitPoint}^+} f(x)`} 
                  {isNaN(L) || !isFinite(L) ? ' = \\infty \\text{ (Không tồn tại)}' : ` \\approx ${L.toFixed(4)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
