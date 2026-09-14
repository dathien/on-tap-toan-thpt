import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { StudentAttempt } from '../types';
import { Clock, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';

export function LiveTracking() {
  const { attempts, exams } = useAppStore();
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAttempts = attempts.filter(a => a.status === 'IN_PROGRESS' || a.status === 'SUBMITTED' || a.status === 'AUTO_SUBMITTED');

  const getExamDuration = (versionId: string) => {
    const exam = exams.find(e => e.id === versionId);
    return exam?.durationMinutes || 90;
  };

  const calculateRemaining = (startTime: number, durationMinutes: number) => {
    const end = startTime + durationMinutes * 60 * 1000;
    const remain = Math.max(0, end - Date.now());
    const m = Math.floor(remain / 60000);
    const s = Math.floor((remain % 60000) / 1000);
    return { m, s, totalMs: remain };
  };

  const getStatusDisplay = (attempt: StudentAttempt) => {
    if (attempt.status === 'SUBMITTED' || attempt.status === 'AUTO_SUBMITTED') {
      return (
        <span className="flex items-center gap-2 text-emerald-600 font-medium">
          <CheckCircle size={18} /> Đã nộp
        </span>
      );
    }
    
    const duration = getExamDuration(attempt.examVersionId);
    const { m } = calculateRemaining(attempt.startTime, duration);
    
    if (m <= 5) {
      return (
        <span className="flex items-center gap-2 text-orange-600 font-medium">
          <AlertCircle size={18} /> Gần hết giờ
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2 text-indigo-600 font-medium">
        <PlayCircle size={18} /> Đang làm
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#172033]">THEO DÕI BÀI ĐANG DIỄN RA</h2>
        <p className="text-slate-500 mt-2 text-lg">Giám sát tiến độ học sinh trong phòng thi.</p>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Học sinh</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Tiến độ</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Còn lại</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeAttempts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Chưa có học sinh nào đang làm bài</td>
              </tr>
            )}
            {activeAttempts.map(attempt => {
              const totalQuestions = Object.keys(attempt.answers).length; // simple mock for total
              const duration = getExamDuration(attempt.examVersionId);
              const { m, s } = calculateRemaining(attempt.startTime, duration);
              
              return (
                <tr key={attempt.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{attempt.studentName}</div>
                    <div className="text-sm text-slate-500">Lớp {attempt.className}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusDisplay(attempt)}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {Object.keys(attempt.answers).filter(k => attempt.answers[k]).length} / {totalQuestions || '?'}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-700">
                    {(attempt.status === 'SUBMITTED' || attempt.status === 'AUTO_SUBMITTED') ? '00:00' : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {activeAttempts.length === 0 && (
          <div className="bg-white p-6 rounded-[20px] shadow-sm text-center text-slate-500">
            Chưa có học sinh nào đang làm bài
          </div>
        )}
        {activeAttempts.map(attempt => {
           const duration = getExamDuration(attempt.examVersionId);
           const { m, s } = calculateRemaining(attempt.startTime, duration);
           
           return (
             <div key={attempt.id} className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-5">
               <div className="flex justify-between items-start mb-3">
                 <div>
                   <div className="font-bold text-lg text-slate-800">{attempt.studentName}</div>
                   <div className="text-sm text-slate-500">Lớp {attempt.className}</div>
                 </div>
                 {getStatusDisplay(attempt)}
               </div>
               <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                 <div className="text-sm text-slate-600">Tiến độ: <span className="font-medium text-slate-800">{Object.keys(attempt.answers).filter(k => attempt.answers[k]).length} câu</span></div>
                 <div className="font-mono font-medium text-slate-800 flex items-center gap-1.5">
                   <Clock size={16} className="text-slate-400" />
                   {(attempt.status === 'SUBMITTED' || attempt.status === 'AUTO_SUBMITTED') ? '00:00' : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
                 </div>
               </div>
             </div>
           )
        })}
      </div>
    </div>
  );
}
