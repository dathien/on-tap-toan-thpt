import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, Edit3, ArrowLeft } from 'lucide-react';
import { curriculumData } from '../data/curriculum';

export function ReviewSpace() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const currentGrade = useAppStore(state => state.currentGrade);
  
  const topics = curriculumData[currentGrade as keyof typeof curriculumData] || [];
  const [selectedTopic, setSelectedTopic] = useState(topics[0]?.id || '');
  
  const currentTopic = topics.find(t => t.id === selectedTopic);
  const lessons = currentTopic?.lessons || [];
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]?.id || '');

  const progress = 35; // Mock progress

  // If no curriculum
  if (!topics.length) {
    return <div className="p-8 text-center">Chưa có dữ liệu chương trình cho khối {currentGrade}.</div>;
  }

  const typeName = type === 'thuong-xuyen' ? 'THƯỜNG XUYÊN' : type === 'giua-ky' ? 'GIỮA KỲ' : type === 'cuoi-ky' ? 'CUỐI KỲ' : 'TỐT NGHIỆP';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate('/review')} className="text-slate-500 hover:text-slate-800 flex items-center gap-2">
          <ArrowLeft size={20} /> Quay lại
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="text-sm font-bold text-indigo-600 mb-1 uppercase tracking-wider">{typeName}</div>
            <h2 className="text-3xl font-bold text-slate-800">ÔN TẬP TOÁN {currentGrade}</h2>
          </div>
          
          <div className="flex-1 max-w-md w-full">
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
              <span>Tiến độ ôn tập</span>
              <span className="text-indigo-600">{progress}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Chủ đề</label>
            <select 
              value={selectedTopic} 
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                const topic = topics.find(t => t.id === e.target.value);
                if (topic && topic.lessons.length > 0) {
                  setSelectedLesson(topic.lessons[0].id);
                }
              }}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-800"
            >
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Bài học</label>
            <select 
              value={selectedLesson} 
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-800"
            >
              {lessons.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: LÝ THUYẾT */}
          <div className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-6 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 mb-2">LÝ THUYẾT TRỌNG TÂM</h3>
            <p className="text-slate-600 mb-6 flex-1">
              Công thức • Khái niệm • Dạng toán
            </p>
            <button 
              onClick={() => navigate(`/review-space/${type}/theory?topic=${selectedTopic}&lesson=${selectedLesson}`)}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              HỌC LÝ THUYẾT
            </button>
          </div>

          {/* Card 2: LUYỆN TẬP */}
          <div className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-6 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Edit3 size={24} />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-2">LUYỆN TẬP</h3>
            <p className="text-slate-600 mb-6 flex-1">
              Theo bài • Theo dạng • Theo mức độ
            </p>
            <button 
              onClick={() => navigate(`/review-space/${type}/practice?topic=${selectedTopic}&lesson=${selectedLesson}`)}
              className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              BẮT ĐẦU LUYỆN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
