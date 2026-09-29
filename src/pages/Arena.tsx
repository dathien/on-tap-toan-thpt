import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Shield, Swords, Users, Trophy, Zap, LockKeyhole, Medal, Flag, Route, ChevronRight, Sparkles, RotateCcw } from 'lucide-react';

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
  const [active, setActive] = useState<'overview'|'ranking'|'demo'|'teacher'>('overview');
  const [demoDone, setDemoDone] = useState(false);
  const sorted = useMemo(() => [...players].sort((a,b) => b.arena-a.arena), [players]);

  const simulateUpset = () => {
    setPlayers(prev => prev.map(p => {
      if (p.id === 'p6') return {...p, tier:'Bạc', pos:1, arena:p.arena+30, xp:p.xp+120, shield:1, placement:3};
      if (p.id === 'p4') return {...p, pos:2, arena:p.arena-10};
      if (p.tier === 'Bạc' && p.id !== 'p4') return {...p, pos:p.pos+1};
      return p;
    }));
    setDemoDone(true);
  };
  const resetDemo = () => { setPlayers(initialPlayers); setDemoDone(false); };

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
            <button onClick={()=>setActive('demo')} className="px-5 py-3 rounded-xl bg-white text-indigo-800 font-black hover:-translate-y-0.5 transition">Chạy tình huống mẫu</button>
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
      {([['overview','Tổng quan'],['ranking','Xếp hạng'],['demo','Mô phỏng luật'],['teacher','Thiết lập GV']] as const).map(([id,label]) => <button key={id} onClick={()=>setActive(id)} className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-bold border transition ${active===id?'bg-indigo-600 text-white border-indigo-600 shadow':'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>{label}</button>)}
    </div>

    {active==='overview' && <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modes.map((m,i)=><motion.button key={m.title} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*.05}} onClick={()=>setActive(i===1?'demo':'ranking')} className="text-left bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
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

    {active==='ranking' && <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 md:p-6 border-b flex flex-wrap justify-between gap-3 items-center"><div><h2 className="text-xl font-black text-slate-900">Bảng xếp hạng lớp 12A5</h2><p className="text-sm text-slate-500 mt-1">Dữ liệu mẫu để nghiệm thu luật trước khi nối Google Sheets.</p></div><span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm">● Demo offline</span></div>
      <div className="divide-y">
        {sorted.map((p,i)=><motion.div layout key={p.id} className="p-4 md:px-6 flex items-center gap-4">
          <div className={`w-10 text-center font-black ${i<3?'text-amber-600':'text-slate-400'}`}>{i===0?'👑':`#${i+1}`}</div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-black text-indigo-700">{p.name[0]}</div>
          <div className="min-w-0 flex-1"><div className="font-black text-slate-800 truncate">{p.name} {p.role!=='Học sinh'&&<span className="text-xs ml-1 text-indigo-600">• {p.role}</span>}</div><div className="flex flex-wrap gap-1.5 mt-1"><span className={`text-xs border rounded-full px-2 py-0.5 font-bold ${tierStyle[p.tier]}`}>{p.tier} #{p.pos}</span>{p.guardian&&<span className="text-xs rounded-full px-2 py-0.5 font-bold bg-violet-50 text-violet-700">🏰 {p.guardian}</span>}{p.shield? <span className="text-xs rounded-full px-2 py-0.5 font-bold bg-sky-50 text-sky-700">🛡 {p.shield}</span>:null}</div></div>
          <div className="text-right"><div className="font-black text-slate-900">{p.arena}</div><div className="text-xs text-slate-400">Arena</div></div>
        </motion.div>)}
      </div>
    </section>}

    {active==='demo' && <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-5">
      <section className="bg-white rounded-2xl border p-6 shadow-sm">
        <div className="flex justify-between gap-3"><div><h2 className="text-xl font-black text-slate-900">Tình huống vượt cấp đặc biệt</h2><p className="text-slate-500 mt-1">Top 1 Đồng thách đấu Top 1 Bạc.</p></div>{demoDone&&<button onClick={resetDemo} className="h-10 px-3 rounded-xl border font-bold text-slate-600 flex items-center gap-2"><RotateCcw size={16}/> Reset</button>}</div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mt-8">
          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5 text-center"><div className="text-3xl">🔥</div><div className="font-black text-xl mt-2">An</div><div className="text-sm font-bold text-orange-700">{demoDone?'Bạc #1':'Đồng #1'}</div><div className="text-2xl font-black mt-3">{demoDone?950:920}</div><div className="text-xs text-slate-500">Arena</div></div>
          <div className="font-black text-2xl text-indigo-600">VS</div>
          <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 text-center"><div className="text-3xl">🎖️</div><div className="font-black text-xl mt-2">Bình</div><div className="text-sm font-bold text-slate-600">Lớp trưởng • Bạc #{demoDone?'2':'1'}</div><div className="text-2xl font-black mt-3">{demoDone?1110:1120}</div><div className="text-xs text-slate-500">Arena</div></div>
        </div>
        {!demoDone?<button onClick={simulateUpset} className="w-full mt-6 py-3.5 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition flex justify-center items-center gap-2"><Zap size={19}/> Mô phỏng: AN THẮNG</button>:<motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-5"><div className="font-black text-emerald-800 text-lg">🏆 Vượt cấp thành công!</div><div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm text-emerald-900"><div>↑ An chiếm <b>Bạc #1</b></div><div>↓ Bình xuống <b>Bạc #2</b></div><div>+30 Arena • +120 XP</div><div>🛡 1 lượt miễn thách đấu</div><div>🧱 3 trận bảo vệ cấp</div><div>⚠ Người cuối Bạc → vùng bảo vệ</div></div></motion.div>}
      </section>
      <section className="bg-slate-950 text-white rounded-2xl p-6 shadow-sm"><h3 className="font-black text-lg">Luật đang áp dụng</h3><div className="space-y-4 mt-5 text-sm text-slate-300">
        <div className="flex gap-3"><Crown className="text-amber-400 shrink-0" size={20}/><p><b className="text-white">Tranh vị trí:</b> thắng Top #1 cấp trên thì chiếm đúng #1; người thua xuống #2.</p></div>
        <div className="flex gap-3"><Shield className="text-sky-400 shrink-0" size={20}/><p><b className="text-white">Bảo hộ:</b> bảo vệ cấp, không bảo vệ ngôi vô thời hạn.</p></div>
        <div className="flex gap-3"><LockKeyhole className="text-violet-400 shrink-0" size={20}/><p><b className="text-white">Chống spam:</b> thách Top cấp trên cần Vé Đại Thách Đấu/điều kiện GV.</p></div>
        <div className="flex gap-3"><Flag className="text-emerald-400 shrink-0" size={20}/><p><b className="text-white">Người cuối cấp:</b> vào vùng bảo vệ, có trận giữ cấp; không bị rớt oan.</p></div>
      </div></section>
    </div>}

    {active==='teacher' && <section className="bg-white rounded-2xl border p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-900">Thiết lập Đấu trường dành cho giáo viên</h2><p className="text-slate-500 mt-1">Bản này là giao diện nghiệm thu. Các điều khiển sẽ nối Apps Script/Google Sheets ở giai đoạn backend.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[['Luật trận','Chính xác trước • thời gian phá hòa'],['Phạm vi thách đấu','Cùng cấp: tối đa 3 bậc phía trên'],['Vượt cấp','Mặc định: người cuối cấp trên'],['Đại Thách Đấu','Cho phép Top cấp dưới thách Top cấp trên'],['Bảo hộ','1 lượt miễn + 3 trận định vị'],['Guardian','GV chỉ định, đổi theo tuần'],['Champion','Tự động = #1 thực tế'],['Ban cán sự','Vai trò riêng, không nâng hạng tự động'],['Đấu tổ','4 tổ • tiếp sức • công/giữ thành']].map(([a,b])=><div key={a} className="rounded-2xl border border-slate-200 p-4"><div className="font-black text-slate-800">{a}</div><div className="text-sm text-slate-500 mt-2">{b}</div></div>)}
      </div>
    </section>}
  </div>
}
