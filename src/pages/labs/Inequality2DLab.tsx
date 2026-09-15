import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Grid3X3, RotateCcw } from 'lucide-react';
import { BlockMath } from 'react-katex';
import * as d3 from 'd3';

export function Inequality2DLab({ onBack }: { onBack: () => void }) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [c, setC] = useState(4);
  const [sign, setSign] = useState<'<=' | '>=' | '<' | '>'>('<=');
  
  const [testPoint, setTestPoint] = useState({ x: 0, y: 0 });

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

  const evaluate = (x: number, y: number) => {
    const val = a * x + b * y;
    if (sign === '<=') return val <= c;
    if (sign === '>=') return val >= c;
    if (sign === '<') return val < c;
    return val > c;
  };

  const isTestPointValid = evaluate(testPoint.x, testPoint.y);

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

    // Draw the region
    const pathPoints = [];
    if (a === 0 && b === 0) {
      if (evaluate(0, 0)) {
        pathPoints.push([xScale(-10), yScale(-10)], [xScale(10), yScale(-10)], [xScale(10), yScale(10)], [xScale(-10), yScale(10)]);
      }
    } else if (b === 0) {
      const x0 = c / a;
      if ((a > 0 && (sign === '<=' || sign === '<')) || (a < 0 && (sign === '>=' || sign === '>'))) {
        pathPoints.push([xScale(-10), yScale(-10)], [xScale(x0), yScale(-10)], [xScale(x0), yScale(10)], [xScale(-10), yScale(10)]);
      } else {
        pathPoints.push([xScale(x0), yScale(-10)], [xScale(10), yScale(-10)], [xScale(10), yScale(10)], [xScale(x0), yScale(10)]);
      }
    } else {
      const getY = (x: number) => (c - a * x) / b;
      const yLeft = getY(-10);
      const yRight = getY(10);
      
      const isBelow = (b > 0 && (sign === '<=' || sign === '<')) || (b < 0 && (sign === '>=' || sign === '>'));
      
      if (isBelow) {
        pathPoints.push([xScale(-10), yScale(-10)], [xScale(10), yScale(-10)], [xScale(10), yScale(yRight)], [xScale(-10), yScale(yLeft)]);
      } else {
        pathPoints.push([xScale(-10), yScale(yLeft)], [xScale(10), yScale(yRight)], [xScale(10), yScale(10)], [xScale(-10), yScale(10)]);
      }
    }

    if (pathPoints.length > 0) {
      g.append("polygon")
        .attr("points", pathPoints.map(d => d.join(",")).join(" "))
        .attr("fill", "#22c55e")
        .attr("fill-opacity", 0.2);
    }

    // Draw the line
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
        .attr("stroke", "#16a34a")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", (sign === '<' || sign === '>') ? "5,5" : "none");
    }

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
      .attr("fill", evaluate(testPoint.x, testPoint.y) ? "#15803d" : "#dc2626")
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

  }, [a, b, c, sign, testPoint, dimensions]);

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Grid3X3 className="text-green-600" />
            Lab Miền Nghiệm Bất Phương Trình
          </h2>
        </div>
        <button onClick={() => { setA(1); setB(1); setC(4); setSign('<='); setTestPoint({x:0, y:0}); }} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <RotateCcw size={16} /> Dữ liệu mẫu
        </button>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">
        {/* A. THÔNG SỐ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">A. Thông số bất phương trình</h3>
          <div className="flex flex-wrap items-center gap-4 text-lg">
            <div className="flex items-center gap-2">
              <input type="number" value={a} onChange={e => setA(Number(e.target.value) || 0)} className="w-20 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-green-500 font-mono text-center" />
              <span className="font-semibold italic">x</span>
            </div>
            <span className="font-bold">+</span>
            <div className="flex items-center gap-2">
              <input type="number" value={b} onChange={e => setB(Number(e.target.value) || 0)} className="w-20 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-green-500 font-mono text-center" />
              <span className="font-semibold italic">y</span>
            </div>
            <select value={sign} onChange={e => setSign(e.target.value as any)} className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-green-500 font-mono font-bold">
              <option value="<">&lt;</option>
              <option value="<=">&le;</option>
              <option value=">">&gt;</option>
              <option value=">=">&ge;</option>
            </select>
            <input type="number" value={c} onChange={e => setC(Number(e.target.value) || 0)} className="w-20 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-green-500 font-mono text-center" />
          </div>
        </div>

        {/* B. KẾT QUẢ & MÔ PHỎNG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2 w-full text-left">B. Mô phỏng miền nghiệm</h3>
            <div ref={containerRef} className="w-full h-[400px] border border-slate-200 rounded-lg overflow-hidden bg-slate-50 touch-none">
              <svg ref={svgRef} className="w-full h-full" style={{ touchAction: 'none' }}></svg>
            </div>
            <p className="text-sm text-slate-500 mt-2">Kéo điểm M để thử nghiệm. Miền màu xanh là miền nghiệm.</p>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">C. Kết quả kiểm tra điểm M</h3>
              <div className="text-xl mb-4">
                Điểm thử <strong className="text-blue-600">M({testPoint.x}; {testPoint.y})</strong>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-lg mb-4">
                Thay x = {testPoint.x}, y = {testPoint.y} vào BPT:<br/>
                {a}({testPoint.x}) + {b}({testPoint.y}) = {a * testPoint.x + b * testPoint.y} <br/>
                So sánh: {a * testPoint.x + b * testPoint.y} {sign} {c} {isTestPointValid ? ' (ĐÚNG)' : ' (SAI)'}
              </div>
              <div className={`p-4 rounded-xl text-lg font-bold text-center ${isTestPointValid ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                {isTestPointValid ? '✓ Điểm M THUỘC miền nghiệm' : '✗ Điểm M KHÔNG THUỘC miền nghiệm'}
              </div>
            </div>

            {/* D. KHÁM PHÁ */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex-1">
              <h3 className="text-lg font-bold text-green-800 mb-2">D. Khám phá</h3>
              <ul className="list-disc pl-5 space-y-2 text-green-700">
                <li>Thử đổi dấu từ <strong className="font-mono">≤</strong> sang <strong className="font-mono">&lt;</strong>. Bạn thấy đường biên thay đổi thế nào? (Nét liền chuyển thành nét đứt).</li>
                <li>Điều gì xảy ra với miền nghiệm khi hệ số <strong className="font-mono">c</strong> tăng lên?</li>
                <li>Di chuyển điểm M qua lại giữa hai nửa mặt phẳng để xem kết quả tính toán cập nhật.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
