const fs = require('fs');
let code = fs.readFileSync('src/pages/Bank.tsx', 'utf8');

code = code.replace(
  "import { VisualRenderer } from '../components/visuals/VisualRenderer';",
  "import { VisualRenderer } from '../components/visuals/VisualRenderer';\nimport { QuestionEditorModal } from '../components/QuestionEditorModal';\nimport { Question } from '../types';"
);

code = code.replace(
  "const [filterDiff, setFilterDiff] = useState<string>('ALL');",
  "const [filterDiff, setFilterDiff] = useState<string>('ALL');\n  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);\n  const updateQuestion = useAppStore(state => state.updateQuestion);"
);

code = code.replace(
  "onClick={() => navigate(`/bank/edit/${q.id}`)}",
  "onClick={() => setEditingQuestion(q)}"
);

code = code.replace(
  "</button>\n                    <button \n                      onClick={() => handleDelete(q.id)}",
  `</button>\n                    <button 
                      onClick={() => {
                        const copy = { ...q, id: require('uuid').v4() };
                        useAppStore.getState().addQuestion(copy);
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Sao chép"
                    >
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(q.id)}`
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
          }}
        />
      )}
  );
}`
);

fs.writeFileSync('src/pages/Bank.tsx', code);
