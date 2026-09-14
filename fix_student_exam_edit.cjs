const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');

if (!code.includes('isTeacherMode')) {
    code = code.replace(
        "const addAttempt = useAppStore((state) => state.addAttempt);",
        "const addAttempt = useAppStore((state) => state.addAttempt);\n  const isTeacherMode = useAppStore((state) => state.isTeacherMode);\n  const [editingQuestion, setEditingQuestion] = React.useState<Question | null>(null);\n  const updateQuestion = useAppStore((state) => state.updateQuestion);"
    );

    code = code.replace(
        "import { Edit, Save, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';",
        "import { Edit, Save, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';" // In case it's not imported
    );
    if (!code.includes('Edit')) {
        code = code.replace(
            "import { AlertTriangle } from 'lucide-react';",
            "import { AlertTriangle, Edit } from 'lucide-react';"
        );
    }
    
    if (!code.includes('QuestionEditorModal')) {
        code = code.replace(
            "import { validateQuestionVisual } from '../utils/visualValidator';",
            "import { validateQuestionVisual } from '../utils/visualValidator';\nimport { QuestionEditorModal } from '../components/QuestionEditorModal';"
        );
    }

    code = code.replace(
        `<span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {currentQuestion.question_type === 'MCQ_SINGLE' ? 'Nhiều phương án' : 
               currentQuestion.question_type === 'TRUE_FALSE_GROUP' ? 'Đúng/Sai' : 'Trả lời ngắn'}
            </span>`,
        `<div className="flex gap-2">
              {isTeacherMode && (
                <button 
                  onClick={() => setEditingQuestion(currentQuestion)}
                  className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100"
                >
                  <Edit size={14} /> Sửa câu này
                </button>
              )}
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {currentQuestion.question_type === 'MCQ_SINGLE' ? 'Nhiều phương án' : 
                 currentQuestion.question_type === 'TRUE_FALSE_GROUP' ? 'Đúng/Sai' : 'Trả lời ngắn'}
              </span>
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
    fs.writeFileSync('src/pages/StudentExam.tsx', code);
    console.log("Added Edit to StudentExam");
}
