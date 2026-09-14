import { FunctionGraph } from './FunctionGraph';
import React from 'react';
import { normalizeMathToken } from '../../utils/mathNormalizer';
import { sanitizeStudentContent } from '../../utils/studentSanitizer';

export function Geometry2D({ data }: { data: any }) {
  if (!data) return <div className="text-red-500">Thiếu dữ liệu hình học</div>;

  const { viewBox = "0 0 100 100", polygons = [], segments = [], circles = [], points = [], texts = [] } = data;

  return (
    <div className="w-full max-w-sm mx-auto my-4 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 p-2">
      <svg viewBox={viewBox} className="w-full h-auto drop-shadow-sm font-sans">
        
        {polygons.map((p: any, i: number) => (
          <polygon key={`poly-${i}`} points={p.points} fill={p.fill || "none"} stroke={p.stroke || "#1e293b"} strokeWidth={p.strokeWidth || 1} />
        ))}

        {circles.map((c: any, i: number) => (
          <circle key={`circ-${i}`} cx={c.x} cy={c.y} r={c.r} fill={c.fill || "none"} stroke={c.stroke || "#1e293b"} strokeWidth={c.strokeWidth || 1} />
        ))}

        {segments.map((s: any, i: number) => (
          <line 
            key={`seg-${i}`} 
            x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} 
            stroke={s.stroke || "#1e293b"} 
            strokeWidth={s.strokeWidth || 1.5}
            strokeDasharray={s.dashed ? "4,4" : "none"}
          />
        ))}

        {points.map((pt: any, i: number) => (
          <circle key={`pt-${i}`} cx={pt.x} cy={pt.y} r={pt.r || 2} fill={pt.fill || "#1e293b"} />
        ))}

        {texts.map((t: any, i: number) => (
          <text key={`txt-${i}`} x={t.x} y={t.y} fontSize={t.fontSize || 5} fill={t.fill || "#1e293b"} textAnchor={t.textAnchor || "middle"} dominantBaseline={t.dominantBaseline || "middle"}>
            {sanitizeStudentContent(normalizeMathToken(t.content))}
          </text>
        ))}

      </svg>
    </div>
  );
}

export function Geometry3D({ data }: { data: any }) {
  // We'll use 2D projection via SVG for static Geometry3D representations (as per requirements)
  return <Geometry2D data={data} />;
}

export function CoordinateSystem({ data, type }: { data: any, type: 'OXY' | 'OXYZ' }) {
  // Similar to FunctionGraph, tailored if needed, but we can reuse FunctionGraph logic mostly.
  return <FunctionGraph data={data} />;
}
