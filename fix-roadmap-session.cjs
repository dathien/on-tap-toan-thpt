const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const newInit = `
  const [session, setSession] = useState<LearningSession | null>(() => {
    try {
      const saved = localStorage.getItem('currentLearningPath');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate it's the new schema
        if (parsed && parsed.status && Array.isArray(parsed.units)) {
          return parsed;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  });
`;

code = code.replace(
  /const \[session, setSession\] = useState<LearningSession \| null>\(\(\) => \{[\s\S]*?\}\);/,
  newInit.trim()
);

// Also let's double check if there's any other return null issue. 
// Adding a fallback return just in case to show the setup screen.
const fallbackReturn = `
  // Fallback if status is somehow unrecognized
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 mt-8 text-center">
       <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-200">
          <h2 className="text-xl font-bold mb-4">Lỗi tải lộ trình</h2>
          <p>Dữ liệu lộ trình học bị hỏng hoặc thuộc về phiên bản cũ.</p>
          <button 
            onClick={() => { localStorage.removeItem('currentLearningPath'); window.location.reload(); }}
            className="mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded-xl"
          >
            Tạo lộ trình mới
          </button>
       </div>
    </div>
  );
}
`;

code = code.replace(/return null;\n\}/, fallbackReturn);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
