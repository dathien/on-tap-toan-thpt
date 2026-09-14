import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import { StudentAttempt } from '../types';

export function StudentLogin() {
  const { versionId } = useParams<{ versionId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const addAttempt = useAppStore(state => state.addAttempt);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanClass = typeof studentClass === 'string' ? studentClass.trim() : '';
    
    if (!cleanName || !cleanClass || !versionId) return;

    const attemptId = uuidv4();
    const newAttempt: StudentAttempt = {
      id: attemptId,
      examVersionId: versionId,
      studentName: cleanName,
      className: cleanClass,
      startTime: Date.now(),
      endTime: null,
      durationUsed: null,
      answers: {},
      score: null,
      status: 'IN_PROGRESS',
      focusEvents: []
    };
    
    addAttempt(newAttempt);
    navigate(`/student/take/${attemptId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Vào phòng thi</h1>
        <p className="text-center text-slate-500 mb-8">Vui lòng nhập thông tin để bắt đầu làm bài</p>
        
        <form onSubmit={handleStart} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-base"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lớp</label>
            <input 
              type="text" 
              required
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-base"
              placeholder="12A1"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-lg mt-4"
          >
            BẮT ĐẦU LÀM BÀI
          </button>
        </form>
      </div>
    </div>
  );
}
