const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamList.tsx', 'utf8');

code = code.replace(
  "import { FileText, Trash2, ExternalLink, Clock, Play } from 'lucide-react';",
  "import { FileText, Trash2, ExternalLink, Clock, Play, Edit } from 'lucide-react';"
);

code = code.replace(
  "<button \n                    onClick={() => setDeleteConfirm(exam.id)}",
  `<button 
                    onClick={() => navigate('/exam-editor/' + exam.id)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(exam.id)}`
);

fs.writeFileSync('src/pages/ExamList.tsx', code);
