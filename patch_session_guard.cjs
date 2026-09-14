const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const regex = /\/\/ ---------------------------------------------------------------------------\n\s*\/\/ RENDER: DIAGNOSTIC/;

const replacement = `if (!session) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-12 mt-8 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-200">
          <h2 className="text-xl font-bold mb-4">Lỗi tải lộ trình</h2>
          <p>Không tìm thấy dữ liệu lộ trình đang học.</p>
          <button 
            onClick={() => setView('HOME')}
            className="mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded-xl"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: DIAGNOSTIC`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched session guard");
