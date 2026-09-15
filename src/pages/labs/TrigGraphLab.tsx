import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, RefreshCw, Activity } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import * as math from 'mathjs';
import * as d3 from 'd3';

export function TrigGraphLab({ onBack }: { onBack: () => void }) {
  const [func, setFunc] = useState<'sin'|'cos'|'tan'|'cot'>('sin');
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  
  const [scale, setScale] = useState(50); // px per unit (where 1 unit on x axis = 1 radian, roughly scale*pi = pixels)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

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

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset(prev => ({ x: prev.x + (e.clientX - lastPos.x), y: prev.y + (e.clientY - lastPos.y) }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

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

    const startX = fromSvgX(0);
    const endX = fromSvgX(width);
    
    // Axes
    g.append("line").attr("x1", 0).attr("y1", cy).attr("x2", width).attr("y2", cy).attr("stroke", "#64748b").attr("stroke-width", 2);
    g.append("line").attr("x1", cx).attr("y1", 0).attr("x2", cx).attr("y2", height).attr("stroke", "#64748b").attr("stroke-width", 2);

    // Ticks Pi
    const piScale = Math.PI;
    const startTick = Math.floor(startX / piScale);
    const endTick = Math.ceil(endX / piScale);
    for (let i = startTick; i <= endTick; i++) {
      const x = i * piScale;
      const sx = toSvgX(x);
      g.append("line").attr("x1", sx).attr("y1", cy - 5).attr("x2", sx).attr("y2", cy + 5).attr("stroke", "#64748b");
      if (i !== 0) {
        const label = i === 1 ? "π" : i === -1 ? "-π" : `${i}π`;
        g.append("text").attr("x", sx).attr("y", cy + 20).text(label).attr("text-anchor", "middle").attr("fill", "#64748b").attr("font-size", "12px");
      }
    }

    // Graph
    let pathD = '';
    let isFirst = true;
    const step = (endX - startX) / 300;
    
    let color = "#3b82f6";
    if (func === 'cos') color = "#10b981";
    if (func === 'tan') color = "#f59e0b";
    if (func === 'cot') color = "#8b5cf6";

    for (let x = startX; x <= endX; x += step) {
      let y = 0;
      if (func === 'sin') y = a * Math.sin(b * x);
      if (func === 'cos') y = a * Math.cos(b * x);
      if (func === 'tan') y = a * Math.tan(b * x);
      if (func === 'cot') y = a * (1 / Math.tan(b * x));

      const sx = toSvgX(x);
      const sy = toSvgY(y);

      if (Math.abs(y) > 10) {
        // Asymptote break for tan/cot
        isFirst = true;
      } else {
        if (sy > -height*2 && sy < height*3) {
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
    }

    if (pathD) {
      g.append("path").attr("d", pathD).attr("fill", "none").attr("stroke", color).attr("stroke-width", 3);
    }

  }, [func, a, b, scale, offset, dimensions]);

  const eq = `y = ${a === 1 ? '' : a === -1 ? '-' : a}\\${func}(${b === 1 ? 'x' : b === -1 ? '-x' : b + 'x'})`;
  const T = `\\frac{${func === 'sin' || func === 'cos' ? '2\\pi' : '\\pi'}}{|${b}|} = \\frac{${func === 'sin' || func === 'cos' ? '2\\pi' : '\\pi'}}{${Math.abs(b)}}`;

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Lab Đồ Thị Hàm Số Lượng Giác
          </h2>
        </div>
        <button onClick={() => { setFunc('sin'); setA(1); setB(1); setScale(50); setOffset({x:0, y:0}); }} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RefreshCw size={16} /> Đặt lại
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
        {/* A. THÔNG SỐ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Tham số hàm lượng giác <MathRenderer value="y = a \cdot f(bx)" className="inline" /></h3>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-700">Hàm số f:</label>
              <select value={func} onChange={e => setFunc(e.target.value as any)} className="px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500">
                <option value="sin">y = sin(x)</option>
                <option value="cos">y = cos(x)</option>
                <option value="tan">y = tan(x)</option>
                <option value="cot">y = cot(x)</option>
              </select>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <label className="font-semibold text-slate-700">Biên độ (a) =</label>
              <input type="number" step="0.5" value={a} onChange={e => setA(Number(e.target.value) || 0)} className="w-20 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-mono text-center" />
            </div>
            <div className="flex items-center gap-4 mt-6">
              <label className="font-semibold text-slate-700">Tần số (b) =</label>
              <input type="number" step="0.5" value={b} onChange={e => setB(Number(e.target.value) || 0)} className="w-20 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-mono text-center" />
            </div>
          </div>
        </div>

        {/* B. KẾT QUẢ & MÔ PHỎNG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-slate-800">B. Đồ thị</h3>
              <div className="flex items-center gap-2">
                 <button onClick={() => setScale(s => s * 1.2)} className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"><ZoomIn size={16}/></button>
                 <button onClick={() => setScale(s => s / 1.2)} className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"><ZoomOut size={16}/></button>
              </div>
            </div>
            <div className="relative w-full h-[350px]">
              <div className="absolute top-2 left-2 bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm z-10 pointer-events-none">
                <MathRenderer value={eq} />
              </div>
              <div ref={containerRef} className="w-full h-full border border-slate-200 rounded-lg overflow-hidden bg-slate-50 touch-none">
                <svg 
                  ref={svgRef} 
                  className="w-full h-full cursor-move" 
                  style={{ touchAction: 'none' }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                ></svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">C. Đặc điểm hàm số</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <span className="text-blue-800 font-medium">Chu kì tuần hoàn (T):</span>
                  <span className="font-bold text-blue-900 text-lg"><MathRenderer value={`T = ${T}`} /></span>
                </div>
                {(func === 'sin' || func === 'cos') && (
                  <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <span className="text-emerald-800 font-medium">Tập giá trị:</span>
                    <span className="font-bold text-emerald-900 text-lg"><MathRenderer value={`[${-Math.abs(a)}, ${Math.abs(a)}]`} /></span>
                  </div>
                )}
                {(func === 'tan' || func === 'cot') && (
                  <div className="flex justify-between items-center p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <span className="text-amber-800 font-medium">Tập xác định:</span>
                    <span className="text-amber-900">
                      {func === 'tan' ? <MathRenderer value={`D = \\mathbb{R} \\setminus \\{ \\frac{\\pi}{2|b|} + k\\frac{\\pi}{|b|} \\}`} /> : <MathRenderer value={`D = \\mathbb{R} \\setminus \\{ k\\frac{\\pi}{|b|} \\}`} />}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-2">D. Khám phá</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Tham số <strong>a</strong> (Biên độ) làm đồ thị co dãn theo trục tung (Oy). Thử a=2, đồ thị sẽ cao hơn.</li>
                <li>Tham số <strong>b</strong> làm đồ thị co dãn theo trục hoành (Ox) và làm thay đổi chu kì. Thử b=2, chu kì sẽ giảm đi một nửa.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
