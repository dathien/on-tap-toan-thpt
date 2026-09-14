const fs = require('fs');
let code = fs.readFileSync('src/pages/CreateExam.tsx', 'utf8');

// 1. Add imports
code = code.replace(
    "import { Settings2, BookOpen, Database, FileText, PenTool, Loader2 , CheckCircle2, X } from 'lucide-react';",
    "import { Settings2, BookOpen, Database, FileText, PenTool, Loader2 , CheckCircle2, X } from 'lucide-react';\nimport { QuestionBankSelector } from '../components/QuestionBankSelector';\nimport { ManualQuestionForm } from '../components/ManualQuestionForm';\nimport { Question } from '../types';"
);

// 2. Add states
const stateInjection = `
  const [draftBankQuestions, setDraftBankQuestions] = useState<Question[]>([]);
  const [draftManualQuestions, setDraftManualQuestions] = useState<Question[]>([]);
  const [targetCount, setTargetCount] = useState(10);
  const [saveToBank, setSaveToBank] = useState(false);
`;
code = code.replace(
    "const fileInputRef = React.useRef<HTMLInputElement>(null);",
    "const fileInputRef = React.useRef<HTMLInputElement>(null);" + stateInjection
);

// 3. Render UI inside form
const sourceUIRegex = /<\/div>\s*<\/div>\s*\{source === 'WORD' && file && \(/;
const sourceUIReplacement = `            </div>
          </div>
          
          {source === 'BANK' && (
             <QuestionBankSelector 
                selectedQuestions={draftBankQuestions} 
                onChange={setDraftBankQuestions} 
                targetCount={targetCount}
             />
          )}

          {source === 'MANUAL' && (
             <>
               <ManualQuestionForm 
                  questions={draftManualQuestions} 
                  onChange={setDraftManualQuestions} 
               />
               <label className="flex items-center gap-3 mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" checked={saveToBank} onChange={e => setSaveToBank(e.target.checked)} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
                  <div className="font-bold text-slate-700">Lưu các câu hỏi này vào Ngân hàng gốc</div>
               </label>
             </>
          )}

          {source === 'WORD' && file && (`;
code = code.replace(sourceUIRegex, sourceUIReplacement);

// 4. Update targetCount UI next to duration
const advancedConfigRegex = /<div className="h-px bg-slate-100" \/>\s*\{\/\* Thiết lập nâng cao \*\/\}/;
const countConfigReplacement = `              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng câu (dự kiến)</label>
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={targetCount}
                  onChange={e => setTargetCount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />
          {/* Thiết lập nâng cao */}`;
code = code.replace(advancedConfigRegex, countConfigReplacement);

// 5. Update handleCreate
const handleCreateRegex = /\} else \{\s*addExam\(newExam\);\s*navigate\(\`\/exam-preview\/\$\{newExam.id\}\`\);\s*\}/;
const handleCreateReplacement = `    } else if (source === 'BANK') {
      if (draftBankQuestions.length === 0) {
        alert("Vui lòng chọn ít nhất 1 câu hỏi từ Ngân hàng!");
        return;
      }
      addExam(newExam);
      addExamVersion({
        id: uuidv4(),
        examConfigId: newExam.id,
        questions: draftBankQuestions
      });
      navigate(\`/exam-preview/\${newExam.id}\`);
    } else if (source === 'MANUAL') {
      if (draftManualQuestions.length === 0) {
        alert("Vui lòng nhập ít nhất 1 câu hỏi!");
        return;
      }
      
      if (saveToBank) {
         const store = useAppStore.getState();
         draftManualQuestions.forEach(q => store.addQuestion(q));
      }
      
      addExam(newExam);
      addExamVersion({
        id: uuidv4(),
        examConfigId: newExam.id,
        questions: draftManualQuestions
      });
      navigate(\`/exam-preview/\${newExam.id}\`);
    }`;
code = code.replace(handleCreateRegex, handleCreateReplacement);

fs.writeFileSync('src/pages/CreateExam.tsx', code);
console.log("Patched CreateExam");
