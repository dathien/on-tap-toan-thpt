const fs = require('fs');
let code = fs.readFileSync('src/pages/CreateExam.tsx', 'utf8');

const importParser = `import { parseDocx, extractQuestionsFromText } from '../utils/docxParser';\nimport { Loader2 } from 'lucide-react';\n`;

if (!code.includes("parseDocx")) {
    code = code.replace(
        "import { Settings2, BookOpen, Database, FileText, PenTool } from 'lucide-react';",
        "import { Settings2, BookOpen, Database, FileText, PenTool, Loader2 } from 'lucide-react';\nimport { parseDocx, extractQuestionsFromText } from '../utils/docxParser';"
    );
}

// Add state for file
const stateToAdd = `
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const addExamVersion = useAppStore(state => state.addExamVersion);
`;

code = code.replace(
    "const [source, setSource] = useState<'BANK' | 'MANUAL' | 'WORD'>('BANK');",
    "const [source, setSource] = useState<'BANK' | 'MANUAL' | 'WORD'>('BANK');" + stateToAdd
);

// handleCreate
const handleCreateReplacement = `
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên đề!");
      return;
    }
    
    if (source === 'WORD' && !file) {
      alert("Vui lòng chọn file Word (.docx)!");
      return;
    }

    const newExam: ExamConfig = {
      id: uuidv4(),
      name: name.trim(),
      type: type,
      durationMinutes: duration,
      parts: type === 'THUONG_XUYEN' ? ['I'] : ['I', 'II', 'III'],
      shuffleQuestions,
      shuffleOptions,
      showAnswersAfter: false,
      grade: grade,
    };
    
    if (source === 'WORD') {
      try {
        setIsParsing(true);
        setParseStatus('Đang đọc file...');
        const text = await parseDocx(file!);
        setParseStatus('Đang nhận diện câu hỏi...');
        const questions = extractQuestionsFromText(text, grade);
        
        if (questions.length === 0) {
            alert("Chưa nhận diện được câu hỏi trong file.");
            setIsParsing(false);
            return;
        }

        addExam(newExam);
        addExamVersion({
            id: uuidv4(),
            examConfigId: newExam.id,
            questions: questions
        });
        
        setIsParsing(false);
        navigate(\`/exam-editor/\${newExam.id}\`);
      } catch (err: any) {
        setIsParsing(false);
        alert("Không thể đọc file Word này: " + err.message);
      }
    } else {
      addExam(newExam);
      navigate(\`/exam-preview/\${newExam.id}\`);
    }
  };
`;

code = code.replace(
    /const handleCreate = \(e: React\.FormEvent\) => \{[\s\S]*?navigate\(`\/exam-preview\/\$\{newExam\.id\}`\);\n    \}\n  \};/,
    handleCreateReplacement
);


// Replace the WORD radio label to trigger file input and show status
const wordLabel = `<label className={\`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center text-center gap-3 transition-all \${source === 'WORD' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-600'}\`}>
                <input 
                  type="radio" 
                  name="source" 
                  value="WORD" 
                  checked={source === 'WORD'} 
                  onChange={() => setSource('WORD')}
                  className="sr-only" 
                />
                <FileText size={28} className={source === 'WORD' ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="font-bold">Tải Word .docx</span>
                <span className="text-xs text-slate-500">Nhận dạng đề từ file Word</span>
              </label>`;

const newWordLabel = `<label 
                onClick={() => {
                  setSource('WORD');
                  if (!file) fileInputRef.current?.click();
                }}
                className={\`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center text-center gap-3 transition-all \${source === 'WORD' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-600'}\`}
              >
                <input 
                  type="radio" 
                  name="source" 
                  value="WORD" 
                  checked={source === 'WORD'} 
                  onChange={() => setSource('WORD')}
                  className="sr-only" 
                />
                <FileText size={28} className={source === 'WORD' ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="font-bold">Tải Word .docx</span>
                <span className="text-xs text-slate-500">Nhận dạng đề từ file Word</span>
              </label>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                accept=".docx"
                className="hidden"
                onChange={(e) => {
                   const selected = e.target.files?.[0];
                   if (selected && selected.name.endsWith('.docx')) {
                      setFile(selected);
                   } else if (selected) {
                      alert('Vui lòng chọn file định dạng .docx hợp lệ.');
                      setFile(null);
                   }
                }}
              />`;

code = code.replace(wordLabel, newWordLabel);

const statusUI = `
          {source === 'WORD' && file && (
            <div className="pl-10">
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <FileText className="text-indigo-600" />
                   <div>
                     <p className="font-bold text-slate-800">✓ {file.name}</p>
                     <p className="text-sm text-slate-500">
                        {isParsing ? parseStatus : \`Đã tải lên • \${(file.size / 1024).toFixed(1)} KB\`}
                     </p>
                   </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                  disabled={isParsing}
                >
                  ✕ Hủy
                </button>
              </div>
            </div>
          )}
`;

code = code.replace("</div>\n          </div>\n        </div>", "</div>\n" + statusUI + "          </div>\n        </div>");

const buttonUI = `<button
            type="submit"
            className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <BookOpen size={20} />
            TẠO ĐỀ VÀ XEM TRƯỚC
          </button>`;

const newButtonUI = `<button
            type="submit"
            disabled={isParsing || (source === 'WORD' && !file)}
            className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors shadow-sm flex items-center gap-2"
          >
            {isParsing ? <Loader2 size={20} className="animate-spin" /> : <BookOpen size={20} />}
            {isParsing ? 'ĐANG TẠO ĐỀ...' : 'TẠO ĐỀ VÀ XEM TRƯỚC'}
          </button>`;

code = code.replace(buttonUI, newButtonUI);

fs.writeFileSync('src/pages/CreateExam.tsx', code);
console.log("Patched CreateExam");
