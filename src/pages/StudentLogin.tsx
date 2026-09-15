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
  const examVersions = useAppStore(state => state.examVersions);
  
  const version = examVersions.find(v => v.id === versionId);

  if (!version) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy bài kiểm tra</h1>
          <p className="text-slate-500 mb-6">Liên kết không tồn tại hoặc dữ liệu bài thi không khả dụng trên thiết bị này.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

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
