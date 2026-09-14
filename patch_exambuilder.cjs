const fs = require('fs');

let code = `import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import { ExamConfig, Grade } from '../types';
import { curriculumData } from '../data/curriculum';

export function ExamBuilder() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const currentGrade = useAppStore((state) => state.currentGrade);
  const addExam = useAppStore((state) => state.addExam);
  const isThuongXuyen = type === 'THUONG_XUYEN';

  const [mode, setMode] = useState<'CHUAN' | 'LINH_HOAT'>('CHUAN');
  const [duration, setDuration] = useState(isThuongXuyen ? 15 : 90);
  const [parts, setParts] = useState<('I' | 'II' | 'III')[]>(isThuongXuyen ? ['I'] : ['I', 'II', 'III']);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);

  // New states for Scope
  const [examGrade, setExamGrade] = useState<Grade>(12);
  const [scopeType, setScopeType] = useState<'LESSON' | 'TOPIC' | 'MULTI_TOPIC'>('LESSON');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  
  const [examName, setExamName] = useState('');
  const [isCustomName, setIsCustomName] = useState(false);

  const topics = curriculumData[examGrade as 10|11|12] || [];

  // Initialize selections when grade changes
  useEffect(() => {
    if (topics.length > 0) {
      if (!selectedTopic || !topics.find(t => t.id === selectedTopic)) {
        setSelectedTopic(topics[0].id);
        setSelectedTopics([topics[0].id]);
        if (topics[0].lessons.length > 0) {
          setSelectedLesson(topics[0].lessons[0].id);
        } else {
          setSelectedLesson('');
        }
      }
    } else {
      setSelectedTopic('');
      setSelectedTopics([]);
      setSelectedLesson('');
    }
  }, [examGrade, topics]);

  // Update selected lesson when single topic changes
  useEffect(() => {
    if (scopeType === 'LESSON') {
      const t = topics.find(t => t.id === selectedTopic);
      if (t && t.lessons.length > 0) {
         if (!t.lessons.find(l => l.id === selectedLesson)) {
            setSelectedLesson(t.lessons[0].id);
         }
      } else {
         setSelectedLesson('');
      }
    }
  }, [selectedTopic, scopeType, topics]);

  // Generate default name
  useEffect(() => {
    if (isCustomName) return;
    
    let generatedName = \`Ôn tập Toán \${examGrade}\`;
    
    if (scopeType === 'LESSON' && selectedTopic && selectedLesson) {
      const t = topics.find(t => t.id === selectedTopic);
      const l = t?.lessons.find(l => l.id === selectedLesson);
      if (l) generatedName += \` – \${l.name}\`;
    } else if (scopeType === 'TOPIC' && selectedTopic) {
      const t = topics.find(t => t.id === selectedTopic);
      if (t) generatedName += \` – \${t.name}\`;
    } else if (scopeType === 'MULTI_TOPIC') {
      generatedName += \` – Chủ đề đã chọn\`;
    }
    
    setExamName(generatedName);
  }, [examGrade, scopeType, selectedTopic, selectedLesson, selectedTopics, isCustomName, topics]);


  const handleTogglePart = (part: 'I' | 'II' | 'III') => {
    if (mode === 'CHUAN') return;
    if (isThuongXuyen) return;
    
    setParts((prev) => {
      if (prev.includes(part)) {
        if (prev.length === 1) return prev; // Cannot deselect last one
        return prev.filter((p) => p !== part);
      }
      return [...prev, part].sort();
    });
  };

  const handleModeChange = (newMode: 'CHUAN' | 'LINH_HOAT') => {
    setMode(newMode);
    if (newMode === 'CHUAN') {
      setDuration(isThuongXuyen ? 15 : 90);
      setParts(isThuongXuyen ? ['I'] : ['I', 'II', 'III']);
    }
  };

  const toggleMultiTopic = (tId: string) => {
    setSelectedTopics(prev => {
      if (prev.includes(tId)) {
        if (prev.length === 1) return prev; // Prevent deselecting all
        return prev.filter(id => id !== tId);
      }
      return [...prev, tId];
    });
  };

  const handleCreate = () => {
    const newExam: ExamConfig = {
      id: uuidv4(),
      name: examName.trim() || \`Đề \${type} Toán \${examGrade}\`,
      type: type as any,
      durationMinutes: duration,
      parts,
      shuffleQuestions,
      shuffleOptions,
      showAnswersAfter: false,
      grade: examGrade,
      scopeType: scopeType,
      topicIds: scopeType === 'MULTI_TOPIC' ? selectedTopics : [selectedTopic],
      lessonIds: scopeType === 'LESSON' ? [selectedLesson] : undefined,
    };
    
    addExam(newExam);
    navigate(\`/exam-preview/\${newExam.id}\`);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/review')} className="text-slate-500 hover:text-slate-800">
          ← Quay lại
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Tạo đề ôn tập</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-10">
        
        {/* NỘI DUNG ÔN TẬP */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">Nội dung ôn tập</h3>
          
          <div className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Khối lớp</label>
                  <select 
                    value={examGrade} 
                    onChange={e => setExamGrade(Number(e.target.value) as Grade)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phạm vi</label>
                  <select 
                    value={scopeType} 
                    onChange={e => setScopeType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="LESSON">Một bài học</option>
                    <option value="TOPIC">Một chủ đề</option>
                    <option value="MULTI_TOPIC">Nhiều chủ đề</option>
                  </select>
                </div>
             </div>

             {scopeType !== 'MULTI_TOPIC' ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Chủ đề</label>
                    <select 
                      value={selectedTopic} 
                      onChange={e => setSelectedTopic(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      {topics.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                 </div>
                 {scopeType === 'LESSON' && (
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Bài học</label>
                      <select 
                        value={selectedLesson} 
                        onChange={e => setSelectedLesson(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      >
                        {topics.find(t => t.id === selectedTopic)?.lessons.map(l => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                   </div>
                 )}
               </div>
             ) : (
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Chọn các chủ đề</label>
                  <div className="space-y-3 p-4 border border-slate-200 rounded-xl max-h-60 overflow-y-auto">
                    {topics.map(t => (
                      <label key={t.id} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedTopics.includes(t.id)}
                          onChange={() => toggleMultiTopic(t.id)}
                          className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <span className="font-medium text-slate-700">{t.name}</span>
                      </label>
                    ))}
                  </div>
               </div>
             )}

             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tên đề ôn tập</label>
                <input 
                  type="text"
                  value={examName}
                  onChange={e => {
                    setExamName(e.target.value);
                    setIsCustomName(true);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Nhập tên đề..."
                />
             </div>
          </div>
        </div>

        {/* CHẾ ĐỘ TẠO BÀI */}
        {!isThuongXuyen && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">Chế độ tạo bài</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleModeChange('CHUAN')}
                className={\`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all \${
                  mode === 'CHUAN' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }\`}
              >
                Đề Chuẩn
              </button>
              <button
                onClick={() => handleModeChange('LINH_HOAT')}
                className={\`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all \${
                  mode === 'LINH_HOAT' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }\`}
              >
                Linh Hoạt
              </button>
            </div>
            {mode === 'CHUAN' && (
              <p className="text-sm text-slate-500 mt-3">
                Cấu trúc cố định: 90 phút. Phần I (12 câu), Phần II (4 câu Đ/S), Phần III (6 câu ngắn).
              </p>
            )}
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Thời gian (Phút)</h3>
          <input
            type="number"
            min="1"
            max="180"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
            disabled={mode === 'CHUAN'}
            className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 text-base"
          />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Cấu trúc phần thi</h3>
          <div className="space-y-3">
            <label className={\`flex items-center gap-3 p-4 rounded-xl border \${parts.includes('I') ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200'} \${mode === 'CHUAN' || isThuongXuyen ? 'opacity-70' : 'cursor-pointer'}\`}>
              <input
                type="checkbox"
                checked={parts.includes('I')}
                onChange={() => handleTogglePart('I')}
                disabled={mode === 'CHUAN' || isThuongXuyen}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              <div className="font-semibold text-slate-800">Trắc nghiệm ABCD (Phần I)</div>
            </label>
            {!isThuongXuyen && (
              <>
                <label className={\`flex items-center gap-3 p-4 rounded-xl border \${parts.includes('II') ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200'} \${mode === 'CHUAN' ? 'opacity-70' : 'cursor-pointer'}\`}>
                  <input
                    type="checkbox"
                    checked={parts.includes('II')}
                    onChange={() => handleTogglePart('II')}
                    disabled={mode === 'CHUAN'}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <div className="font-semibold text-slate-800">Trắc nghiệm Đúng / Sai (Phần II)</div>
                </label>
                <label className={\`flex items-center gap-3 p-4 rounded-xl border \${parts.includes('III') ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200'} \${mode === 'CHUAN' ? 'opacity-70' : 'cursor-pointer'}\`}>
                  <input
                    type="checkbox"
                    checked={parts.includes('III')}
                    onChange={() => handleTogglePart('III')}
                    disabled={mode === 'CHUAN'}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <div className="font-semibold text-slate-800">Trả lời ngắn (Phần III)</div>
                </label>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Trộn đề</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="font-medium text-slate-700">Trộn thứ tự câu hỏi</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleOptions}
                onChange={(e) => setShuffleOptions(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="font-medium text-slate-700">Trộn phương án (ABCD)</span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleCreate}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-lg"
          >
            TẠO ĐỀ
          </button>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/pages/ExamBuilder.tsx', code);
console.log("Patched ExamBuilder");
