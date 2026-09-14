import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import { ExamConfig, Grade } from '../types';

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

  const handleCreate = () => {
    const newExam: ExamConfig = {
      id: uuidv4(),
      name: `Đề ${type === 'THUONG_XUYEN' ? 'Thường Xuyên' : type === 'GIUA_KY' ? 'Giữa Kỳ' : type === 'CUOI_KY' ? 'Cuối Kỳ' : 'Tốt Nghiệp'} Toán ${currentGrade}`,
      type: type as any,
      durationMinutes: duration,
      parts,
      shuffleQuestions,
      shuffleOptions,
      showAnswersAfter: false,
      grade: currentGrade,
    };
    addExam(newExam);
    navigate(`/exam-preview/${newExam.id}`); // Or direct to start test for now
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/review')} className="text-slate-500 hover:text-slate-800">
          ← Quay lại
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Tạo đề ôn tập</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8">
        
        {!isThuongXuyen && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Chế độ tạo bài</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleModeChange('CHUAN')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  mode === 'CHUAN' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Đề Chuẩn
              </button>
              <button
                onClick={() => handleModeChange('LINH_HOAT')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  mode === 'LINH_HOAT' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
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
            className="w-full max-w-xs px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 text-base"
          />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Cấu trúc phần thi</h3>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 rounded-xl border ${parts.includes('I') ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200'} ${mode === 'CHUAN' ? 'opacity-70' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={parts.includes('I')}
                onChange={() => handleTogglePart('I')}
                disabled={mode === 'CHUAN' || isThuongXuyen}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              <div>
                <div className="font-semibold text-slate-800">Phần I: Trắc nghiệm nhiều phương án</div>
                <div className="text-sm text-slate-500">
                  {isThuongXuyen ? '10 câu (A, B, C, D)' : '12 câu (A, B, C, D)'}
                </div>
              </div>
            </label>

            {!isThuongXuyen && (
              <>
                <label className={`flex items-center gap-3 p-4 rounded-xl border ${parts.includes('II') ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200'} ${mode === 'CHUAN' ? 'opacity-70' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    checked={parts.includes('II')}
                    onChange={() => handleTogglePart('II')}
                    disabled={mode === 'CHUAN'}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <div>
                    <div className="font-semibold text-slate-800">Phần II: Trắc nghiệm Đúng / Sai</div>
                    <div className="text-sm text-slate-500">4 câu lớn × 4 ý</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 rounded-xl border ${parts.includes('III') ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200'} ${mode === 'CHUAN' ? 'opacity-70' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    checked={parts.includes('III')}
                    onChange={() => handleTogglePart('III')}
                    disabled={mode === 'CHUAN'}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <div>
                    <div className="font-semibold text-slate-800">Phần III: Trả lời ngắn</div>
                    <div className="text-sm text-slate-500">6 câu điền đáp án</div>
                  </div>
                </label>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Tùy chọn hiển thị</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700">Trộn thứ tự câu hỏi</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleOptions}
                onChange={(e) => setShuffleOptions(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700">Trộn đáp án A-D (luôn bảo toàn đáp án đúng)</span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleCreate}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-lg"
          >
            Tạo Đề & Xem Trước
          </button>
        </div>

      </div>
    </div>
  );
}
