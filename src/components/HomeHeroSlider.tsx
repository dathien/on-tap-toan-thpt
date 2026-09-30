import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BookOpen, ChevronLeft, ChevronRight, FlaskConical, GraduationCap, Play, Sparkles, Trophy, Users } from 'lucide-react';

const slides = [
  {
    eyebrow: 'HỌC TẬP THÔNG MINH',
    title: 'Ôn tập Toán THPT trực quan, chủ động và có lộ trình',
    desc: 'Học lý thuyết, luyện câu hỏi và theo dõi tiến độ trên cùng một không gian học tập.',
    cta: 'Bắt đầu ôn tập',
    path: '/review',
    Icon: BookOpen,
    chips: ['Toán 10', 'Toán 11', 'Toán 12'],
    accent: 'from-indigo-600 via-violet-600 to-sky-500'
  },
  {
    eyebrow: 'ĐẤU TRƯỜNG TRI THỨC',
    title: 'Học mà chơi — thách đấu để cùng tiến bộ',
    desc: 'Sẵn sàng cho 1vs1, vượt cấp, đấu tổ và tiếp sức với cơ chế xếp hạng công bằng.',
    cta: 'Vào Đấu trường',
    path: '/arena',
    Icon: Trophy,
    chips: ['1 vs 1', 'Vượt cấp', 'Đấu tổ'],
    accent: 'from-amber-500 via-orange-500 to-rose-500'
  },
  {
    eyebrow: 'PHÒNG LAB TOÁN HỌC',
    title: 'Quan sát, thử nghiệm và khám phá Toán học bằng tương tác',
    desc: 'Kết nối công thức với đồ thị, hình học và các mô phỏng trực quan ngay trong bài học.',
    cta: 'Vào phòng Lab',
    path: '/lab',
    Icon: FlaskConical,
    chips: ['2D / 3D', 'Đồ thị', 'Mô phỏng'],
    accent: 'from-emerald-500 via-teal-500 to-cyan-500'
  },
  {
    eyebrow: 'THI ĐUA & TIẾN BỘ',
    title: 'Mỗi bài làm là một bước tiến trên hành trình chinh phục mục tiêu',
    desc: 'Kết quả, thử thách và hoạt động nhóm tạo động lực học tập tích cực cho cả lớp.',
    cta: 'Xem kết quả',
    path: '/results',
    Icon: GraduationCap,
    chips: ['Tiến độ', 'Thành tích', 'Nhóm học tập'],
    accent: 'from-fuchsia-600 via-purple-600 to-indigo-500'
  }
];

export function HomeHeroSlider() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  const particles = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);
  const go = (delta: number) => setIndex(i => (i + delta + slides.length) % slides.length);

  return (
    <section
      className="hero-slider relative overflow-hidden rounded-[26px] border border-white/60 shadow-[0_18px_50px_rgba(15,23,42,0.10)] bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Giới thiệu các khu vực học tập"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-[0.10] transition-all duration-700`} />
      <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
      <div className="absolute -left-20 -bottom-28 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      {!reduceMotion && particles.map((p) => (
        <motion.span
          key={p}
          className="absolute hidden md:block h-2.5 w-2.5 rounded-full bg-white/70 shadow-sm"
          style={{ left: `${54 + p * 6}%`, top: `${18 + (p % 3) * 22}%` }}
          animate={{ y: [0, -12, 0], x: [0, p % 2 ? 7 : -7, 0], opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 3.2 + p * 0.25, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={reduceMotion ? false : { opacity: 0, x: 34 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -34 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative grid min-h-[350px] grid-cols-1 items-center gap-6 px-7 pb-16 pt-8 md:grid-cols-[minmax(0,1.08fr)_minmax(300px,.92fr)] md:gap-10 md:px-[88px] md:pb-16 md:pt-10 lg:px-[96px]"
        >
          <div className="z-10 min-w-0 max-w-[610px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-slate-700 shadow-sm backdrop-blur">
              <Sparkles size={15} className="text-indigo-600" /> {slide.eyebrow}
            </div>
            <h2 className="max-w-[600px] text-[30px] font-black leading-[1.12] text-[#172033] md:text-[38px] lg:text-[40px]">{slide.title}</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 md:text-lg">{slide.desc}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {slide.chips.map(chip => <span key={chip} className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-bold text-slate-700 shadow-sm">{chip}</span>)}
            </div>
            <button onClick={() => navigate(slide.path)} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3.5 font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#4338CA]">
              <Play size={18} fill="currentColor" /> {slide.cta}
            </button>
          </div>

          <div className="relative mx-auto flex h-[210px] w-full max-w-[360px] items-center justify-center md:h-[250px]">
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className={`relative flex h-40 w-40 items-center justify-center rounded-[38px] bg-gradient-to-br ${slide.accent} text-white shadow-[0_25px_55px_rgba(79,70,229,.25)] md:h-48 md:w-48`}
            >
              <slide.Icon size={82} strokeWidth={1.65} />
              <motion.div animate={reduceMotion ? undefined : { scale: [1, 1.12, 1] }} transition={{ duration: 2.4, repeat: Infinity }} className="absolute -right-7 -top-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-xl">
                <Sparkles size={30} />
              </motion.div>
              <motion.div animate={reduceMotion ? undefined : { x: [0, 8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -bottom-5 -left-8 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-black text-slate-700 shadow-xl">
                <Users size={20} className="text-emerald-500" /> Cùng tiến bộ
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={() => go(-1)} aria-label="Slide trước" className="hero-arrow absolute bottom-4 left-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white md:bottom-auto md:left-5 md:top-1/2 md:-translate-y-1/2"><ChevronLeft size={24} /></button>
      <button onClick={() => go(1)} aria-label="Slide sau" className="hero-arrow absolute bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white md:bottom-auto md:right-5 md:top-1/2 md:-translate-y-1/2"><ChevronRight size={24} /></button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-white/70 px-3 py-2 shadow-sm backdrop-blur">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`Đến slide ${i + 1}`} className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? 'w-7 bg-indigo-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`} />
        ))}
      </div>
    </section>
  );
}
