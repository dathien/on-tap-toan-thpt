import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  LayoutDashboard, Gem, 
  BookOpen,
  Compass,
  Database, 
  FileEdit, 
  ClipboardCheck, 
  FlaskConical, 
  BarChart3, 
  Users, 
  Library, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import clsx from 'clsx';

const mainNavItems = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, path: '/' },
  { id: 'review', label: 'Ôn tập', icon: BookOpen, path: '/review' },
  { id: 'roadmap', label: 'Lộ trình tự học', icon: Compass, path: '/roadmap' },
  { id: 'bank', label: 'Ngân hàng câu hỏi', icon: Database, path: '/bank' },
  { id: 'create', label: 'Tạo đề', icon: FileEdit, path: '/create' },
  { id: 'materials', label: 'Kho đề thi', icon: Library, path: '/materials' },
  { id: 'exam', label: 'Kiểm tra - Thi', icon: ClipboardCheck, path: '/exam' },
  { id: 'lab', label: 'Phòng Lab Toán học', icon: FlaskConical, path: '/lab' },
  { id: 'treasure', label: 'Kho báu Toán học', icon: Gem, path: '/treasure' },
  { id: 'results', label: 'Kết quả học tập', icon: BarChart3, path: '/results' },
  { id: 'classes', label: 'Lớp học', icon: Users, path: '/classes' },
  { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/settings' },
];

export function Layout() {
  const { settings, currentGrade, setCurrentGrade } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#1F2A44] text-white">
        <div className="font-bold text-lg">{settings.appName}</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={clsx(
        "bg-[#1F2A44] text-slate-300 w-64 flex-shrink-0 flex flex-col fixed md:sticky top-0 h-[100dvh] overflow-hidden z-50 transition-transform duration-300 ease-in-out shadow-xl md:shadow-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 pb-2 hidden md:block border-b border-white/10 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">GV</div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">{settings.appName}</h1>
          </div>
          <p className="text-xs text-indigo-300 mt-1 uppercase tracking-wider mb-4 line-clamp-2">{settings.description}</p>
        </div>

        <nav className="flex-1 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] overflow-y-auto overflow-x-hidden mt-4 md:mt-0 min-h-0">
          <ul className="space-y-1 px-3">
            {mainNavItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => clsx(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                    isActive ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-900/20" : "hover:bg-white/10 hover:text-white font-medium"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={20} className={clsx(isActive ? "text-indigo-100" : "text-slate-400")} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative w-full overflow-hidden bg-[#F7F8FC]">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-sm">
          <div className="font-bold text-slate-800 hidden sm:block">
            {/* Context title could go here if managed by state, for now left blank or generic */}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Khối</span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[10, 11, 12].map((g) => (
                <button
                  key={g}
                  onClick={() => setCurrentGrade(g as 10 | 11 | 12)}
                  className={clsx(
                    "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                    currentGrade === g 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
