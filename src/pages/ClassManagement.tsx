import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Class, Student, StudentAttempt, ExamConfig } from '../types';
import { Users, Search, Plus, MoreHorizontal, Edit, Copy, Trash2, ArrowLeft, BarChart2, Activity, CheckCircle, FileText, Upload, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export function ClassManagement() {
  const store = useAppStore();
  const navigate = useNavigate();
  
  // App state
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  
  // Filters
  const [yearFilter, setYearFilter] = useState('2026-2027');
  const [gradeFilter, setGradeFilter] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [classModal, setClassModal] = useState<{isOpen: boolean, data: Partial<Class> | null}>({ isOpen: false, data: null });
  const [studentModal, setStudentModal] = useState<{isOpen: boolean, data: Partial<Student> | null}>({ isOpen: false, data: null });
  const [importModal, setImportModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, type: 'class'|'student', id: string, name: string}>({isOpen: false, type: 'class', id: '', name: ''});

  // Derived data
  const classes = useMemo(() => {
    let filtered = store.classes;
    if (yearFilter !== 'Tất cả') filtered = filtered.filter(c => c.schoolYear === yearFilter);
    if (gradeFilter !== 'Tất cả') filtered = filtered.filter(c => c.grade.toString() === gradeFilter);
    if (searchQuery) filtered = filtered.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [store.classes, yearFilter, gradeFilter, searchQuery]);

  const getClassStats = (classId: string) => {
    const classStudents = store.students.filter(s => s.classId === classId);
    const studentIds = classStudents.map(s => s.id);
    const classAttempts = store.attempts.filter(a => studentIds.includes(a.studentName)); // using studentName as ID for simplicity? wait, studentName is string. 
    
    // In our system, attempts might not have studentId, but we generated attempts in TeacherResults with studentId.
    // Wait, StudentAttempt type has studentName. 
    // Let's check TeacherResults. It used a local generated demo attempts.
    
    // Fallback if we use real attempts
    const classRealAttempts = store.attempts.filter(a => a.className === store.classes.find(c => c.id === classId)?.name);
    
    const isDemo = store.classes.find(c => c.id === classId)?.isDemo;
    
    let count = classStudents.length;
    if (isDemo) {
      if (classId === 'c_12a1') count = 40;
      else if (classId === 'c_11a1') count = 38;
      else if (classId === 'c_10a1') count = 35;
    }
    // mock some data if demo class
    
    let avgScore = 0;
    let completion = 0;
    let activeThisWeek = 0;
    
    if (isDemo && classId === 'c_12a1') {
      avgScore = 7.8;
      completion = 90;
      activeThisWeek = 36;
    } else if (isDemo && classId === 'c_11a1') {
      avgScore = 7.2;
      completion = 85;
      activeThisWeek = 30;
    } else if (isDemo && classId === 'c_10a1') {
      avgScore = 8.1;
      completion = 92;
      activeThisWeek = 33;
    } else {
       if (classRealAttempts.length > 0) {
         avgScore = classRealAttempts.reduce((acc, val) => acc + (val.score || 0), 0) / classRealAttempts.length;
         activeThisWeek = new Set(classRealAttempts.map(a => a.studentName)).size;
         completion = count > 0 ? Math.round((activeThisWeek / count) * 100) : 0;
       }
    }
    
    return { count, avgScore, completion, activeThisWeek };
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (classModal.data?.id) {
      store.updateClass(classModal.data.id, classModal.data);
    } else {
      store.addClass({
        id: `c_${Date.now()}`,
        name: classModal.data?.name || 'Lớp mới',
        grade: classModal.data?.grade || 12,
        schoolYear: classModal.data?.schoolYear || '2026-2027',
        description: classModal.data?.description || '',
        isDemo: false
      });
    }
    setClassModal({isOpen: false, data: null});
  };

  const handleDelete = () => {
    if (deleteConfirm.type === 'class') {
      store.deleteClass(deleteConfirm.id);
      setActiveClassId(null);
    } else {
      store.deleteStudent(deleteConfirm.id);
    }
    setDeleteConfirm({isOpen: false, type: 'class', id: '', name: ''});
  };

  if (activeClassId) {
    return <ClassDetail 
      classId={activeClassId} 
      onBack={() => setActiveClassId(null)} 
      onEditStudent={(s) => setStudentModal({isOpen: true, data: s})}
      onDeleteStudent={(s) => setDeleteConfirm({isOpen: true, type: 'student', id: s.id, name: s.fullName})}
      onAddStudent={() => setStudentModal({isOpen: true, data: {classId: activeClassId}})}
      onImport={() => setImportModal(true)}
    />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">LỚP HỌC</h2>
        <p className="text-slate-500">Quản lý lớp, học sinh và hoạt động học tập.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block py-2 pl-3 pr-8 font-medium cursor-pointer outline-none">
              <option value="Tất cả">Năm học: Tất cả</option>
              <option value="2026-2027">Năm học: 2026–2027</option>
              <option value="2025-2026">Năm học: 2025–2026</option>
            </select>
            <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block py-2 pl-3 pr-8 font-medium cursor-pointer outline-none">
              <option value="Tất cả">Khối: Tất cả</option>
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
            <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2 outline-none transition-colors" 
            placeholder="Tìm lớp..."
          />
        </div>
        
        <button 
          onClick={() => setClassModal({isOpen: true, data: {}})}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors ml-auto"
        >
          <Plus size={18} /> THÊM LỚP
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => {
          const stats = getClassStats(cls.id);
          return (
            <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{cls.name}</h3>
                  <div className="relative group">
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100">
                      <MoreHorizontal size={20} />
                    </button>
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <div className="py-1">
                        <button 
                          onClick={() => setClassModal({isOpen: true, data: cls})}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                        >
                          <Edit size={14} /> Sửa lớp
                        </button>
                        <button 
                          onClick={() => {
                            const newCls = {...cls, id: `c_${Date.now()}`, name: `${cls.name} (Copy)`};
                            store.addClass(newCls);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                        >
                          <Copy size={14} /> Nhân bản lớp
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({isOpen: true, type: 'class', id: cls.id, name: cls.name})}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Xóa lớp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-6">
                  Khối {cls.grade} <span className="w-1 h-1 rounded-full bg-slate-300"></span> {stats.count} học sinh
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Đã làm bài tuần này:</span>
                    <span className="font-semibold text-slate-800">{stats.activeThisWeek}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Điểm TB:</span>
                    <span className="font-semibold text-slate-800">{stats.avgScore.toFixed(1).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Hoàn thành:</span>
                    <span className="font-semibold text-emerald-600">{stats.completion}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto border-t border-slate-100 p-4 bg-slate-50/50 flex gap-2">
                <button 
                  onClick={() => setActiveClassId(cls.id)}
                  className="flex-1 bg-white border border-slate-200 text-indigo-600 font-bold py-2 rounded-lg hover:border-indigo-600 transition-colors shadow-sm text-sm"
                >
                  MỞ LỚP
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Modal */}
      {classModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">{classModal.data?.id ? 'Sửa lớp' : 'Thêm lớp'}</h3>
            </div>
            <form onSubmit={handleSaveClass} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên lớp *</label>
                <input 
                  type="text" 
                  required
                  value={classModal.data?.name || ''} 
                  onChange={(e) => setClassModal({isOpen: true, data: {...classModal.data, name: e.target.value}})}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  placeholder="VD: 12A1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Khối *</label>
                  <select 
                    required
                    value={classModal.data?.grade || 12}
                    onChange={(e) => setClassModal({isOpen: true, data: {...classModal.data, grade: parseInt(e.target.value)}})}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  >
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Năm học *</label>
                  <input 
                    type="text" 
                    required
                    value={classModal.data?.schoolYear || '2026-2027'}
                    onChange={(e) => setClassModal({isOpen: true, data: {...classModal.data, schoolYear: e.target.value}})}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả</label>
                <textarea 
                  value={classModal.data?.description || ''}
                  onChange={(e) => setClassModal({isOpen: true, data: {...classModal.data, description: e.target.value}})}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-20"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setClassModal({isOpen: false, data: null})} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">SAVE / LƯU LỚP</button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {/* Student Modal */}
      {studentModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">{studentModal.data?.id ? 'Sửa học sinh' : 'Thêm học sinh'}</h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (studentModal.data?.id) {
                store.updateStudent(studentModal.data.id, studentModal.data);
              } else {
                store.addStudent({
                  id: `s_${Date.now()}`,
                  fullName: studentModal.data?.fullName || '',
                  code: studentModal.data?.code || '',
                  classId: studentModal.data?.classId || '',
                  isDemo: false
                });
              }
              setStudentModal({isOpen: false, data: null});
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Họ và tên *</label>
                <input 
                  type="text" 
                  required
                  value={studentModal.data?.fullName || ''} 
                  onChange={(e) => setStudentModal({isOpen: true, data: {...studentModal.data, fullName: e.target.value}})}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mã học sinh</label>
                <input 
                  type="text" 
                  value={studentModal.data?.code || ''} 
                  onChange={(e) => setStudentModal({isOpen: true, data: {...studentModal.data, code: e.target.value}})}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Lớp</label>
                <select 
                  required
                  value={studentModal.data?.classId || ''}
                  onChange={(e) => setStudentModal({isOpen: true, data: {...studentModal.data, classId: e.target.value}})}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="">-- Chọn lớp --</option>
                  {store.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setStudentModal({isOpen: false, data: null})} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">LƯU</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {importModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Nhập danh sách học sinh</h3>
              <p className="text-sm text-slate-500 mt-1">Dán danh sách học sinh (mỗi dòng 1 tên) hoặc kèm mã (VD: Nguyễn Văn A - 12A1-001)</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const text = (e.target as any).list.value;
              const lines = text.split('\n').filter((l: string) => l.trim().length > 0);
              lines.forEach((line: string) => {
                const parts = line.split('-');
                store.addStudent({
                  id: `s_${Date.now()}_${Math.random()}`,
                  fullName: parts[0].trim(),
                  code: parts[1] ? parts[1].trim() : '',
                  classId: activeClassId || '',
                  isDemo: false
                });
              });
              setImportModal(false);
            }} className="p-6 space-y-4">
              <textarea 
                name="list"
                required
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-48 text-sm"
                placeholder="Nguyễn Minh Anh
Trần Gia Bảo
Lê Hoàng Nam - 12A1-003"
              ></textarea>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setImportModal(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">NHẬP DỮ LIỆU</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa</h3>
            <p className="text-slate-500 mb-6">Bạn có chắc chắn muốn xóa {deleteConfirm.type === 'class' ? 'lớp' : 'học sinh'} <strong className="text-slate-800">{deleteConfirm.name}</strong> không? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({isOpen: false, type: 'class', id: '', name: ''})} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">Hủy</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Class Detail Component ---

function ClassDetail({ 
  classId, 
  onBack, 
  onEditStudent, 
  onDeleteStudent, 
  onAddStudent,
  onImport
}: {
  classId: string, 
  onBack: () => void,
  onEditStudent: (s: Student) => void,
  onDeleteStudent: (s: Student) => void,
  onAddStudent: () => void,
  onImport: () => void
}) {
  const store = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assigned' | 'results'>('overview');
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const cls = store.classes.find(c => c.id === classId);
  const students = store.students.filter(s => s.classId === classId);
  
  if (!cls) return <div>Lớp không tồn tại</div>;

  const isDemoClass = cls.isDemo;
  const filteredStudents = students.filter(s => s.fullName.toLowerCase().includes(searchStudent.toLowerCase()));

  // Mock Overview stats
  let totalStudents = students.length;
  let activeStudents = isDemoClass ? 37 : 0;
  let avgScore = isDemoClass ? 7.8 : 0;
  let completion = isDemoClass ? 90 : 0;
  
  const recentActivities = [
    { name: 'Đạo hàm và cực trị', done: 36, total: 40, avg: 8.1 },
    { name: 'Khảo sát hàm số', done: 34, total: 40, avg: 7.4 },
    { name: 'Vector và Oxyz', done: 31, total: 40, avg: 6.9 },
  ];

  const assignedExams = [
    { id: 'e1', name: 'Đạo hàm và cực trị', type: 'Thường xuyên', duration: 15, done: 36, total: 40 },
    { id: 'e2', name: 'Khảo sát hàm số', type: 'Ôn luyện', duration: 30, done: 34, total: 40 },
    { id: 'e3', name: 'Giữa kỳ I', type: 'Giữa kỳ', duration: 90, done: 40, total: 40 },
  ];

  if (selectedStudentId) {
    const student = students.find(s => s.id === selectedStudentId);
    if (student) {
      return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
          <button onClick={() => setSelectedStudentId(null)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
            <ArrowLeft size={18} /> Quay lại lớp {cls.name}
          </button>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 uppercase">{student.fullName}</h2>
                  <p className="text-slate-500 font-medium mt-1">{cls.name} • Mã: {student.code || 'Chưa có'}</p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">Điểm TB</div>
                    <div className="text-2xl font-bold text-indigo-600">{isDemoClass ? '8,6' : '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">Đã hoàn thành</div>
                    <div className="text-2xl font-bold text-slate-800">{isDemoClass ? '8/8' : '0/0'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">Tiến bộ</div>
                    <div className="text-2xl font-bold text-emerald-600 flex items-center gap-1">
                      {isDemoClass ? <>↑ 0,8</> : '-'}
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Chủ đề</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Đạo hàm', pct: 90 },
                    { name: 'Cực trị', pct: 85 },
                    { name: 'Khảo sát hàm số', pct: 80 },
                    { name: 'Tích phân', pct: 75 },
                    { name: 'Oxyz', pct: 82 },
                  ].map((topic, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-700">{topic.name}</span>
                        <span className="text-slate-600">{topic.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${topic.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Lịch sử bài làm</h3>
                <div className="divide-y divide-slate-100">
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Đạo hàm và cực trị</span>
                    <span className="font-bold text-emerald-600">9,0</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Khảo sát hàm số</span>
                    <span className="font-bold text-indigo-600">8,5</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Giữa kỳ I</span>
                    <span className="font-bold text-indigo-600">8,7</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/results')}
                  className="w-full mt-6 py-2 bg-slate-50 text-indigo-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                >
                  XEM KẾT QUẢ ĐẦY ĐỦ
                </button>
             </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-4">
          <ArrowLeft size={18} /> Quay lại danh sách lớp
        </button>
        <h2 className="text-2xl font-bold text-slate-800 uppercase">LỚP {cls.name}</h2>
        <p className="text-slate-500 font-medium">Khối {cls.grade} • Năm học {cls.schoolYear}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center border-b border-slate-100 overflow-x-auto">
          {[
            { id: 'overview', label: 'TỔNG QUAN' },
            { id: 'students', label: 'HỌC SINH' },
            { id: 'assigned', label: 'BÀI ĐÃ GIAO' },
            { id: 'results', label: 'KẾT QUẢ' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap",
                activeTab === tab.id ? "text-indigo-600" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-sm font-semibold text-slate-500 mb-1">Sĩ số</div>
                    <div className="text-3xl font-bold text-slate-800">{totalStudents}</div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-sm font-semibold text-slate-500 mb-1">Đã hoạt động</div>
                    <div className="text-3xl font-bold text-slate-800">{activeStudents}</div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-sm font-semibold text-slate-500 mb-1">Điểm trung bình</div>
                    <div className="text-3xl font-bold text-indigo-600">{avgScore.toFixed(1).replace('.', ',')}</div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-sm font-semibold text-slate-500 mb-1">Hoàn thành bài</div>
                    <div className="text-3xl font-bold text-emerald-600">{completion}%</div>
                 </div>
               </div>
               
               <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">HOẠT ĐỘNG GẦN ĐÂY</h3>
                  <div className="space-y-4">
                    {recentActivities.map((act, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div>
                          <div className="font-bold text-slate-800">{act.name}</div>
                          <div className="text-sm text-slate-500 mt-1">{act.done}/{act.total} đã làm</div>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <div className="text-sm font-semibold text-slate-500 mb-0.5">Điểm TB</div>
                          <div className="font-bold text-indigo-600 text-lg">{act.avg.toFixed(1).replace('.', ',')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-4">
               <div className="flex flex-wrap items-center justify-between gap-4">
                 <div className="flex flex-wrap gap-2">
                   <button onClick={onAddStudent} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                     <Plus size={16} /> THÊM HỌC SINH
                   </button>
                   <button onClick={onImport} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                     <Upload size={16} /> NHẬP DANH SÁCH
                   </button>
                   <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                     <FileText size={16} /> XUẤT DANH SÁCH
                   </button>
                 </div>
                 
                 <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search size={16} className="text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2 outline-none" 
                      placeholder="Tìm học sinh..."
                    />
                 </div>
               </div>

               {/* Desktop Table */}
               <div className="hidden md:block overflow-x-auto mt-4">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-center w-12">STT</th>
                        <th className="px-4 py-3 font-semibold">Họ và tên</th>
                        <th className="px-4 py-3 font-semibold">Mã HS</th>
                        <th className="px-4 py-3 font-semibold">Trạng thái</th>
                        <th className="px-4 py-3 font-semibold text-center">Số bài đã làm</th>
                        <th className="px-4 py-3 font-semibold text-center">Điểm TB</th>
                        <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-center">{String(idx + 1).padStart(2, '0')}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">{s.fullName}</td>
                          <td className="px-4 py-3">{s.code || '-'}</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Hoạt động</span></td>
                          <td className="px-4 py-3 text-center">{isDemoClass ? (8 - (idx % 3)) : 0}</td>
                          <td className="px-4 py-3 text-center font-bold text-indigo-600">{isDemoClass ? (8.6 - (idx % 3) * 0.4).toFixed(1).replace('.', ',') : '-'}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button onClick={() => setSelectedStudentId(s.id)} className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">Xem</button>
                              <button onClick={() => onEditStudent(s)} className="text-slate-400 hover:text-indigo-600"><Edit size={16}/></button>
                              <button onClick={() => onDeleteStudent(s)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr><td colSpan={7} className="p-8 text-center text-slate-500">Không tìm thấy học sinh nào.</td></tr>
                      )}
                    </tbody>
                  </table>
               </div>
               
               {/* Mobile Cards */}
               <div className="md:hidden space-y-4 mt-4">
                  {filteredStudents.map((s, idx) => (
                    <div key={s.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                       <div className="flex justify-between items-start mb-2">
                         <div className="font-bold text-slate-800 text-lg">{s.fullName}</div>
                         <div className="flex gap-2">
                           <button onClick={() => onEditStudent(s)} className="text-slate-400 hover:text-indigo-600 p-1"><Edit size={16}/></button>
                           <button onClick={() => onDeleteStudent(s)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                         </div>
                       </div>
                       <div className="text-sm text-slate-500 space-y-1 mb-4">
                         <div>Mã: <span className="font-medium text-slate-700">{s.code || '-'}</span></div>
                         <div>Đã làm: <span className="font-medium text-slate-700">{isDemoClass ? (8 - (idx % 3)) : 0} bài</span></div>
                         <div>Điểm TB: <span className="font-bold text-indigo-600">{isDemoClass ? (8.6 - (idx % 3) * 0.4).toFixed(1).replace('.', ',') : '-'}</span></div>
                       </div>
                       <button onClick={() => setSelectedStudentId(s.id)} className="w-full py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors text-sm">
                         Xem chi tiết
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'assigned' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Danh sách bài đã giao</h3>
                <Link to="/materials" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                  <Plus size={16} /> GIAO BÀI
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedExams.map(exam => (
                  <div key={exam.id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                    <div className="font-bold text-slate-800 text-lg mb-1">{exam.name}</div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">{exam.type}</span>
                      <span className="text-sm text-slate-500">{exam.duration} phút</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-4">
                      <span className="text-slate-600">Đã nộp:</span>
                      <span className="font-bold text-slate-800">{exam.done}/{exam.total}</span>
                    </div>
                    <Link to="/results" className="block w-full text-center py-2 border border-slate-200 text-indigo-600 font-semibold rounded-lg hover:border-indigo-600 transition-colors text-sm">
                      CHI TIẾT
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="max-w-xl mx-auto space-y-6">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                 <h3 className="text-lg font-bold text-slate-800 mb-6">Tổng quan kết quả lớp {cls.name}</h3>
                 
                 <div className="grid grid-cols-3 gap-4 mb-8">
                   <div>
                     <div className="text-sm font-semibold text-slate-500 mb-1">Điểm TB lớp</div>
                     <div className="text-3xl font-bold text-indigo-600">7,8</div>
                   </div>
                   <div>
                     <div className="text-sm font-semibold text-slate-500 mb-1">Cao nhất</div>
                     <div className="text-3xl font-bold text-emerald-600">9,5</div>
                   </div>
                   <div>
                     <div className="text-sm font-semibold text-slate-500 mb-1">Hoàn thành</div>
                     <div className="text-3xl font-bold text-slate-800">90%</div>
                   </div>
                 </div>
                 
                 <button 
                  onClick={() => navigate('/results')}
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                 >
                   XEM PHÂN TÍCH ĐẦY ĐỦ
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Ensure the page export also contains the Student/Import Modals
