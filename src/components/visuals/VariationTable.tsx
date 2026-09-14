import React from 'react';
import { MathText } from '../MathText';
import { normalizeMathToken } from '../../utils/mathNormalizer';

const safeText = (value: any, fallback = "") => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return fallback;
  }
  return normalizeMathToken(String(value));
};

export function validateVariationTable(data: any) {
  if (!data) return false;
  if (!data.xPoints || !data.derivative || !data.function) return false;
  
  // Basic structural checks
  if (!Array.isArray(data.xPoints)) return false;
  if (!Array.isArray(data.derivative.intervals)) return false;
  if (!Array.isArray(data.function.intervalDirections)) return false;
  
  return true;
}

export function VariationTable({ data }: { data: any }) {
  const isStudentView = typeof window !== 'undefined' && (window.location.pathname.includes('/exam') || window.location.pathname.includes('/result'));
  if (!validateVariationTable(data)) {
    if (isStudentView) return null;
    return null;
  }

  const { xPoints, derivative, function: func } = data;
  const N = xPoints.length;
  if (N < 2) return <div className="text-slate-500 text-sm">Dữ liệu không đủ để vẽ bảng</div>;
  
  const cols = 2 * N - 1;

  const renderArrow = (dir: string, i: number) => {
    if (dir === 'up') {
      return (
        <svg className="w-full h-full absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          <defs>
            <marker id={"arrow-up-" + i} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#1e293b" />
            </marker>
          </defs>
          <line x1="15%" y1="80%" x2="85%" y2="20%" stroke="#1e293b" strokeWidth="1.5" markerEnd={"url(#arrow-up-" + i + ")"} />
        </svg>
      );
    }
    if (dir === 'down') {
      return (
        <svg className="w-full h-full absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          <defs>
            <marker id={"arrow-down-" + i} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#1e293b" />
            </marker>
          </defs>
          <line x1="15%" y1="20%" x2="85%" y2="80%" stroke="#1e293b" strokeWidth="1.5" markerEnd={"url(#arrow-down-" + i + ")"} />
        </svg>
      );
    }
    return null;
  };

  const getAlignment = (i: number) => {
    if (xPoints[i]?.type === 'discontinuity') return 'items-center';
    
    const pValObj = func.pointValues?.find((p: any) => p.x === xPoints[i].value);
    if (pValObj?.type === 'local_max') return 'items-start pt-2';
    if (pValObj?.type === 'local_min') return 'items-end pb-2';
    if (pValObj?.type === 'inflection') return 'items-center';

    if (i === 0) {
      return func.intervalDirections?.[0] === 'up' ? 'items-end pb-2' : 'items-start pt-2';
    }
    if (i === N - 1) {
      return func.intervalDirections?.[N - 2] === 'up' ? 'items-start pt-2' : 'items-end pb-2';
    }

    const prevDir = func.intervalDirections?.[i - 1];
    const nextDir = func.intervalDirections?.[i];
    if (prevDir === 'up' && nextDir === 'down') return 'items-start pt-2';
    if (prevDir === 'down' && nextDir === 'up') return 'items-end pb-2';
    return 'items-center';
  };

  const getPointValue = (i: number) => {
    if (i === 0) return safeText(func.leftLimit);
    if (i === N - 1) return safeText(func.rightLimit);
    const pValObj = func.pointValues?.find((p: any) => p.x === xPoints[i].value && p.type !== 'left_limit' && p.type !== 'right_limit');
    return safeText(pValObj?.y);
  };

  let criticalCounter = 0;

  return (
    <div className="variation-table-wrapper w-full overflow-x-auto my-4 pb-2 flex justify-center">
      <div className="variation-table border-2 border-slate-800 bg-white inline-block text-slate-800">
        
        {/* Row x */}
        <div className="flex border-b-2 border-slate-800">
          <div className="w-12 md:w-16 border-r-2 border-slate-800 p-2 font-bold flex items-center justify-center shrink-0">
            <MathText className="math-token" text="$x$" />
          </div>
          <div 
            className="flex-1 grid px-4 py-2" 
            style={{ gridTemplateColumns: "repeat(" + cols + ", minmax(min-content, 1fr))" }}
          >
            {Array.from({ length: cols }).map((_, colIndex) => {
              const isPoint = colIndex % 2 === 0;
              const pointIndex = colIndex / 2;
              
              if (isPoint) {
                 const textValue = safeText(xPoints[pointIndex]?.value);
                 return <div key={"x-" + colIndex} className="text-center font-medium flex items-center justify-center">{textValue ? <MathText className="math-token" text={"$" + textValue + "$"} /> : null}</div>
              }
              return <div key={"x-space-" + colIndex}></div>;
            })}
          </div>
        </div>

        {/* Row y' */}
        <div className="flex border-b-2 border-slate-800">
          <div className="w-12 md:w-16 border-r-2 border-slate-800 p-2 font-bold flex items-center justify-center shrink-0">
            <MathText className="math-token" text="$y'$" />
          </div>
          <div 
            className="flex-1 grid px-4 py-2" 
            style={{ gridTemplateColumns: "repeat(" + cols + ", minmax(min-content, 1fr))" }}
          >
            {Array.from({ length: cols }).map((_, colIndex) => {
              const isPoint = colIndex % 2 === 0;
              const pointIndex = colIndex / 2;
              const intervalIndex = Math.floor(colIndex / 2);
              
              if (isPoint) {
                 const pt = xPoints[pointIndex];
                 if (pt?.type === 'discontinuity') {
                   return (
                     <div key={"yp-" + colIndex} className="flex justify-center h-full">
                       <div className="border-l border-r border-slate-800 w-1 mx-[-2px] h-6"></div>
                     </div>
                   );
                 }
                 if (pt?.type === 'infinity') {
                   return <div key={"yp-" + colIndex}></div>;
                 }
                 
                 const dpVal = derivative.pointValues?.find((p: any) => p.x === pt.value);
                 const cVal = dpVal ? safeText(dpVal.value) : (pt?.type === 'critical' ? safeText(derivative.criticalValues?.[criticalCounter++]) : "");
                 return <div key={"yp-" + colIndex} className="text-center font-medium flex items-center justify-center">{cVal ? <MathText className="math-token" text={"$" + cVal + "$"} /> : null}</div>
              } else {
                 const intervalVal = safeText(derivative.intervals?.[intervalIndex]);
                 return <div key={"yp-int-" + colIndex} className="text-center font-bold flex items-center justify-center">{intervalVal ? <MathText className="math-token" text={"$" + intervalVal + "$"} /> : null}</div>;
              }
            })}
          </div>
        </div>

        {/* Row y */}
        <div className="flex min-h-[100px]">
          <div className="w-12 md:w-16 border-r-2 border-slate-800 p-2 font-bold flex items-center justify-center shrink-0">
            <MathText className="math-token" text="$y$" />
          </div>
          <div 
            className="flex-1 grid px-4" 
            style={{ gridTemplateColumns: "repeat(" + cols + ", minmax(min-content, 1fr))" }}
          >
             {Array.from({ length: cols }).map((_, colIndex) => {
              const isPoint = colIndex % 2 === 0;
              const pointIndex = colIndex / 2;
              const intervalIndex = Math.floor(colIndex / 2);
              
              if (isPoint) {
                 const pt = xPoints[pointIndex];
                 if (pt?.type === 'discontinuity') {
                   const leftLimObj = func.pointValues?.find((p: any) => p.x === pt.value && p.type === 'left_limit');
                   const rightLimObj = func.pointValues?.find((p: any) => p.x === pt.value && p.type === 'right_limit');
                   
                   const leftDir = func.intervalDirections?.[pointIndex - 1];
                   const rightDir = func.intervalDirections?.[pointIndex];
                   
                   const leftClass = leftDir === 'up' ? 'top-2' : 'bottom-2';
                   const rightClass = rightDir === 'up' ? 'bottom-2' : 'top-2';
                   
                   const leftText = safeText(leftLimObj?.y);
                   const rightText = safeText(rightLimObj?.y);

                   return (
                     <div key={"y-" + colIndex} className="flex justify-center h-full w-full relative min-w-[40px]">
                       {leftLimObj && leftText && (
                         <div className={`absolute ${leftClass} right-1/2 pr-1 md:pr-2 whitespace-nowrap`}>
                           <MathText className="math-token" text={"$" + leftText + "$"} />
                         </div>
                       )}
                       {rightLimObj && rightText && (
                         <div className={`absolute ${rightClass} left-1/2 pl-1 md:pl-2 whitespace-nowrap`}>
                           <MathText className="math-token" text={"$" + rightText + "$"} />
                         </div>
                       )}
                       <div className="border-l border-r border-slate-800 w-1 mx-[-2px] h-full absolute left-1/2 -translate-x-1/2"></div>
                     </div>
                   );
                 }
                 
                 const yVal = getPointValue(pointIndex);
                 const alignment = getAlignment(pointIndex);
                 return (
                   <div key={"y-" + colIndex} className={`flex justify-center w-full ${alignment} font-medium`}>
                     {yVal ? <MathText className="math-token" text={"$" + yVal + "$"} /> : null}
                   </div>
                 );
              } else {
                 const dir = func.intervalDirections?.[intervalIndex];
                 return (
                   <div key={"y-int-" + colIndex} className="relative w-full h-full flex items-center justify-center min-w-[30px]">
                     {renderArrow(dir, intervalIndex)}
                   </div>
                 );
              }
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
