import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  Rocket, Zap, BookOpen, PenTool, Database, Gamepad2, 
  Puzzle, CheckCircle2, BarChart2, RotateCcw, User, FileText,
  ChevronLeft
} from 'lucide-react';
import { MathText } from '../components/MathText';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { VisualRenderer } from '../components/visuals/VisualRenderer';

const CARDS = [
  { id: 'start', title: 'Bắt đầu', icon: Rocket, color: 'text-indigo-600', bg: 'bg-indigo-100', desc: 'Chọn lộ trình học' },
  { id: 'warmup', title: 'Khởi động', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100', desc: 'Kiểm tra nhanh' },
  { id: 'theory', title: 'Kiến thức', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'Lý thuyết trọng tâm' },
  { id: 'practice', title: 'Luyện tập', icon: PenTool, color: 'text-cyan-600', bg: 'bg-cyan-100', desc: 'Từ dễ đến khó' },
  { id: 'bank', title: 'Ngân hàng', icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-100', desc: 'Chọn dạng bài' },
  { id: 'game', title: 'Trò chơi', icon: Gamepad2, color: 'text-orange-600', bg: 'bg-orange-100', desc: 'Mini-game Toán' },
  { id: 'structure', title: 'Cấu trúc đề', icon: Puzzle, color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'Xem form đề thi' },
  { id: 'test', title: 'Kiểm tra', icon: CheckCircle2, color: 'text-cyan-600', bg: 'bg-cyan-100', desc: 'Thi thử tính giờ' },
  { id: 'result', title: 'Kết quả', icon: BarChart2, color: 'text-indigo-600', bg: 'bg-indigo-100', desc: 'Phân tích điểm' },
  { id: 'relearn', title: 'Học lại', icon: RotateCcw, color: 'text-orange-600', bg: 'bg-orange-100', desc: 'Vùng kiến thức yếu' },
  { id: 'profile', title: 'Hồ sơ học tập', icon: User, color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'Tiến độ học' },
  { id: 'report', title: 'Báo cáo GV', icon: FileText, color: 'text-cyan-600', bg: 'bg-cyan-100', desc: 'Thống kê cho GV' }
];

export function Roadmap() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const { currentGrade, questions, exams, attempts } = useAppStore();

  const renderModule = () => {
    switch(activeModule) {
      case 'start':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">🚀 Bắt đầu lộ trình</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Khối lớp</label>
                <select className="w-full p-3 rounded-xl border border-slate-300">
                  <option>Khối 10</option>
                  <option>Khối 11</option>
                  <option>Khối 12</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Chủ đề</label>
                <select className="w-full p-3 rounded-xl border border-slate-300">
                  <option>Hàm số</option>
                  <option>Khối đa diện</option>
                  <option>Mũ và Logarit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mục tiêu</label>
                <select className="w-full p-3 rounded-xl border border-slate-300">
                  <option>Điểm 7+</option>
                  <option>Điểm 8+</option>
                  <option>Điểm 9+</option>
                </select>
              </div>
              <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl mt-4">
                BẮT ĐẦU HỌC
              </button>
            </div>
          </div>
        );
      case 'warmup':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">⚡ Khởi động</h3>
            <p className="text-slate-600 mb-4">3 câu chẩn đoán nhanh năng lực.</p>
            {questions.slice(0, 3).map((q, i) => (
              <div key={q.id} className="mb-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                <div className="font-bold text-indigo-700 mb-2">Câu {i+1}:</div>
                <MathText text={sanitizeQuestionText(q.content)} />
                <VisualRenderer visual={q.visual} />
              </div>
            ))}
          </div>
        );
      case 'theory':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">📚 Kiến thức trọng tâm</h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h4 className="font-bold text-emerald-800 mb-2">1. Định nghĩa</h4>
                <MathText text="Hàm số $y = f(x)$ đồng biến trên $K$ nếu $\forall x_1, x_2 \in K, x_1 < x_2 \Rightarrow f(x_1) < f(x_2)$" />
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                <h4 className="font-bold text-indigo-800 mb-2">2. Đạo hàm</h4>
                <MathText text="Nếu $f'(x) > 0, \forall x \in K$ thì hàm số đồng biến trên $K$." />
              </div>
            </div>
          </div>
        );
      case 'practice':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">✍️ Luyện tập</h3>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold shrink-0">Nhận biết</button>
              <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold shrink-0">Thông hiểu</button>
              <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold shrink-0">Vận dụng</button>
            </div>
            {questions.slice(3, 5).map((q, i) => (
              <div key={q.id} className="mb-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                <div className="font-bold text-indigo-700 mb-2">Bài tập {i+1}:</div>
                <MathText text={sanitizeQuestionText(q.content)} />
                <VisualRenderer visual={q.visual} />
              </div>
            ))}
          </div>
        );
      case 'bank':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">🧠 Ngân hàng</h3>
            <p className="text-slate-600 mb-4">Tự chọn dạng bài từ kho dữ liệu.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-400 cursor-pointer">
                <h4 className="font-bold text-slate-800">Sự đồng biến, nghịch biến</h4>
                <p className="text-sm text-slate-500">142 câu hỏi</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-400 cursor-pointer">
                <h4 className="font-bold text-slate-800">Cực trị của hàm số</h4>
                <p className="text-sm text-slate-500">95 câu hỏi</p>
              </div>
            </div>
          </div>
        );
      case 'game':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <h3 className="text-xl font-bold mb-4">🎮 Mini-Game Flashcard</h3>
            <div className="w-full max-w-sm mx-auto h-64 bg-indigo-600 rounded-2xl flex items-center justify-center text-white p-6 cursor-pointer shadow-lg transform transition hover:scale-105">
              <div className="text-2xl font-bold"><MathText text="Đạo hàm của $y = \sin(x)$ là gì?" /></div>
            </div>
            <p className="text-slate-500 mt-4">Chạm để lật thẻ</p>
          </div>
        );
      case 'structure':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">🧩 Cấu trúc đề 2025</h3>
            <div className="space-y-3">
              <div className="p-4 border border-indigo-200 bg-indigo-50 rounded-xl">
                <h4 className="font-bold text-indigo-800">Phần I: 12 câu trắc nghiệm nhiều phương án</h4>
                <p className="text-sm text-indigo-600 mt-1">Gồm 4 đáp án A, B, C, D.</p>
              </div>
              <div className="p-4 border border-cyan-200 bg-cyan-50 rounded-xl">
                <h4 className="font-bold text-cyan-800">Phần II: 4 câu Trắc nghiệm Đúng/Sai</h4>
                <p className="text-sm text-cyan-600 mt-1">Mỗi câu gồm 4 ý a, b, c, d.</p>
              </div>
              <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-xl">
                <h4 className="font-bold text-emerald-800">Phần III: 6 câu Trả lời ngắn</h4>
                <p className="text-sm text-emerald-600 mt-1">Điền đáp án cuối cùng.</p>
              </div>
            </div>
          </div>
        );
      case 'test':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">✓ Kiểm tra định kỳ</h3>
            {exams.length > 0 ? (
              <div className="space-y-4">
                {exams.slice(0, 3).map(e => (
                  <div key={e.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800">{e.name}</div>
                      <div className="text-sm text-slate-500">{e.durationMinutes} phút</div>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">
                      Vào thi
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Chưa có đề thi nào trong hệ thống.</p>
            )}
          </div>
        );
      case 'result':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">📊 Kết quả của bạn</h3>
            {attempts.length > 0 ? (
              <div className="space-y-4">
                {attempts.map(a => (
                  <div key={a.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800">{a.studentName}</div>
                      <div className="text-sm text-slate-500">Lớp {a.className}</div>
                    </div>
                    <div className="text-xl font-bold text-emerald-600">
                      {a.score !== null ? `${a.score.toFixed(1)} đ` : 'Chưa chấm'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Bạn chưa có lịch sử làm bài nào.</p>
            )}
          </div>
        );
      case 'relearn':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">🔄 Gợi ý học lại</h3>
            <p className="text-slate-600 mb-4">Hệ thống phân tích bạn đang yếu ở các phần sau:</p>
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-xl mb-4">
              <h4 className="font-bold text-orange-800">Cực trị hàm số</h4>
              <p className="text-sm text-orange-600">Tỷ lệ đúng: 30%</p>
              <button className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold text-sm">
                Ôn tập lại ngay
              </button>
            </div>
            <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-xl">
              <h4 className="font-bold text-indigo-800">Khảo sát đồ thị</h4>
              <p className="text-sm text-indigo-600">Tỷ lệ đúng: 45%</p>
              <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm">
                Ôn tập lại ngay
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">👤 Hồ sơ học tập</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl font-bold">HS</div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Học sinh Tiêu chuẩn</h4>
                <p className="text-slate-500">Lớp {currentGrade}A1</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                  <span>Tiến độ chương trình Khối {currentGrade}</span>
                  <span className="text-indigo-600">65%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-[65%]"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-3xl font-bold text-slate-800">12</div>
                  <div className="text-sm text-slate-500">Bài đã học</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-3xl font-bold text-emerald-600">8.5</div>
                  <div className="text-sm text-slate-500">Điểm trung bình</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'report':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">📋 Báo cáo dành cho Giáo viên</h3>
            <p className="text-slate-600 mb-4">Bảng theo dõi tiến độ chung của học sinh trong lớp.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600 border-b">Học sinh</th>
                    <th className="p-3 font-semibold text-slate-600 border-b">Tiến độ</th>
                    <th className="p-3 font-semibold text-slate-600 border-b">Lần luyện</th>
                    <th className="p-3 font-semibold text-slate-600 border-b">Đ.Trung bình</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-800">Nguyễn Văn A</td>
                    <td className="p-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">65%</span></td>
                    <td className="p-3 text-slate-600">12</td>
                    <td className="p-3 font-bold text-slate-800">8.5</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-800">Trần Thị B</td>
                    <td className="p-3"><span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg">30%</span></td>
                    <td className="p-3 text-slate-600">4</td>
                    <td className="p-3 font-bold text-slate-800">5.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#172033]">LỘ TRÌNH TỰ HỌC</h2>
          <p className="text-slate-500 mt-2 text-lg">Học sâu • Luyện tập • Kiểm tra • Cải thiện</p>
        </div>
      </div>

      {activeModule ? (
        <div className="space-y-6">
          <button 
            onClick={() => setActiveModule(null)}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors bg-white px-4 py-2 rounded-xl border border-indigo-100 shadow-sm w-fit"
          >
            <ChevronLeft size={20} /> Quay lại Lộ trình
          </button>
          {renderModule()}
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-800">Chủ đề: Khảo sát hàm số (Đang học)</h3>
              <span className="font-bold text-indigo-600">65%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full w-[65%]"></div>
            </div>
            <div className="flex gap-4 mt-4 text-sm font-medium overflow-x-auto pb-2">
              <span className="shrink-0 text-emerald-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Hoàn thành</span>
              <span className="shrink-0 text-indigo-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Đang học</span>
              <span className="shrink-0 text-cyan-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Đang luyện</span>
              <span className="shrink-0 text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Chưa bắt đầu</span>
              <span className="shrink-0 text-orange-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Cần học lại</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {CARDS.map((card) => (
              <button 
                key={card.id}
                onClick={() => setActiveModule(card.id)}
                className="bg-white p-5 rounded-[20px] shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-[15px]">{card.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
