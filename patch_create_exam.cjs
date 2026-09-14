const fs = require('fs');
let code = fs.readFileSync('src/pages/CreateExam.tsx', 'utf8');

// 1. Add CheckCircle2 and X to imports
code = code.replace(/import \{ Settings2([^}]*)\} from 'lucide-react';/, "import { Settings2$1, CheckCircle2, X } from 'lucide-react';");

// 2. Add the file display UI
const regex = /<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<div className="bg-slate-50 border-t border-slate-200/;
const replacement = `            </div>
          </div>
          
          {source === 'WORD' && file && (
            <div className="mt-4 p-4 border border-indigo-200 bg-indigo-50 rounded-xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                 </div>
                 <div>
                    <div className="font-bold text-slate-800">{file.name}</div>
                    <div className="text-sm text-slate-500">
                      {Math.round(file.size / 1024)} KB • {isParsing ? parseStatus : 'Đã tải lên'}
                    </div>
                 </div>
               </div>
               <button 
                  type="button" 
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="text-slate-400 hover:text-red-500 transition-colors"
               >
                 <X size={20} />
               </button>
            </div>
          )}
          
        </div>

        <div className="bg-slate-50 border-t border-slate-200`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/CreateExam.tsx', code);
console.log("Patched file upload UI");
