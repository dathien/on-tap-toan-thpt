import React, { useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { curriculumData } from '../data/curriculum';
import { useAppStore } from '../store/useAppStore';
import { ExamConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function PracticeConfig() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  
  const currentGrade = useAppStore(state => state.currentGrade);
  const addExam = useAppStore(state => state.addExam);
  
  const topicId = searchParams.get('topic');
  const lessonId = searchParams.get('lesson');

  const topics = curriculumData[currentGrade as keyof typeof curriculumData] || [];
  const topic = topics.find(t => t.id === topicId);
  const lesson = topic?.lessons.find(l => l.id === lessonId);

  const isThuongXuyen = type === 'thuong-xuyen';

  const [scope, setScope] = useState<'LESSON' | 'TOPIC' | 'TYPE'>('LESSON');
  const [difficulty, setDifficulty] = useState<number>(2); // 1: Nhận biết, 2: Thông hiểu, 3: Vận dụng, 4: Tổng hợp
  const [questionCount, setQuestionCount] = useState<number>(isThuongXuyen ? 10 : 10);
  const [parts, setParts] = useState<('I' | 'II' | 'III')[]>(isThuongXuyen ? ['I'] : ['I', 'II', 'III']);

  const handleTogglePart = (part: 'I' | 'II' | 'III') => {
    if (isThuongXuyen) return;
    setParts((prev) => {
      if (prev.includes(part)) {
        if (prev.length === 1) return prev; // Cannot deselect last one
        return prev.filter((p) => p !== part);
      }
      return [...prev, part].sort();
    });
  };

  const allQuestions = useAppStore(state => state.questions);
  const addExamVersion = useAppStore(state => state.addExamVersion);
  const addAttempt = useAppStore(state => state.addAttempt);

  const handleStartPractice = () => {
    // Create an ExamConfig
    const newConfig: ExamConfig = {
      id: uuidv4(),
      name: `Luyện tập: ${scope === 'LESSON' ? (lesson?.name || 'Bài học') : (topic?.name || 'Chủ đề')}`,
      type: type === 'thuong-xuyen' ? 'THUONG_XUYEN' : type === 'giua-ky' ? 'GIUA_KY' : type === 'cuoi-ky' ? 'CUOI_KY' : 'TOT_NGHIEP',
      durationMinutes: isThuongXuyen ? 15 : Math.ceil(questionCount * 1.5), // Approximate duration
      parts,
      shuffleQuestions: true,
      shuffleOptions: true,
      showAnswersAfter: true,
      grade: currentGrade
    };
    addExam(newConfig);

    // Build selected questions
    const pool = allQuestions.filter(q => q.grade_id === currentGrade);
    
    // Naive shuffle
    const shuffleArray = (array: any[]) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    let selectedQuestions = [];
    if (parts.includes('I')) {
      let iQ = pool.filter(q => q.question_type === 'MCQ_SINGLE');
      iQ = shuffleArray(iQ);
      selectedQuestions.push(...iQ.slice(0, questionCount));
    }
    if (parts.includes('II') && !isThuongXuyen) {
      let iiQ = pool.filter(q => q.question_type === 'TRUE_FALSE_GROUP');
      iiQ = shuffleArray(iiQ);
      selectedQuestions.push(...iiQ.slice(0, 4));
    }
    if (parts.includes('III') && !isThuongXuyen) {
      let iiiQ = pool.filter(q => q.question_type === 'SHORT_ANSWER');
      iiiQ = shuffleArray(iiiQ);
      selectedQuestions.push(...iiiQ.slice(0, 6));
    }

    const newVersion = {
      id: uuidv4(),
      examConfigId: newConfig.id,
      questions: selectedQuestions,
    };
    addExamVersion(newVersion);

    const newAttempt = {
      id: uuidv4(),
      examVersionId: newVersion.id,
      studentName: 'Học sinh (Luyện tập)',
      className: 'Tự học',
      startTime: Date.now(),
      endTime: null,
      durationUsed: null,
      answers: {},
      score: null,
      status: 'IN_PROGRESS' as const,
      focusEvents: []
    };
    addAttempt(newAttempt);
    navigate(`/student/take/${newAttempt.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(`/review-space/${type}`)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2">
          <ArrowLeft size={20} /> Quay lại Không gian ôn tập
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Thiết lập Luyện tập</h2>
          <p className="text-slate-500">Mô-đun: {type === 'thuong-xuyen' ? 'THƯỜNG XUYÊN' : type === 'giua-ky' ? 'GIỮA KỲ' : type === 'cuoi-ky' ? 'CUỐI KỲ' : 'TỐT NGHIỆP'}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Nội dung</h3>
          <div className="flex gap-4">
            {['LESSON', 'TOPIC', 'TYPE'].map((s) => (
              <button
                key={s}
                onClick={() => setScope(s as any)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  scope === s ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Theo {s === 'LESSON' ? 'bài học' : s === 'TOPIC' ? 'chủ đề' : 'dạng toán'}
              </button>
            ))}
          </div>
          {scope === 'LESSON' && <p className="text-sm text-emerald-700 mt-2 font-medium bg-emerald-50 inline-block px-3 py-1 rounded-lg">Bài: {lesson?.name}</p>}
          {scope === 'TOPIC' && <p className="text-sm text-emerald-700 mt-2 font-medium bg-emerald-50 inline-block px-3 py-1 rounded-lg">Chủ đề: {topic?.name}</p>}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Mức độ</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Tổng hợp'].map((lvl, idx) => (
              <button
                key={lvl}
                onClick={() => setDifficulty(idx + 1)}
                className={`py-3 px-2 rounded-xl border-2 font-medium transition-all text-center ${
                  difficulty === idx + 1 ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Số lượng câu</h3>
          <div className="flex gap-4">
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                onClick={() => {
                  if (isThuongXuyen && num !== 10) return;
                  setQuestionCount(num);
                }}
                disabled={isThuongXuyen && num !== 10}
                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                  questionCount === num ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {num} câu
              </button>
            ))}
          </div>
          {isThuongXuyen && <p className="text-sm text-slate-500 mt-2">Mẫu Thường xuyên cố định 10 câu.</p>}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Dạng câu hỏi</h3>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 rounded-xl border ${parts.includes('I') ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200'} ${isThuongXuyen ? 'opacity-70' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={parts.includes('I')}
                onChange={() => handleTogglePart('I')}
                disabled={isThuongXuyen}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              <div className="font-semibold text-slate-800">Trắc nghiệm ABCD (Phần I)</div>
            </label>
            {!isThuongXuyen && (
              <>
                <label className={`flex items-center gap-3 p-4 rounded-xl border ${parts.includes('II') ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200'} cursor-pointer`}>
                  <input
                    type="checkbox"
                    checked={parts.includes('II')}
                    onChange={() => handleTogglePart('II')}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="font-semibold text-slate-800">Trắc nghiệm Đúng / Sai (Phần II)</div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border ${parts.includes('III') ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200'} cursor-pointer`}>
                  <input
                    type="checkbox"
                    checked={parts.includes('III')}
                    onChange={() => handleTogglePart('III')}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="font-semibold text-slate-800">Trả lời ngắn (Phần III)</div>
                </label>
              </>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleStartPractice}
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm text-lg"
          >
            BẮT ĐẦU LUYỆN
          </button>
        </div>
      </div>
    </div>
  );
}
