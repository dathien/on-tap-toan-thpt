import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Triangle, RotateCcw } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import * as d3 from 'd3';

export function TriangleSolverLab({ onBack }: { onBack: () => void }) {
  // Input mode: SSS, SAS, ASA
  const [a, setA] = useState(5);
  const [b, setB] = useState(6);
  const [angleC, setAngleC] = useState(60); // degrees
  
  const [error, setError] = useState('');

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

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

  // Calculate triangle properties based on SAS (Side a, Angle C, Side b)
  let cSide = 0, angleA = 0, angleB = 0, area = 0, R = 0, r = 0;
  let isValid = false;

  try {
    const C_rad = (angleC * Math.PI) / 180;
    // Cosine rule for side c
    cSide = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C_rad));
    
    // Sine rule / Cosine rule for other angles
    angleA = Math.acos((b*b + cSide*cSide - a*a) / (2*b*cSide)) * 180 / Math.PI;
    angleB = 180 - angleC - angleA;

    // Area
    const p = (a + b + cSide) / 2;
    area = Math.sqrt(p * (p - a) * (p - b) * (p - cSide));

    // Circumcircle & Incircle
    R = (a * b * cSide) / (4 * area);
    r = area / p;
    
    isValid = cSide > 0 && angleA > 0 && angleB > 0 && !isNaN(cSide);
  } catch (e) {}

  useEffect(() => {
    if (!svgRef.current || !isValid) return;
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Coordinates mapping
    // Let C be at origin (0,0)
    // Let B be on positive x-axis at (a, 0)
    // Let A be at (b * cos(C), b * sin(C))
    
    const C_rad = (angleC * Math.PI) / 180;
    const ptC = { x: 0, y: 0 };
    const ptB = { x: a, y: 0 };
    const ptA = { x: b * Math.cos(C_rad), y: b * Math.sin(C_rad) };

    // Bounding box
    const minX = Math.min(ptA.x, ptB.x, ptC.x);
    const maxX = Math.max(ptA.x, ptB.x, ptC.x);
    const minY = Math.min(ptA.y, ptB.y, ptC.y);
    const maxY = Math.max(ptA.y, ptB.y, ptC.y);

    const dataW = maxX - minX;
    const dataH = maxY - minY;

    const margin = 50;
    const scale = Math.min((width - 2 * margin) / (dataW || 1), (height - 2 * margin) / (dataH || 1));

    const cx = width / 2 - ((minX + maxX) / 2) * scale;
    const cy = height / 2 + ((minY + maxY) / 2) * scale; // invert Y

    const toX = (val: number) => cx + val * scale;
    const toY = (val: number) => cy - val * scale;

    const g = svg.append("g");

    // Triangle Path
    g.append("polygon")
      .attr("points", `${toX(ptA.x)},${toY(ptA.y)} ${toX(ptB.x)},${toY(ptB.y)} ${toX(ptC.x)},${toY(ptC.y)}`)
      .attr("fill", "rgba(56, 189, 248, 0.2)")
      .attr("stroke", "#0284c7")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round");

    // Vertices
    const drawVertex = (pt: any, label: string, offset: {x:number, y:number}) => {
      g.append("circle").attr("cx", toX(pt.x)).attr("cy", toY(pt.y)).attr("r", 5).attr("fill", "#0284c7");
      g.append("text").attr("x", toX(pt.x) + offset.x).attr("y", toY(pt.y) + offset.y).text(label).attr("font-size", "16px").attr("font-weight", "bold").attr("fill", "#0f172a");
    };

    drawVertex(ptA, "A", { x: 0, y: -10 });
    drawVertex(ptB, "B", { x: 10, y: 15 });
    drawVertex(ptC, "C", { x: -15, y: 15 });

    // Side labels
    const drawLabel = (p1: any, p2: any, label: string, val: number) => {
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      g.append("text")
        .attr("x", toX(midX))
        .attr("y", toY(midY) + 5)
        .text(`${label}=${val.toFixed(1)}`)
        .attr("font-size", "12px")
        .attr("fill", "#64748b")
        .attr("text-anchor", "middle")
        .attr("background", "white");
    };

    drawLabel(ptB, ptC, "a", a);
    drawLabel(ptA, ptC, "b", b);
    drawLabel(ptA, ptB, "c", cSide);

  }, [a, b, angleC, dimensions, isValid, cSide]);

  const resetData = () => {
    setA(5);
    setB(6);
    setAngleC(60);
  };

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Triangle className="text-sky-600" />
            Lab Giải Tam Giác (Định lí Cosin & Sin)
          </h2>
        </div>
        <button onClick={resetData} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Tham số tam giác ABC (Cạnh - Góc - Cạnh)</h3>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4">
              <label className="font-semibold text-slate-700">Cạnh a (BC) =</label>
              <input type="number" min="0.1" step="0.5" value={a} onChange={e => setA(Number(e.target.value) || 0.1)} className="w-24 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500 font-mono text-center" />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold text-slate-700">Cạnh b (AC) =</label>
              <input type="number" min="0.1" step="0.5" value={b} onChange={e => setB(Number(e.target.value) || 0.1)} className="w-24 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500 font-mono text-center" />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold text-slate-700">Góc C (độ) =</label>
              <input type="number" min="1" max="179" value={angleC} onChange={e => setAngleC(Number(e.target.value) || 1)} className="w-24 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500 font-mono text-center" />
            </div>
          </div>
          {!isValid && <div className="mt-4 text-red-600 text-sm">Các thông số không tạo thành một tam giác hợp lệ.</div>}
        </div>

        {isValid && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2 w-full text-left">B. Hình học trực quan</h3>
              <div ref={containerRef} className="w-full h-[400px] border border-slate-200 rounded-lg overflow-hidden bg-slate-50 touch-none">
                <svg ref={svgRef} className="w-full h-full"></svg>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">C. Kết quả giải tam giác</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <span className="text-blue-800 font-medium text-sm">Định lí Cosin tính cạnh c (AB):</span>
                    <MathRenderer value={`c^2 = a^2 + b^2 - 2ab\\cos(C)`} className="text-blue-900" />
                    <span className="font-bold text-blue-900 text-xl"><MathRenderer value={`c = ${cSide.toFixed(2)}`} /></span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <span className="text-emerald-800 font-medium text-sm">Góc A:</span>
                      <span className="font-bold text-emerald-900 text-xl"><MathRenderer value={`\\widehat{A} = ${angleA.toFixed(2)}^\\circ`} /></span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <span className="text-amber-800 font-medium text-sm">Góc B:</span>
                      <span className="font-bold text-amber-900 text-xl"><MathRenderer value={`\\widehat{B} = ${angleB.toFixed(2)}^\\circ`} /></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-slate-600 font-medium text-sm">Diện tích (S):</span>
                      <span className="font-bold text-slate-800 text-lg"><MathRenderer value={`S = ${area.toFixed(2)}`} /></span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-slate-600 font-medium text-sm">Bán kính đ/t ngoại tiếp (R):</span>
                      <span className="font-bold text-slate-800 text-lg"><MathRenderer value={`R = ${R.toFixed(2)}`} /></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 flex-1">
                <h3 className="text-lg font-bold text-sky-800 mb-2">D. Khám phá</h3>
                <ul className="list-disc pl-5 space-y-2 text-sky-700">
                  <li>Thay đổi góc C thành <MathRenderer value="90^\circ" className="inline" />. Quan sát Định lí Cosin trở thành Định lí Pythagoras: <MathRenderer value="c^2 = a^2 + b^2" className="inline" />.</li>
                  <li>Bạn có thể tính góc A bằng Định lí Sin sau khi đã có c: <MathRenderer value="\frac{a}{\sin A} = \frac{c}{\sin C}" className="inline" />.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
