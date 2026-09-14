const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const curriculum = `
const mathCurriculum = {
  10: [
    "Mệnh đề và tập hợp",
    "Bất phương trình và hệ bất phương trình",
    "Hàm số và đồ thị",
    "Hệ thức lượng trong tam giác",
    "Vectơ",
    "Thống kê",
    "Xác suất"
  ],
  11: [
    "Hàm số lượng giác và phương trình lượng giác",
    "Dãy số - Cấp số cộng - Cấp số nhân",
    "Giới hạn",
    "Hàm số liên tục",
    "Đạo hàm",
    "Quan hệ song song trong không gian",
    "Quan hệ vuông góc trong không gian",
    "Xác suất"
  ],
  12: [
    "Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số",
    "Vectơ và hệ tọa độ trong không gian",
    "Các số đặc trưng đo mức độ phân tán",
    "Nguyên hàm và tích phân",
    "Phương pháp tọa độ trong không gian",
    "Xác suất có điều kiện"
  ]
};
`;

if (!code.includes('mathCurriculum')) {
  code = code.replace(
    "const CARDS = [",
    curriculum + "\nconst CARDS = ["
  );
}

// Add state to Roadmap component
const states = `
  const [selectedGrade, setSelectedGrade] = useState<number>(12);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [target, setTarget] = useState<string>('Điểm 8+');
`;

code = code.replace(
  "  const { currentGrade, questions, exams, attempts } = useAppStore();",
  "  const { currentGrade, questions, exams, attempts } = useAppStore();\n" + states
);

// Replace the 'start' render module
const startModule = `
      case 'start':
        const availableTopics = (mathCurriculum as any)[selectedGrade] || [];
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">🚀 Bắt đầu lộ trình</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Khối lớp</label>
                <select 
                  value={selectedGrade}
                  onChange={e => {
                    setSelectedGrade(Number(e.target.value));
                    setSelectedTopic('');
                  }}
                  className="w-full p-3 rounded-xl border border-slate-300"
                >
                  <option value={10}>Khối 10</option>
                  <option value={11}>Khối 11</option>
                  <option value={12}>Khối 12</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Chủ đề</label>
                <select 
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300"
                >
                  <option value="">[Chọn chủ đề]</option>
                  {availableTopics.map((topic: string) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mục tiêu</label>
                <select 
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300"
                >
                  <option value="Điểm 7+">Điểm 7+</option>
                  <option value="Điểm 8+">Điểm 8+</option>
                  <option value="Điểm 9+">Điểm 9+</option>
                </select>
              </div>
              <button 
                disabled={!selectedTopic}
                className={\`w-full py-3 font-bold rounded-xl mt-4 transition-colors \${!selectedTopic ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}\`}
              >
                {!selectedTopic ? 'Vui lòng chọn chủ đề phù hợp với khối lớp' : 'BẮT ĐẦU HỌC'}
              </button>
            </div>
          </div>
        );
`;

const oldStartModuleRegex = /case 'start':[\s\S]*?(?=case 'warmup':)/;
code = code.replace(oldStartModuleRegex, startModule);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
