import React, { useState, useEffect } from 'react';

const TEMPLATES = {
  cubic: {
    type: "VARIATION_TABLE",
    data: {
      xPoints: [
        { type: "infinity", value: "-\\infty" },
        { type: "critical", value: "x_1" },
        { type: "critical", value: "x_2" },
        { type: "infinity", value: "+\\infty" }
      ],
      derivative: {
        intervals: ["+", "-", "+"],
        criticalValues: ["0", "0"]
      },
      function: {
        intervalDirections: ["up", "down", "up"],
        pointValues: [
          { x: "x_1", y: "y_{CĐ}", type: "local_max" },
          { x: "x_2", y: "y_{CT}", type: "local_min" }
        ],
        leftLimit: "-\\infty",
        rightLimit: "+\\infty"
      }
    }
  },
  quartic: {
    type: "VARIATION_TABLE",
    data: {
      xPoints: [
        { type: "infinity", value: "-\\infty" },
        { type: "critical", value: "x_1" },
        { type: "critical", value: "0" },
        { type: "critical", value: "x_2" },
        { type: "infinity", value: "+\\infty" }
      ],
      derivative: {
        intervals: ["-", "+", "-", "+"],
        criticalValues: ["0", "0", "0"]
      },
      function: {
        intervalDirections: ["down", "up", "down", "up"],
        pointValues: [
          { x: "x_1", y: "y_{CT}", type: "local_min" },
          { x: "0", y: "y_{CĐ}", type: "local_max" },
          { x: "x_2", y: "y_{CT}", type: "local_min" }
        ],
        leftLimit: "+\\infty",
        rightLimit: "+\\infty"
      }
    }
  },
  rational: {
    type: "VARIATION_TABLE",
    data: {
      xPoints: [
        { type: "infinity", value: "-\\infty" },
        { type: "discontinuity", value: "x_0" },
        { type: "infinity", value: "+\\infty" }
      ],
      derivative: {
        intervals: ["+", "+"],
        criticalValues: []
      },
      function: {
        intervalDirections: ["up", "up"],
        pointValues: [
          { x: "x_0", y: "+\\infty", type: "left_limit" },
          { x: "x_0", y: "-\\infty", type: "right_limit" }
        ],
        leftLimit: "y_0",
        rightLimit: "y_0"
      }
    }
  },
  discontinuous: {
    type: "VARIATION_TABLE",
    data: {
      xPoints: [
        { type: "infinity", value: "-\\infty" },
        { type: "critical", value: "x_1" },
        { type: "discontinuity", value: "x_0" },
        { type: "infinity", value: "+\\infty" }
      ],
      derivative: {
        intervals: ["+", "-", "-"],
        criticalValues: ["0"]
      },
      function: {
        intervalDirections: ["up", "down", "down"],
        pointValues: [
          { x: "x_1", y: "y_{CĐ}", type: "local_max" },
          { x: "x_0", y: "-\\infty", type: "left_limit" },
          { x: "x_0", y: "+\\infty", type: "right_limit" }
        ],
        leftLimit: "-\\infty",
        rightLimit: "-\\infty"
      }
    }
  }
};

export function VariationTableEditor({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (val: string) => void 
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={() => onChange(JSON.stringify(TEMPLATES.cubic, null, 2))} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm text-slate-700">Mẫu: Bậc ba</button>
        <button type="button" onClick={() => onChange(JSON.stringify(TEMPLATES.quartic, null, 2))} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm text-slate-700">Mẫu: Bậc bốn</button>
        <button type="button" onClick={() => onChange(JSON.stringify(TEMPLATES.rational, null, 2))} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm text-slate-700">Mẫu: Phân thức</button>
        <button type="button" onClick={() => onChange(JSON.stringify(TEMPLATES.discontinuous, null, 2))} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm text-slate-700">Mẫu: Gián đoạn</button>
      </div>
      <div>
         <label className="block text-sm font-medium text-slate-700 mb-1">Dữ liệu cấu hình (JSON)</label>
         <textarea 
           value={value} 
           onChange={e => onChange(e.target.value)} 
           rows={12} 
           className="w-full p-2 font-mono text-sm rounded-xl border border-slate-300" 
           placeholder={`{
  "type": "VARIATION_TABLE",
  "data": { ... }
}`} 
         />
      </div>
    </div>
  );
}
