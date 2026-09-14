const fs = require('fs');
let code = fs.readFileSync('src/pages/ClassManagement.tsx', 'utf8');

const modals = `
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
                  id: \`s_\${Date.now()}\`,
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
              const lines = text.split('\\n').filter((l: string) => l.trim().length > 0);
              lines.forEach((line: string) => {
                const parts = line.split('-');
                store.addStudent({
                  id: \`s_\${Date.now()}_\${Math.random()}\`,
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
                placeholder="Nguyễn Minh Anh\nTrần Gia Bảo\nLê Hoàng Nam - 12A1-003"
              ></textarea>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setImportModal(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">NHẬP DỮ LIỆU</button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

code = code.replace(
  '{/* Delete Confirm Modal */}',
  modals + '\n      {/* Delete Confirm Modal */}'
);

fs.writeFileSync('src/pages/ClassManagement.tsx', code);
