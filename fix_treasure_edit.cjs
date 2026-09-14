const fs = require('fs');
let code = fs.readFileSync('src/pages/TreasureHunt.tsx', 'utf8');

if (!code.includes('QuestionEditorModal')) {
    code = code.replace(
        "import { MathText } from '../components/MathText';",
        "import { MathText } from '../components/MathText';\nimport { QuestionEditorModal } from '../components/QuestionEditorModal';\nimport { Edit } from 'lucide-react';"
    );
    
    code = code.replace(
        "const [playedQuestionIds, setPlayedQuestionIds] = useState<Set<string>>(new Set());",
        "const [playedQuestionIds, setPlayedQuestionIds] = useState<Set<string>>(new Set());\n  const isTeacherMode = useAppStore(state => state.isTeacherMode);\n  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);\n  const updateQuestion = useAppStore(state => state.updateQuestion);"
    );

    code = code.replace(
        `<div className="question-card bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="question-content question-text text-lg text-slate-800 mb-6">`,
        `<div className="question-card bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
          {isTeacherMode && (
              <button 
                onClick={() => setEditingQuestion(q)}
                className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100"
              >
                <Edit size={14} /> Sửa câu này
              </button>
          )}
          <div className="question-content question-text text-lg text-slate-800 mb-6">`
    );

    code = code.replace(
        "    </div>\n  );\n}",
        `    </div>
    {editingQuestion && (
        <QuestionEditorModal
          initialQuestion={editingQuestion}
          onCancel={() => setEditingQuestion(null)}
          onSave={(mode, updatedQ) => {
            updateQuestion(updatedQ.id, updatedQ);
            setEditingQuestion(null);
            setLevelQuestions(prev => prev.map(pq => pq.id === updatedQ.id ? updatedQ : pq));
          }}
        />
      )}
    </>
  );
}`
    );
    code = code.replace(
        "return (\n    <div className=\"min-h-[calc(100vh-8rem)]",
        "return (\n    <>\n    <div className=\"min-h-[calc(100vh-8rem)]"
    );

    fs.writeFileSync('src/pages/TreasureHunt.tsx', code);
    console.log("Added Edit to TreasureHunt");
}
