import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import { ExamConfig, Grade } from '../types';
import { Settings2, BookOpen, Database, FileText, PenTool, Loader2 , CheckCircle2, X } from 'lucide-react';
import { parseDocx, extractQuestionsFromText } from '../utils/docxParser';

export function CreateExam() {
  const navigate = useNavigate();
  const { currentGrade, addExam } = useAppStore();

  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>(currentGrade);
  const [type, setType] = useState<'THUONG_XUYEN' | 'GIUA_KY' | 'CUOI_KY' | 'TOT_NGHIEP'>('THUONG_XUYEN');
  const [duration, setDuration] = useState(15);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('2');
  
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);

  const [source, setSource] = useState<'BANK' | 'MANUAL' | 'WORD'>('BANK');
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const addExamVersion = useAppStore(state => state.addExamVersion);


  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên đề!");
      return;
    }
    
    if (source === 'WORD' && !file) {
      alert("Vui lòng chọn file Word (.docx)!");
      return;
    }

    const newExam: ExamConfig = {
      id: uuidv4(),
      name: name.trim(),
      type: type,
      durationMinutes: duration,
      parts: type === 'THUONG_XUYEN' ? ['I'] : ['I', 'II', 'III'],
      shuffleQuestions,
      shuffleOptions,
      showAnswersAfter: false,
      grade: grade,
    };
    
    if (source === 'WORD') {
      try {
        setIsParsing(true);
        setParseStatus('Đang đọc file...');
        const text = await parseDocx(file!);
        setParseStatus('Đang nhận diện câu hỏi...');
        const questions = extractQuestionsFromText(text, grade);
        
        if (questions.length === 0) {
            alert("Chưa nhận diện được câu hỏi trong file.");
            setIsParsing(false);
            return;
        }

        addExam(newExam);
        addExamVersion({
            id: uuidv4(),
            examConfigId: newExam.id,
            questions: questions
        });
        
        setIsParsing(false);
        navigate(`/exam-editor/${newExam.id}`);
      } catch (err: any) {
        setIsParsing(false);
        alert("Không thể đọc file Word này: " + err.message);
      }
    } else {
      addExam(newExam);
      navigate(`/exam-preview/${newExam.id}`);
    }
  };


  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Settings2 size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#172033]">Tạo Đề Mới</h2>
          <p className="text-slate-500 mt-1">Thiết lập cấu trúc và nguồn câu hỏi cho đề kiểm tra.</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Thông tin chung */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">1</span>
              Thông tin chung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-10">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Tên đề</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ví dụ: Đề kiểm tra 15 phút Chương 1"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Khối lớp</label>
                <select 
                  value={grade}
                  onChange={e => setGrade(Number(e.target.value) as Grade)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value={10}>Khối 10</option>
                  <option value={11}>Khối 11</option>
                  <option value={12}>Khối 12</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Loại bài</label>
                <select 
                  value={type}
                  onChange={e => {
                    const t = e.target.value as any;
                    setType(t);
                    if (t === 'THUONG_XUYEN') setDuration(15);
                    else setDuration(90);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="THUONG_XUYEN">Thường xuyên (15 phút)</option>
                  <option value="GIUA_KY">Giữa kỳ (90 phút)</option>
                  <option value="CUOI_KY">Cuối kỳ (90 phút)</option>
                  <option value="TOT_NGHIEP">Tốt nghiệp (90 phút)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Chủ đề (Tùy chọn)</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Hàm số, Khối đa diện..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mức độ ưu tiên</label>
                <select 
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="1">Nhận biết - Thông hiểu (Dễ)</option>
                  <option value="2">Cân bằng (Tiêu chuẩn)</option>
                  <option value="3">Vận dụng - Nâng cao (Khó)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian làm bài (phút)</label>
                <input 
                  type="number" 
                  min="1"
                  max="180"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Thiết lập nâng cao */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">2</span>
              Cấu hình trộn đề
            </h3>
            <div className="pl-10 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-slate-700 font-medium">Trộn ngẫu nhiên thứ tự câu hỏi</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <div>
                  <span className="text-slate-700 font-medium block">Trộn đáp án A–D</span>
                  <span className="text-sm text-slate-500">Hệ thống sẽ tự động hoán vị A,B,C,D nhưng vẫn giữ đúng đáp án chính xác.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Nguồn câu hỏi */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">3</span>
              Nguồn dữ liệu
            </h3>
            <div className="pl-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center text-center gap-3 transition-all ${source === 'BANK' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-600'}`}>
                <input 
                  type="radio" 
                  name="source" 
                  value="BANK" 
                  checked={source === 'BANK'} 
                  onChange={() => setSource('BANK')}
                  className="sr-only" 
                />
                <Database size={28} className={source === 'BANK' ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="font-bold">Ngân hàng câu hỏi</span>
                <span className="text-xs text-slate-500">Rút ngẫu nhiên theo ma trận</span>
              </label>

              <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center text-center gap-3 transition-all ${source === 'MANUAL' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-600'}`}>
                <input 
                  type="radio" 
                  name="source" 
                  value="MANUAL" 
                  checked={source === 'MANUAL'} 
                  onChange={() => setSource('MANUAL')}
                  className="sr-only" 
                />
                <PenTool size={28} className={source === 'MANUAL' ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="font-bold">Nhập thủ công</span>
                <span className="text-xs text-slate-500">Tự soạn từng câu hỏi trực tiếp</span>
              </label>

              <label 
                onClick={() => {
                  setSource('WORD');
                  if (!file) fileInputRef.current?.click();
                }}
                className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center text-center gap-3 transition-all ${source === 'WORD' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-600'}`}
              >
                <input 
                  type="radio" 
                  name="source" 
                  value="WORD" 
                  checked={source === 'WORD'} 
                  onChange={() => setSource('WORD')}
                  className="sr-only" 
                />
                <FileText size={28} className={source === 'WORD' ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="font-bold">Tải Word .docx</span>
                <span className="text-xs text-slate-500">Nhận dạng đề từ file Word</span>
              </label>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                accept=".docx"
                className="hidden"
                onChange={(e) => {
                   const selected = e.target.files?.[0];
                   if (selected && selected.name.endsWith('.docx')) {
                      setFile(selected);
                   } else if (selected) {
                      alert('Vui lòng chọn file định dạng .docx hợp lệ.');
                      setFile(null);
                   }
                }}
              />
                        </div>
          </div>
          
          {source === 'WORD' && file && (
            <div className="mt-4 p-4 border border-indigo-200 bg-indigo-50 rounded-xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                 </div>
                 <div>
                    <div className="font-bold text-slate-800">{file.name}</div>
                    <div className="text-sm text-slate-500">
                      {Math.round(file.size / 1024)} KB • {isParsing ? parseStatus : 'Đã tải lên'}
                    </div>
                 </div>
               </div>
               <button 
                  type="button" 
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="text-slate-400 hover:text-red-500 transition-colors"
               >
                 <X size={20} />
               </button>
            </div>
          )}
          
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-6 md:px-8 flex justify-end">
          <button
            type="submit"
            disabled={isParsing || (source === 'WORD' && !file)}
            className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors shadow-sm flex items-center gap-2"
          >
            {isParsing ? <Loader2 size={20} className="animate-spin" /> : <BookOpen size={20} />}
            {isParsing ? 'ĐANG TẠO ĐỀ...' : 'TẠO ĐỀ VÀ XEM TRƯỚC'}
          </button>
        </div>
      </form>
    </div>
  );
}
