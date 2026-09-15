import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Move, RotateCcw, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import * as d3 from 'd3';

export function VectorOxyLab({ onBack }: { onBack: () => void }) {
  const [ux, setUx] = useState(3);
  const [uy, setUy] = useState(2);
  const [vx, setVx] = useState(-1);
  const [vy, setVy] = useState(4);
  const [k, setK] = useState(2);
  
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

    // Defs for arrows
    const defs = svg.append("defs");
    ["u", "v", "sum", "sub", "k"].forEach(id => {
      let color = "#3b82f6"; // u
      if (id === "v") color = "#f59e0b";
      else if (id === "sum") color = "#10b981";
      else if (id === "sub") color = "#ef4444";
      else if (id === "k") color = "#8b5cf6";
      
      defs.append("marker")
        .attr("id", `arrow-${id}`)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 9)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", color);
    });

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

    // Helper to draw vector
    const drawVector = (x1: number, y1: number, x2: number, y2: number, color: string, id: string, label: string) => {
      g.append("line")
        .attr("x1", toSvgX(x1)).attr("y1", toSvgY(y1))
        .attr("x2", toSvgX(x2)).attr("y2", toSvgY(y2))
        .attr("stroke", color).attr("stroke-width", 3)
        .attr("marker-end", `url(#arrow-${id})`);
      
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      g.append("text")
        .attr("x", toSvgX(midX))
        .attr("y", toSvgY(midY) - 5)
        .text(label)
        .attr("fill", color)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle");
    };

    // Draw vectors
    // u
    drawVector(0, 0, ux, uy, "#3b82f6", "u", "u");
    // v
    drawVector(0, 0, vx, vy, "#f59e0b", "v", "v");
    
    // sum (u + v) -> Draw as parallelogram
    g.append("line").attr("x1", toSvgX(ux)).attr("y1", toSvgY(uy)).attr("x2", toSvgX(ux+vx)).attr("y2", toSvgY(uy+vy)).attr("stroke", "#f59e0b").attr("stroke-width", 2).attr("stroke-dasharray", "5,5");
    g.append("line").attr("x1", toSvgX(vx)).attr("y1", toSvgY(vy)).attr("x2", toSvgX(ux+vx)).attr("y2", toSvgY(uy+vy)).attr("stroke", "#3b82f6").attr("stroke-width", 2).attr("stroke-dasharray", "5,5");
    drawVector(0, 0, ux+vx, uy+vy, "#10b981", "sum", "u+v");

    // sub (u - v) -> From end of v to end of u
    drawVector(vx, vy, ux, uy, "#ef4444", "sub", "u-v");
    
    // k*u
    // Offset slightly so it doesn't overlap completely with u
    g.append("line")
      .attr("x1", toSvgX(0)).attr("y1", toSvgY(0) + 4)
      .attr("x2", toSvgX(k*ux)).attr("y2", toSvgY(k*uy) + 4)
      .attr("stroke", "#8b5cf6").attr("stroke-width", 3)
      .attr("stroke-dasharray", "4,4")
      .attr("marker-end", "url(#arrow-k)");
    g.append("text").attr("x", toSvgX(k*ux/2)).attr("y", toSvgY(k*uy/2) + 15).text("k·u").attr("fill", "#8b5cf6").attr("font-weight", "bold");

  }, [ux, uy, vx, vy, k, scale, offset, dimensions]);

  const dot = ux * vx + uy * vy;
  const lenU = Math.sqrt(ux*ux + uy*uy);
  const lenV = Math.sqrt(vx*vx + vy*vy);
  const cosAngle = (lenU * lenV === 0) ? 0 : dot / (lenU * lenV);
  const angleDeg = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180 / Math.PI;

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Move className="text-indigo-600" />
            Lab Vectơ trong mặt phẳng Oxy
          </h2>
        </div>
        <button onClick={() => { setUx(3); setUy(2); setVx(-1); setVy(4); setK(2); setScale(40); setOffset({x:0, y:0}); }} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
        {/* A. THÔNG SỐ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Tham số Vector</h3>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex flex-col gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="font-bold text-blue-800">Vector <MathRenderer value="\vec{u}" className="inline" /></label>
              <div className="flex items-center gap-2">
                <span>x = </span><input type="number" value={ux} onChange={e => setUx(Number(e.target.value) || 0)} className="w-16 px-2 py-1 border border-blue-300 rounded outline-none" />
                <span>y = </span><input type="number" value={uy} onChange={e => setUy(Number(e.target.value) || 0)} className="w-16 px-2 py-1 border border-blue-300 rounded outline-none" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <label className="font-bold text-amber-800">Vector <MathRenderer value="\vec{v}" className="inline" /></label>
              <div className="flex items-center gap-2">
                <span>x = </span><input type="number" value={vx} onChange={e => setVx(Number(e.target.value) || 0)} className="w-16 px-2 py-1 border border-amber-300 rounded outline-none" />
                <span>y = </span><input type="number" value={vy} onChange={e => setVy(Number(e.target.value) || 0)} className="w-16 px-2 py-1 border border-amber-300 rounded outline-none" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <label className="font-bold text-purple-800">Hệ số k</label>
              <div className="flex items-center gap-2">
                <span>k = </span><input type="number" value={k} onChange={e => setK(Number(e.target.value) || 0)} className="w-16 px-2 py-1 border border-purple-300 rounded outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* B. KẾT QUẢ & MÔ PHỎNG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-slate-800">B. Đồ thị mặt phẳng Oxy</h3>
              <div className="flex items-center gap-2">
                 <button onClick={() => setScale(s => s * 1.2)} className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"><ZoomIn size={16}/></button>
                 <button onClick={() => setScale(s => s / 1.2)} className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"><ZoomOut size={16}/></button>
                 <button onClick={() => { setScale(40); setOffset({x:0, y:0}); }} className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200"><RefreshCw size={16}/></button>
              </div>
            </div>
            <div ref={containerRef} className="w-full h-[450px] border border-slate-200 rounded-lg overflow-hidden bg-slate-50 touch-none">
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
          
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">C. Các phép toán</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-emerald-800">Tổng (Quy tắc hình bình hành):</span>
                  <span className="text-lg"><MathRenderer value={`\\vec{u} + \\vec{v} = (${ux + vx}; ${uy + vy})`} /></span>
                </div>

                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-red-800">Hiệu (Quy tắc 3 điểm):</span>
                  <span className="text-lg"><MathRenderer value={`\\vec{u} - \\vec{v} = (${ux - vx}; ${uy - vy})`} /></span>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-purple-800">Tích với số (k = {k}):</span>
                  <span className="text-lg"><MathRenderer value={`k\\vec{u} = (${k * ux}; ${k * uy})`} /></span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Độ dài:</span>
                    <MathRenderer value={`|\\vec{u}| = ${lenU.toFixed(2)}, |\\vec{v}| = ${lenV.toFixed(2)}`} />
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                    <span className="font-bold text-slate-700">Tích vô hướng:</span>
                    <MathRenderer value={`\\vec{u} \\cdot \\vec{v} = ${dot}`} />
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                    <span className="font-bold text-slate-700">Góc giữa 2 vector:</span>
                    <MathRenderer value={`(\\vec{u}, \\vec{v}) \\approx ${angleDeg.toFixed(1)}^\\circ`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex-1">
              <h3 className="text-lg font-bold text-indigo-800 mb-2">D. Khám phá</h3>
              <ul className="list-disc pl-5 space-y-2 text-indigo-700">
                <li>Hãy thử chỉnh hệ số k âm (ví dụ k = -1), vector <MathRenderer value="k\vec{u}" className="inline" /> sẽ thay đổi hướng thế nào so với <MathRenderer value="\vec{u}" className="inline" />?</li>
                <li>Thay đổi tọa độ để tích vô hướng <MathRenderer value="\vec{u} \cdot \vec{v} = 0" className="inline" /> (ví dụ u(2,0) và v(0,2)). Điều gì xảy ra với góc giữa chúng?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
