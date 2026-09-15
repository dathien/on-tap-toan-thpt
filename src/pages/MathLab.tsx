import React, { useState, useMemo } from 'react';
import { LineChart, Axis3D, Shapes, Target, Triangle, Maximize, Search, ArrowLeft, FlaskConical, LayoutGrid, AlertCircle, Brain, PieChart, Layers, Grid3X3, LayoutDashboard } from 'lucide-react';
import { FunctionGraphLab } from './labs/FunctionGraphLab';
import { FunctionAnalysisLab } from './labs/FunctionAnalysisLab';
import { DerivativeLab } from './labs/DerivativeLab';
import { IntegralLab } from './labs/IntegralLab';
import { VectorLab } from './labs/VectorLab';
import { OxyzLab } from './labs/OxyzLab';
import { LogicLab } from './labs/LogicLab';
import { SetLab } from './labs/SetLab';
import { Inequality2DLab } from './labs/Inequality2DLab';
import { InequalitySystem2DLab } from './labs/InequalitySystem2DLab';


import { curriculumData } from '../data/curriculum';

interface LabMeta {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
  lessonIds?: string[];
}

export const LAB_CATALOG: LabMeta[] = [
  { id: 'function-graph', name: 'Đồ thị hàm số', description: 'Vẽ và khảo sát đồ thị hàm số', icon: LineChart, color: 'text-indigo-600', bg: 'bg-indigo-50', lessonIds: ['l17'] },
  { id: 'function-analysis', name: 'Khảo sát hàm số', description: 'Sự biến thiên, cực trị, tiệm cận', icon: Target, color: 'text-cyan-600', bg: 'bg-cyan-50', lessonIds: ['l13', 'l14', 'l16', 'l17'] },
  { id: 'derivative', name: 'Đạo hàm', description: 'Ý nghĩa hình học của đạo hàm, tiếp tuyến', icon: Maximize, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'integral', name: 'Tích phân', description: 'Tính tích phân và diện tích hình phẳng', icon: Shapes, color: 'text-amber-600', bg: 'bg-amber-50', lessonIds: ['l24', 'l25'] },
  { id: 'vector', name: 'Vector', description: 'Các phép toán vector trong Oxy và Oxyz', icon: Triangle, color: 'text-purple-600', bg: 'bg-purple-50', lessonIds: ['l19'] },
  { id: 'oxyz', name: 'Oxyz', description: 'Hệ tọa độ trong không gian', icon: Axis3D, color: 'text-pink-600', bg: 'bg-pink-50', lessonIds: ['l18'] },
];

export function MathLab() {
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [selectedSemester, setSelectedSemester] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const renderActiveLab = () => {
    switch (activeLab) {
      case 'function-graph': return <FunctionGraphLab onBack={() => setActiveLab(null)} />;
      case 'function-analysis': return <FunctionAnalysisLab onBack={() => setActiveLab(null)} />;
      case 'derivative': return <DerivativeLab onBack={() => setActiveLab(null)} />;
      case 'integral': return <IntegralLab onBack={() => setActiveLab(null)} />;
      case 'vector': return <VectorLab onBack={() => setActiveLab(null)} />;
      case 'oxyz': return <OxyzLab onBack={() => setActiveLab(null)} />;
      case 'logic': return <LogicLab onBack={() => setActiveLab(null)} />;
      case 'sets': return <SetLab onBack={() => setActiveLab(null)} mode="SET" />;
      case 'set-operations': return <SetLab onBack={() => setActiveLab(null)} mode="OPERATIONS" />;
      case 'inequality-2d': return <Inequality2DLab onBack={() => setActiveLab(null)} />;
      case 'inequality-system-2d': return <InequalitySystem2DLab onBack={() => setActiveLab(null)} />;

      default: return null;
    }
  };

  const getLabsForLesson = (lessonId: string) => {
    return LAB_CATALOG.filter(lab => lab.lessonIds?.includes(lessonId));
  };

  const filteredTopics = useMemo(() => {
    let result: { grade: number, topic: any }[] = [];
    if (selectedGrade === 'ALL') {
      [10, 11, 12].forEach(g => {
        (curriculumData[g as 10|11|12] || []).forEach(t => result.push({ grade: g, topic: t }));
      });
    } else {
      (curriculumData[selectedGrade as 10|11|12] || []).forEach(t => result.push({ grade: selectedGrade, topic: t }));
    }
    
    if (selectedSemester !== 'ALL') {
      result = result.filter(item => item.topic.semester === selectedSemester || item.topic.semester === 'NEEDS_CURRICULUM_MAPPING');
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.map(item => {
        const filteredLessons = item.topic.lessons.filter((l: any) => 
          l.name.toLowerCase().includes(q) || 
          item.topic.name.toLowerCase().includes(q) ||
          getLabsForLesson(l.id).some(lab => lab.name.toLowerCase().includes(q))
        );
        return { ...item, topic: { ...item.topic, lessons: filteredLessons } };
      }).filter(item => item.topic.lessons.length > 0);
    }
    
    return result;
  }, [selectedGrade, selectedSemester, searchQuery]);

  if (activeLab) {
    return (
      <div className="max-w-7xl mx-auto min-h-[calc(100vh-8rem)] overflow-y-auto pb-12">
        {renderActiveLab()}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#172033] flex items-center gap-2">
            <FlaskConical className="text-indigo-600" />
            Phòng Lab Toán Học
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Mô phỏng, trực quan hóa và tương tác với các khái niệm toán học.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm bài học, tên Lab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full md:w-72 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-2 md:p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => { setSelectedGrade('ALL'); setSelectedSemester('ALL'); }}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${selectedGrade === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            TẤT CẢ LAB
          </button>
          {[10, 11, 12].map(g => (
            <button
              key={g}
              onClick={() => { setSelectedGrade(g); setSelectedSemester('ALL'); }}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${selectedGrade === g ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              Khối {g}
            </button>
          ))}
        </div>

        {selectedGrade !== 'ALL' && (
          <div className="flex flex-wrap gap-2 pl-2 border-l-2 border-indigo-100">
            <button
              onClick={() => setSelectedSemester('ALL')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedSemester === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Cả năm
            </button>
            {[1, 2].map(s => (
              <button
                key={s}
                onClick={() => setSelectedSemester(s)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedSemester === s ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
              >
                Học kỳ {s === 1 ? 'I' : 'II'}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedGrade === 'ALL' && !searchQuery ? (
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <LayoutGrid className="text-indigo-600" /> Danh sách toàn bộ Lab hiện có
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {LAB_CATALOG.map(tool => (
              <button 
                key={tool.id} 
                onClick={() => setActiveLab(tool.id)}
                className="bg-white p-5 rounded-[20px] shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                  <tool.icon size={28} />
                </div>
                <div>
                  <div className="font-bold text-slate-800">{tool.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{tool.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Search className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-500 text-lg">Không tìm thấy chủ đề hoặc bài học nào phù hợp.</p>
            </div>
          ) : (
            filteredTopics.map((item, idx) => (
              <div key={`${item.grade}-${item.topic.id}-${idx}`} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md">Khối {item.grade}</span>
                    {item.topic.name}
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {item.topic.lessons.map((lesson: any) => {
                    const labs = getLabsForLesson(lesson.id);
                    return (
                      <div key={lesson.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-slate-800">{lesson.name}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {labs.length > 0 && (
                            labs.map(lab => (
                              <button
                                key={lab.id}
                                onClick={() => setActiveLab(lab.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${lab.bg} ${lab.color} hover:shadow-sm hover:scale-105 border border-transparent hover:border-current/20`}
                              >
                                <lab.icon size={16} />
                                {lab.name}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
