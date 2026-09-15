import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Circle, RotateCcw } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import * as d3 from 'd3';

export function TrigUnitCircleLab({ onBack }: { onBack: () => void }) {
  const [angleDeg, setAngleDeg] = useState(45);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

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

  const angleRad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(angleRad);
  const cosVal = Math.cos(angleRad);
  const tanVal = Math.tan(angleRad);
  const cotVal = 1 / tanVal;

  useEffect(() => {
    if (!svgRef.current) return;
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = 40;
    const size = Math.min(width, height) - margin * 2;
    const r = size / 2;
    const cx = width / 2;
    const cy = height / 2;

    const g = svg.append("g").attr("transform", `translate(${cx},${cy})`);

    // Axes
    g.append("line").attr("x1", -r - 20).attr("y1", 0).attr("x2", r + 20).attr("y2", 0).attr("stroke", "#94a3b8").attr("stroke-width", 2);
    g.append("line").attr("x1", 0).attr("y1", -r - 20).attr("x2", 0).attr("y2", r + 20).attr("stroke", "#94a3b8").attr("stroke-width", 2);
    
    // Labels
    g.append("text").attr("x", r + 25).attr("y", 5).text("x").attr("fill", "#64748b");
    g.append("text").attr("x", 5).attr("y", -r - 25).text("y").attr("fill", "#64748b");

    // Unit Circle
    g.append("circle").attr("cx", 0).attr("cy", 0).attr("r", r).attr("fill", "none").attr("stroke", "#cbd5e1").attr("stroke-width", 2);

    // Grid/Ticks
    const ticks = [-1, -0.5, 0.5, 1];
    ticks.forEach(t => {
      g.append("line").attr("x1", t * r).attr("y1", -4).attr("x2", t * r).attr("y2", 4).attr("stroke", "#94a3b8");
      g.append("line").attr("x1", -4).attr("y1", -t * r).attr("x2", 4).attr("y2", -t * r).attr("stroke", "#94a3b8");
      if (t !== 0) {
        g.append("text").attr("x", t * r).attr("y", 16).text(t.toString()).attr("font-size", "10px").attr("text-anchor", "middle").attr("fill", "#94a3b8");
        g.append("text").attr("x", -8).attr("y", -t * r + 4).text(t.toString()).attr("font-size", "10px").attr("text-anchor", "end").attr("fill", "#94a3b8");
      }
    });

    // Angle Arc
    const arc = d3.arc()({
      innerRadius: 0,
      outerRadius: r * 0.2,
      startAngle: Math.PI / 2,
      endAngle: Math.PI / 2 - angleRad
    });
    g.append("path").attr("d", arc as string).attr("fill", "#fef08a").attr("opacity", 0.6);

    const ptX = cosVal * r;
    const ptY = -sinVal * r;

    // Sin line
    g.append("line").attr("x1", ptX).attr("y1", 0).attr("x2", ptX).attr("y2", ptY).attr("stroke", "#ef4444").attr("stroke-width", 3).attr("stroke-dasharray", "4,4");
    g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", ptY).attr("stroke", "#ef4444").attr("stroke-width", 4);
    
    // Cos line
    g.append("line").attr("x1", 0).attr("y1", ptY).attr("x2", ptX).attr("y2", ptY).attr("stroke", "#3b82f6").attr("stroke-width", 3).attr("stroke-dasharray", "4,4");
    g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", ptX).attr("y2", 0).attr("stroke", "#3b82f6").attr("stroke-width", 4);

    // Radius line
    g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", ptX).attr("y2", ptY).attr("stroke", "#1e293b").attr("stroke-width", 2);

    // Point M
    const drag = d3.drag<SVGCircleElement, any>()
      .on("drag", (event) => {
        let dx = event.x;
        let dy = event.y;
        let angle = Math.atan2(-dy, dx) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        setAngleDeg(Math.round(angle));
      });

    const ptGrp = g.append("g")
      .attr("transform", `translate(${ptX},${ptY})`)
      .style("cursor", "pointer")
      .call(drag as any);

    ptGrp.append("circle")
      .attr("r", 8)
      .attr("fill", "#10b981")
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    ptGrp.append("text")
      .attr("x", 12)
      .attr("y", -12)
      .text(`M`)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#1e293b")
      .style("pointer-events", "none");

  }, [angleDeg, dimensions]);

  const resetData = () => {
    setAngleDeg(45);
  };

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Circle className="text-emerald-600" />
            Lab Đường Tròn Lượng Giác
          </h2>
        </div>
        <button onClick={resetData} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
        {/* A. THÔNG SỐ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Thông số góc lượng giác</h3>
          <div className="flex flex-wrap items-center gap-6 text-lg">
            <div className="flex flex-col gap-2 w-full max-w-md">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-700">Góc <MathRenderer value="\alpha" /> (độ):</label>
                <span className="font-bold text-emerald-600">{angleDeg}°</span>
              </div>
              <input 
                type="range" 
                min="0" max="360" 
                value={angleDeg} 
                onChange={e => setAngleDeg(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-sm text-slate-500">
                <span>0°</span>
                <span>90°</span>
                <span>180°</span>
                <span>270°</span>
                <span>360°</span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <MathRenderer value={`\\alpha = \\frac{${angleDeg}\\pi}{180} \\text{ rad}`} />
            </div>
          </div>
        </div>

        {/* B. KẾT QUẢ & MÔ PHỎNG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2 w-full text-left">B. Mô phỏng đường tròn đơn vị</h3>
            <div ref={containerRef} className="w-full h-[400px] border border-slate-200 rounded-lg overflow-hidden bg-slate-50 touch-none">
              <svg ref={svgRef} className="w-full h-full" style={{ touchAction: 'none' }}></svg>
            </div>
            <p className="text-sm text-slate-500 mt-2">Kéo điểm M trên đường tròn để thay đổi góc.</p>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">C. Giá trị lượng giác</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="w-20 font-bold text-red-700 text-lg">Sin:</div>
                  <div className="flex-1 text-xl"><MathRenderer value={`\\sin(${angleDeg}^\\circ) = ${sinVal.toFixed(4)}`} /></div>
                  <div className="text-sm text-red-600 hidden sm:block">Độ dài hình chiếu lên trục Oy</div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="w-20 font-bold text-blue-700 text-lg">Cos:</div>
                  <div className="flex-1 text-xl"><MathRenderer value={`\\cos(${angleDeg}^\\circ) = ${cosVal.toFixed(4)}`} /></div>
                  <div className="text-sm text-blue-600 hidden sm:block">Độ dài hình chiếu lên trục Ox</div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="w-20 font-bold text-amber-700 text-lg">Tan:</div>
                  <div className="flex-1 text-xl">
                    {Math.abs(cosVal) < 0.0001 ? (
                      <span className="text-amber-600 font-bold">Không xác định (∞)</span>
                    ) : (
                      <MathRenderer value={`\\tan(${angleDeg}^\\circ) = ${tanVal.toFixed(4)}`} />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                  <div className="w-20 font-bold text-purple-700 text-lg">Cot:</div>
                  <div className="flex-1 text-xl">
                    {Math.abs(sinVal) < 0.0001 ? (
                      <span className="text-purple-600 font-bold">Không xác định (∞)</span>
                    ) : (
                      <MathRenderer value={`\\cot(${angleDeg}^\\circ) = ${cotVal.toFixed(4)}`} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* D. KHÁM PHÁ */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex-1">
              <h3 className="text-lg font-bold text-emerald-800 mb-2">D. Khám phá</h3>
              <ul className="list-disc pl-5 space-y-2 text-emerald-700">
                <li>Khi góc <MathRenderer value="\alpha" /> chạy từ 0° đến 90°, giá trị Sin tăng hay giảm?</li>
                <li>Tại góc nào thì <MathRenderer value="\sin(\alpha) = \cos(\alpha)" />?</li>
                <li>Khám phá tính tuần hoàn: Nếu bạn quay điểm M quá 360°, vị trí của nó trên đường tròn có thay đổi không?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
