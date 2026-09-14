const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const setupRender = `
  // ---------------------------------------------------------------------------
  // RENDER: SETUP
  // ---------------------------------------------------------------------------
  if (!session || session.status === 'SETUP') {
    const availableTopics = demoCurriculum[selectedGrade as keyof typeof demoCurriculum] || [];
    const selectedTopicObj = availableTopics.find(t => t.id === selectedTopic);
    const availableLessons = selectedTopicObj ? selectedTopicObj.lessons : [];
    
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-12 mt-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-wide">Thiết lập Lộ trình</h2>
          <p className="text-slate-500 mt-2">Hệ thống sẽ cá nhân hóa bài học dựa trên lựa chọn của bạn</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">1. Khối lớp</label>
              <select 
                value={selectedGrade}
                onChange={e => {
                  const newGrade = Number(e.target.value) as 10 | 11 | 12;
                  setSelectedGrade(newGrade);
                  
                  // Auto select first topic and lesson for the new grade
                  const newTopics = demoCurriculum[newGrade];
                  if (newTopics && newTopics.length > 0) {
                    const firstTopic = newTopics[0];
                    setSelectedTopic(firstTopic.id);
                    if (firstTopic.lessons && firstTopic.lessons.length > 0) {
                      setSelectedLesson(firstTopic.lessons[0].id);
                    } else {
                      setSelectedLesson('');
                    }
                  } else {
                    setSelectedTopic('');
                    setSelectedLesson('');
                  }
                }}
                className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
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
                  
                  // Auto select first lesson
                  const tObj = availableTopics.find(t => t.id === topicId);
                  if (tObj && tObj.lessons && tObj.lessons.length > 0) {
                    setSelectedLesson(tObj.lessons[0].id);
                  } else {
                    setSelectedLesson('');
                  }
                }}
                className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
              >
                <option value="">[Chọn chủ đề]</option>
                {availableTopics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">3. Bài học</label>
              <select 
                value={selectedLesson}
                onChange={e => setSelectedLesson(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
              >
                <option value="">[Chọn bài học]</option>
                {availableLessons.map(lesson => (
                  <option key={lesson.id} value={lesson.id}>{lesson.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">4. Mục tiêu điểm số</label>
              <select 
                value={target}
                onChange={e => setTarget(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
              >
                <option value="Củng cố nền tảng">Củng cố nền tảng</option>
                <option value="Điểm 5+">Điểm 5+</option>
                <option value="Điểm 7+">Điểm 7+</option>
                <option value="Điểm 8+">Điểm 8+</option>
                <option value="Điểm 9+">Điểm 9+</option>
              </select>
            </div>
            
            <div className="pt-4">
              <button 
                type="button"
                onClick={handleStartSetup}
                disabled={!selectedGrade || !selectedTopic || !selectedLesson || !target}
                className={clsx(
                  "w-full py-4 font-bold rounded-xl transition-all text-lg shadow-sm",
                  (!selectedGrade || !selectedTopic || !selectedLesson || !target)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                )}
              >
                {(!selectedGrade || !selectedTopic || !selectedLesson || !target) ? 'VUI LÒNG CHỌN ĐẦY ĐỦ' : 'BẮT ĐẦU CHẨN ĐOÁN'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
`;

code = code.replace(/  \/\/ ---------------------------------------------------------------------------\n  \/\/ RENDER: SETUP\n  \/\/ ---------------------------------------------------------------------------\n  if \(\!session \|\| session\.status === 'SETUP'\) \{[\s\S]*?    \);\n  \}/, setupRender.trim());

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log('done');
