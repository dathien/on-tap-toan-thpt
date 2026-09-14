const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

if (!code.includes('QuestionEditorModal')) {
    code = code.replace(
        "import { Question, LearningSession, LearningUnit } from '../types';",
        "import { Question, LearningSession, LearningUnit } from '../types';\nimport { QuestionEditorModal } from '../components/QuestionEditorModal';\nimport { Edit } from 'lucide-react';"
    );
    
    code = code.replace(
        "const addSession = useAppStore(state => state.addSession);",
        "const addSession = useAppStore(state => state.addSession);\n  const isTeacherMode = useAppStore(state => state.isTeacherMode);\n  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);\n  const updateQuestion = useAppStore(state => state.updateQuestion);"
    );

    // Replace <h4 className="font-bold text-slate-700">Câu {i + 1}</h4>
    code = code.replaceAll(
        `<h4 className="font-bold text-slate-700">Câu {i + 1}</h4>`,
        `<div className="flex items-center gap-3">
           <h4 className="font-bold text-slate-700">Câu {i + 1}</h4>
           {isTeacherMode && (
             <button onClick={() => setEditingQuestion(q)} className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded">
                <Edit size={12} /> Sửa
             </button>
           )}
         </div>`
    );

    code = code.replace(
        "    </div>\n  );\n}",
        `      {editingQuestion && (
        <QuestionEditorModal
          initialQuestion={editingQuestion}
          onCancel={() => setEditingQuestion(null)}
          onSave={(mode, updatedQ) => {
            updateQuestion(updatedQ.id, updatedQ);
            setEditingQuestion(null);
          }}
        />
      )}
    </div>
  );
}`
    );
    fs.writeFileSync('src/pages/Roadmap.tsx', code);
    console.log("Added Edit to Roadmap");
}
