import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, LayoutDashboard, Plus, Trash2, RotateCcw } from 'lucide-react';
import * as d3 from 'd3';

interface Inequality {
  id: string;
  a: number;
  b: number;
  c: number;
  sign: '<=' | '>=' | '<' | '>';
  color: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#eab308', '#a855f7', '#ec4899'];

export function InequalitySystem2DLab({ onBack }: { onBack: () => void }) {
  const [inequalities, setInequalities] = useState<Inequality[]>([
    { id: '1', a: 1, b: 1, c: 4, sign: '<=', color: COLORS[0] },
    { id: '2', a: 1, b: 0, c: 0, sign: '>=', color: COLORS[1] },
    { id: '3', a: 0, b: 1, c: 0, sign: '>=', color: COLORS[2] }
  ]);
  
  const [testPoint, setTestPoint] = useState({ x: 1, y: 1 });

  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 });
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

  const addInequality = () => {
    if (inequalities.length >= 5) return;
    setInequalities([
      ...inequalities,
      { id: Date.now().toString(), a: 1, b: 1, c: 2, sign: '<=', color: COLORS[inequalities.length] }
    ]);
  };

  const removeInequality = (id: string) => {
    setInequalities(inequalities.filter(i => i.id !== id));
  };

  const updateInequality = (id: string, field: keyof Inequality, value: any) => {
    setInequalities(inequalities.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const evaluate = (ineq: Inequality, x: number, y: number) => {
    const val = ineq.a * x + ineq.b * y;
    if (ineq.sign === '<=') return val <= ineq.c;
    if (ineq.sign === '>=') return val >= ineq.c;
    if (ineq.sign === '<') return val < ineq.c;
    return val > ineq.c;
  };

  const isTestPointValid = inequalities.every(i => evaluate(i, testPoint.x, testPoint.y));

  useEffect(() => {
    if (!svgRef.current) return;
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const domain = [-10, 10];
    const xScale = d3.scaleLinear().domain(domain).range([0, w]);
    const yScale = d3.scaleLinear().domain(domain).range([h, 0]);

    // Grid
    const xAxis = d3.axisBottom(xScale).ticks(20).tickSize(-h).tickFormat(() => "");
    const yAxis = d3.axisLeft(yScale).ticks(20).tickSize(-w).tickFormat(() => "");

    g.append("g").attr("class", "grid x-grid text-slate-200 stroke-slate-200").attr("transform", `translate(0,${h})`).call(xAxis);
    g.append("g").attr("class", "grid y-grid text-slate-200 stroke-slate-200").call(yAxis);

    // Axes
    g.append("g").attr("transform", `translate(0,${yScale(0)})`).call(d3.axisBottom(xScale));
    g.append("g").attr("transform", `translate(${xScale(0)},0)`).call(d3.axisLeft(yScale));

    // A brute force approach to highlight intersection region on canvas
    // We create a dense grid of points, filter valid ones, and draw small rects or compute convex hull
    // For simplicity, we just draw lines and color valid dots
    const dx = (domain[1] - domain[0]) / w * 2;
    const dy = (domain[1] - domain[0]) / h * 2;
    
    // Using a simpler approach: draw the boundaries and then overlay a semi-transparent layer masking out invalid regions?
    // Actually, drawing colored semi-transparent polygons for each inequality is standard. The intersection will be darkest.
    // However, the prompt specifically asks to "highlight the intersection region clearly, not just draw individual lines".
    // Let's do pixel-based or grid-based fill.
    
    const validPoints = [];
    for (let x = domain[0]; x <= domain[1]; x += 0.25) {
      for (let y = domain[0]; y <= domain[1]; y += 0.25) {
        if (inequalities.every(i => evaluate(i, x, y))) {
          validPoints.push({x, y});
        }
      }
    }

    g.selectAll(".valid-point")
      .data(validPoints)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.x))
      .attr("y", d => yScale(d.y))
      .attr("width", xScale(0.25) - xScale(0))
      .attr("height", yScale(0) - yScale(0.25))
      .attr("fill", "#10b981")
      .attr("opacity", 0.3);


    // Draw the lines
    inequalities.forEach(ineq => {
      const { a, b, c, sign, color } = ineq;
      if (a !== 0 || b !== 0) {
        let linePoints = [];
        if (b === 0) {
          linePoints = [[xScale(c/a), yScale(-10)], [xScale(c/a), yScale(10)]];
        } else {
          linePoints = [[xScale(-10), yScale((c - a * -10) / b)], [xScale(10), yScale((c - a * 10) / b)]];
        }
        g.append("line")
          .attr("x1", linePoints[0][0])
          .attr("y1", linePoints[0][1])
          .attr("x2", linePoints[1][0])
          .attr("y2", linePoints[1][1])
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", (sign === '<' || sign === '>') ? "5,5" : "none");
      }
    });

    // Test Point
    const drag = d3.drag<SVGCircleElement, any>()
      .on("drag", (event) => {
        let x = Math.round(xScale.invert(event.x));
        let y = Math.round(yScale.invert(event.y));
        x = Math.max(-10, Math.min(10, x));
        y = Math.max(-10, Math.min(10, y));
        setTestPoint({ x, y });
      });

    const ptGrp = g.append("g")
      .attr("transform", `translate(${xScale(testPoint.x)},${yScale(testPoint.y)})`)
      .style("cursor", "pointer")
      .call(drag as any);

    ptGrp.append("circle")
      .attr("r", 6)
      .attr("fill", isTestPointValid ? "#059669" : "#dc2626")
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    ptGrp.append("text")
      .attr("x", 10)
      .attr("y", -10)
      .text(`M(${testPoint.x}; ${testPoint.y})`)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#1e293b")
      .style("pointer-events", "none");

  }, [inequalities, testPoint, dimensions]);

  const resetData = () => {
    setInequalities([
      { id: '1', a: 1, b: 1, c: 4, sign: '<=', color: COLORS[0] },
      { id: '2', a: 1, b: 0, c: 0, sign: '>=', color: COLORS[1] },
      { id: '3', a: 0, b: 1, c: 0, sign: '>=', color: COLORS[2] }
    ]);
    setTestPoint({ x: 1, y: 1 });
  };

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="text-teal-600" />
            Lab Miền Nghiệm Hệ BPT
          </h2>
        </div>
        <button onClick={resetData} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: THÔNG SỐ */}
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">A. Thông số Hệ BPT</h3>
                {inequalities.length < 5 && (
                  <button onClick={addInequality} className="text-sm px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 flex items-center gap-1">
                    <Plus size={16} /> Thêm BPT
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {inequalities.map((ineq, index) => (
                  <div key={ineq.id} className="flex flex-wrap items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="w-3 h-12 rounded-full" style={{ backgroundColor: ineq.color }}></div>
                    <div className="flex items-center gap-1">
                      <input type="number" value={ineq.a} onChange={e => updateInequality(ineq.id, 'a', Number(e.target.value) || 0)} className="w-14 px-2 py-1.5 border border-slate-300 rounded outline-none focus:border-teal-500 font-mono text-center" />
                      <span className="font-semibold italic text-slate-600">x</span>
                    </div>
                    <span className="font-bold text-slate-400">+</span>
                    <div className="flex items-center gap-1">
                      <input type="number" value={ineq.b} onChange={e => updateInequality(ineq.id, 'b', Number(e.target.value) || 0)} className="w-14 px-2 py-1.5 border border-slate-300 rounded outline-none focus:border-teal-500 font-mono text-center" />
                      <span className="font-semibold italic text-slate-600">y</span>
                    </div>
                    <select value={ineq.sign} onChange={e => updateInequality(ineq.id, 'sign', e.target.value)} className="px-2 py-1.5 border border-slate-300 rounded outline-none focus:border-teal-500 font-mono font-bold">
                      <option value="<">&lt;</option>
                      <option value="<=">&le;</option>
                      <option value=">">&gt;</option>
                      <option value=">=">&ge;</option>
                    </select>
                    <input type="number" value={ineq.c} onChange={e => updateInequality(ineq.id, 'c', Number(e.target.value) || 0)} className="w-14 px-2 py-1.5 border border-slate-300 rounded outline-none focus:border-teal-500 font-mono text-center" />
                    
                    {inequalities.length > 1 && (
                      <button onClick={() => removeInequality(ineq.id)} className="ml-auto p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">C. Kiểm tra điểm M</h3>
              <div className="text-lg mb-4">
                Điểm thử <strong className="text-teal-600">M({testPoint.x}; {testPoint.y})</strong>
              </div>
              <div className="space-y-2 mb-4">
                {inequalities.map((ineq, i) => {
                  const pass = evaluate(ineq, testPoint.x, testPoint.y);
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ineq.color }}></div>
                      <span className="w-24 text-slate-500">BPT {i+1}:</span>
                      <span className="flex-1">{ineq.a}({testPoint.x}) + {ineq.b}({testPoint.y}) = {ineq.a * testPoint.x + ineq.b * testPoint.y} {ineq.sign} {ineq.c}</span>
                      <span className={`font-bold ${pass ? 'text-green-600' : 'text-red-500'}`}>{pass ? 'ĐÚNG' : 'SAI'}</span>
                    </div>
                  )
                })}
              </div>
              <div className={`p-4 rounded-xl text-lg font-bold text-center ${isTestPointValid ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {isTestPointValid ? '✓ Điểm M THUỘC miền nghiệm của Hệ' : '✗ Điểm M KHÔNG THUỘC miền nghiệm của Hệ'}
              </div>
            </div>
          </div>

          {/* RIGHT: MÔ PHỎNG */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-2 w-full text-left">B. Mô phỏng miền nghiệm (Vùng màu xanh ngọc)</h3>
              <div ref={containerRef} className="w-full h-full min-h-[400px] border border-slate-200 rounded-lg overflow-hidden bg-slate-50 touch-none">
                <svg ref={svgRef} className="w-full h-full" style={{ touchAction: 'none' }}></svg>
              </div>
              <p className="text-sm text-slate-500 mt-2 text-center">Kéo điểm M để thử nghiệm. Miền được tô màu sáng biểu thị giao của tất cả BPT (Miền nghiệm của Hệ).</p>
            </div>
          </div>
        </div>

        {/* D. KHÁM PHÁ */}
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-teal-800 mb-2">D. Khám phá</h3>
          <ul className="list-disc pl-5 space-y-2 text-teal-700">
            <li>Thêm một bất phương trình mới (VD: <strong className="font-mono">x + y ≤ 2</strong>). Miền nghiệm chung sẽ bị thu hẹp lại hay mở rộng ra?</li>
            <li>Hãy thử đổi dấu của BPT 2 từ <strong className="font-mono">≥</strong> sang <strong className="font-mono">≤</strong> và quan sát xem miền nghiệm chung thay đổi ra sao.</li>
            <li>Miền nghiệm của hệ có thể là một đa giác khép kín không? Hãy thử tìm bộ hệ số để tạo ra một tam giác.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
