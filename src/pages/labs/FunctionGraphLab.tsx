import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, Trash2, RefreshCw } from 'lucide-react';
import * as math from 'mathjs';

export function FunctionGraphLab({ onBack }: { onBack: () => void }) {
  const [inputStr, setInputStr] = useState('x^2 - 3*x + 2');
  const [expr, setExpr] = useState('x^2 - 3*x + 2');
  const [error, setError] = useState('');
  
  const [scale, setScale] = useState(50); // px per unit
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // offset in px
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const handleDraw = () => {
    try {
      const compiled = math.compile(inputStr);
      compiled.evaluate({ x: 1 }); // test
      setExpr(inputStr);
      setError('');
    } catch (e) {
      setError('Biểu thức không hợp lệ. Vui lòng kiểm tra lại.');
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };
  
  const width = 800;
  const height = 600;
  
  const cx = width / 2 + offset.x;
  const cy = height / 2 + offset.y;

  const toSvgX = (x: number) => cx + x * scale;
  const toSvgY = (y: number) => cy - y * scale;
  
  const fromSvgX = (sx: number) => (sx - cx) / scale;

  // Generate path
  let pathD = '';
  try {
    const compiled = math.compile(expr);
    const startX = fromSvgX(0);
    const endX = fromSvgX(width);
    const step = (endX - startX) / 200;
    
    let isFirst = true;
    for (let x = startX; x <= endX; x += step) {
      const y = compiled.evaluate({ x });
      if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
        const sx = toSvgX(x);
        const sy = toSvgY(y);
        // Clip sy to prevent massive SVG numbers breaking render
        if (sy > -height*2 && sy < height*3) {
           if (isFirst) {
             pathD += `M ${sx} ${sy} `;
             isFirst = false;
           } else {
             pathD += `L ${sx} ${sy} `;
           }
        } else {
           isFirst = true; // disconnect line if it goes out of bounds wildly (like 1/x)
        }
      } else {
        isFirst = true;
      }
    }
  } catch(e) {}

  // Grid lines
  const gridLines = [];
  const startGridX = Math.floor(fromSvgX(0));
  const endGridX = Math.ceil(fromSvgX(width));
  const startGridY = Math.floor((cy - height) / scale);
  const endGridY = Math.ceil(cy / scale);

  for (let x = startGridX; x <= endGridX; x++) {
    gridLines.push(<line key={`gx_${x}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={height} stroke="#e2e8f0" strokeWidth="1" />);
  }
  for (let y = startGridY; y <= endGridY; y++) {
    gridLines.push(<line key={`gy_${y}`} x1={0} y1={toSvgY(y)} x2={width} y2={toSvgY(y)} stroke="#e2e8f0" strokeWidth="1" />);
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center gap-4 flex-wrap">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shrink-0">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 shrink-0">Đồ thị hàm số</h2>
        
        <div className="flex-1 flex items-center gap-2 min-w-[200px]">
          <span className="font-semibold text-slate-700">f(x) =</span>
          <input 
            type="text" 
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={inputStr}
            onChange={e => setInputStr(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleDraw()}
            placeholder="VD: x^2 - 3*x + 2"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={handleDraw} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
            VẼ ĐỒ THỊ
          </button>
          <button onClick={() => setInputStr('')} className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg" title="Xóa">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      
      {error && <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">{error}</div>}
      
      <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-4 bg-slate-50 text-sm">
        <span className="text-slate-500 font-medium">Ví dụ nhanh:</span>
        {['x^2', 'x^3 - 3*x + 2', '1/x', 'sin(x)', 'cos(x)'].map(ex => (
          <button 
            key={ex} 
            onClick={() => { setInputStr(ex); setExpr(ex); setError(''); }}
            className="text-indigo-600 hover:underline"
          >
            {ex}
          </button>
        ))}
        
        <div className="ml-auto flex items-center gap-2">
           <button onClick={() => setScale(s => s * 1.2)} className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50" title="Phóng to"><ZoomIn size={16}/></button>
           <button onClick={() => setScale(s => s / 1.2)} className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50" title="Thu nhỏ"><ZoomOut size={16}/></button>
           <button onClick={() => { setScale(50); setOffset({x:0, y:0}); }} className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50" title="Đặt lại"><RefreshCw size={16}/></button>
        </div>
      </div>

      <div className="flex-1 relative bg-[#F8FAFC] overflow-hidden min-h-[400px] touch-none">
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid slice"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="cursor-move"
        >
          {/* Grid */}
          <g className="grid-lines">{gridLines}</g>
          
          {/* Axes */}
          <line x1={0} y1={cy} x2={width} y2={cy} stroke="#64748b" strokeWidth="2" />
          <line x1={cx} y1={0} x2={cx} y2={height} stroke="#64748b" strokeWidth="2" />
          
          {/* Ticks and labels */}
          {gridLines.map((_, i) => {
             // Let's just draw some numbers
             return null;
          })}
          
          {/* Path */}
          {pathD && <path d={pathD} fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>
    </div>
  );
}
