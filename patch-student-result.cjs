const fs = require('fs');

const newResultComponent = `import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, RefreshCw, Home } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function StudentResult() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  
  const attempts = useAppStore(state => state.attempts);
  const addAttempt = useAppStore(state => state.addAttempt);
  const examVersions = useAppStore(state => state.examVersions);
  const addExamVersion = useAppStore(state => state.addExamVersion);
  const exams = useAppStore(state => state.exams);
  const allQuestions = useAppStore(state => state.questions);

  const attempt = attempts.find(a => a.id === attemptId);
  const version = examVersions.find(v => v.id === attempt?.examVersionId);
  const config = exams.find(e => e.id === version?.examConfigId);

  const stats = useMemo(() => {
    if (!attempt || !version) return null;
    
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    
    let levelStats = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 }, 4: { correct: 0, total: 0 } };
    let typeStats = { 'MCQ_SINGLE': { correct: 0, total: 0 }, 'TRUE_FALSE_GROUP': { correct: 0, total: 0 }, 'SHORT_ANSWER': { correct: 0, total: 0 } };

    version.questions.forEach(q => {
      const ans = attempt.answers[q.id];
      levelStats[q.difficulty].total += 1;
      typeStats[q.question_type].total += 1;

      if (ans === undefined || ans === null || ans === '') {
        unanswered += 1;
      } else {
        let isCorrect = false;
        if (q.question_type === 'MCQ_SINGLE') {
          const correctOpt = q.options.find(o => o.isCorrect);
          isCorrect = correctOpt && correctOpt.id === ans;
        } else if (q.question_type === 'SHORT_ANSWER') {
          isCorrect = String(ans).trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        } else if (q.question_type === 'TRUE_FALSE_GROUP') {
          // Check if at least some were correct - simplify by considering 4/4 correct as full correct for stats
          const ansMap = ans as Record<string, boolean>;
          let correctStmts = 0;
          q.statements.forEach(stmt => {
            if (ansMap[stmt.id] === stmt.isTrue) correctStmts++;
          });
          isCorrect = correctStmts === q.statements.length;
        }
        
        if (isCorrect) {
          correct += 1;
          levelStats[q.difficulty].correct += 1;
          typeStats[q.question_type].correct += 1;
        } else {
          wrong += 1;
        }
      }
    });

    return { correct, wrong, unanswered, levelStats, typeStats, total: version.questions.length };
  }, [attempt, version]);

  if (!attempt || !config || !version || !stats) return <div>Không tìm thấy dữ liệu</div>;

  const handleRetry = () => {
    // Generate a new version, filtering out questions in current version if possible
    const currentQIds = new Set(version.questions.map(q => q.id));
    const availableQuestions = allQuestions.filter(q => q.grade_id === config.grade && !currentQIds.has(q.id));
    
    // In a real app we'd carefully reconstruct the exam according to config parts.
    // For simplicity here, we'll just reuse the config but draw new random questions.
    let selectedQuestions = [];
    const pool = availableQuestions.length > 0 ? availableQuestions : allQuestions.filter(q => q.grade_id === config.grade);
    
    if (config.parts.includes('I')) {
      const qs = pool.filter(q => q.question_type === 'MCQ_SINGLE').slice(0, config.type === 'THUONG_XUYEN' ? 10 : 12);
      selectedQuestions.push(...qs);
    }
    if (config.parts.includes('II')) {
      const qs = pool.filter(q => q.question_type === 'TRUE_FALSE_GROUP').slice(0, 4);
      selectedQuestions.push(...qs);
    }
    if (config.parts.includes('III')) {
      const qs = pool.filter(q => q.question_type === 'SHORT_ANSWER').slice(0, 6);
      selectedQuestions.push(...qs);
    }

    const newVersion = {
      id: uuidv4(),
      examConfigId: config.id,
      questions: selectedQuestions,
    };
    addExamVersion(newVersion);
    
    // Create new attempt immediately for the same student
    const newAttempt = {
      id: uuidv4(),
      examVersionId: newVersion.id,
      studentName: attempt.studentName,
      className: attempt.className,
      startTime: Date.now(),
      endTime: null,
      durationUsed: null,
      answers: {},
      score: null,
      status: 'IN_PROGRESS' as const,
      focusEvents: []
    };
    addAttempt(newAttempt);
    navigate(\`/student/take/\${newAttempt.id}\`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-200">
          
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-32 h-32 bg-indigo-100 text-indigo-600 rounded-full flex flex-col items-center justify-center shrink-0 border-4 border-indigo-50">
              <span className="text-4xl font-bold">{attempt.score}</span>
              <span className="text-sm font-medium opacity-80">Điểm</span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Hoàn thành Luyện tập!</h1>
              <p className="text-slate-500 mb-4">{config.name}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg">Đúng: {stats.correct}</span>
                <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg">Sai: {stats.wrong}</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg">Chưa làm: {stats.unanswered}</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                  Thời gian: {attempt.endTime ? Math.floor((attempt.endTime - attempt.startTime) / 60000) : 0} phút
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Kết quả theo mức độ</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4].map(level => {
                  const s = stats.levelStats[level as 1|2|3|4];
                  if (s.total === 0) return null;
                  const labels = { 1: 'Nhận biết', 2: 'Thông hiểu', 3: 'Vận dụng', 4: 'Tổng hợp' };
                  return (
                    <div key={level} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-medium text-slate-700">{labels[level as keyof typeof labels]}</span>
                      <span className="text-indigo-600 font-bold">{s.correct}/{s.total}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Kết quả theo dạng toán</h3>
              <div className="space-y-3">
                {['MCQ_SINGLE', 'TRUE_FALSE_GROUP', 'SHORT_ANSWER'].map(type => {
                  const s = stats.typeStats[type as keyof typeof stats.typeStats];
                  if (s.total === 0) return null;
                  const labels = { 'MCQ_SINGLE': 'Trắc nghiệm ABCD', 'TRUE_FALSE_GROUP': 'Đúng / Sai', 'SHORT_ANSWER': 'Trả lời ngắn' };
                  return (
                    <div key={type} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-medium text-slate-700">{labels[type as keyof typeof labels]}</span>
                      <span className="text-emerald-600 font-bold">{s.correct}/{s.total}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-8">
            <button
              onClick={() => {
                // Navigate to theory of the first question's topic (mocking)
                const firstQ = version.questions[0];
                navigate(\`/review-space/\${config.type.toLowerCase().replace('_', '-')}/theory?topic=\${firstQ?.topic_id || 'c5'}&lesson=\${firstQ?.lesson_id || 'l13'}\`);
              }}
              className="flex-1 py-3.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen size={20} />
              XEM LẠI LÝ THUYẾT
            </button>
            
            <button
              onClick={handleRetry}
              className="flex-1 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw size={20} />
              LUYỆN LẠI DẠNG NÀY
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Trang chủ
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/StudentResult.tsx', newResultComponent);
