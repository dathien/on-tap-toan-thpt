import React from 'react';
import { normalizeMathToken } from '../../utils/mathNormalizer';
import { sanitizeStudentContent } from '../../utils/studentSanitizer';

export function FunctionGraph({ data }: { data: any }) {
  if (!data) return <div className="text-red-500">Thiếu dữ liệu đồ thị</div>;

  // Assuming data provides viewBox and paths/points
  const { viewBox = "-5 -5 10 10", paths = [], points = [], asymptotes = [], labels = [] } = data;

  const [minX, minY, width, height] = viewBox.split(' ').map(Number);
  const maxX = minX + width;
  const maxY = minY + height;

  return (
    <div className="w-full max-w-md mx-auto my-4 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 p-2">
      <svg viewBox={viewBox} className="w-full h-auto drop-shadow-sm font-sans" style={{ vectorEffect: 'non-scaling-stroke' }}>
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#64748b" />
          </marker>
        </defs>

        {/* Grid lines (optional) */}
        {/* Axes */}
        <line x1={minX} y1="0" x2={maxX} y2="0" stroke="#64748b" strokeWidth={width/100} markerEnd="url(#arrow)" />
        <line x1="0" y1={minY} x2="0" y2={maxY} stroke="#64748b" strokeWidth={width/100} markerEnd="url(#arrow)" />

        {/* Labels for axes */}
        <text x={maxX - 0.5} y="-0.5" fontSize={width/20} fill="#64748b">x</text>
        <text x="0.3" y={maxY - 0.5} fontSize={width/20} fill="#64748b">y</text>
        <text x="-0.4" y="-0.4" fontSize={width/20} fill="#64748b">O</text>

        {/* Asymptotes */}
        {asymptotes.map((line: any, i: number) => (
          <line 
            key={`asym-${i}`} 
            x1={line.x1} y1={line.y1} 
            x2={line.x2} y2={line.y2} 
            stroke="#94a3b8" 
            strokeWidth={width/200} 
            strokeDasharray={`${width/50},${width/50}`} 
          />
        ))}

        {/* Function Paths */}
        {paths.map((p: any, i: number) => (
          <path 
            key={`path-${i}`} 
            d={p.d} 
            fill={p.fill || "none"} 
            stroke={p.stroke || "#4f46e5"} 
            strokeWidth={p.strokeWidth || width/100} 
          />
        ))}

        {/* Points & Coordinates */}
        {points.map((pt: any, i: number) => (
          <g key={`pt-${i}`}>
            <circle cx={pt.x} cy={pt.y} r={width/60} fill="#1e293b" />
            {pt.dashedToAxis && (
              <>
                <line x1={pt.x} y1={pt.y} x2={pt.x} y2="0" stroke="#94a3b8" strokeWidth={width/300} strokeDasharray={`${width/100},${width/100}`} />
                <line x1={pt.x} y1={pt.y} x2="0" y2={pt.y} stroke="#94a3b8" strokeWidth={width/300} strokeDasharray={`${width/100},${width/100}`} />
              </>
            )}
            {pt.labelX && <text x={pt.x} y={pt.y > 0 ? -0.3 : 0.6} fontSize={width/25} fill="#1e293b" textAnchor="middle">{sanitizeStudentContent(normalizeMathToken(pt.labelX))}</text>}
            {pt.labelY && <text x={pt.x > 0 ? -0.3 : 0.3} y={pt.y} fontSize={width/25} fill="#1e293b" textAnchor={pt.x > 0 ? "end" : "start"} dominantBaseline="middle">{sanitizeStudentContent(normalizeMathToken(pt.labelY))}</text>}
          </g>
        ))}

        {/* Custom Text Labels */}
        {labels.map((lbl: any, i: number) => (
          <text key={`lbl-${i}`} x={lbl.x} y={lbl.y} fontSize={lbl.fontSize || width/25} fill={lbl.fill || "#1e293b"} textAnchor="middle">
            {sanitizeStudentContent(normalizeMathToken(lbl.text))}
          </text>
        ))}
      </svg>
    </div>
  );
}
