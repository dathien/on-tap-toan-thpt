import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Maximize2, RotateCcw, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import * as d3 from 'd3';

export function DynamicParabolaLab({ onBack }: { onBack: () => void }) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-4);
  const [c, setC] = useState(3);
  
  const [scale, setScale] = useState(40); // px per unit
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

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

  const vertexX = a !== 0 ? -b / (2 * a) : 0;
  const vertexY = a !== 0 ? a * vertexX * vertexX + b * vertexX + c : c;
  const delta = b * b - 4 * a * c;

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
    g.append("text").attr("x", width - 15).attr("y", cy - 10).text("x").attr("fill", "#64748b");
    g.append("text").attr("x", cx + 10).attr("y", 15).text("y").attr("fill", "#64748b");

    // Parabola Path
    if (a !== 0) {
      let pathD = '';
      let isFirst = true;
      const step = (endGridX - startGridX) / 100;
      for (let x = startGridX; x <= endGridX; x += step) {
        const y = a * x * x + b * x + c;
        const sx = toSvgX(x);
        const sy = toSvgY(y);
        
        if (sy > -height && sy < height * 2) {
          if (isFirst) {
            pathD += `M ${sx} ${sy} `;
            isFirst = false;
          } else {
            pathD += `L ${sx} ${sy} `;
          }
        }
      }
      if (pathD) {
        g.append("path").attr("d", pathD).attr("fill", "none").attr("stroke", "#0284c7").attr("stroke-width", 3);
      }

      // Vertex
      g.append("circle").attr("cx", toSvgX(vertexX)).attr("cy", toSvgY(vertexY)).attr("r", 5).attr("fill", "#dc2626");
      g.append("text").attr("x", toSvgX(vertexX) + 10).attr("y", toSvgY(vertexY) - 10).text("I").attr("fill", "#dc2626").attr("font-weight", "bold");
      
      // Axis of symmetry
      g.append("line").attr("x1", toSvgX(vertexX)).attr("y1", 0).attr("x2", toSvgX(vertexX)).attr("y2", height).attr("stroke", "#dc2626").attr("stroke-dasharray", "5,5").attr("stroke-width", 1.5);
    }

  }, [a, b, c, scale, offset, dimensions]);

  const formatEquation = () => {
    let eq = "y = ";
    if (a === 1) eq += "x^2 ";
    else if (a === -1) eq += "-x^2 ";
    else eq += `${a}x^2 `;

    if (b > 0) eq += `+ ${b}x `;
    else if (b < 0) eq += `- ${Math.abs(b)}x `;

    if (c > 0) eq += `+ ${c}`;
    else if (c < 0) eq += `- ${Math.abs(c)}`;
    
    return eq;
  };

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Maximize2 className="text-sky-600" />
            Lab Hàm Số Bậc Hai (Parabol)
          </h2>
        </div>
        <button onClick={() => { setA(1); setB(-4); setC(3); setScale(40); setOffset({x:0, y:0}); }} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Tham số hàm số <MathRenderer value="y = ax^2 + bx + c" className="inline" /></h3>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4">
              <label className="font-semibold text-slate-700">a =</label>
              <input type="number" value={a} onChange={e => setA(Number(e.target.value) || 0)} className="w-20 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500 font-mono text-center" />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold text-slate-700">b =</label>
              <input type="number" value={b} onChange={e => setB(Number(e.target.value) || 0)} className="w-20 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500 font-mono text-center" />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold text-slate-700">c =</label>
              <input type="number" value={c} onChange={e => setC(Number(e.target.value) || 0)} className="w-20 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500 font-mono text-center" />
            </div>
          </div>
          {a === 0 && <div className="mt-4 p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">Lưu ý: Khi a = 0, hàm số trở thành hàm bậc nhất, không còn là Parabol.</div>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-slate-800">B. Đồ thị</h3>
              <div className="flex items-center gap-2">
                 <button onClick={() => setScale(s => s * 1.2)} className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"><ZoomIn size={16}/></button>
                 <button onClick={() => setScale(s => s / 1.2)} className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"><ZoomOut size={16}/></button>
                 <button onClick={() => { setScale(40); setOffset({x:0, y:0}); }} className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"><RefreshCw size={16}/></button>
              </div>
            </div>
            <div className="relative w-full h-[400px]">
              <div className="absolute top-2 left-2 bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm z-10 pointer-events-none">
                <MathRenderer value={formatEquation()} />
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
              <h3 className="text-lg font-bold text-slate-800 mb-4">C. Đặc điểm đồ thị</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-600 font-medium">Bề lõm:</span>
                  <span className="font-bold text-slate-800">{a > 0 ? 'Hướng lên trên (a > 0)' : a < 0 ? 'Hướng xuống dưới (a < 0)' : 'Không xác định'}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-lg">
                  <span className="text-red-700 font-medium">Đỉnh <MathRenderer value="I(x_I; y_I)" className="inline" />:</span>
                  <span className="font-bold text-red-800">
                    {a !== 0 ? <MathRenderer value={`I(${vertexX.toFixed(2)}; ${vertexY.toFixed(2)})`} /> : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-sky-50 border border-sky-100 rounded-lg">
                  <span className="text-sky-700 font-medium">Trục đối xứng:</span>
                  <span className="font-bold text-sky-800">
                    {a !== 0 ? <MathRenderer value={`x = ${vertexX.toFixed(2)}`} /> : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-600 font-medium">Giao điểm với trục Tung (Oy):</span>
                  <span className="font-bold text-slate-800"><MathRenderer value={`(0; ${c})`} /></span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-600 font-medium"><MathRenderer value={`\\Delta = b^2 - 4ac`} className="inline" />:</span>
                  <span className="font-bold text-slate-800">{delta}</span>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 flex-1">
              <h3 className="text-lg font-bold text-sky-800 mb-2">D. Khám phá</h3>
              <ul className="list-disc pl-5 space-y-2 text-sky-700">
                <li>Thay đổi dấu của <strong className="font-mono">a</strong> (từ dương sang âm). Bề lõm của đồ thị thay đổi thế nào?</li>
                <li>Hệ số <strong className="font-mono">c</strong> ảnh hưởng đến vị trí nào của đồ thị? (Giao điểm với trục tung Oy).</li>
                <li>Quan sát <MathRenderer value="\Delta" className="inline" />. Khi <MathRenderer value="\Delta < 0" className="inline" />, đồ thị có cắt trục Ox không? Thử nhập a=1, b=0, c=1.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
