const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const renderHomeCode = `
  const handleCardAction = (type: string) => {
    if (!session && type !== 'SETUP') {
      if (window.confirm('Bạn cần bắt đầu một lộ trình mới để sử dụng chức năng này. Bắt đầu ngay?')) {
        setSession(null);
        setView('SETUP');
      }
      return;
    }

    switch (type) {
      case 'SETUP':
        setSession(null);
        setView('SETUP');
        break;
      case 'DIAGNOSTIC':
        setSession({ ...session!, status: 'DIAGNOSTIC' });
        setView('SESSION');
        break;
      case 'THEORY':
        setSession({ ...session!, status: 'LEARNING' });
        setLearningStep('THEORY');
        setView('SESSION');
        break;
      case 'PRACTICE':
        setSession({ ...session!, status: 'LEARNING' });
        setLearningStep('PRACTICE');
        setView('SESSION');
        break;
      case 'ASSESSMENT':
        setSession({ ...session!, status: 'ASSESSMENT' });
        setView('SESSION');
        break;
      case 'COMPLETED':
        setSession({ ...session!, status: 'COMPLETED' });
        setView('SESSION');
        break;
      case 'RETRY':
        if (session!.status !== 'COMPLETED') {
            alert('Bạn cần hoàn thành lộ trình hiện tại để xem phần học lại.');
            return;
        }
        // Logic for retry could reset status or just go to learning step
        setSession({ ...session!, status: 'LEARNING' });
        setLearningStep('PRACTICE');
        setView('SESSION');
        break;
    }
  };

  const renderHome = () => {
    const cards = [
      { id: 'start', icon: Rocket, title: 'BẮT ĐẦU', desc: 'Bắt đầu một lộ trình học mới', color: 'text-indigo-600', bg: 'bg-indigo-100', action: () => handleCardAction('SETUP') },
      { id: 'diagnostic', icon: Zap, title: 'KHỞI ĐỘNG', desc: 'Chẩn đoán nhanh kiến thức', color: 'text-orange-600', bg: 'bg-orange-100', action: () => handleCardAction('DIAGNOSTIC') },
      { id: 'theory', icon: BookOpen, title: 'KIẾN THỨC', desc: 'Xem lý thuyết trọng tâm', color: 'text-blue-600', bg: 'bg-blue-100', action: () => handleCardAction('THEORY') },
      { id: 'practice', icon: PenTool, title: 'LUYỆN TẬP', desc: 'Luyện bài theo chủ đề', color: 'text-emerald-600', bg: 'bg-emerald-100', action: () => handleCardAction('PRACTICE') },
      { id: 'game', icon: Gamepad2, title: 'TRÒ CHƠI', desc: 'Ôn tập qua trò chơi Toán học', color: 'text-purple-600', bg: 'bg-purple-100', action: () => navigate('/treasure') },
      { id: 'assessment', icon: CheckCircle2, title: 'KIỂM TRA', desc: 'Kiểm tra mức độ nắm kiến thức', color: 'text-rose-600', bg: 'bg-rose-100', action: () => handleCardAction('ASSESSMENT') },
      { id: 'results', icon: BarChart2, title: 'KẾT QUẢ', desc: 'Xem kết quả và tiến bộ', color: 'text-teal-600', bg: 'bg-teal-100', action: () => handleCardAction('COMPLETED') },
      { id: 'retry', icon: RotateCcw, title: 'HỌC LẠI', desc: 'Ôn lại phần chưa vững', color: 'text-amber-600', bg: 'bg-amber-100', action: () => handleCardAction('RETRY') },
      { id: 'profile', icon: User, title: 'HỒ SƠ HỌC TẬP', desc: 'Xem quá trình học cá nhân', color: 'text-cyan-600', bg: 'bg-cyan-100', action: () => alert('Tính năng đang được phát triển') },
      { id: 'report', icon: FileText, title: 'BÁO CÁO GV', desc: 'Giáo viên xem tiến độ học tập', color: 'text-slate-600', bg: 'bg-slate-100', action: () => alert('Tính năng dành cho giáo viên') },
    ];

    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-12 mt-8 animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-wide">Lộ Trình Tự Học</h2>
          <p className="text-slate-500 mt-2 font-medium">Học sâu • Luyện tập • Kiểm tra • Cải thiện</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id}
                onClick={card.action}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col items-center text-center"
              >
                <div className={\`w-16 h-16 rounded-2xl \${card.bg} \${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform\`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 font-medium">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
`;

code = code.replace("// ---------------------------------------------------------------------------\n  // RENDER: SETUP", renderHomeCode + "\n\n// ---------------------------------------------------------------------------\n  // RENDER: SETUP");

fs.writeFileSync('src/pages/Roadmap.tsx', code);
