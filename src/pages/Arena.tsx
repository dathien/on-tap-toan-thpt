import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Shield, Swords, Users, Trophy, Zap, LockKeyhole, Medal, Flag, Route, ChevronRight, Sparkles, RotateCcw, Ticket, History, Target, CheckCircle2, Play, ArrowRight, Clock3 } from 'lucide-react';
import { MathText } from '../components/MathText';

type Tier = 'Tân binh' | 'Đồng' | 'Bạc' | 'Vàng';
type Role = 'Học sinh' | 'Lớp trưởng' | 'Lớp phó học tập' | 'Bí thư';
type Player = { id:string; name:string; role:Role; tier:Tier; pos:number; arena:number; xp:number; shield?:number; placement?:number; guardian?:string; };

const initialPlayers: Player[] = [
  { id:'p1', name:'Minh', role:'Học sinh', tier:'Vàng', pos:1, arena:1380, xp:3250 },
  { id:'p2', name:'Lan', role:'Lớp phó học tập', tier:'Vàng', pos:2, arena:1340, xp:3010 },
  { id:'p3', name:'Hùng', role:'Học sinh', tier:'Vàng', pos:3, arena:1315, xp:2960, guardian:'Cổng Top' },
  { id:'p4', name:'Bình', role:'Lớp trưởng', tier:'Bạc', pos:1, arena:1120, xp:2680, guardian:'Ải Bạc' },
  { id:'p5', name:'Mai', role:'Học sinh', tier:'Bạc', pos:2, arena:1085, xp:2440 },
  { id:'p6', name:'An', role:'Học sinh', tier:'Đồng', pos:1, arena:920, xp:2210, shield:1, placement:3 },
  { id:'p7', name:'Nam', role:'Bí thư', tier:'Đồng', pos:2, arena:885, xp:2040 },
  { id:'p8', name:'Phúc', role:'Học sinh', tier:'Đồng', pos:3, arena:850, xp:1950 },
];

const tierStyle: Record<Tier,string> = {
  'Tân binh':'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Đồng':'bg-orange-50 text-orange-700 border-orange-200',
  'Bạc':'bg-slate-100 text-slate-700 border-slate-300',
  'Vàng':'bg-amber-50 text-amber-700 border-amber-200'
};

const modes = [
  { icon:Swords, title:'Thách đấu 1 vs 1', desc:'Đấu cùng cấp, tranh vị trí bằng độ chính xác và thời gian.', tag:'Cốt lõi' },
  { icon:Route, title:'Thách đấu vượt cấp', desc:'Đủ điều kiện để đánh cửa ải hoặc Top của cấp trên.', tag:'Leo hạng' },
  { icon:Medal, title:'Thách đấu Ban cán sự', desc:'Chức vụ độc lập với thứ hạng; thưởng theo độ khó thực tế.', tag:'Đặc biệt' },
  { icon:Shield, title:'Người giữ ải', desc:'Giáo viên chỉ định Guardian cho từng cổng hoặc từng tuần.', tag:'Guardian' },
  { icon:Crown, title:'Tranh ngôi Champion', desc:'Top 3 tiến dần #3 → #2 → #1, có Vé Tranh Ngôi.', tag:'Top' },
  { icon:Users, title:'Đấu tổ & Tiếp sức', desc:'4 tổ công thành, giữ thành hoặc giải nối tiếp từng chặng.', tag:'Đồng đội' },
];

export function Arena() {
  const [players, setPlayers] = useState(initialPlayers);
  const [active, setActive] = useState<'overview'|'challenge'|'teams'|'ranking'|'teacher'>('challenge');
  const [rankingView, setRankingView] = useState<'individual'|'team'>('individual');
  const [teamMode, setTeamMode] = useState<'Đấu tổ'|'Tiếp sức'>('Đấu tổ');
  const [teamA, setTeamA] = useState('Tổ 1');
  const [teamB, setTeamB] = useState('Tổ 2');
  const [teamNotice, setTeamNotice] = useState('');
  const [teams, setTeams] = useState([
    {name:'Tổ 1', points:320, wins:6, relay:2},
    {name:'Tổ 2', points:295, wins:5, relay:1},
    {name:'Tổ 3', points:270, wins:4, relay:1},
    {name:'Tổ 4', points:245, wins:3, relay:0},
  ]);
  const [challenger, setChallenger] = useState('p6');
  const [opponent, setOpponent] = useState('p4');
  const [challengerInput, setChallengerInput] = useState('');
  const [opponentInput, setOpponentInput] = useState('');
  const [challengeType, setChallengeType] = useState('Đại Thách Đấu');
  const [tickets, setTickets] = useState(3);
  const [notice, setNotice] = useState('');
  const [battleMinutes, setBattleMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [battle, setBattle] = useState<{a:string;b:string;mode:string}|null>(null);
  const [inBattle, setInBattle] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number,{a?:string;b?:string;revealed?:boolean}>>({});
  const [history, setHistory] = useState([
    {id:'m1', a:'Lan', b:'Hùng', result:'Lan thắng', mode:'1vs1', delta:'+10', time:'Hôm nay • 09:15'},
    {id:'m2', a:'Nam', b:'Phúc', result:'Phúc thắng', mode:'1vs1', delta:'+10', time:'Hôm qua • 14:20'},
  ]);
  const battleQuestions = [
    { q:'Cho hàm số $f(x)=x^3-3x+2$. Hàm số nghịch biến trên khoảng nào?', options:['$(-\\infty;-1)$','$(-1;1)$','$(1;+\\infty)$','$(-\\infty;+\\infty)$'], correct:'B' },
    { q:'Nghiệm của phương trình $x^2-5x+6=0$ là:', options:['$x=1$ hoặc $x=6$','$x=2$ hoặc $x=3$','$x=-2$ hoặc $x=-3$','$x=3$ hoặc $x=5$'], correct:'B' },
    { q:'Đạo hàm của hàm số $y=x^3-2x$ là:', options:["$y'=3x^2-2$","$y'=x^2-2$","$y'=3x-2$","$y'=3x^2$"], correct:'A' },
  ];
  const sorted = useMemo(() => [...players].sort((a,b) => b.arena-a.arena), [players]);

  useEffect(() => {
    if (!inBattle || !timerRunning || timeLeft <= 0) return;
    const timer = window.setInterval(() => setTimeLeft(v => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [inBattle, timerRunning, timeLeft]);

  useEffect(() => {
    if (inBattle && timeLeft === 0) { setTimerRunning(false); setTimeExpired(true); }
  }, [inBattle, timeLeft]);

  const formatTime = (seconds:number) => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;



  return <div className="max-w-7xl mx-auto space-y-6 pb-14">
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 text-white p-7 md:p-10 shadow-xl">
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-violet-400/20 blur-3xl" />
      <div className="absolute left-1/3 -bottom-28 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="relative z-10 grid md:grid-cols-[1.15fr_.85fr] gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-bold"><Sparkles size={16}/> HỌC MÀ CHƠI • CHƠI ĐỂ TIẾN BỘ</div>
          <h1 className="text-3xl md:text-5xl font-black mt-5 leading-tight">Đấu trường Tri thức</h1>
          <p className="text-indigo-100 mt-4 text-lg leading-7 max-w-2xl">1vs1, vượt cấp, Ban cán sự, Guardian, Champion, đấu tổ và tiếp sức — cùng một hệ thống xếp hạng nhưng không khóa cơ hội tiến bộ của học sinh.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={()=>setActive('challenge')} className="px-5 py-3 rounded-xl bg-white text-indigo-800 font-black hover:-translate-y-0.5 transition">Tạo thách đấu</button>
            <button onClick={()=>setActive('ranking')} className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 font-bold hover:bg-white/15 transition">Xem bảng xếp hạng</button>
          </div>
        </div>
        <div className="relative h-56 flex items-center justify-center">
          <motion.div animate={{y:[0,-9,0]}} transition={{duration:3,repeat:Infinity}} className="w-40 h-40 rounded-[38px] bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl flex items-center justify-center"><Trophy size={86}/></motion.div>
          <motion.div animate={{x:[0,8,0]}} transition={{duration:2.6,repeat:Infinity}} className="absolute right-4 top-2 bg-white text-slate-900 px-4 py-3 rounded-2xl font-black shadow-xl">#1 👑 Champion</motion.div>
          <motion.div animate={{x:[0,-7,0]}} transition={{duration:3.1,repeat:Infinity}} className="absolute left-0 bottom-2 bg-indigo-500 px-4 py-3 rounded-2xl font-black shadow-xl">🛡 Bảo hộ thăng hạng</motion.div>
        </div>
      </motion.div>
    </section>

    <div className="flex gap-2 overflow-x-auto pb-1">
      {([['overview','Tổng quan'],['challenge','Thách đấu'],['teams','Tổ & Tiếp sức'],['ranking','Xếp hạng'],['teacher','Thiết lập GV']] as const).map(([id,label]) => <button key={id} onClick={()=>setActive(id)} className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-bold border transition ${active===id?'bg-indigo-600 text-white border-indigo-600 shadow':'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>{label}</button>)}
    </div>

    {active==='overview' && <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modes.map((m,i)=><motion.button key={m.title} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*.05}} onClick={()=>setActive(i<=4?'challenge':'ranking')} className="text-left bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
          <div className="flex justify-between items-start"><div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><m.icon size={25}/></div><span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">{m.tag}</span></div>
          <h3 className="font-black text-slate-900 text-lg mt-4">{m.title}</h3><p className="text-slate-500 mt-2 leading-6">{m.desc}</p>
          <div className="mt-4 text-indigo-600 font-bold flex items-center gap-1">Mở khu vực <ChevronRight size={17}/></div>
        </motion.button>)}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border p-5"><div className="font-black text-slate-800">🛡 Bảo hộ thăng hạng</div><p className="text-sm text-slate-500 mt-2">Vừa vượt cấp: miễn 1 lượt bị thách đấu, 3 trận định vị không bị giáng cấp.</p></div>
        <div className="bg-white rounded-2xl border p-5"><div className="font-black text-slate-800">🏰 Guardian ≠ Champion</div><p className="text-sm text-slate-500 mt-2">Guardian do GV chỉ định; Champion luôn là người #1 theo kết quả thực tế.</p></div>
        <div className="bg-white rounded-2xl border p-5"><div className="font-black text-slate-800">🔥 Cơ hội vượt cấp</div><p className="text-sm text-slate-500 mt-2">Top cấp dưới có thể mở Vé Đại Thách Đấu để thử sức Top cấp trên.</p></div>
      </div>
    </>}


    {active==='challenge' && <div className="space-y-5">
      {!inBattle ? <div className="grid xl:grid-cols-[1.1fr_.9fr] gap-5">
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Swords className="text-indigo-600"/> Tạo thách đấu</h2><p className="text-sm text-slate-500 mt-1">Học sinh chọn người muốn thách đấu; giáo viên xác nhận và cho vào trận ngay.</p></div>
            <div className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 font-black text-sm flex items-center gap-2"><Ticket size={17}/> {tickets} vé</div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <label className="text-sm font-bold text-slate-700">Người thách đấu
              <select value={challenger} onChange={e=>setChallenger(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-200">
                {players.map(p=><option key={p.id} value={p.id}>{p.name} • {p.tier} #{p.pos}</option>)}<option value="manual">＋ Nhập tên học sinh khác</option>
              </select>
              {challenger==='manual'&&<input value={challengerInput} onChange={e=>setChallengerInput(e.target.value)} placeholder="Nhập họ và tên học sinh" className="mt-2 w-full rounded-xl border border-indigo-200 bg-indigo-50/40 px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-200"/>}
            </label>
            <label className="text-sm font-bold text-slate-700">Đối thủ
              <select value={opponent} onChange={e=>setOpponent(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-200">
                {players.map(p=><option key={p.id} value={p.id}>{p.name} • {p.tier} #{p.pos}</option>)}<option value="manual">＋ Nhập tên học sinh khác</option>
              </select>
              {opponent==='manual'&&<input value={opponentInput} onChange={e=>setOpponentInput(e.target.value)} placeholder="Nhập họ và tên đối thủ" className="mt-2 w-full rounded-xl border border-indigo-200 bg-indigo-50/40 px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-200"/>}
            </label>
            <label className="text-sm font-bold text-slate-700 md:col-span-2">Loại trận<select value={challengeType} onChange={e=>setChallengeType(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>1vs1 cùng cấp</option><option>Đại Thách Đấu</option><option>Thách Ban cán sự</option><option>Phá ải Guardian</option><option>Tranh ngôi Champion</option></select></label>
          </div>
          <div className="mt-5 grid sm:grid-cols-[1fr_auto] gap-3 items-end">
            <label className="text-sm font-bold text-slate-700">Thời gian toàn trận
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><Clock3 size={18} className="text-indigo-600"/><input type="number" min={1} max={90} value={battleMinutes} onChange={e=>setBattleMinutes(Math.max(1,Math.min(90,Number(e.target.value)||1)))} className="w-full py-3 outline-none font-black text-slate-900"/><span className="text-sm font-bold text-slate-500">phút</span></div>
            </label>
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-800 font-bold">⏱ Nhập 1–90 phút</div>
          </div>
          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600"><b className="text-slate-900">Cách tổ chức:</b> hai học sinh giải trên giấy hoặc lên bảng. App chỉ hiển thị câu hỏi, nhận đáp án A–D cuối cùng, chấm điểm và điều khiển diễn biến trận.</div>
          <button onClick={()=>{if(tickets<=0){setNotice('Không còn vé thách đấu.');return;} const aName=challenger==='manual'?challengerInput.trim():players.find(p=>p.id===challenger)?.name||''; const bName=opponent==='manual'?opponentInput.trim():players.find(p=>p.id===opponent)?.name||''; if(!aName||!bName){setNotice('Vui lòng chọn hoặc nhập đầy đủ tên hai học sinh.');return;} if(aName.toLocaleLowerCase('vi')===bName.toLocaleLowerCase('vi')){setNotice('Không thể tự thách đấu chính mình.');return;} setTickets(v=>v-1); setBattle({a:aName,b:bName,mode:challengeType}); setNotice(''); setQuestionIndex(0); setAnswers({}); setTimeLeft(battleMinutes*60); setTimerRunning(false); setTimeExpired(false);}} className="w-full mt-5 py-3.5 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition flex items-center justify-center gap-2"><Swords size={19}/> BẮT ĐẦU THÁCH ĐẤU</button>
          {battle&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="mt-4 rounded-2xl bg-indigo-50 border border-indigo-100 p-4"><div className="font-black text-indigo-900">⚔️ {battle.a} vs {battle.b}</div><div className="text-sm text-indigo-700 mt-1">{battle.mode} • Giáo viên đã xác nhận trận đấu.</div><button onClick={()=>{setInBattle(true);setTimerRunning(true)}} className="mt-3 w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center gap-2"><Play size={18}/> VÀO TRẬN</button></motion.div>}
        </section>
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b"><h3 className="font-black text-slate-900 flex items-center gap-2"><History size={19} className="text-indigo-600"/> Lịch sử thách đấu</h3><p className="text-xs text-slate-500 mt-1">Các trận đã hoàn thành gần nhất.</p></div>
          <div className="divide-y">{history.filter(h=>h.result!=='Đang chờ').map(h=><div key={h.id} className="p-4"><div className="flex justify-between gap-3"><div className="font-black text-slate-800">{h.a} <span className="text-slate-400">vs</span> {h.b}</div><span className="text-xs font-black px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{h.result}</span></div><div className="text-xs text-slate-500 mt-2 flex justify-between"><span>{h.mode} • {h.time}</span><b>{h.delta}</b></div></div>)}</div>
        </section>
      </div> : battle && (()=>{const q=battleQuestions[questionIndex]; const cur=answers[questionIndex]||{}; const letters=['A','B','C','D']; const scoreA=Object.entries(answers).filter(([i,v])=>v.revealed&&v.a===battleQuestions[Number(i)]?.correct).length; const scoreB=Object.entries(answers).filter(([i,v])=>v.revealed&&v.b===battleQuestions[Number(i)]?.correct).length; return <motion.section initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-950 text-white p-5 md:p-7">
          <motion.div animate={{opacity:[.2,.5,.2]}} transition={{duration:2,repeat:Infinity}} className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300"/>
          <div className="text-center text-xs font-black tracking-[.22em] text-indigo-200">⚔️ ĐẤU TRƯỜNG TRI THỨC • {battle.mode.toUpperCase()}</div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mt-5">
            <motion.div animate={{scale:scoreA>scoreB?1.03:1}} className={`text-center rounded-2xl p-4 border ${scoreA>scoreB?'bg-cyan-400/15 border-cyan-300/40':'bg-white/5 border-white/10'}`}><div className="text-xs font-black tracking-widest text-cyan-200">ĐẤU THỦ A</div><div className="text-xl md:text-3xl font-black mt-1">{battle.a}</div><div className="mt-2 text-4xl font-black text-cyan-300">{scoreA}</div></motion.div>
            <div className="flex flex-col items-center gap-2"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 border-4 border-white/15 shadow-xl flex items-center justify-center font-black text-lg">VS</div><div className={`min-w-[108px] text-center px-3 py-2 rounded-xl border font-mono text-xl font-black ${timeLeft<=30?'bg-red-500/20 border-red-400 text-red-200 animate-pulse':'bg-black/25 border-white/15 text-amber-300'}`}><Clock3 size={15} className="inline mr-1 -mt-1"/>{formatTime(timeLeft)}</div></div>
            <motion.div animate={{scale:scoreB>scoreA?1.03:1}} className={`text-center rounded-2xl p-4 border ${scoreB>scoreA?'bg-amber-400/15 border-amber-300/40':'bg-white/5 border-white/10'}`}><div className="text-xs font-black tracking-widest text-amber-200">ĐẤU THỦ B</div><div className="text-xl md:text-3xl font-black mt-1">{battle.b}</div><div className="mt-2 text-4xl font-black text-amber-300">{scoreB}</div></motion.div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400" animate={{width:`${Math.max(0,(timeLeft/(battleMinutes*60))*100)}%`}} transition={{duration:.3}}/></div>
        </div>
        <div className="p-5 md:p-8 max-w-5xl mx-auto">
          {timeExpired&&<div className="mb-5 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-center font-black text-red-700">⏰ HẾT GIỜ! Giáo viên có thể xác nhận các đáp án đã chọn hoặc kết thúc trận.</div>}
          <div className="flex flex-wrap justify-between items-center gap-3"><div className="flex items-center gap-3"><div className="font-black text-indigo-700">CÂU {questionIndex+1} / {battleQuestions.length}</div><div className="hidden sm:block h-2 w-32 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-indigo-500" style={{width:`${((questionIndex+1)/battleQuestions.length)*100}%`}}/></div></div><div className="flex items-center gap-2 text-sm font-bold text-slate-500"><Clock3 size={17}/> Giải trên giấy hoặc trên bảng rồi chọn kết quả</div></div>
          <div className="mt-6 text-lg md:text-xl font-bold text-slate-900 leading-8"><MathText text={q.q}/></div>
          <div className="grid md:grid-cols-2 gap-3 mt-6">{q.options.map((opt,i)=><div key={i} className={`rounded-2xl border-2 p-4 flex gap-3 items-center ${cur.revealed&&letters[i]===q.correct?'border-emerald-400 bg-emerald-50':'border-slate-200 bg-slate-50'}`}><span className="w-9 h-9 rounded-xl bg-white border flex items-center justify-center font-black text-indigo-700">{letters[i]}</span><MathText text={opt}/></div>)}</div>
          <div className="grid md:grid-cols-2 gap-4 mt-7">{(['a','b'] as const).map(side=><div key={side} className="rounded-2xl border border-slate-200 p-4"><div className="font-black text-slate-800">Đáp án của {side==='a'?battle.a:battle.b}</div><div className="grid grid-cols-4 gap-2 mt-3">{letters.map(L=><button disabled={cur.revealed} key={L} onClick={()=>setAnswers(prev=>({...prev,[questionIndex]:{...prev[questionIndex],[side]:L}}))} className={`py-3 rounded-xl border-2 font-black transition ${cur[side]===L?'border-indigo-600 bg-indigo-600 text-white':'border-slate-200 hover:border-indigo-300'}`}>{L}</button>)}</div></div>)}</div>
          {!cur.revealed?<button disabled={!cur.a||!cur.b} onClick={()=>setAnswers(prev=>({...prev,[questionIndex]:{...prev[questionIndex],revealed:true}}))} className="w-full mt-5 py-3.5 rounded-xl bg-indigo-600 disabled:bg-slate-300 text-white font-black">XÁC NHẬN CÂU TRẢ LỜI</button>:<div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="font-black text-emerald-800">✓ Đáp án đúng: {q.correct}</div><div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm"><div><b>{battle.a}:</b> {cur.a===q.correct?'✓ +1 điểm':'✕ 0 điểm'}</div><div><b>{battle.b}:</b> {cur.b===q.correct?'✓ +1 điểm':'✕ 0 điểm'}</div></div>{questionIndex<battleQuestions.length-1?<button onClick={()=>setQuestionIndex(v=>v+1)} className="mt-4 px-5 py-3 rounded-xl bg-slate-900 text-white font-black flex items-center gap-2">CÂU TIẾP THEO <ArrowRight size={18}/></button>:<button onClick={()=>{const finalA=scoreA+(cur.a===q.correct?1:0); const finalB=scoreB+(cur.b===q.correct?1:0); const result=finalA===finalB?'Hòa':finalA>finalB?`${battle.a} thắng`:`${battle.b} thắng`; setHistory(h=>[{id:`m${Date.now()}`,a:battle.a,b:battle.b,result,mode:battle.mode,delta:`${finalA}–${finalB}`,time:'Vừa xong'},...h]); setInBattle(false); setBattle(null); setQuestionIndex(0); setAnswers({}); setNotice(`Kết thúc trận: ${result} • ${finalA}–${finalB}`);}} className="mt-4 px-5 py-3 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center gap-2"><Trophy size={18}/> KẾT THÚC TRẬN</button>}</div>}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <button onClick={()=>setInBattle(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800">← Quay lại điều khiển trận</button>
            <div className="flex gap-2"><button onClick={()=>setTimerRunning(v=>!v)} disabled={timeLeft===0} className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700">{timerRunning?'⏸ Tạm dừng':'▶ Tiếp tục'}</button><button onClick={()=>{setTimeLeft(battleMinutes*60);setTimeExpired(false);setTimerRunning(true)}} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold">↻ Đặt lại giờ</button></div>
          </div>
        </div>
      </motion.section>})()}
    </div>}



    {active==='teams' && <div className="grid xl:grid-cols-[1.05fr_.95fr] gap-5">
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Users className="text-indigo-600"/> Đấu tổ & Tiếp sức</h2>
        <p className="text-sm text-slate-500 mt-1">Thi đấu theo đúng Tổ 1–4 của lớp. Điểm của hoạt động nhóm được cộng cho tổ, không cộng vào bảng xếp hạng cá nhân.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          {(['Đấu tổ','Tiếp sức'] as const).map(m=><button key={m} onClick={()=>setTeamMode(m)} className={`p-4 rounded-2xl border-2 text-left font-black ${teamMode===m?'border-indigo-600 bg-indigo-50 text-indigo-800':'border-slate-200'}`}>{m==='Đấu tổ'?'🛡️':'🏃'} {m}<div className="text-xs font-medium text-slate-500 mt-1">{m==='Đấu tổ'?'Hai tổ đối đầu trực tiếp':'Các thành viên lần lượt hoàn thành từng chặng'}</div></button>)}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          <label className="text-sm font-bold text-slate-700">Tổ thách đấu<select value={teamA} onChange={e=>setTeamA(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3">{teams.map(t=><option key={t.name}>{t.name}</option>)}</select></label>
          <label className="text-sm font-bold text-slate-700">Tổ đối thủ<select value={teamB} onChange={e=>setTeamB(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3">{teams.map(t=><option key={t.name}>{t.name}</option>)}</select></label>
        </div>
        {teamMode==='Tiếp sức'&&<div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900"><b>Luật tiếp sức:</b> mỗi thành viên phụ trách một chặng. Chỉ khi chặng hiện tại được xác nhận đúng mới mở chặng tiếp theo. Giáo viên điều phối thứ tự thành viên của từng tổ.</div>}
        <button onClick={()=>{if(teamA===teamB){setTeamNotice('Vui lòng chọn hai tổ khác nhau.');return;} setTeamNotice(`Đã tạo ${teamMode}: ${teamA} vs ${teamB}. Giáo viên có thể bắt đầu hoạt động.`)}} className="w-full mt-5 py-3.5 rounded-xl bg-indigo-600 text-white font-black">⚔️ BẮT ĐẦU {teamMode.toUpperCase()}</button>
        {teamNotice&&<div className="mt-4 rounded-xl bg-indigo-50 border border-indigo-100 p-4 font-bold text-indigo-800">{teamNotice}</div>}
      </section>
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b"><h3 className="font-black text-slate-900">🏆 Xếp hạng các tổ</h3><p className="text-xs text-slate-500 mt-1">Đấu tổ và tiếp sức chỉ tác động bảng xếp hạng tổ.</p></div>
        <div className="divide-y">{[...teams].sort((a,b)=>b.points-a.points).map((t,i)=><div key={t.name} className="p-4 flex items-center gap-4"><div className="w-9 font-black text-center">{i===0?'👑':`#${i+1}`}</div><div className="flex-1"><div className="font-black text-slate-800">{t.name}</div><div className="text-xs text-slate-500 mt-1">{t.wins} trận thắng • {t.relay} lần thắng tiếp sức</div></div><div className="text-right"><div className="font-black text-indigo-700">{t.points}</div><div className="text-xs text-slate-400">điểm tổ</div></div></div>)}</div>
      </section>
    </div>}

    {active==='ranking' && <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 md:p-6 border-b"><div className="flex flex-wrap justify-between gap-3 items-center"><div><h2 className="text-xl font-black text-slate-900">Bảng xếp hạng lớp 12A5</h2><p className="text-sm text-slate-500 mt-1">Xếp hạng cá nhân và xếp hạng tổ được tách riêng.</p></div><span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm">● Đấu trường lớp học</span></div><div className="flex gap-2 mt-4"><button onClick={()=>setRankingView('individual')} className={`px-4 py-2 rounded-xl font-bold ${rankingView==='individual'?'bg-indigo-600 text-white':'bg-slate-100 text-slate-600'}`}>Cá nhân</button><button onClick={()=>setRankingView('team')} className={`px-4 py-2 rounded-xl font-bold ${rankingView==='team'?'bg-indigo-600 text-white':'bg-slate-100 text-slate-600'}`}>Theo tổ</button></div></div>
      {rankingView==='individual'?<div className="divide-y">
        {sorted.map((p,i)=><motion.div layout key={p.id} className="p-4 md:px-6 flex items-center gap-4">
          <div className={`w-10 text-center font-black ${i<3?'text-amber-600':'text-slate-400'}`}>{i===0?'👑':`#${i+1}`}</div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-black text-indigo-700">{p.name[0]}</div>
          <div className="min-w-0 flex-1"><div className="font-black text-slate-800 truncate">{p.name} {p.role!=='Học sinh'&&<span className="text-xs ml-1 text-indigo-600">• {p.role}</span>}</div><div className="flex flex-wrap gap-1.5 mt-1"><span className={`text-xs border rounded-full px-2 py-0.5 font-bold ${tierStyle[p.tier]}`}>{p.tier} #{p.pos}</span>{p.guardian&&<span className="text-xs rounded-full px-2 py-0.5 font-bold bg-violet-50 text-violet-700">🏰 {p.guardian}</span>}{p.shield? <span className="text-xs rounded-full px-2 py-0.5 font-bold bg-sky-50 text-sky-700">🛡 {p.shield}</span>:null}</div></div>
          <div className="text-right"><div className="font-black text-slate-900">{p.arena}</div><div className="text-xs text-slate-400">Arena</div></div>
        </motion.div>)}
      </div>:<div className="divide-y">{[...teams].sort((a,b)=>b.points-a.points).map((t,i)=><motion.div layout key={t.name} className="p-4 md:px-6 flex items-center gap-4"><div className="w-10 text-center font-black text-amber-600">{i===0?'👑':`#${i+1}`}</div><div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-700">T{i+1}</div><div className="flex-1"><div className="font-black text-slate-800">{t.name}</div><div className="text-xs text-slate-500 mt-1">{t.wins} trận thắng • {t.relay} thắng tiếp sức</div></div><div className="text-right"><div className="font-black text-slate-900">{t.points}</div><div className="text-xs text-slate-400">điểm tổ</div></div></motion.div>)}</div>}
    </section>}

    {active==='teacher' && <section className="bg-white rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-black text-slate-900">Thiết lập Đấu trường dành cho giáo viên</h2></div><p className="text-slate-500 mt-1">Bản này là giao diện nghiệm thu. Các điều khiển sẽ nối Apps Script/Google Sheets ở giai đoạn backend.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[['Luật trận','Chính xác trước • thời gian phá hòa'],['Phạm vi thách đấu','Cùng cấp: tối đa 3 bậc phía trên'],['Vượt cấp','Mặc định: người cuối cấp trên'],['Đại Thách Đấu','Cho phép Top cấp dưới thách Top cấp trên'],['Bảo hộ','1 lượt miễn + 3 trận định vị'],['Guardian','GV chỉ định, đổi theo tuần'],['Champion','Tự động = #1 thực tế'],['Ban cán sự','Vai trò riêng, không nâng hạng tự động'],['Đấu tổ','4 tổ • tiếp sức • công/giữ thành']].map(([a,b])=><div key={a} className="rounded-2xl border border-slate-200 p-4"><div className="font-black text-slate-800">{a}</div><div className="text-sm text-slate-500 mt-2">{b}</div></div>)}
      </div>
    </section>}
  </div>
}
