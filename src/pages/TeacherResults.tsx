import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Search, TrendingUp, TrendingDown, Users, FileText, CheckCircle, AlertCircle, ChevronDown, BarChart2, Eye, ArrowLeft, Activity, LayoutList } from 'lucide-react';
import clsx from 'clsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// --- DEMO DATA ---
const DEMO_STUDENTS = [
  { id: 's1', name: 'Nguyễn Minh Anh', classId: '12A1', isDemo: true },
  { id: 's2', name: 'Trần Gia Bảo', classId: '12A1', isDemo: true },
  { id: 's3', name: 'Lê Hoàng Nam', classId: '12A1', isDemo: true },
  { id: 's4', name: 'Phạm Ngọc Hà', classId: '12A1', isDemo: true },
  { id: 's5', name: 'Võ Minh Khang', classId: '12A1', isDemo: true },
  { id: 's6', name: 'Nguyễn Khánh Linh', classId: '12A1', isDemo: true },
  { id: 's7', name: 'Trần Quốc Huy', classId: '12A1', isDemo: true },
  { id: 's8', name: 'Lê Thảo My', classId: '12A1', isDemo: true },
  { id: 's9', name: 'Phạm Đức Anh', classId: '12A1', isDemo: true },
  { id: 's10', name: 'Hoàng Gia Hân', classId: '12A1', isDemo: true },
];

const DEMO_EXAMS = [
  { id: 'e1', name: 'Đạo hàm và cực trị', type: 'Thường xuyên', questionCount: 10, duration: 15, date: '2026-09-01', isDemo: true },
  { id: 'e2', name: 'Khảo sát hàm số', type: 'Ôn luyện', questionCount: 10, duration: 30, date: '2026-09-03', isDemo: true },
  { id: 'e3', name: 'Nguyên hàm - Tích phân', type: 'Ôn luyện', questionCount: 15, duration: 45, date: '2026-09-05', isDemo: true },
  { id: 'e4', name: 'Giữa kỳ I', type: 'Giữa kỳ', questionCount: 50, duration: 90, date: '2026-09-07', isDemo: true, parts: [{name: 'PHẦN I – Nhiều phương án', pct: 78}, {name: 'PHẦN II – Đúng/Sai', pct: 65}, {name: 'PHẦN III – Trả lời ngắn', pct: 54}] },
  { id: 'e5', name: 'Vector và Oxyz', type: 'Ôn luyện', questionCount: 12, duration: 45, date: '2026-09-09', isDemo: true },
  { id: 'e6', name: 'Ôn tập tốt nghiệp - Hàm số', type: 'Tốt nghiệp', questionCount: 50, duration: 90, date: '2026-09-11', isDemo: true, parts: [{name: 'PHẦN I – Nhiều phương án', pct: 85}, {name: 'PHẦN II – Đúng/Sai', pct: 70}, {name: 'PHẦN III – Trả lời ngắn', pct: 60}] },
];

const generateAttempts = () => {
  const attempts: any[] = [];
  DEMO_STUDENTS.forEach((student, index) => {
    let baseScore = 7.5;
    if (index === 0) baseScore = 8.8;
    if (index === 1) baseScore = 7.8;
    if (index === 2) baseScore = 6.8;
    if (index === 8) baseScore = 5.5;
    
    DEMO_EXAMS.forEach((exam, examIdx) => {
      if (index > 6 && examIdx === 5) return; 
      if (index === 1 && examIdx === 4) return;
      
      let score = baseScore + (examIdx * 0.2) + (Math.random() * 1.0 - 0.5);
      if (score > 10) score = 10;
      if (score < 0) score = 0;
      
      attempts.push({
        id: `att_${student.id}_${exam.id}`,
        studentId: student.id,
        examId: exam.id,
        score: Math.round(score * 10) / 10,
        timeSpent: Math.floor(exam.duration * (0.6 + Math.random() * 0.3)),
        date: new Date(2026, 8, 1 + examIdx * 2).toISOString(),
        isDemo: true
      });
    });
  });
  return attempts;
};
const DEMO_ATTEMPTS = generateAttempts();

export function TeacherResults() {
  const store = useAppStore();
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'exams'>('students');
  
  // Filters
  const [gradeFilter, setGradeFilter] = useState<string>('12');
  const [classFilter, setClassFilter] = useState<string>('12A1');
  const [timeFilter, setTimeFilter] = useState<string>('Tất cả');
  const [typeFilter, setTypeFilter] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);

  const students = isDemoMode ? DEMO_STUDENTS : [];
  const exams: any[] = isDemoMode ? DEMO_EXAMS : store.exams;
  const attempts = isDemoMode ? DEMO_ATTEMPTS : store.attempts;

  const studentStats = useMemo(() => {
    let filtered = students;
    if (searchQuery) filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return filtered.map(student => {
      const stuAttempts = attempts.filter((a: any) => a.studentId === student.id);
      stuAttempts.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let progress = 0;
      if (stuAttempts.length >= 2) progress = stuAttempts[stuAttempts.length - 1].score - stuAttempts[0].score;
      
      const avgScore = stuAttempts.length > 0 ? stuAttempts.reduce((acc: number, val: any) => acc + val.score, 0) / stuAttempts.length : 0;
      const maxScore = stuAttempts.length > 0 ? Math.max(...stuAttempts.map((a: any) => a.score)) : 0;
      const completion = exams.length > 0 ? (stuAttempts.length / exams.length) * 100 : 0;

      return { ...student, attemptsCount: stuAttempts.length, avgScore, maxScore, completion, progress, attempts: stuAttempts };
    });
  }, [students, attempts, exams.length, searchQuery]);

  const examStats = useMemo(() => {
    let filtered: any[] = exams;
    if (searchQuery) filtered = filtered.filter(e => (e as any).name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return filtered.map(exam => {
      const exAttempts = attempts.filter((a: any) => a.examId === exam.id);
      const avgScore = exAttempts.length > 0 ? exAttempts.reduce((acc: number, val: any) => acc + val.score, 0) / exAttempts.length : 0;
      const maxScore = exAttempts.length > 0 ? Math.max(...exAttempts.map((a: any) => a.score)) : 0;
      const minScore = exAttempts.length > 0 ? Math.min(...exAttempts.map((a: any) => a.score)) : 0;
      
      return { ...exam, attemptsCount: exAttempts.length, avgScore, maxScore, minScore, attempts: exAttempts };
    });
  }, [exams, attempts, searchQuery]);

  const totalAttempts = attempts.length;
  const avgOverall = totalAttempts > 0 ? attempts.reduce((acc: any, val: any) => acc + val.score, 0) / totalAttempts : 0;
  const studentsNeedingSupport = studentStats.filter(s => s.avgScore < 6.5 && s.attemptsCount > 0);
  const avgCompletion = studentStats.length > 0 ? studentStats.reduce((acc, val) => acc + val.completion, 0) / studentStats.length : 0;

  if (selectedStudent) {
    const chartData = selectedStudent.attempts.map((a: any, i: number) => ({
      name: `Lần ${i + 1}`,
      score: a.score,
      examName: exams.find((e: any) => e.id === a.examId)?.name || `Bài ${i + 1}`
    }));

    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <ArrowLeft size={18} /> Quay lại
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-2xl mb-4">
                {selectedStudent.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{selectedStudent.name}</h2>
              <p className="text-slate-500 font-medium">Lớp {selectedStudent.classId}</p>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Điểm TB:</span>
                  <span className="font-bold text-slate-800 text-lg">{selectedStudent.avgScore.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Đã làm:</span>
                  <span className="font-bold text-slate-800 text-lg">{selectedStudent.attemptsCount}/{exams.length}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-slate-500">Thời gian TB:</span>
                  <span className="font-bold text-slate-800 text-lg">
                    {Math.round(selectedStudent.attempts.reduce((a:any, b:any) => a + b.timeSpent, 0) / (selectedStudent.attemptsCount || 1))} phút
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" /> Tiến bộ học tập
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                      formatter={(value: any, name: any, props: any) => [`${value} điểm`, props.payload.examName]}
                    />
                    <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100"><h3 className="text-lg font-bold text-slate-800">Lịch sử làm bài</h3></div>
              <div className="divide-y divide-slate-100">
                {selectedStudent.attempts.map((attempt: any) => {
                  const exam = exams.find((e: any) => e.id === attempt.examId);
                  return (
                    <div key={attempt.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="font-semibold text-slate-800">{(exam as any)?.name || 'Bài thi'}</div>
                        <div className="text-sm text-slate-500 mt-1">{new Date(attempt.date).toLocaleDateString('vi-VN')} • {attempt.timeSpent} phút</div>
                      </div>
                      <div className="text-xl font-bold text-indigo-600">{attempt.score.toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedExam) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedExam(null)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <ArrowLeft size={18} /> Quay lại
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <FileText size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{selectedExam.name}</h2>
              <div className="inline-block px-2 py-1 mt-2 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">{selectedExam.type}</div>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Ngày giao:</span>
                  <span className="font-semibold text-slate-800">{selectedExam.date ? new Date(selectedExam.date).toLocaleDateString('vi-VN') : 'Không rõ'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Thời gian làm bài:</span>
                  <span className="font-semibold text-slate-800">{selectedExam.duration} phút</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Đã làm:</span>
                  <span className="font-bold text-slate-800 text-lg">{selectedExam.attemptsCount}/{students.length}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-slate-500">Điểm trung bình:</span>
                  <span className="font-bold text-indigo-600 text-lg">{selectedExam.avgScore.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
                <div className="text-sm font-semibold text-slate-500 mb-1">Cao nhất</div>
                <div className="text-2xl font-bold text-emerald-600">{selectedExam.maxScore.toFixed(1)}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
                <div className="text-sm font-semibold text-slate-500 mb-1">Thấp nhất</div>
                <div className="text-2xl font-bold text-amber-600">{selectedExam.minScore.toFixed(1)}</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {selectedExam.parts && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800">Phân tích theo phần</h3>
                </div>
                <div className="p-6 space-y-6">
                  {selectedExam.parts.map((part:any, i:number) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-base font-semibold">
                         <span className="text-slate-700">{part.name}</span>
                         <span className={part.pct < 60 ? "text-amber-600" : "text-emerald-600"}>{part.pct}%</span>
                       </div>
                       <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                         <div 
                           className={clsx("h-full rounded-full transition-all duration-1000", part.pct < 60 ? "bg-amber-400" : "bg-emerald-500")} 
                           style={{ width: `${part.pct}%` }}
                         ></div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Kết quả chi tiết</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {selectedExam.attempts.map((attempt: any) => {
                  const student = students.find((s: any) => s.id === attempt.studentId);
                  return (
                    <div key={attempt.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="font-semibold text-slate-800">{student?.name || 'Học sinh'}</div>
                        <div className="text-sm text-slate-500 mt-1">{attempt.timeSpent} phút • {new Date(attempt.date).toLocaleDateString('vi-VN')}</div>
                      </div>
                      <div className={clsx("text-xl font-bold", attempt.score >= 8 ? "text-emerald-600" : attempt.score >= 6.5 ? "text-indigo-600" : attempt.score >= 5 ? "text-amber-500" : "text-red-500")}>
                        {attempt.score.toFixed(1)}
                      </div>
                    </div>
                  );
                })}
                {selectedExam.attempts.length === 0 && (
                  <div className="p-8 text-center text-slate-500">Chưa có học sinh nào nộp bài.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Kết quả học tập</h2>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
          <label className="text-sm font-semibold text-slate-700 cursor-pointer flex items-center gap-2">
            <input 
              type="checkbox" 
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              checked={isDemoMode}
              onChange={(e) => setIsDemoMode(e.target.checked)}
            />
            Dữ liệu mẫu
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-500">Khối:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['10', '11', '12'].map(g => (
              <button 
                key={g}
                onClick={() => setGradeFilter(g)}
                className={clsx("px-3 py-1 rounded-md text-sm font-bold transition-all", gradeFilter === g ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 pl-3 pr-8 font-medium cursor-pointer outline-none">
              <option value="12A1">12A1</option>
              <option value="12A2">12A2</option>
            </select>
            <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 pl-3 pr-8 font-medium cursor-pointer outline-none">
              <option value="Tất cả">Tất cả thời gian</option>
              <option value="Tuần này">Tuần này</option>
            </select>
            <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          
          <div className="relative hidden sm:block">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 pl-3 pr-8 font-medium cursor-pointer outline-none">
              <option value="Tất cả">Tất cả bài</option>
              <option value="Thường xuyên">Thường xuyên</option>
              <option value="Giữa kỳ">Giữa kỳ</option>
              <option value="Tốt nghiệp">Tốt nghiệp</option>
              <option value="Ôn luyện">Ôn luyện</option>
            </select>
            <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative ml-auto w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2 outline-none transition-colors" 
            placeholder={activeTab === 'students' ? "Tìm học sinh..." : "Tìm bài thi..."}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 font-medium mb-2">
            <BarChart2 size={18} className="text-indigo-500" />
            ĐIỂM TRUNG BÌNH
          </div>
          <div className="text-3xl font-bold text-slate-800">{avgOverall.toFixed(1).replace('.', ',')}</div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 font-medium mb-2">
            <CheckCircle size={18} className="text-emerald-500" />
            TỶ LỆ HOÀN THÀNH
          </div>
          <div className="text-3xl font-bold text-slate-800">{Math.round(avgCompletion)}%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 font-medium mb-2">
            <FileText size={18} className="text-blue-500" />
            SỐ LƯỢT LÀM
          </div>
          <div className="text-3xl font-bold text-slate-800">{totalAttempts}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 font-medium mb-2">
            <AlertCircle size={18} className="text-amber-500" />
            HỌC SINH CẦN HỖ TRỢ
          </div>
          <div className="text-3xl font-bold text-slate-800">{studentsNeedingSupport.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('students')}
                className={clsx("flex-1 py-4 text-center font-bold text-sm transition-colors relative", activeTab === 'students' ? "text-indigo-600" : "text-slate-500 hover:bg-slate-50")}
              >
                THEO HỌC SINH
                {activeTab === 'students' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('exams')}
                className={clsx("flex-1 py-4 text-center font-bold text-sm transition-colors relative", activeTab === 'exams' ? "text-indigo-600" : "text-slate-500 hover:bg-slate-50")}
              >
                THEO BÀI THI
                {activeTab === 'exams' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
              </button>
            </div>
            
            {activeTab === 'students' && (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Học sinh</th>
                        <th className="px-4 py-4 font-semibold">Lớp</th>
                        <th className="px-4 py-4 font-semibold text-center">Số bài</th>
                        <th className="px-4 py-4 font-semibold text-center">Điểm TB</th>
                        <th className="px-4 py-4 font-semibold text-center">Cao nhất</th>
                        <th className="px-4 py-4 font-semibold text-center">Hoàn thành</th>
                        <th className="px-4 py-4 font-semibold text-center">Tiến bộ</th>
                        <th className="px-6 py-4 font-semibold text-right">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentStats.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 font-semibold text-slate-800 whitespace-nowrap">{student.name}</td>
                          <td className="px-4 py-3">{student.classId}</td>
                          <td className="px-4 py-3 text-center">{student.attemptsCount} bài</td>
                          <td className="px-4 py-3 text-center font-bold text-indigo-600">{student.avgScore.toFixed(1).replace('.', ',')}</td>
                          <td className="px-4 py-3 text-center">{student.maxScore.toFixed(1).replace('.', ',')}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${student.completion}%` }}></div>
                              </div>
                              <span className="text-xs font-medium">{Math.round(student.completion)}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {student.progress > 0 ? (
                              <span className="text-emerald-600 flex items-center justify-center gap-1 font-medium"><TrendingUp size={14}/> +{student.progress.toFixed(1).replace('.', ',')}</span>
                            ) : student.progress < 0 ? (
                              <span className="text-amber-600 flex items-center justify-center gap-1 font-medium"><TrendingDown size={14}/> {student.progress.toFixed(1).replace('.', ',')}</span>
                            ) : (
                              <span className="text-slate-400 font-medium">-</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-right">
                            <button onClick={() => setSelectedStudent(student)} className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm hover:underline">
                              Xem
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="md:hidden divide-y divide-slate-100">
                  {studentStats.map((student) => (
                    <div key={student.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-slate-800 text-base">{student.name}</div>
                          <div className="text-sm text-slate-500">{student.classId} • {student.attemptsCount} bài</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-indigo-600 text-lg">{student.avgScore.toFixed(1).replace('.', ',')}</div>
                          <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Điểm TB</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Hoàn thành:</span>
                          <span className="font-medium text-slate-800">{Math.round(student.completion)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Tiến bộ:</span>
                          {student.progress > 0 ? (
                            <span className="text-emerald-600 font-medium flex items-center"><TrendingUp size={14} className="mr-1"/> +{student.progress.toFixed(1)}</span>
                          ) : student.progress < 0 ? (
                            <span className="text-amber-600 font-medium flex items-center"><TrendingDown size={14} className="mr-1"/> {student.progress.toFixed(1)}</span>
                          ) : (
                            <span className="text-slate-400 font-medium">-</span>
                          )}
                        </div>
                      </div>
                      
                      <button onClick={() => setSelectedStudent(student)} className="w-full py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors text-sm">
                        Xem chi tiết
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'exams' && (
              <div className="divide-y divide-slate-100">
                {examStats.map(exam => (
                  <div key={exam.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800 text-base">{exam.name || (exam as any).title}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">{(exam as any).type}</span>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-3">
                        <span>Đã làm: <strong className="text-slate-700">{exam.attemptsCount}/{students.length}</strong></span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{exam.duration} phút</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 sm:justify-end">
                      <div className="text-center">
                        <div className="text-xs font-semibold text-slate-500 mb-0.5">ĐIỂM TB</div>
                        <div className="font-bold text-indigo-600 text-lg">{exam.avgScore.toFixed(1)}</div>
                      </div>
                      <button 
                        onClick={() => setSelectedExam(exam)}
                        className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-semibold text-indigo-600 hover:border-indigo-300 transition-colors"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
            <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
              <AlertCircle size={20} className="text-amber-600" />
              <h3 className="font-bold text-amber-800">Học sinh cần hỗ trợ</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {studentsNeedingSupport.length > 0 ? studentsNeedingSupport.map(student => (
                <div key={student.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800">{student.name}</span>
                    <span className="font-bold text-amber-600">{student.avgScore.toFixed(1)}</span>
                  </div>
                  <div className="text-sm text-slate-600 mb-3 flex items-center gap-2">
                    <span className="text-slate-400">Điểm TB:</span> {student.avgScore.toFixed(1)} 
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400">Yếu:</span> Tích phân, Oxyz
                  </div>
                  <button onClick={() => setSelectedStudent(student)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                    Xem chi tiết
                  </button>
                </div>
              )) : (
                <div className="p-6 text-center text-slate-500 text-sm">
                  Không có học sinh nào.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Phân tích theo chuyên đề</h3>
             </div>
             <div className="p-5 space-y-4">
                {[
                  { name: 'Đạo hàm', pct: 82 },
                  { name: 'Vector', pct: 79 },
                  { name: 'Cực trị', pct: 76 },
                  { name: 'Nguyên hàm', pct: 72 },
                  { name: 'Khảo sát hàm số', pct: 68 },
                  { name: 'Tích phân', pct: 61 },
                  { name: 'Oxyz', pct: 58 },
                ].map((topic, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-700">{topic.name}</span>
                      <span className={topic.pct < 65 ? "text-amber-600 font-bold" : "text-slate-600"}>{topic.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={clsx("h-full rounded-full", topic.pct < 65 ? "bg-amber-400" : "bg-indigo-500")} 
                        style={{ width: `${topic.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
