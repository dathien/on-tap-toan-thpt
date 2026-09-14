const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const setupBlockRegex = /if \(view === 'SETUP'\) \{[\s\S]*?return \([\s\S]*?<div className="pt-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/;

const newSetupBlock = `
  if (view === 'SETUP') {
    const availableTopics = demoCurriculum[selectedGrade as keyof typeof demoCurriculum] || [];
    const selectedTopicObj = availableTopics.find(t => t.id === selectedTopic);
    const availableLessons = selectedTopicObj ? selectedTopicObj.lessons : [];
    
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12 mt-8 animate-fade-in">
        <button 
          onClick={() => setView('HOME')} 
          className="flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-2 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          QUAY LẠI TỔNG QUAN
        </button>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-wide">Thiết lập Lộ trình</h2>
          <p className="text-slate-500 mt-2">Hệ thống sẽ cá nhân hóa bài học dựa trên nhóm năng lực</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">1. Khối lớp</label>
                  <select 
                    value={selectedGrade}
                    onChange={e => {
                      const newGrade = Number(e.target.value) as 10 | 11 | 12;
                      setSelectedGrade(newGrade);
                      const newTopics = demoCurriculum[newGrade];
                      if (newTopics && newTopics.length > 0) {
                        setSelectedTopic(newTopics[0].id);
                        setSelectedLesson(newTopics[0].lessons?.[0]?.id || '');
                      } else {
                        setSelectedTopic('');
                        setSelectedLesson('');
                      }
                    }}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-medium text-slate-700 bg-white"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">2. Chủ đề</label>
                  <select 
                    value={selectedTopic}
                    onChange={e => {
                      const topicId = e.target.value;
                      setSelectedTopic(topicId);
                      const tObj = availableTopics.find(t => t.id === topicId);
                      setSelectedLesson(tObj?.lessons?.[0]?.id || '');
                    }}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-medium text-slate-700 bg-white"
                  >
                    {availableTopics.map(topic => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">3. Bài học</label>
                  <select 
                    value={selectedLesson}
                    onChange={e => setSelectedLesson(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-medium text-slate-700 bg-white"
                  >
                    {availableLessons.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.name}</option>)}
                  </select>
                </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold text-slate-700">4. Nhóm năng lực</label>
                  <button onClick={() => setSelectedAbility('AVERAGE')} className="text-sm text-indigo-600 font-semibold hover:underline">Tự động đề xuất</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                    onClick={() => setSelectedAbility('WEAK')}
                    className={\`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-2 transition-all \${selectedAbility === 'WEAK' ? 'border-green-500 bg-green-50 shadow-sm' : 'border-slate-200 hover:border-green-200 bg-white'}\`}
                >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={18} /></div>
                    <div className="font-bold text-slate-800">Cần củng cố</div>
                    <div className="text-xs text-slate-500">Nắm kiến thức nền, lý thuyết cơ bản.</div>
                </div>
                
                <div 
                    onClick={() => setSelectedAbility('AVERAGE')}
                    className={\`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-2 transition-all \${selectedAbility === 'AVERAGE' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-200 bg-white'}\`}
                >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Play size={18} /></div>
                    <div className="font-bold text-slate-800">Trung bình</div>
                    <div className="text-xs text-slate-500">Luyện chắc dạng bài, tăng phản xạ.</div>
                </div>

                <div 
                    onClick={() => setSelectedAbility('GOOD')}
                    className={\`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-2 transition-all \${selectedAbility === 'GOOD' ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-slate-200 hover:border-purple-200 bg-white'}\`}
                >
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Zap size={18} /></div>
                    <div className="font-bold text-slate-800">Khá</div>
                    <div className="text-xs text-slate-500">Giảm lý thuyết, tăng vận dụng.</div>
                </div>

                <div 
                    onClick={() => setSelectedAbility('EXCELLENT')}
                    className={\`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-2 transition-all \${selectedAbility === 'EXCELLENT' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200 hover:border-orange-200 bg-white'}\`}
                >
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Rocket size={18} /></div>
                    <div className="font-bold text-slate-800">Giỏi</div>
                    <div className="text-xs text-slate-500">Bài toán phân hóa, tổng hợp kiến thức.</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen size={18} className="text-slate-500" /> Lộ trình đề xuất</h4>
                
                <div className="flex gap-4 text-sm font-medium text-slate-600 mb-6">
                   <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex-1 text-center">
                     <span className="block text-xl font-bold text-slate-800 mb-1">
                        {selectedAbility === 'WEAK' ? '8-10' : selectedAbility === 'AVERAGE' ? '10-12' : selectedAbility === 'GOOD' ? '12-15' : '10-15'}
                     </span> 
                     Câu hỏi
                   </div>
                   <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex-1 text-center">
                     <span className="block text-xl font-bold text-slate-800 mb-1">
                        {selectedAbility === 'WEAK' ? '60%' : selectedAbility === 'AVERAGE' ? '30%' : selectedAbility === 'GOOD' ? '10%' : '0%'}
                     </span> 
                     Nhận biết
                   </div>
                   <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex-1 text-center">
                     <span className="block text-xl font-bold text-slate-800 mb-1">
                        {selectedAbility === 'WEAK' ? '10%' : selectedAbility === 'AVERAGE' ? '30%' : selectedAbility === 'GOOD' ? '50%' : '45%'}
                     </span> 
                     Vận dụng
                   </div>
                   <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex-1 text-center">
                     <span className="block text-xl font-bold text-slate-800 mb-1">
                        {selectedAbility === 'WEAK' ? '0%' : selectedAbility === 'AVERAGE' ? '0%' : selectedAbility === 'GOOD' ? '10%' : '45%'}
                     </span> 
                     VD Cao
                   </div>
                </div>

                <div className="flex justify-end gap-3">
                   <button 
                     onClick={handlePreview}
                     className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                   >
                     XEM TRƯỚC BÀI TẬP
                   </button>
                   <button 
                    onClick={() => {
                        handleStartSetup();
                    }}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    ÁP DỤNG LỘ TRÌNH
                  </button>
                </div>
            </div>
            
            {showPreview && proposedQuestions && (
                <div className="mt-8 border-t border-slate-200 pt-8">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800">Xem trước ({proposedQuestions.length} câu hỏi)</h3>
                      <button onClick={() => setShowPreview(false)} className="text-slate-500 hover:text-slate-700 font-bold">✕ Đóng</button>
                   </div>
                   
                   <div className="space-y-6">
                      {proposedQuestions.map((q, idx) => (
                         <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-2 items-center">
                                    <span className="font-bold text-indigo-700">Câu {idx + 1}</span>
                                    <span className={\`text-xs font-semibold px-2 py-0.5 rounded-full \${
                                        q.difficulty === 1 ? 'bg-green-100 text-green-700' :
                                        q.difficulty === 2 ? 'bg-blue-100 text-blue-700' :
                                        q.difficulty === 3 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                    }\`}>
                                        {q.difficulty === 1 ? 'Nhận biết' : q.difficulty === 2 ? 'Thông hiểu' : q.difficulty === 3 ? 'Vận dụng' : 'Vận dụng cao'}
                                    </span>
                                </div>
                                <button onClick={() => setEditingQuestion(q)} className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center gap-1"><Edit size={14} /> Sửa</button>
                            </div>
                            <div className="text-slate-800 font-medium"><MathText text={sanitizeQuestionText(q.content)} /></div>
                            {q.question_type === 'MCQ_SINGLE' && q.options && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                   {q.options.map((opt: any, oIdx: number) => (
                                      <div key={opt.id} className={\`p-3 rounded-lg border \${opt.id === q.correct_option_id ? 'border-green-500 bg-green-50 font-semibold' : 'border-slate-200 bg-slate-50'}\`}>
                                         <span className="mr-2 font-bold">{['A', 'B', 'C', 'D'][oIdx]}.</span>
                                         <MathText text={sanitizeQuestionText(opt.content)} />
                                      </div>
                                   ))}
                                </div>
                            )}
                         </div>
                      ))}
                      {proposedQuestions.length === 0 && (
                          <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                             Ngân hàng hiện chưa đủ câu phù hợp cho lộ trình này.
                          </div>
                      )}
                   </div>
                </div>
            )}
            
          </div>
        </div>
        
        {editingQuestion && (
          <QuestionEditorModal
            question={editingQuestion}
            onClose={() => setEditingQuestion(null)}
            onSave={(mode, newQ) => {
               setProposedQuestions(prev => prev ? prev.map(q => q.id === newQ.id ? newQ : q) : null);
               setEditingQuestion(null);
            }}
            isEmbedded={true}
          />
        )}
      </div>
    );
  }
`;

code = code.replace(setupBlockRegex, newSetupBlock);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched 4");
