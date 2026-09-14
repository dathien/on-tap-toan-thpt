const fs = require('fs');
let code = fs.readFileSync('src/pages/CreateExam.tsx', 'utf8');

// replace everything from {/* Thông tin chung */} to {/* Thiết lập nâng cao */}
const regex = /\{\/\* Thông tin chung \*\/\}[\s\S]*?\{\/\* Thiết lập nâng cao \*\/\}/;

const replacement = `
          {/* Thông tin chung */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">1</span>
              Thông tin chung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-10">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Tên đề</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ví dụ: Đề kiểm tra 15 phút Chương 1"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Khối lớp</label>
                <select 
                  value={grade}
                  onChange={e => setGrade(Number(e.target.value) as Grade)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value={10}>Khối 10</option>
                  <option value={11}>Khối 11</option>
                  <option value={12}>Khối 12</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Loại bài</label>
                <select 
                  value={type}
                  onChange={e => {
                    const t = e.target.value as any;
                    setType(t);
                    if (t === 'THUONG_XUYEN') setDuration(15);
                    else setDuration(90);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="THUONG_XUYEN">Thường xuyên (15 phút)</option>
                  <option value="GIUA_KY">Giữa kỳ (90 phút)</option>
                  <option value="CUOI_KY">Cuối kỳ (90 phút)</option>
                  <option value="TOT_NGHIEP">Tốt nghiệp (90 phút)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Chủ đề (Tùy chọn)</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Hàm số, Khối đa diện..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mức độ ưu tiên</label>
                <select 
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="1">Nhận biết - Thông hiểu (Dễ)</option>
                  <option value="2">Cân bằng (Tiêu chuẩn)</option>
                  <option value="3">Vận dụng - Nâng cao (Khó)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian làm bài (phút)</label>
                <input 
                  type="number" 
                  min="1"
                  max="180"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng câu (dự kiến)</label>
                <input type="number" min="1" max="100" value={targetCount} onChange={e => setTargetCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />
          {/* Thiết lập nâng cao */}
`.trim();

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/CreateExam.tsx', code);
