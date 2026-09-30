import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { Crown, Shield, Swords, Users, Trophy, Zap, LockKeyhole, Medal, Flag, Route, ChevronRight, Sparkles, RotateCcw, Ticket, History, Target, CheckCircle2, Play, ArrowRight, Clock3 } from 'lucide-react';
import { MathText } from '../components/MathText';

type Tier = 'Tân binh' | 'Đồng' | 'Bạc' | 'Vàng';
type Role = 'Học sinh' | 'Lớp trưởng' | 'Lớp phó học tập' | 'Bí thư';
type Player = { id:string; name:string; role:Role; tier:Tier; pos:number; arena:number; xp:number; wins:number; losses?:number; matchesPlayed?:number; rankDays:number; rankSince?:string; lastRank?:number; shield?:number; placement?:number; guardian?:string; champion?:boolean; championSince?:string; };
type Team = { name:string; points:number; wins:number; relay:number; rankDays:number; rankSince?:string; lastRank?:number };
const STORAGE_KEY = 'mathArenaData';
const STORAGE_SCHEMA = 1;
const API_URL = 'https://script.google.com/macros/s/AKfycbxoeZqJnRNGNbrCnCvjBXASmcDLEydrxASxE3ybYNVdvEf5Hte5dIM4x-91WKOVVXJxRQ/exec';

async function apiGet(action:string) {
  const res = await fetch(`${API_URL}?action=${encodeURIComponent(action)}`, { cache:'no-store' });
  if (!res.ok) throw new Error(`API GET ${res.status}`);
  const json = await res.json();
  if (!json?.success) throw new Error(json?.message || 'API trả về lỗi');
  return json;
}
async function apiPost(action:string, data:any) {
  const res = await fetch(API_URL, {
    method:'POST',
    headers:{'Content-Type':'text/plain;charset=utf-8'},
    body:JSON.stringify({action,data})
  });
  if (!res.ok) throw new Error(`API POST ${res.status}`);
  const json = await res.json();
  if (!json?.success) throw new Error(json?.message || 'API trả về lỗi');
  return json;
}
const daysAgoIso = (days:number) => new Date(Date.now() - Math.max(0, days) * 86400000).toISOString();
const daysHeld = (iso?:string, fallback=0) => iso ? Math.max(0, Math.floor((Date.now()-new Date(iso).getTime())/86400000)) : fallback;
function withPlayerRanks(list:Player[], resetChanged=false){ const order=[...list].sort((a,b)=>b.arena-a.arena); const ranks=new Map(order.map((p,i)=>[p.id,i+1])); const now=new Date().toISOString(); return list.map(p=>{ const nr=ranks.get(p.id)||1; const changed=resetChanged && p.lastRank!=null && p.lastRank!==nr; return {...p,lastRank:nr,rankSince:changed?now:(p.rankSince||daysAgoIso(p.rankDays)),rankDays:daysHeld(changed?now:(p.rankSince||daysAgoIso(p.rankDays)),p.rankDays)}; }); }
function withTeamRanks(list:Team[], resetChanged=false){ const order=[...list].sort((a,b)=>b.points-a.points); const ranks=new Map(order.map((t,i)=>[t.name,i+1])); const now=new Date().toISOString(); return list.map(t=>{ const nr=ranks.get(t.name)||1; const changed=resetChanged && t.lastRank!=null && t.lastRank!==nr; return {...t,lastRank:nr,rankSince:changed?now:(t.rankSince||daysAgoIso(t.rankDays)),rankDays:daysHeld(changed?now:(t.rankSince||daysAgoIso(t.rankDays)),t.rankDays)}; }); }

const initialPlayers: Player[] = [
  { id:'p1', name:'Minh', role:'Học sinh', tier:'Vàng', pos:1, arena:1380, xp:3250, wins:12, rankDays:2 },
  { id:'p2', name:'Lan', role:'Lớp phó học tập', tier:'Vàng', pos:2, arena:1340, xp:3010, wins:10, rankDays:4 },
  { id:'p3', name:'Hùng', role:'Học sinh', tier:'Vàng', pos:3, arena:1315, xp:2960, wins:9, rankDays:3, guardian:'Cổng Top' },
  { id:'p4', name:'Bình', role:'Lớp trưởng', tier:'Bạc', pos:1, arena:1120, xp:2680, wins:8, rankDays:6, guardian:'Ải Bạc' },
  { id:'p5', name:'Mai', role:'Học sinh', tier:'Bạc', pos:2, arena:1085, xp:2440, wins:7, rankDays:5 },
  { id:'p6', name:'An', role:'Học sinh', tier:'Đồng', pos:1, arena:920, xp:2210, wins:6, rankDays:5, shield:1, placement:3 },
  { id:'p7', name:'Nam', role:'Bí thư', tier:'Đồng', pos:2, arena:885, xp:2040, wins:5, rankDays:7 },
  { id:'p8', name:'Phúc', role:'Học sinh', tier:'Đồng', pos:3, arena:850, xp:1950, wins:4, rankDays:3 },
];

const tierStyle: Record<Tier,string> = {
  'Tân binh':'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Đồng':'bg-orange-50 text-orange-700 border-orange-200',
  'Bạc':'bg-slate-100 text-slate-700 border-slate-300',
  'Vàng':'bg-amber-50 text-amber-700 border-amber-200'
};

type ArenaLevel = 'Khởi động' | 'Bứt phá' | 'Chinh phục' | 'Đỉnh cao';
const tierOrder: Tier[] = ['Tân binh','Đồng','Bạc','Vàng'];
const arenaByTier: Record<Tier,{level:ArenaLevel;academic:string;label:string;primary:number;secondary:number;fog:number;css:string}> = {
  'Tân binh':{level:'Khởi động',academic:'Yếu',label:'SÂN KHỞI ĐỘNG',primary:0x22c55e,secondary:0x86efac,fog:0x06150c,css:'from-emerald-950 via-green-900 to-slate-950'},
  'Đồng':{level:'Bứt phá',academic:'Trung bình',label:'SÂN BỨT PHÁ',primary:0x0ea5e9,secondary:0x67e8f9,fog:0x041421,css:'from-sky-950 via-blue-900 to-slate-950'},
  'Bạc':{level:'Chinh phục',academic:'Khá',label:'SÂN CHINH PHỤC',primary:0x8b5cf6,secondary:0xd8b4fe,fog:0x110720,css:'from-violet-950 via-purple-900 to-slate-950'},
  'Vàng':{level:'Đỉnh cao',academic:'Giỏi',label:'SÂN ĐỈNH CAO',primary:0xf59e0b,secondary:0xfde68a,fog:0x1c1003,css:'from-amber-950 via-orange-900 to-slate-950'}
};
function higherTier(a?:Tier,b?:Tier):Tier { const ai=Math.max(0,tierOrder.indexOf(a||'Tân binh')); const bi=Math.max(0,tierOrder.indexOf(b||'Tân binh')); return tierOrder[Math.max(ai,bi)]; }

const modes = [
  { icon:Swords, title:'Thách đấu 1 vs 1', desc:'Đấu cùng cấp, tranh vị trí bằng độ chính xác và thời gian.', tag:'Cốt lõi' },
  { icon:Route, title:'Thách đấu vượt cấp', desc:'Đủ điều kiện để đánh cửa ải hoặc Top của cấp trên.', tag:'Leo hạng' },
  { icon:Medal, title:'Thách đấu Ban cán sự', desc:'Chức vụ độc lập với thứ hạng; thưởng theo độ khó thực tế.', tag:'Đặc biệt' },
  { icon:Shield, title:'Người giữ ải', desc:'Giáo viên chỉ định Guardian cho từng cổng hoặc từng tuần.', tag:'Guardian' },
  { icon:Crown, title:'Tranh Hạng 1 & Champion', desc:'Hạng 1 thuộc từng cấp; Champion là danh hiệu riêng của toàn lớp.', tag:'Top' },
  { icon:Users, title:'Đấu tổ & Tiếp sức', desc:'4 tổ công thành, giữ thành hoặc giải nối tiếp từng chặng.', tag:'Đồng đội' },
];

function MathArena3D({ leftName, rightName, leftScore, rightScore, urgent, arenaTier }:{leftName:string;rightName:string;leftScore:number;rightScore:number;urgent:boolean;arenaTier:Tier}) {
  const theme=arenaByTier[arenaTier];
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglOk, setWebglOk] = useState(true);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true }); } catch { setWebglOk(false); return; }
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(theme.fog, 9, 28);
    const camera = new THREE.PerspectiveCamera(48, 1, .1, 100);
    camera.position.set(0, 7.2, 12.5); camera.lookAt(0, .4, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(theme.fog, 1);
    mount.appendChild(renderer.domElement);
    const hemi = new THREE.HemisphereLight(theme.secondary, theme.fog, 2.2); scene.add(hemi);
    const key = new THREE.PointLight(theme.primary, 26, 22); key.position.set(-5,5,5); scene.add(key);
    const rim = new THREE.PointLight(theme.secondary, 28, 22); rim.position.set(5,4,3); scene.add(rim);
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(7.6,8.4,.55,64), new THREE.MeshStandardMaterial({color:theme.fog,metalness:.75,roughness:.28,emissive:theme.primary,emissiveIntensity:.08})); floor.position.y=-.55; scene.add(floor);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(6.7,.12,16,96), new THREE.MeshStandardMaterial({color:theme.primary,emissive:theme.primary,emissiveIntensity:2})); ring.rotation.x=Math.PI/2; ring.position.y=-.2; scene.add(ring);
    const grid = new THREE.GridHelper(13,18,theme.secondary,theme.primary); grid.position.y=-.22; scene.add(grid);
    const makePod=(x:number,color:number)=>{ const g=new THREE.Group(); const base=new THREE.Mesh(new THREE.CylinderGeometry(2.15,2.45,.7,48),new THREE.MeshStandardMaterial({color,metalness:.65,roughness:.3,emissive:color,emissiveIntensity:.18})); g.add(base); const halo=new THREE.Mesh(new THREE.TorusGeometry(2.2,.07,12,64),new THREE.MeshBasicMaterial({color})); halo.rotation.x=Math.PI/2; halo.position.y=.38; g.add(halo); g.position.set(x,.05,0); scene.add(g); return g;};
    const left=makePod(-3.25,theme.primary), right=makePod(3.25,theme.secondary);
    const center = new THREE.Mesh(new THREE.OctahedronGeometry(.65,0),new THREE.MeshStandardMaterial({color:theme.secondary,emissive:theme.primary,emissiveIntensity:1.5,metalness:.4})); center.position.set(0,1.2,.2); scene.add(center);
    const symbols:THREE.Mesh[]=[]; for(let i=0;i<18;i++){ const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.08+(i%3)*.035,0),new THREE.MeshBasicMaterial({color:i%2?theme.primary:theme.secondary})); const a=(i/18)*Math.PI*2; m.position.set(Math.cos(a)*(5.4+(i%3)*.45),.5+(i%4)*.55,Math.sin(a)*(3.5+(i%2))); scene.add(m); symbols.push(m); }
    const resize=()=>{ const w=mount.clientWidth,h=Math.max(220,Math.min(330,Math.round(w*.31))); renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }; resize(); const ro=new ResizeObserver(resize); ro.observe(mount);
    let raf=0; const clock=new THREE.Clock(); const animate=()=>{ const t=clock.getElapsedTime(); center.rotation.y=t*1.7; center.rotation.x=t*.7; left.position.y=.05+Math.sin(t*2)*.035; right.position.y=.05+Math.sin(t*2+1)*.035; symbols.forEach((m,i)=>m.position.y+=Math.sin(t*2+i)*.0007); ring.rotation.z=t*.08; renderer.render(scene,camera); raf=requestAnimationFrame(animate); }; animate();
    return ()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();mount.removeChild(renderer.domElement);scene.traverse(o=>{const m=o as THREE.Mesh;if(m.geometry)m.geometry.dispose();const mat=m.material as THREE.Material;if(mat&&'dispose' in mat)mat.dispose();});};
  },[arenaTier]);
  return <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-[#05071a] shadow-2xl">
    <div ref={mountRef} className="w-full" aria-label="Sàn đấu Toán học 3D WebGL" />
    {!webglOk&&<div className="h-[240px] flex items-center justify-center text-white/70 font-bold">Thiết bị không hỗ trợ WebGL — đang dùng chế độ dự phòng.</div>}
    <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center"><span className="rounded-full border border-white/15 bg-black/35 px-4 py-1.5 text-[11px] font-black tracking-[.18em] text-white backdrop-blur">{theme.label} • TOÁN HỌC 3D • WEBGL</span></div>
    <div className="pointer-events-none absolute inset-x-4 bottom-4 grid grid-cols-[1fr_auto_1fr] items-end gap-3 text-white"><div className="rounded-2xl border border-cyan-300/20 bg-slate-950/65 p-3 backdrop-blur"><div className="text-xs font-black text-cyan-300">NGƯỜI CHƠI A</div><div className="text-xl font-black">{leftName}</div><div className="text-3xl font-black text-cyan-300">{leftScore}</div></div><div className={`mb-3 rounded-full border px-4 py-2 font-black ${urgent?'border-red-400 bg-red-500/80':'border-fuchsia-300/30 bg-fuchsia-600/70'}`}>VS</div><div className="rounded-2xl border border-amber-300/20 bg-slate-950/65 p-3 text-right backdrop-blur"><div className="text-xs font-black text-amber-300">NGƯỜI CHƠI B</div><div className="text-xl font-black">{rightName}</div><div className="text-3xl font-black text-amber-300">{rightScore}</div></div></div>
  </div>;
}

export function Arena() {
  const [players, setPlayers] = useState<Player[]>(() => { try { const raw=localStorage.getItem(STORAGE_KEY); if(raw){ const d=JSON.parse(raw); if(Array.isArray(d.players)) return withPlayerRanks(d.players); } } catch{} return withPlayerRanks(initialPlayers); });
  const [active, setActive] = useState<'overview'|'challenge'|'teams'|'ranking'|'teacher'>('challenge');
  const [rankingView, setRankingView] = useState<'individual'|'team'>('individual');
  const [historyFilter, setHistoryFilter] = useState<'Tất cả'|'Cá nhân'|'Vượt cấp'|'Hạng 1'|'Guardian'|'Champion'|'Đấu tổ'|'Tiếp sức'>('Tất cả');
  const [tierFilter, setTierFilter] = useState<'Tất cả'|Tier>('Tất cả');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [teamMode, setTeamMode] = useState<'Đấu tổ'|'Tiếp sức'>('Đấu tổ');
  const [teamA, setTeamA] = useState('Tổ 1');
  const [teamB, setTeamB] = useState('Tổ 2');
  const [teamNotice, setTeamNotice] = useState('');
  const [teamBattle, setTeamBattle] = useState<{mode:'Đấu tổ'|'Tiếp sức';a:string;b:string}|null>(null);
  const [teamQuestionIndex, setTeamQuestionIndex] = useState(0);
  const [teamAnswers, setTeamAnswers] = useState<Record<number,{a?:string;b?:string;revealed?:boolean}>>({});
  const [teams, setTeams] = useState<Team[]>(() => { try { const raw=localStorage.getItem(STORAGE_KEY); if(raw){ const d=JSON.parse(raw); if(Array.isArray(d.teams)) return withTeamRanks(d.teams); } } catch{} return withTeamRanks([
    {name:'Tổ 1', points:320, wins:6, relay:2, rankDays:4},
    {name:'Tổ 2', points:295, wins:5, relay:1, rankDays:6},
    {name:'Tổ 3', points:270, wins:4, relay:1, rankDays:3},
    {name:'Tổ 4', points:245, wins:3, relay:0, rankDays:2},
  ]); });
  const [challenger, setChallenger] = useState('p6');
  const [opponent, setOpponent] = useState('p4');
  const [challengerInput, setChallengerInput] = useState('');
  const [opponentInput, setOpponentInput] = useState('');
  const [tickets, setTickets] = useState(3);
  const [notice, setNotice] = useState('');
  const [battleMinutes, setBattleMinutes] = useState(5);
  const [matchTypeOverride, setMatchTypeOverride] = useState('');
  const [editingMatchType, setEditingMatchType] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [scoreStudentId, setScoreStudentId] = useState('p6');
  const [studentPointDelta, setStudentPointDelta] = useState(10);
  const [scoreTeamName, setScoreTeamName] = useState('Tổ 1');
  const [teamPointDelta, setTeamPointDelta] = useState(10);
  const [pointNotice, setPointNotice] = useState('');
  const [cloudStatus, setCloudStatus] = useState<'loading'|'online'|'offline'>('loading');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPoints, setNewStudentPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [battle, setBattle] = useState<{a:string;b:string;mode:string;arenaTier:Tier}|null>(null);
  const [inBattle, setInBattle] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number,{a?:string;b?:string;revealed?:boolean}>>({});
  const [history, setHistory] = useState<any[]>(() => { try { const raw=localStorage.getItem(STORAGE_KEY); if(raw){ const d=JSON.parse(raw); if(Array.isArray(d.history)) return d.history; } } catch{} return [
    {id:'m1', a:'Lan', b:'Hùng', result:'Lan thắng', mode:'1vs1', delta:'+10', time:'Hôm nay • 09:15'},
    {id:'m2', a:'Nam', b:'Phúc', result:'Phúc thắng', mode:'1vs1', delta:'+10', time:'Hôm qua • 14:20'},
  ]; });
  const battleQuestions = [
    { q:'Cho hàm số $f(x)=x^3-3x+2$. Hàm số nghịch biến trên khoảng nào?', options:['$(-\\infty;-1)$','$(-1;1)$','$(1;+\\infty)$','$(-\\infty;+\\infty)$'], correct:'B' },
    { q:'Nghiệm của phương trình $x^2-5x+6=0$ là:', options:['$x=1$ hoặc $x=6$','$x=2$ hoặc $x=3$','$x=-2$ hoặc $x=-3$','$x=3$ hoặc $x=5$'], correct:'B' },
    { q:'Đạo hàm của hàm số $y=x^3-2x$ là:', options:["$y'=3x^2-2$","$y'=x^2-2$","$y'=3x-2$","$y'=3x^2$"], correct:'A' },
  ];
  const sorted = useMemo(() => [...players].sort((a,b) => b.arena-a.arena), [players]);
  const selectedProfile = useMemo(()=>players.find(p=>p.id===selectedProfileId),[players,selectedProfileId]);
  const filteredRanking = useMemo(()=>[...players].filter(p=>tierFilter==='Tất cả'||p.tier===tierFilter).sort((a,b)=>tierOrder.indexOf(a.tier)-tierOrder.indexOf(b.tier)||a.pos-b.pos||b.arena-a.arena),[players,tierFilter]);
  const historyMatchesFilter = (h:any) => { const m=String(h.mode||'').toLowerCase(); if(historyFilter==='Tất cả')return true; if(historyFilter==='Cá nhân')return !m.includes('tổ')&&!m.includes('tiếp sức'); if(historyFilter==='Vượt cấp')return m.includes('vượt'); if(historyFilter==='Hạng 1')return m.includes('hạng 1'); if(historyFilter==='Guardian')return m.includes('giữ ải')||m.includes('guardian'); if(historyFilter==='Champion')return m.includes('champion'); if(historyFilter==='Đấu tổ')return m.includes('đấu tổ'); if(historyFilter==='Tiếp sức')return m.includes('tiếp sức'); return true; };
  const filteredHistory = useMemo(()=>history.filter(historyMatchesFilter),[history,historyFilter]);
  const championPlayer = useMemo(()=>players.find(p=>p.champion),[players]);
  const guardianPlayers = useMemo(()=>players.filter(p=>p.guardian),[players]);
  const officerPlayers = useMemo(()=>players.filter(p=>p.role!=='Học sinh'),[players]);
  const profileHistory = useMemo(()=>selectedProfile?history.filter((h:any)=>h.playerAId===selectedProfile.id||h.playerBId===selectedProfile.id||h.a===selectedProfile.name||h.b===selectedProfile.name):[],[history,selectedProfile]);

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({schemaVersion:STORAGE_SCHEMA,players,teams,history,savedAt:new Date().toISOString()})); } catch{} }, [players,teams,history]);

  useEffect(() => {
    let cancelled=false;
    (async()=>{
      try {
        const [studentsRes, profilesRes, matchesRes] = await Promise.all([apiGet('students'), apiGet('profiles'), apiGet('matches').catch(()=>({data:[]}))]);
        if (cancelled) return;
        const students=Array.isArray(studentsRes.data)?studentsRes.data:[];
        const profiles=Array.isArray(profilesRes.data)?profilesRes.data:[];
        if(students.length && profiles.length){
          const byId=new Map(students.map((s:any)=>[String(s.studentId),s]));
          const tierMap:Record<string,Tier>={YEU:'Tân binh',TRUNGBINH:'Đồng',KHA:'Bạc',GIOI:'Vàng'};
          const remotePlayers:Player[]=profiles.map((p:any)=>{
            const s:any=byId.get(String(p.studentId))||{};
            const role=(['Học sinh','Lớp trưởng','Lớp phó học tập','Bí thư'].includes(s.classRole)?s.classRole:'Học sinh') as Role;
            return {id:String(p.studentId),name:String(s.fullName||p.studentId),role,tier:tierMap[String(p.arenaLevel)]||'Tân binh',pos:Number(p.rank)||1,arena:Number(p.points)||0,xp:0,wins:Number(p.wins)||0,losses:Number(p.losses)||0,matchesPlayed:Number(p.matchesPlayed)||0,rankDays:daysHeld(p.rankSince,0),rankSince:p.rankSince||new Date().toISOString(),lastRank:Number(p.rank)||undefined,shield:Number(p.shieldCount)||0,placement:Number(p.protectionMatches)||0,guardian:p.guardian===true||String(p.guardian).toUpperCase()==='TRUE'?'Người giữ ải':undefined,champion:p.champion===true||String(p.champion).toUpperCase()==='TRUE',championSince:(p.champion===true||String(p.champion).toUpperCase()==='TRUE')?(p.rankSince||new Date().toISOString()):undefined};
          });

          // Google Sheet là nguồn dữ liệu chính thức của Đấu trường.
          // Khi Sheet có đủ danh sách, thay toàn bộ dữ liệu mẫu/local để không còn trùng học sinh hoặc mã cũ.
          const officialPlayers = remotePlayers
            .filter(p => /^HS\d{3}$/.test(p.id))
            .sort((a,b) => {
              const ta=tierOrder.indexOf(a.tier), tb=tierOrder.indexOf(b.tier);
              return ta===tb ? a.pos-b.pos : ta-tb;
            });
          if (officialPlayers.length > 0) {
            setPlayers(officialPlayers);
            const first=officialPlayers[0];
            const second=officialPlayers[1] || first;
            setChallenger(first.id);
            setOpponent(second.id);
            setScoreStudentId(first.id);
          }
        }
        const remoteMatches=Array.isArray((matchesRes as any)?.data)?(matchesRes as any).data:[];
        if(remoteMatches.length){
          const normalized=remoteMatches.map((m:any)=>({
            id:String(m.matchId||m.id||`gm_${Math.random()}`),
            a:String(m.playerAName||m.a||'Người chơi A'),
            b:String(m.playerBName||m.b||'Người chơi B'),
            result:m.winnerName?`${m.winnerName} thắng`:(m.result||'Hòa'),
            mode:String(m.matchType||m.mode||'1vs1'),
            delta:m.delta||`${Number(m.scoreA)||0} - ${Number(m.scoreB)||0}`,
            time:String(m.endedAt||m.startedAt||m.createdAt||''),
            playerAId:String(m.playerAId||''), playerBId:String(m.playerBId||''), winnerId:String(m.winnerId||''),
            scoreA:Number(m.scoreA)||0, scoreB:Number(m.scoreB)||0, source:'sheet'
          }));
          setHistory(prev=>{ const ids=new Set(normalized.map((x:any)=>x.id)); return [...normalized,...prev.filter((x:any)=>!ids.has(x.id))]; });
        }
        setCloudStatus('online');
      } catch(err){ console.error(err); if(!cancelled)setCloudStatus('offline'); }
    })();
    return ()=>{cancelled=true};
  }, []);
  const addStudent = async () => {
    const name=newStudentName.trim(); const pts=Math.max(0,Math.trunc(Number(newStudentPoints)||0));
    if(!name){setPointNotice('Nhập họ tên học sinh cần thêm.');return;}
    if(players.some(p=>p.name.toLowerCase()===name.toLowerCase())){setPointNotice('Học sinh này đã có trong danh sách.');return;}
    const tempId=`p${Date.now()}`;
    setPlayers(prev=>withPlayerRanks([...prev,{id:tempId,name,role:'Học sinh',tier:'Tân binh',pos:1,arena:pts,xp:0,wins:0,rankDays:0,rankSince:new Date().toISOString()}],true));
    setScoreStudentId(tempId); setNewStudentName(''); setNewStudentPoints(0);
    try {
      const saved=await apiPost('addStudent',{fullName:name,points:pts,arenaLevel:'YEU'});
      const realId=String(saved.studentId||tempId);
      setPlayers(prev=>withPlayerRanks(prev.map(p=>p.id===tempId?{...p,id:realId}:p),true));
      setScoreStudentId(realId); setCloudStatus('online');
      setPointNotice(`Đã thêm ${name} với ${pts} điểm và lưu vào Google Sheet.`);
    } catch(err){console.error(err);setCloudStatus('offline');setPointNotice(`Đã lưu ${name} trên máy; chưa đồng bộ được Google Sheet.`);}
  };

  const crossTierRule = (a?:Player, b?:Player) => {
    if (!a || !b) return {ok:false, message:'Không xác định được hai học sinh.'};
    const ai=tierOrder.indexOf(a.tier), bi=tierOrder.indexOf(b.tier);
    if (ai < 0 || bi < 0 || bi !== ai + 1) return {ok:false, message:'Vượt cấp chỉ áp dụng lên đúng 1 cấp liền kề.'};
    const upper=players.filter(p=>p.tier===b.tier);
    const lastRank=Math.max(...upper.map(p=>p.pos));
    const normalTarget=b.pos===lastRank;
    const grandChallenge=a.pos===1 && b.pos===1;
    if (!normalTarget && !grandChallenge) return {ok:false, message:`${a.name} chỉ được thách Hạng ${lastRank} ${b.tier}. Riêng Hạng 1 ${a.tier} được mở Đại Thách Đấu với Hạng 1 ${b.tier}.`};
    return {ok:true, grandChallenge, lastRank, message:grandChallenge?'Đại Thách Đấu: Hạng 1 cấp dưới thách Hạng 1 cấp trên.':`Cửa vượt cấp: thách Hạng ${lastRank} ${b.tier}.`};
  };

  const classOfficerRule = (a?:Player, b?:Player) => {
    if (!a || !b) return {ok:false, message:'Không xác định được hai học sinh.'};
    if (b.role === 'Học sinh') return {ok:false, message:`${b.name} không thuộc Ban cán sự.`};
    const topNote = b.pos === 1 ? ` • ${b.name} đồng thời đang giữ Hạng 1 ${b.tier}` : '';
    return {ok:true, message:`Ải Ban cán sự: ${a.name} thách ${b.role} ${b.name}${topNote}. Trận này không tự đổi thứ hạng; thắng được thưởng Arena riêng.`};
  };


  const guardianRule = (a?:Player, b?:Player) => {
    if (!a || !b) return {ok:false, message:'Không xác định được hai học sinh.'};
    if (!b.guardian) return {ok:false, message:`${b.name} hiện không được giáo viên chỉ định là Người giữ ải.`};
    if (a.id === b.id) return {ok:false, message:'Người giữ ải không thể tự thách đấu chính mình.'};
    return {ok:true, message:`${a.name} thách ${b.name} tại ${b.guardian}. Đây là ải đặc biệt: không tự đổi Hạng; người thách đấu vượt ải được +40 Arena, Người giữ ải bảo vệ thành công được +25 Arena.`};
  };


  const championRule = (a?:Player, b?:Player) => {
    if (!a || !b) return {ok:false, message:'Không xác định được hai học sinh.'};
    const flagged = players.filter(p=>p.champion).sort((x,y)=>y.arena-x.arena);
    const currentChampion = flagged[0] || sorted[0];
    if (!currentChampion || b.id !== currentChampion.id) return {ok:false, message:`${b.name} hiện không phải Champion toàn lớp.`};
    if (a.id === b.id) return {ok:false, message:'Champion không thể tự thách đấu chính mình.'};
    if (a.pos !== 1) return {ok:false, message:`${a.name} đang Hạng ${a.pos} ${a.tier}. Chỉ Hạng 1 của một cấp mới được thách Champion.`};
    return {ok:true, message:`${a.name} • Hạng 1 ${a.tier} thách Champion ${b.name}. Nếu thắng, danh hiệu Champion chuyển sang ${a.name}; thứ hạng trong các cấp giữ nguyên.`};
  };

  const challengeMeta = useMemo(() => {
    const a = challenger === 'manual' ? undefined : players.find(p => p.id === challenger);
    const b = opponent === 'manual' ? undefined : players.find(p => p.id === opponent);
    if (!a || !b) return { type:'1vs1 tự do', reason:'Học sinh nhập thủ công: giáo viên xác nhận trận đấu trực tiếp.', icon:'⚔️' };
    // Champion toàn lớp là một danh hiệu riêng. Nếu dữ liệu cũ có nhiều cờ champion,
    // chỉ người có Arena cao nhất được coi là Champion hiện tại.
    const flaggedChampions = players.filter(p=>p.champion).sort((x,y)=>y.arena-x.arena);
    const champion = flaggedChampions[0] || sorted[0];
    if (b.id === champion?.id && a.id !== b.id) {
      const eligible = a.pos === 1;
      return { type:'Thách đấu Champion toàn lớp', reason:eligible?`${a.name} là Hạng 1 ${a.tier} và đủ điều kiện thách Champion ${b.name}. Champion là danh hiệu riêng, không thay thế Hạng 1 của cấp.`:`${a.name} chưa đủ điều kiện: chỉ Hạng 1 của một cấp mới được thách Champion toàn lớp.`, icon:'👑' };
    }
    if (b.guardian) return { type:'Thách đấu Người giữ ải', reason:`${b.name} đang giữ ${b.guardian}.`, icon:'🛡️' };
    if (b.role !== 'Học sinh') { const rule=classOfficerRule(a,b); return { type:'Thách đấu Ban cán sự', reason:rule.message, icon:'🎖️' }; }
    if (a.tier === b.tier && b.pos === 1) return { type:`Tranh Hạng 1 ${b.tier}`, reason:`${b.name} đang giữ Hạng 1 trong cấp ${b.tier}. Đây không phải Champion toàn lớp.`, icon:'🥇' };
    if (a.tier !== b.tier) { const rule=crossTierRule(a,b); return { type:'Thách đấu vượt cấp', reason:rule.ok?rule.message:`Chưa đủ điều kiện: ${rule.message}`, icon:'🚀' }; }
    return { type:'1vs1 cùng cấp', reason:`Hai học sinh cùng cấp ${a.tier}; Hạng ${a.pos} đấu Hạng ${b.pos}.`, icon:'⚔️' };
  }, [challenger, opponent, players, sorted]);

  const effectiveMatchType = matchTypeOverride || challengeMeta.type;

  useEffect(() => {
    if (!inBattle || !timerRunning || timeLeft <= 0) return;
    const timer = window.setInterval(() => setTimeLeft(v => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [inBattle, timerRunning, timeLeft]);

  useEffect(() => {
    if (inBattle && timeLeft === 0) { setTimerRunning(false); setTimeExpired(true); }
  }, [inBattle, timeLeft]);

  const formatTime = (seconds:number) => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;

  const playArenaSound = (kind:'start'|'tick'|'reveal'|'next'|'finish') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const ctx = audioContextRef.current || new window.AudioContext();
      audioContextRef.current = ctx;
      const now = ctx.currentTime;
      const notes = kind==='start' ? [392,523,659] : kind==='finish' ? [523,659,784] : kind==='reveal' ? [660,880] : kind==='next' ? [440,554] : [880];
      notes.forEach((freq,i)=>{
        const osc=ctx.createOscillator(); const gain=ctx.createGain();
        osc.type = kind==='tick' ? 'square' : 'sine'; osc.frequency.value=freq;
        gain.gain.setValueAtTime(0.0001, now+i*.11);
        gain.gain.exponentialRampToValueAtTime(kind==='tick'?0.035:0.075, now+i*.11+.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now+i*.11+.16);
        osc.connect(gain); gain.connect(ctx.destination); osc.start(now+i*.11); osc.stop(now+i*.11+.18);
      });
    } catch { /* âm thanh là tăng cường, không chặn trận đấu */ }
  };

  useEffect(() => {
    if (inBattle && timerRunning && timeLeft > 0 && timeLeft <= 10) playArenaSound('tick');
  }, [timeLeft, inBattle, timerRunning]);

  const addStudentPoints = async () => {
    const delta=Math.trunc(Number(studentPointDelta));
    const target=players.find(p=>p.id===scoreStudentId);
    if(!target||!Number.isFinite(delta)||delta===0){setPointNotice('Chọn học sinh và nhập số điểm khác 0.');return;}
    setPlayers(prev=>withPlayerRanks(prev.map(p=>p.id===scoreStudentId?{...p,arena:Math.max(0,p.arena+delta)}:p),true));
    try {
      await apiPost('adjustPoints',{studentId:scoreStudentId,changePoints:delta,reason:'GV điều chỉnh trên Đấu trường',createdBy:'TEACHER'});
      setCloudStatus('online'); setPointNotice(`${target.name}: ${delta>0?'+':''}${delta} điểm • đã lưu Google Sheet.`);
    } catch(err){console.error(err);setCloudStatus('offline');setPointNotice(`${target.name}: ${delta>0?'+':''}${delta} điểm • đã lưu trên máy, chưa đồng bộ Google Sheet.`);}
  };
  const addTeamPoints = () => {
    const delta = Math.trunc(Number(teamPointDelta));
    if (!Number.isFinite(delta) || delta===0) { setPointNotice('Chọn tổ và nhập số điểm khác 0.'); return; }
    setTeams(prev=>withTeamRanks(prev.map(t=>t.name===scoreTeamName?{...t,points:Math.max(0,t.points+delta)}:t),true));
    setPointNotice(`${scoreTeamName}: ${delta>0?'+':''}${delta} điểm tổ.`);
  };


  const startTeamBattle = () => {
    if (teamA===teamB) { setTeamNotice('Vui lòng chọn hai tổ khác nhau.'); return; }
    setTeamBattle({mode:teamMode,a:teamA,b:teamB});
    setTeamQuestionIndex(0);
    setTeamAnswers({});
    setTeamNotice('');
  };

  const finishTeamBattle = async (finalA:number, finalB:number) => {
    if(!teamBattle) return;
    const isDraw=finalA===finalB;
    const winnerName=isDraw?'':(finalA>finalB?teamBattle.a:teamBattle.b);
    const reward=teamBattle.mode==='Tiếp sức'?40:30;
    const drawReward=10;
    const now=new Date().toISOString();
    let nextTeams=teams.map(t=>{
      if(isDraw && (t.name===teamBattle.a || t.name===teamBattle.b)) return {...t,points:t.points+drawReward};
      if(t.name===winnerName) return {...t,points:t.points+reward,wins:t.wins+1,relay:t.relay+(teamBattle.mode==='Tiếp sức'?1:0)};
      return t;
    });
    nextTeams=withTeamRanks(nextTeams,true);
    setTeams(nextTeams);
    const result=isDraw?'Hòa':`${winnerName} thắng`;
    setHistory(h=>[{id:`tm${Date.now()}`,a:teamBattle.a,b:teamBattle.b,result,mode:teamBattle.mode,delta:isDraw?`+${drawReward} mỗi tổ`:`+${reward} điểm tổ`,time:new Date().toLocaleString('vi-VN')},...h]);
    try {
      const changed=nextTeams.filter(t=>t.name===teamBattle.a || t.name===teamBattle.b);
      for(const t of changed){
        await apiPost('saveTeam',{teamId:`TEAM_${t.name.replace(/\s+/g,'_').toUpperCase()}`,teamName:t.name,points:t.points,wins:t.wins,relayWins:t.relay,rank:t.lastRank||0,rankSince:t.rankSince||now,status:'ACTIVE',updatedAt:now});
      }
      setCloudStatus('online');
      setTeamNotice(`Kết thúc ${teamBattle.mode}: ${result} • ${finalA}–${finalB} • ${isDraw?`mỗi tổ +${drawReward}`:`${winnerName} +${reward}`} điểm tổ • đã đồng bộ Google Sheet.`);
    } catch(err){
      console.error(err); setCloudStatus('offline');
      setTeamNotice(`Kết thúc ${teamBattle.mode}: ${result} • ${finalA}–${finalB} • đã lưu trên máy, chưa đồng bộ Google Sheet.`);
    }
    setTeamBattle(null); setTeamQuestionIndex(0); setTeamAnswers({});
  };


  const finishBattle = async (finalA:number, finalB:number) => {
    if(!battle) return;
    const result=finalA===finalB?'Hòa':finalA>finalB?`${battle.a} thắng`:`${battle.b} thắng`;
    playArenaSound('finish');
    const playerA=players.find(p=>p.name===battle.a);
    const playerB=players.find(p=>p.name===battle.b);
    const winner=finalA===finalB?undefined:(finalA>finalB?playerA:playerB);
    const loser=finalA===finalB?undefined:(finalA>finalB?playerB:playerA);

    // Luật xếp hạng: cùng cấp dùng ladder; vượt cấp dùng cửa ải liền kề.
    let arenaDeltaForWinner = 0;
    let nextPlayers = players;
    let crossTierText = '';
    if (winner && loser) {
      const sameTier = winner.tier === loser.tier;
      const isSameTierRule = sameTier && (battle.mode === '1vs1 cùng cấp' || battle.mode.startsWith('Tranh Hạng 1'));
      const battleA=playerA, battleB=playerB;
      const isCrossTier = battle.mode === 'Thách đấu vượt cấp' && !!battleA && !!battleB && battleA.tier !== battleB.tier;
      const isOfficerBattle = battle.mode === 'Thách đấu Ban cán sự' && !!battleA && !!battleB && battleB.role !== 'Học sinh';
      const isGuardianBattle = battle.mode === 'Thách đấu Người giữ ải' && !!battleA && !!battleB && !!battleB.guardian;
      const championNow = [...players].filter(p=>p.champion).sort((x,y)=>y.arena-x.arena)[0] || [...players].sort((x,y)=>y.arena-x.arena)[0];
      const isChampionBattle = battle.mode === 'Thách đấu Champion toàn lớp' && !!battleA && !!battleB && championNow?.id === battleB.id;
      arenaDeltaForWinner = 10;
      if (isSameTierRule && winner.pos > loser.pos) arenaDeltaForWinner = Math.max(10, loser.arena + 1 - winner.arena);

      let updated = players.map(p => {
        if (p.id === winner.id) return {...p, arena:p.arena+arenaDeltaForWinner, wins:(p.wins||0)+1, matchesPlayed:(p.matchesPlayed||0)+1};
        if (p.id === loser.id) return {...p, losses:(p.losses||0)+1, matchesPlayed:(p.matchesPlayed||0)+1};
        return p;
      });
      const now = new Date().toISOString();

      if (isOfficerBattle && battleA && battleB) {
        // Kênh Ban cán sự độc lập với ladder: không đổi pos/tier.
        // HS thách đấu thắng được +30 Arena; cán sự bảo vệ ải thắng được +20 Arena.
        const challengerWon = winner.id === battleA.id;
        arenaDeltaForWinner = challengerWon ? 30 : 20;
        nextPlayers = players.map(p=>{
          if(p.id===winner.id) return {...p,arena:p.arena+arenaDeltaForWinner,wins:(p.wins||0)+1,matchesPlayed:(p.matchesPlayed||0)+1};
          if(p.id===loser.id) return {...p,losses:(p.losses||0)+1,matchesPlayed:(p.matchesPlayed||0)+1};
          return p;
        });
        crossTierText = challengerWon ? ` • Vượt Ải Ban cán sự: ${battleA.name} +30 Arena` : ` • ${battleB.role} ${battleB.name} giữ ải thành công: +20 Arena`;
      } else if (isChampionBattle && battleA && battleB) {
        const rule=championRule(battleA,battleB);
        const challengerWon=winner.id===battleA.id;
        if (!rule.ok) {
          arenaDeltaForWinner=0;
          nextPlayers=players;
          crossTierText=` • Trận Champion không hợp lệ: ${rule.message}`;
        } else if (challengerWon) {
          arenaDeltaForWinner=120;
          nextPlayers=players.map(p=>{
            if(p.id===battleA.id) return {...p,champion:true,championSince:now,arena:p.arena+120,wins:(p.wins||0)+1,matchesPlayed:(p.matchesPlayed||0)+1};
            if(p.id===battleB.id) return {...p,champion:false,championSince:undefined,losses:(p.losses||0)+1,matchesPlayed:(p.matchesPlayed||0)+1};
            return {...p,champion:false,championSince:undefined};
          });
          crossTierText=` • 👑 ${battleA.name} trở thành CHAMPION toàn lớp • +120 Arena`;
        } else {
          arenaDeltaForWinner=60;
          nextPlayers=players.map(p=>{
            if(p.id===battleB.id) return {...p,champion:true,championSince:p.championSince||now,arena:p.arena+60,wins:(p.wins||0)+1,matchesPlayed:(p.matchesPlayed||0)+1};
            if(p.id===battleA.id) return {...p,losses:(p.losses||0)+1,matchesPlayed:(p.matchesPlayed||0)+1};
            return p;
          });
          crossTierText=` • 👑 ${battleB.name} bảo vệ Champion thành công • +60 Arena`;
        }
      } else if (isGuardianBattle && battleA && battleB) {
        // Guardian là vai trò do GV chỉ định, độc lập với ladder và Champion.
        // Thắng Guardian = vượt ải; không tự chiếm vai trò Guardian và không tự đổi Hạng.
        const challengerWon = winner.id === battleA.id;
        arenaDeltaForWinner = challengerWon ? 40 : 25;
        nextPlayers = players.map(p=>{
          if(p.id===winner.id) return {...p,arena:p.arena+arenaDeltaForWinner,wins:(p.wins||0)+1,matchesPlayed:(p.matchesPlayed||0)+1};
          if(p.id===loser.id) return {...p,losses:(p.losses||0)+1,matchesPlayed:(p.matchesPlayed||0)+1};
          return p;
        });
        crossTierText = challengerWon
          ? ` • VƯỢT ẢI thành công: ${battleA.name} thắng ${battleB.guardian} • +40 Arena`
          : ` • ${battleB.name} bảo vệ ${battleB.guardian} thành công • +25 Arena`;
      } else if (isSameTierRule) {
        const tierSorted = updated.filter(p=>p.tier===winner.tier).sort((a,b)=>b.arena-a.arena || a.pos-b.pos);
        const rankMap = new Map(tierSorted.map((p,i)=>[p.id,i+1]));
        nextPlayers = updated.map(p=>p.tier!==winner.tier?p:{...p,pos:rankMap.get(p.id)||p.pos,rankSince:(rankMap.get(p.id)||p.pos)!==p.pos?now:p.rankSince,rankDays:(rankMap.get(p.id)||p.pos)!==p.pos?0:p.rankDays});
      } else if (isCrossTier && battleA && battleB) {
        const rule=crossTierRule(battleA,battleB);
        const challengerWon=winner.id===battleA.id;
        if (rule.ok && challengerWon) {
          const oldATier=battleA.tier, oldAPos=battleA.pos, oldBTier=battleB.tier, oldBPos=battleB.pos;
          arenaDeltaForWinner = rule.grandChallenge ? 100 : 50;
          updated = players.map(p=>{
            if(p.id===battleA.id) return {...p,tier:oldBTier,pos:oldBPos,arena:p.arena+arenaDeltaForWinner,wins:(p.wins||0)+1,matchesPlayed:(p.matchesPlayed||0)+1,shield:1,placement:3,rankSince:now,rankDays:0};
            if(p.id===battleB.id) return {...p,tier:oldATier,pos:oldAPos,losses:(p.losses||0)+1,matchesPlayed:(p.matchesPlayed||0)+1,rankSince:now,rankDays:0};
            return p;
          });
          nextPlayers=updated;
          crossTierText=rule.grandChallenge?` • ĐẠI THÁCH ĐẤU thành công: ${battleA.name} lên ${oldBTier} Hạng ${oldBPos}`:` • Vượt cấp thành công: ${battleA.name} lên ${oldBTier} Hạng ${oldBPos}`;
        } else {
          arenaDeltaForWinner = 15;
          nextPlayers=players.map(p=>p.id===winner.id?{...p,arena:p.arena+15,wins:(p.wins||0)+1,matchesPlayed:(p.matchesPlayed||0)+1}:p.id===loser.id?{...p,losses:(p.losses||0)+1,matchesPlayed:(p.matchesPlayed||0)+1}:p);
          crossTierText=rule.ok?' • Người thách đấu chưa vượt cấp; thứ hạng giữ nguyên.':'';
        }
      } else {
        nextPlayers = updated;
      }
      setPlayers(nextPlayers);
    } else if (finalA===finalB && playerA && playerB) {
      nextPlayers = players.map(p => (p.id===playerA.id || p.id===playerB.id) ? {...p,matchesPlayed:(p.matchesPlayed||0)+1} : p);
      setPlayers(nextPlayers);
    }

    const rankChange = winner && loser && winner.tier===loser.tier && winner.pos>loser.pos && (battle.mode==='1vs1 cùng cấp' || battle.mode.startsWith('Tranh Hạng 1'));
    const winnerAfter = winner ? nextPlayers.find(p=>p.id===winner.id) : undefined;
    const localMatch={id:`m${Date.now()}`,a:battle.a,b:battle.b,result,mode:battle.mode,delta:winner?`+${arenaDeltaForWinner} Arena`:'Hòa',time:new Date().toLocaleString('vi-VN')};
    setHistory(h=>[localMatch,...h]);
    try {
      await apiPost('saveMatch',{
        matchType:battle.mode,
        arenaLevel:battle.arenaTier,
        playerAId:playerA?.id||'',
        playerAName:battle.a,
        playerBId:playerB?.id||'',
        playerBName:battle.b,
        winnerId:winner?.id||'',
        winnerName:winner?.name||'',
        totalQuestions:battleQuestions.length,
        scoreA:finalA,
        scoreB:finalB,
        durationMinutes:battleMinutes,
        startedAt:new Date(Date.now()-(battleMinutes*60-timeLeft)*1000).toISOString(),
        endedAt:new Date().toISOString(),
        status:'COMPLETED',
        createdBy:'TEACHER'
      });
      if (winner && arenaDeltaForWinner>0) {
        await apiPost('adjustPoints',{studentId:winner.id,changePoints:arenaDeltaForWinner,reason:`Kết quả ${battle.mode}: ${winner.name} thắng`,createdBy:'ARENA'});
      }
      setCloudStatus('online');
      const rankText=rankChange&&winnerAfter?` • ${winner.name} lên Hạng ${winnerAfter.pos} ${winnerAfter.tier}`:'';
      setNotice(`Kết thúc trận: ${result} • ${finalA}–${finalB}${rankText}${crossTierText} • +${arenaDeltaForWinner||0} Arena • đã lưu Google Sheet`);
    } catch(err){
      console.error(err); setCloudStatus('offline');
      const rankText=rankChange&&winnerAfter?` • ${winner.name} lên Hạng ${winnerAfter.pos} ${winnerAfter.tier}`:'';
      setNotice(`Kết thúc trận: ${result} • ${finalA}–${finalB}${rankText}${crossTierText} • đã lưu trên máy, chưa đồng bộ Google Sheet`);
    }
    setInBattle(false); setBattle(null); setQuestionIndex(0); setAnswers({});
  };


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
                {players.map(p=><option key={p.id} value={p.id}>{p.name} • {p.tier} • Hạng {p.pos}</option>)}<option value="manual">＋ Nhập tên học sinh khác</option>
              </select>
              {challenger==='manual'&&<input value={challengerInput} onChange={e=>setChallengerInput(e.target.value)} placeholder="Nhập họ và tên học sinh" className="mt-2 w-full rounded-xl border border-indigo-200 bg-indigo-50/40 px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-200"/>}
            </label>
            <label className="text-sm font-bold text-slate-700">Đối thủ
              <select value={opponent} onChange={e=>setOpponent(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-200">
                {players.map(p=><option key={p.id} value={p.id}>{p.name} • {p.tier} • Hạng {p.pos}</option>)}<option value="manual">＋ Nhập tên học sinh khác</option>
              </select>
              {opponent==='manual'&&<input value={opponentInput} onChange={e=>setOpponentInput(e.target.value)} placeholder="Nhập họ và tên đối thủ" className="mt-2 w-full rounded-xl border border-indigo-200 bg-indigo-50/40 px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-200"/>}
            </label>
            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-black text-slate-800">Loại trận</div>
                  <div className="mt-0.5 text-xs font-medium text-slate-500">Chọn nhanh một hình thức thi đấu.</div>
                </div>
                <button type="button" onClick={()=>setMatchTypeOverride('')} className={`rounded-lg border px-3 py-1.5 text-[11px] font-black transition ${!matchTypeOverride?'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm':'border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:text-indigo-700'}`}>↩ Tự nhận diện</button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-3">
                {[
                  ['⚔️','1vs1 cùng cấp','Hai học sinh cùng cấp.'],
                  ['🚀','Vượt cấp','Thách đấu đối thủ cấp cao hơn.'],
                  ['🎖️','Ban cán sự','Thách đấu cán sự lớp.'],
                  ['🛡️','Người giữ ải','Trận đặc biệt vượt ải.'],
                  ['🥇','Tranh Hạng 1','Tranh vị trí Hạng 1 của cấp.'],
                  ['👑','Champion','Thách đấu Champion toàn lớp.'],
                ].map(([icon,label,desc])=>{
                  const type = label==='Vượt cấp' ? 'Thách đấu vượt cấp' : label==='Ban cán sự' ? 'Thách đấu Ban cán sự' : label==='Người giữ ải' ? 'Thách đấu Người giữ ải' : label==='Champion' ? 'Thách đấu Champion toàn lớp' : label==='Tranh Hạng 1' ? 'Tranh Hạng 1 của cấp' : label;
                  const selected = effectiveMatchType === type || (label === 'Tranh Hạng 1' && effectiveMatchType.startsWith('Tranh Hạng 1 '));
                  return <button key={label} type="button" onClick={()=>{
                    const chosen = label === 'Tranh Hạng 1'
                      ? `Tranh Hạng 1 ${players.find(p=>p.id===opponent)?.tier || players.find(p=>p.id===challenger)?.tier || 'của cấp'}`
                      : type;
                    setMatchTypeOverride(chosen);
                  }} className={`group relative min-h-[68px] rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${selected?'z-10 -translate-y-0.5 border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-[0_6px_18px_rgba(79,70,229,0.18)] ring-2 ring-indigo-100':'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm'}`}>
                    {selected && <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-black text-white shadow">✓</span>}
                    <div className="flex items-center gap-2 pr-6">
                      <span className={`text-lg leading-none ${selected?'scale-110':''}`}>{icon}</span>
                      <span className={`text-[13px] font-black leading-4 ${selected?'text-indigo-900':'text-slate-800'}`}>{label}</span>
                    </div>
                    <div className={`mt-1 pl-7 text-[10px] font-semibold leading-4 ${selected?'text-indigo-600':'text-slate-400'}`}>{desc}</div>
                  </button>
                })}
              </div>
              <div className={`mt-3 rounded-xl border px-3 py-2.5 ${matchTypeOverride?'border-amber-200 bg-amber-50':'border-indigo-100 bg-indigo-50/70'}`}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${matchTypeOverride?'bg-amber-100 text-amber-700':'bg-indigo-100 text-indigo-700'}`}>{matchTypeOverride?'GV điều chỉnh':'Tự nhận diện'}</span>
                  <span className="text-xs font-black text-slate-800">{effectiveMatchType}</span>
                </div>
                <div className="mt-1 text-[11px] font-medium leading-4 text-slate-500">
                  {effectiveMatchType.startsWith('Tranh Hạng 1 ') ? 'Tranh vị trí Hạng 1 trong đúng cấp hiện tại; không phải Champion toàn lớp.' : effectiveMatchType==='Thách đấu Champion toàn lớp' ? 'Chỉ Hạng 1 của một cấp được thách Champion; thắng sẽ chiếm danh hiệu nhưng không đổi Hạng trong cấp.' : effectiveMatchType==='Thách đấu vượt cấp' ? 'Học sinh thách đấu đối thủ ở cấp cao hơn.' : effectiveMatchType==='Thách đấu Ban cán sự' ? 'Ải riêng của Ban cán sự: không tự đổi hạng; HS thắng +30 Arena, cán sự giữ ải thắng +20 Arena.' : effectiveMatchType==='Thách đấu Người giữ ải' ? 'Ải Guardian: thắng để vượt ải; không tự đổi Hạng hoặc chiếm vai trò Người giữ ải.' : effectiveMatchType==='1vs1 cùng cấp' ? 'Hai học sinh thi đấu trong cùng một cấp.' : 'Giáo viên chủ động chọn hình thức thi đấu.'}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 grid sm:grid-cols-[1fr_auto] gap-3 items-end">
            <label className="text-sm font-bold text-slate-700">Thời gian toàn trận
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><Clock3 size={18} className="text-indigo-600"/><input type="number" min={1} max={90} value={battleMinutes} onChange={e=>setBattleMinutes(Math.max(1,Math.min(90,Number(e.target.value)||1)))} className="w-full py-3 outline-none font-black text-slate-900"/><span className="text-sm font-bold text-slate-500">phút</span></div>
            </label>
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-800 font-bold">⏱ Nhập 1–90 phút</div>
          </div>
          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600"><b className="text-slate-900">Cách tổ chức:</b> hai học sinh giải trên giấy hoặc lên bảng. App chỉ hiển thị câu hỏi, nhận đáp án A–D cuối cùng, chấm điểm và điều khiển diễn biến trận.</div>
          {!battle ? <button onClick={()=>{if(tickets<=0){setNotice('Không còn vé thách đấu.');return;} const aName=challenger==='manual'?challengerInput.trim():players.find(p=>p.id===challenger)?.name||''; const bName=opponent==='manual'?opponentInput.trim():players.find(p=>p.id===opponent)?.name||''; if(!aName||!bName){setNotice('Vui lòng chọn hoặc nhập đầy đủ tên hai học sinh.');return;} if(aName.toLocaleLowerCase('vi')===bName.toLocaleLowerCase('vi')){setNotice('Không thể tự thách đấu chính mình.');return;} const aPlayer=challenger==='manual'?undefined:players.find(p=>p.id===challenger); const bPlayer=opponent==='manual'?undefined:players.find(p=>p.id===opponent); if(effectiveMatchType==='Thách đấu vượt cấp' && aPlayer && bPlayer){const rule=crossTierRule(aPlayer,bPlayer); if(!rule.ok){setNotice(`🚀 ${rule.message}`);return;}} if(effectiveMatchType==='Thách đấu Ban cán sự' && aPlayer && bPlayer){const rule=classOfficerRule(aPlayer,bPlayer); if(!rule.ok){setNotice(`🎖️ ${rule.message}`);return;}} if(effectiveMatchType==='Thách đấu Người giữ ải' && aPlayer && bPlayer){const rule=guardianRule(aPlayer,bPlayer); if(!rule.ok){setNotice(`🛡️ ${rule.message}`);return;}} setTickets(v=>v-1); const aTier:Tier=challenger==='manual'?'Tân binh':(players.find(p=>p.id===challenger)?.tier||'Tân binh'); const bTier:Tier=opponent==='manual'?'Tân binh':(players.find(p=>p.id===opponent)?.tier||'Tân binh'); setBattle({a:aName,b:bName,mode:effectiveMatchType,arenaTier:higherTier(aTier,bTier)}); setNotice(''); setQuestionIndex(0); setAnswers({}); setTimeLeft(battleMinutes*60); setTimerRunning(false); setTimeExpired(false);}} className="w-full mt-5 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm"><Swords size={20}/> XÁC NHẬN TRẬN ĐẤU</button> : <motion.div initial={{opacity:0,y:10,scale:.98}} animate={{opacity:1,y:0,scale:1}} className="mt-5 overflow-hidden rounded-[24px] border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 shadow-lg">
            <div className="px-5 pt-5 pb-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black tracking-wide text-emerald-700"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> TRẬN ĐẤU ĐÃ SẴN SÀNG</div>
              <div className="mt-3 flex items-center justify-center gap-3 text-slate-900"><span className="text-xl md:text-2xl font-black">{battle.a}</span><span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-black text-white">VS</span><span className="text-xl md:text-2xl font-black">{battle.b}</span></div>
              <div className="mt-2 text-sm font-bold text-slate-500">{battle.mode} • ⏱ {battleMinutes} phút</div>
            </div>
            <button onClick={()=>{setInBattle(true);setTimerRunning(true);playArenaSound('start')}} className="group w-full min-h-[72px] bg-emerald-600 px-5 py-4 text-white transition hover:bg-emerald-700 active:scale-[.995] flex items-center justify-center gap-3 text-lg md:text-xl font-black"><span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition"><Play size={22} fill="currentColor"/></span> VÀO TRẬN NGAY <ChevronRight size={22}/></button>
            <button onClick={()=>setBattle(null)} className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-800 bg-white/70">← Chọn lại học sinh hoặc thời gian</button>
          </motion.div>}
        </section>
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b"><h3 className="font-black text-slate-900 flex items-center gap-2"><History size={19} className="text-indigo-600"/> Lịch sử thách đấu</h3><p className="text-xs text-slate-500 mt-1">Các trận đã hoàn thành gần nhất.</p></div>
          <div className="divide-y">{history.filter(h=>h.result!=='Đang chờ').map(h=><div key={h.id} className="p-4"><div className="flex justify-between gap-3"><div className="font-black text-slate-800">{h.a} <span className="text-slate-400">vs</span> {h.b}</div><span className="text-xs font-black px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{h.result}</span></div><div className="text-xs text-slate-500 mt-2 flex justify-between"><span>{h.mode} • {h.time}</span><b>{h.delta}</b></div></div>)}</div>
        </section>
      </div> : battle && (()=>{const q=battleQuestions[questionIndex]; const cur=answers[questionIndex]||{}; const letters=['A','B','C','D']; const scoreA=Object.entries(answers).filter(([i,v])=>v.revealed&&v.a===battleQuestions[Number(i)]?.correct).length; const scoreB=Object.entries(answers).filter(([i,v])=>v.revealed&&v.b===battleQuestions[Number(i)]?.correct).length; const streak=(side:'a'|'b')=>{let n=0; for(let i=questionIndex-1;i>=0;i--){const v=answers[i]; if(!v?.revealed) continue; if(v[side]===battleQuestions[i]?.correct)n++; else break;} return n;}; const streakA=streak('a'), streakB=streak('b'); const progress=((questionIndex+(cur.revealed?1:0))/battleQuestions.length)*100; return <motion.section initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="relative overflow-hidden rounded-[30px] border border-indigo-300/40 bg-slate-950 shadow-2xl" style={{perspective:'1100px'}}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-x-[5%] top-[165px] h-[250px] rounded-[50%] border-[12px] border-indigo-400/20 bg-gradient-to-b from-indigo-500/15 to-cyan-400/5 shadow-[0_0_80px_rgba(99,102,241,.28)]" style={{transform:'rotateX(67deg)',transformOrigin:'center top'}} />
          <div className="absolute left-[8%] top-[210px] text-4xl font-black text-cyan-300/10">∫</div><div className="absolute right-[9%] top-[205px] text-4xl font-black text-fuchsia-300/10">π</div><div className="absolute left-[18%] top-[315px] text-3xl font-black text-amber-300/10">Σ</div><div className="absolute right-[20%] top-[320px] text-3xl font-black text-emerald-300/10">√</div>
        </div>
        <div className="relative p-3 md:p-5"><MathArena3D leftName={battle.a} rightName={battle.b} leftScore={scoreA} rightScore={scoreB} urgent={timeLeft<=30} arenaTier={battle.arenaTier}/><div className="mt-2 text-center text-xs font-black tracking-widest text-white/70">{arenaByTier[battle.arenaTier].label} • CẤP {arenaByTier[battle.arenaTier].academic.toUpperCase()} • SÂN CỦA CẤP CAO HƠN</div></div>
        <div className={`relative overflow-hidden bg-gradient-to-r ${arenaByTier[battle.arenaTier].css} text-white p-5 md:p-7`}>
          <motion.div animate={{opacity:[.2,.5,.2]}} transition={{duration:2,repeat:Infinity}} className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300"/>
          <div className="flex items-center justify-between gap-3"><div className="text-xs font-black tracking-[.18em] text-indigo-200">⚔️ SÀN ĐẤU TOÁN HỌC 3D • {battle.mode.toUpperCase()}</div><button type="button" onClick={()=>setSoundEnabled(v=>!v)} className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-black text-white hover:bg-white/15">{soundEnabled?'🔊 Âm thanh':'🔇 Tắt âm'}</button></div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2 md:gap-4 mt-5">
            <motion.div animate={{scale:scoreA>scoreB?1.025:1,y:scoreA>scoreB?-3:0}} className={`relative text-center rounded-2xl md:rounded-3xl p-3 md:p-5 border overflow-hidden ${scoreA>scoreB?'bg-cyan-400/15 border-cyan-300/50 shadow-[0_0_35px_rgba(34,211,238,.16)]':'bg-white/5 border-white/10'}`}><div className="absolute inset-x-0 top-0 h-1 bg-cyan-300/70"/><div className="text-[10px] md:text-xs font-black tracking-widest text-cyan-200">NGƯỜI CHƠI A</div><div className="text-base md:text-2xl font-black mt-1 truncate" title={battle.a}>{battle.a}</div><div className="mt-2 text-4xl md:text-5xl font-black text-cyan-300 tabular-nums">{scoreA}</div>{streakA>=2&&<div className="mt-2 inline-flex rounded-full bg-cyan-300/15 border border-cyan-200/20 px-2.5 py-1 text-[10px] md:text-xs font-black text-cyan-100">🔥 COMBO ×{streakA}</div>}</motion.div>
            <div className="flex flex-col items-center justify-center gap-2"><motion.div animate={{rotate:[0,-4,4,0]}} transition={{duration:1.8,repeat:Infinity,repeatDelay:2}} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 border-4 border-white/15 shadow-xl flex items-center justify-center font-black text-sm md:text-lg">VS</motion.div><div className={`min-w-[92px] md:min-w-[112px] text-center px-2 md:px-3 py-2 rounded-xl border font-mono text-lg md:text-xl font-black ${timeLeft<=30?'bg-red-500/25 border-red-400 text-red-100 animate-pulse':'bg-black/25 border-white/15 text-amber-300'}`}><Clock3 size={14} className="inline mr-1 -mt-1"/>{formatTime(timeLeft)}</div><div className="text-[9px] md:text-[10px] font-black tracking-wider text-white/45">CÂU {questionIndex+1}/{battleQuestions.length}</div></div>
            <motion.div animate={{scale:scoreB>scoreA?1.025:1,y:scoreB>scoreA?-3:0}} className={`relative text-center rounded-2xl md:rounded-3xl p-3 md:p-5 border overflow-hidden ${scoreB>scoreA?'bg-amber-400/15 border-amber-300/50 shadow-[0_0_35px_rgba(251,191,36,.16)]':'bg-white/5 border-white/10'}`}><div className="absolute inset-x-0 top-0 h-1 bg-amber-300/70"/><div className="text-[10px] md:text-xs font-black tracking-widest text-amber-200">NGƯỜI CHƠI B</div><div className="text-base md:text-2xl font-black mt-1 truncate" title={battle.b}>{battle.b}</div><div className="mt-2 text-4xl md:text-5xl font-black text-amber-300 tabular-nums">{scoreB}</div>{streakB>=2&&<div className="mt-2 inline-flex rounded-full bg-amber-300/15 border border-amber-200/20 px-2.5 py-1 text-[10px] md:text-xs font-black text-amber-100">🔥 COMBO ×{streakB}</div>}</motion.div>
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3"><div className="h-2.5 rounded-full bg-white/10 overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400" animate={{width:`${Math.max(progress,4)}%`}} transition={{duration:.35}}/></div><div className="text-[10px] font-black text-white/55">TIẾN ĐỘ {Math.round(progress)}%</div></div>
        </div>
        <div className="relative m-3 md:m-5 rounded-[24px] border border-white/10 bg-white p-5 md:p-8 max-w-5xl md:mx-auto shadow-[0_22px_70px_rgba(0,0,0,.28)]">
          {timeExpired&&<div className="mb-5 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-center font-black text-red-700">⏰ HẾT GIỜ! Giáo viên có thể xác nhận các đáp án đã chọn hoặc kết thúc trận.</div>}
          <div className="flex flex-wrap justify-between items-center gap-3"><div className="flex items-center gap-3"><div className="font-black text-indigo-700">CÂU {questionIndex+1} / {battleQuestions.length}</div><div className="hidden sm:block h-2 w-32 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-indigo-500" style={{width:`${((questionIndex+1)/battleQuestions.length)*100}%`}}/></div></div><div className="flex items-center gap-2 text-sm font-bold text-slate-500"><Clock3 size={17}/> Giải trên giấy hoặc trên bảng rồi chọn kết quả</div></div>
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-5 md:p-6"><div className="mb-2 text-[11px] font-black tracking-[.16em] text-indigo-500">CÂU HỎI ĐỐI KHÁNG</div><div className="text-lg md:text-2xl font-black text-slate-900 leading-8"><MathText text={q.q}/></div></div>
          <div className="grid md:grid-cols-2 gap-3 mt-5">{q.options.map((opt,i)=>{const L=letters[i]; const isCorrect=cur.revealed&&L===q.correct; const pickedA=cur.a===L, pickedB=cur.b===L; return <motion.div layout key={i} className={`rounded-2xl border-2 p-4 flex gap-3 items-center transition ${isCorrect?'border-emerald-400 bg-emerald-50 shadow-[0_8px_25px_rgba(16,185,129,.12)]':cur.revealed&&(pickedA||pickedB)?'border-rose-200 bg-rose-50':'border-slate-200 bg-slate-50'}`}><span className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center font-black ${isCorrect?'bg-emerald-600 border-emerald-600 text-white':'bg-white text-indigo-700'}`}>{L}</span><div className="min-w-0 flex-1"><MathText text={opt}/></div>{(pickedA||pickedB)&&<div className="flex gap-1">{pickedA&&<span className="rounded-full bg-cyan-100 px-2 py-1 text-[10px] font-black text-cyan-700">A</span>}{pickedB&&<span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-700">B</span>}</div>}</motion.div>})}</div>
          <div className="grid md:grid-cols-2 gap-4 mt-7">{(['a','b'] as const).map(side=>{const isA=side==='a'; return <div key={side} className={`rounded-2xl border-2 p-4 ${isA?'border-cyan-100 bg-cyan-50/40':'border-amber-100 bg-amber-50/40'}`}><div className="flex items-center justify-between gap-2"><div className="font-black text-slate-800 truncate">{isA?'🔵':'🟠'} {isA?battle.a:battle.b}</div>{cur[side]&&<span className="text-[10px] font-black text-slate-400">ĐÃ KHÓA LỰA CHỌN</span>}</div><div className="grid grid-cols-4 gap-2 mt-3">{letters.map(L=><motion.button whileTap={{scale:.94}} disabled={cur.revealed} key={L} onClick={()=>{setAnswers(prev=>({...prev,[questionIndex]:{...prev[questionIndex],[side]:L}}));playArenaSound('next')}} className={`py-3.5 rounded-xl border-2 font-black transition ${cur[side]===L?(isA?'border-cyan-600 bg-cyan-600 text-white shadow-lg':'border-amber-500 bg-amber-500 text-slate-950 shadow-lg'):'border-slate-200 bg-white hover:border-indigo-300'}`}>{L}</motion.button>)}</div></div>})}</div>
          {!cur.revealed?<button disabled={!cur.a||!cur.b} onClick={()=>{setAnswers(prev=>({...prev,[questionIndex]:{...prev[questionIndex],revealed:true}}));playArenaSound('reveal')}} className="w-full mt-5 py-3.5 rounded-xl bg-indigo-600 disabled:bg-slate-300 text-white font-black">XÁC NHẬN CÂU TRẢ LỜI</button>:<div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="font-black text-emerald-800">✓ Đáp án đúng: {q.correct}</div><div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm"><div><b>{battle.a}:</b> {cur.a===q.correct?'✓ +1 điểm':'✕ 0 điểm'}</div><div><b>{battle.b}:</b> {cur.b===q.correct?'✓ +1 điểm':'✕ 0 điểm'}</div></div>{questionIndex<battleQuestions.length-1?<button onClick={()=>{setQuestionIndex(v=>v+1);playArenaSound('next')}} className="mt-4 px-5 py-3 rounded-xl bg-slate-900 text-white font-black flex items-center gap-2">CÂU TIẾP THEO <ArrowRight size={18}/></button>:<button onClick={()=>{const finalA=scoreA+(cur.a===q.correct?1:0); const finalB=scoreB+(cur.b===q.correct?1:0); void finishBattle(finalA,finalB);}} className="mt-4 px-5 py-3 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center gap-2"><Trophy size={18}/> KẾT THÚC TRẬN</button>}</div>}
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
        <p className="text-sm text-slate-500 mt-1">Tổ 1–4 có điểm và thứ hạng riêng; kết quả không làm thay đổi hạng cá nhân, Guardian hay Champion.</p>
        {!teamBattle ? <>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {(['Đấu tổ','Tiếp sức'] as const).map(m=><button key={m} onClick={()=>setTeamMode(m)} className={`p-4 rounded-2xl border-2 text-left transition ${teamMode===m?'border-indigo-600 bg-indigo-50 text-indigo-800 shadow-sm':'border-slate-200 hover:border-indigo-300'}`}><div className="flex items-center gap-3"><span className="text-2xl">{m==='Đấu tổ'?'🛡️':'🏃'}</span><div><div className="font-black">{m}</div><div className="text-xs font-medium text-slate-500 mt-1">{m==='Đấu tổ'?'Hai tổ đối đầu trực tiếp':'Trả lời nối tiếp qua từng chặng'}</div></div></div></button>)}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <label className="text-sm font-bold text-slate-700">Tổ A<select value={teamA} onChange={e=>setTeamA(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3">{teams.map(t=><option key={t.name}>{t.name}</option>)}</select></label>
            <label className="text-sm font-bold text-slate-700">Tổ B<select value={teamB} onChange={e=>setTeamB(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3">{teams.map(t=><option key={t.name}>{t.name}</option>)}</select></label>
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"><b>{teamMode==='Đấu tổ'?'Luật Đấu tổ:':'Luật Tiếp sức:'}</b> {teamMode==='Đấu tổ'?'Hai tổ cùng trả lời từng câu. Tổ có nhiều câu đúng hơn thắng trận.':'Hai tổ lần lượt vượt từng câu như các chặng tiếp sức. Kết quả tính theo tổng số chặng trả lời đúng.'} <span className="font-bold">Thắng {teamMode==='Đấu tổ'?'+30':'+40'} điểm tổ; hòa mỗi tổ +10.</span></div>
          <button onClick={startTeamBattle} className="w-full mt-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black transition">⚔️ BẮT ĐẦU {teamMode.toUpperCase()}</button>
        </> : (()=>{const q=battleQuestions[teamQuestionIndex]; const cur=teamAnswers[teamQuestionIndex]||{}; const letters=['A','B','C','D']; const scoreA=Object.entries(teamAnswers).filter(([i,v])=>v.revealed&&v.a===battleQuestions[Number(i)]?.correct).length; const scoreB=Object.entries(teamAnswers).filter(([i,v])=>v.revealed&&v.b===battleQuestions[Number(i)]?.correct).length; return <div className="mt-5 rounded-2xl border-2 border-indigo-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-700 to-violet-700 text-white p-4"><div className="text-xs font-black tracking-widest opacity-80">{teamBattle.mode.toUpperCase()}</div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mt-2"><div><div className="font-black text-lg">{teamBattle.a}</div><div className="text-3xl font-black">{scoreA}</div></div><div className="font-black opacity-70">VS</div><div className="text-right"><div className="font-black text-lg">{teamBattle.b}</div><div className="text-3xl font-black">{scoreB}</div></div></div></div>
          <div className="p-5"><div className="flex justify-between gap-3"><div className="font-black text-indigo-700">CÂU {teamQuestionIndex+1}/{battleQuestions.length}</div><div className="text-xs font-bold text-slate-500">{teamBattle.mode==='Tiếp sức'?`CHẶNG ${teamQuestionIndex+1}`:'ĐẤU TỔ'}</div></div><div className="mt-4 text-lg font-bold text-slate-900"><MathText text={q.q}/></div><div className="grid sm:grid-cols-2 gap-2 mt-4">{q.options.map((o,i)=><div key={i} className="rounded-xl bg-slate-50 border border-slate-200 p-3"><b>{letters[i]}.</b> <MathText text={o}/></div>)}</div>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">{(['a','b'] as const).map(side=><div key={side} className="rounded-xl border border-slate-200 p-3"><div className="font-black text-sm">{side==='a'?teamBattle.a:teamBattle.b}</div><div className="grid grid-cols-4 gap-2 mt-2">{letters.map(L=><button disabled={cur.revealed} key={L} onClick={()=>setTeamAnswers(prev=>({...prev,[teamQuestionIndex]:{...prev[teamQuestionIndex],[side]:L}}))} className={`py-2 rounded-lg border-2 font-black ${cur[side]===L?'border-indigo-600 bg-indigo-600 text-white':'border-slate-200'}`}>{L}</button>)}</div></div>)}</div>
          {!cur.revealed?<button disabled={!cur.a||!cur.b} onClick={()=>setTeamAnswers(prev=>({...prev,[teamQuestionIndex]:{...prev[teamQuestionIndex],revealed:true}}))} className="w-full mt-4 py-3 rounded-xl bg-slate-900 disabled:bg-slate-300 text-white font-black">XÁC NHẬN CÂU TRẢ LỜI</button>:<div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4"><div className="font-black text-emerald-800">✓ Đáp án đúng: {q.correct}</div>{teamQuestionIndex<battleQuestions.length-1?<button onClick={()=>setTeamQuestionIndex(v=>v+1)} className="mt-3 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-black">{teamBattle.mode==='Tiếp sức'?'CHẶNG TIẾP THEO':'CÂU TIẾP THEO'} →</button>:<button onClick={()=>{const finalA=scoreA+(cur.a===q.correct?1:0);const finalB=scoreB+(cur.b===q.correct?1:0);void finishTeamBattle(finalA,finalB)}} className="mt-3 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black">🏆 KẾT THÚC TRẬN</button>}</div>}
          <button onClick={()=>{setTeamBattle(null);setTeamQuestionIndex(0);setTeamAnswers({})}} className="mt-4 text-sm font-bold text-slate-500">← Hủy trận / chọn lại tổ</button></div>
        </div>})()}
        {teamNotice&&<div className="mt-4 rounded-xl bg-indigo-50 border border-indigo-100 p-4 font-bold text-indigo-800">{teamNotice}</div>}
      </section>
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b"><h3 className="font-black text-slate-900">🏆 Xếp hạng các tổ</h3><p className="text-xs text-slate-500 mt-1">Điểm tổ tách hoàn toàn khỏi xếp hạng cá nhân.</p></div>
        <div className="divide-y">{[...teams].sort((a,b)=>b.points-a.points).map((t,i)=><div key={t.name} className="p-4 flex items-center gap-4"><div className="w-9 font-black text-center">{i===0?'👑':`#${i+1}`}</div><div className="flex-1"><div className="font-black text-slate-800">{t.name}</div><div className="text-xs text-slate-500 mt-1">{t.wins} trận thắng • {t.relay} thắng tiếp sức • {daysHeld(t.rankSince,t.rankDays)} ngày giữ hạng</div></div><div className="text-right"><div className="font-black text-indigo-700">{t.points}</div><div className="text-xs text-slate-400">điểm tổ</div></div></div>)}</div>
      </section>
    </div>}

    {active==='ranking' && <div className="space-y-5">
      <section className="grid md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4"><div className="text-xs font-black uppercase tracking-wider text-amber-600">👑 Champion toàn lớp</div><div className="mt-2 font-black text-slate-900">{championPlayer?.name||'Chưa chỉ định'}</div><div className="text-xs text-slate-500 mt-1">Danh hiệu độc lập với Hạng 1 từng cấp</div></div>
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4"><div className="text-xs font-black uppercase tracking-wider text-violet-600">🛡 Người giữ ải</div><div className="mt-2 text-2xl font-black text-slate-900">{guardianPlayers.length}</div><div className="text-xs text-slate-500 mt-1">Guardian đang hoạt động</div></div>
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-4"><div className="text-xs font-black uppercase tracking-wider text-indigo-600">🎖 Ban cán sự</div><div className="mt-2 text-2xl font-black text-slate-900">{officerPlayers.length}</div><div className="text-xs text-slate-500 mt-1">Vai trò độc lập với thứ hạng</div></div>
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4"><div className="text-xs font-black uppercase tracking-wider text-emerald-600">⚔ Tổng trận đã lưu</div><div className="mt-2 text-2xl font-black text-slate-900">{history.filter(h=>h.result!=='Đang chờ').length}</div><div className="text-xs text-slate-500 mt-1">Google Sheet + dữ liệu dự phòng</div></div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b">
          <div className="flex flex-wrap justify-between gap-3 items-start"><div><h2 className="text-xl font-black text-slate-900">🏆 Bảng xếp hạng Đấu trường</h2><p className="text-sm text-slate-500 mt-1">4 cấp xếp hạng riêng; Champion, Guardian và Ban cán sự là các vai trò độc lập.</p></div><span className={`px-3 py-1.5 rounded-full font-bold text-sm ${cloudStatus==='online'?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{cloudStatus==='online'?'● Google Sheet đã kết nối':'● Dữ liệu dự phòng'}</span></div>
          <div className="flex flex-wrap gap-2 mt-4"><button onClick={()=>setRankingView('individual')} className={`px-4 py-2 rounded-xl font-bold ${rankingView==='individual'?'bg-indigo-600 text-white shadow':'bg-slate-100 text-slate-600'}`}>Cá nhân</button><button onClick={()=>setRankingView('team')} className={`px-4 py-2 rounded-xl font-bold ${rankingView==='team'?'bg-indigo-600 text-white shadow':'bg-slate-100 text-slate-600'}`}>Theo tổ</button>{rankingView==='individual'&&<div className="flex flex-wrap gap-1.5 sm:ml-auto">{(['Tất cả','Tân binh','Đồng','Bạc','Vàng'] as const).map(t=><button key={t} onClick={()=>setTierFilter(t)} className={`px-3 py-2 rounded-xl text-xs font-black border ${tierFilter===t?'bg-slate-900 text-white border-slate-900':'bg-white text-slate-600 border-slate-200'}`}>{t}</button>)}</div>}</div>
        </div>
        {rankingView==='individual'?<div className="divide-y">
          {filteredRanking.map((p)=><motion.button layout key={p.id} onClick={()=>setSelectedProfileId(p.id)} className="w-full p-4 md:px-6 flex items-center gap-4 text-left hover:bg-slate-50 transition">
            <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center border font-black ${p.pos===1?'bg-amber-50 border-amber-200 text-amber-700':'bg-slate-50 border-slate-200 text-slate-600'}`}><span className="text-[10px] uppercase">Hạng</span><span className="text-lg leading-none">{p.pos}</span></div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-black text-indigo-700">{p.name[0]}</div>
            <div className="min-w-0 flex-1"><div className="font-black text-slate-800 truncate">{p.name}</div><div className="flex flex-wrap gap-1.5 mt-1"><span className={`text-xs border rounded-full px-2 py-0.5 font-bold ${tierStyle[p.tier]}`}>{p.tier}</span>{p.champion&&<span className="text-xs rounded-full px-2 py-0.5 font-bold bg-amber-50 text-amber-700">👑 Champion</span>}{p.guardian&&<span className="text-xs rounded-full px-2 py-0.5 font-bold bg-violet-50 text-violet-700">🛡 {p.guardian}</span>}{p.role!=='Học sinh'&&<span className="text-xs rounded-full px-2 py-0.5 font-bold bg-indigo-50 text-indigo-700">🎖 {p.role}</span>}</div></div>
            <div className="hidden md:grid grid-cols-3 gap-6 text-center"><div><div className="font-black text-slate-800">{p.wins||0}-{p.losses||0}</div><div className="text-[11px] text-slate-400">Thắng - thua</div></div><div><div className="font-black text-slate-800">{p.matchesPlayed||0}</div><div className="text-[11px] text-slate-400">Số trận</div></div><div><div className="font-black text-slate-800">{daysHeld(p.rankSince,p.rankDays)}</div><div className="text-[11px] text-slate-400">Ngày giữ hạng</div></div></div>
            <div className="text-right min-w-[72px]"><div className="font-black text-slate-900">{p.arena}</div><div className="text-xs text-slate-400">Arena</div></div><ChevronRight size={18} className="text-slate-300"/>
          </motion.button>)}
        </div>:<div className="divide-y">{[...teams].sort((a,b)=>b.points-a.points).map((t,i)=><motion.div layout key={t.name} className="p-4 md:px-6 flex items-center gap-4"><div className={`w-10 text-center font-black ${i===0?'text-amber-600':'text-slate-400'}`}>{i===0?'👑':`#${i+1}`}</div><div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-700">T{i+1}</div><div className="flex-1"><div className="font-black text-slate-800">{t.name}</div><div className="text-xs text-slate-500 mt-1">{t.wins} trận thắng • {t.relay} thắng tiếp sức • {daysHeld(t.rankSince,t.rankDays)} ngày giữ hạng</div></div><div className="text-right"><div className="font-black text-slate-900">{t.points}</div><div className="text-xs text-slate-400">điểm tổ</div></div></motion.div>)}</div>}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-black text-slate-900">🕘 Lịch sử thi đấu</h2><p className="text-sm text-slate-500 mt-1">Lọc nhanh theo loại trận; dữ liệu Google Sheet được ưu tiên khi có kết nối.</p></div><div className="text-sm font-bold text-slate-500">{filteredHistory.length} trận</div></div><div className="flex gap-2 overflow-x-auto pb-1 mt-4">{(['Tất cả','Cá nhân','Vượt cấp','Hạng 1','Guardian','Champion','Đấu tổ','Tiếp sức'] as const).map(f=><button key={f} onClick={()=>setHistoryFilter(f)} className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-black border ${historyFilter===f?'bg-indigo-600 text-white border-indigo-600':'bg-white text-slate-600 border-slate-200'}`}>{f}</button>)}</div></div>
        <div className="divide-y">{filteredHistory.length?filteredHistory.slice(0,50).map((h:any)=><div key={h.id} className="p-4 md:px-6 flex flex-wrap items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">⚔️</div><div className="flex-1 min-w-[220px]"><div className="font-black text-slate-800">{h.a} <span className="text-slate-400 font-bold">vs</span> {h.b}</div><div className="text-xs text-slate-500 mt-1">{h.mode} • {h.time||'Chưa có thời gian'}</div></div><div className="text-right"><div className="font-black text-emerald-700">{h.result}</div><div className="text-xs text-slate-500 mt-1">{h.delta}</div></div></div>):<div className="p-8 text-center text-slate-500">Chưa có trận phù hợp bộ lọc.</div>}</div>
      </section>

      {selectedProfile&&<div className="fixed inset-0 z-[100] bg-slate-950/55 backdrop-blur-sm p-4 flex items-center justify-center" onClick={()=>setSelectedProfileId('')}><div className="w-full max-w-2xl max-h-[86vh] overflow-y-auto rounded-3xl bg-white shadow-2xl" onClick={e=>e.stopPropagation()}><div className="p-6 border-b flex gap-4 items-start"><div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-xl font-black text-indigo-700">{selectedProfile.name[0]}</div><div className="flex-1"><div className="text-xl font-black text-slate-900">{selectedProfile.name}</div><div className="flex flex-wrap gap-2 mt-2"><span className={`text-xs border rounded-full px-2 py-1 font-bold ${tierStyle[selectedProfile.tier]}`}>{selectedProfile.tier} • Hạng {selectedProfile.pos}</span>{selectedProfile.champion&&<span className="text-xs rounded-full px-2 py-1 font-bold bg-amber-50 text-amber-700">👑 Champion</span>}{selectedProfile.guardian&&<span className="text-xs rounded-full px-2 py-1 font-bold bg-violet-50 text-violet-700">🛡 {selectedProfile.guardian}</span>}</div></div><button onClick={()=>setSelectedProfileId('')} className="w-9 h-9 rounded-full bg-slate-100 font-black text-slate-600">×</button></div><div className="p-6 grid grid-cols-4 gap-3"><div className="rounded-2xl bg-slate-50 p-3 text-center"><div className="text-xl font-black">{selectedProfile.arena}</div><div className="text-[11px] text-slate-500">Arena</div></div><div className="rounded-2xl bg-slate-50 p-3 text-center"><div className="text-xl font-black">{selectedProfile.wins||0}</div><div className="text-[11px] text-slate-500">Thắng</div></div><div className="rounded-2xl bg-slate-50 p-3 text-center"><div className="text-xl font-black">{selectedProfile.losses||0}</div><div className="text-[11px] text-slate-500">Thua</div></div><div className="rounded-2xl bg-slate-50 p-3 text-center"><div className="text-xl font-black">{selectedProfile.matchesPlayed||0}</div><div className="text-[11px] text-slate-500">Số trận</div></div></div><div className="px-6 pb-6"><div className="font-black text-slate-900 mb-3">Lịch sử thi đấu của học sinh</div><div className="rounded-2xl border divide-y">{profileHistory.length?profileHistory.slice(0,15).map((h:any)=><div key={h.id} className="p-3 flex justify-between gap-3"><div><div className="font-bold text-slate-800">{h.a} vs {h.b}</div><div className="text-xs text-slate-500 mt-1">{h.mode} • {h.time}</div></div><div className="text-sm font-black text-emerald-700">{h.result}</div></div>):<div className="p-5 text-center text-sm text-slate-500">Chưa có lịch sử trận đấu.</div>}</div></div></div></div>}
    </div>}

    {active==='teacher' && <section className="space-y-5">
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-black text-slate-900">Điểm thi đua do giáo viên điều chỉnh</h2><p className="text-slate-500 mt-1">Cộng hoặc trừ điểm trực tiếp cho cá nhân và tổ. Điểm cập nhật ngay vào bảng xếp hạng tương ứng.</p></div></div>
        <div className="mt-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 p-5"><div className="font-black text-emerald-900">➕ Thêm học sinh</div><p className="mt-1 text-sm text-emerald-800/70">Học sinh thêm mới được lưu vào Google Sheet và đồng thời giữ bản dự phòng trên máy.</p><div className="grid sm:grid-cols-[1fr_150px_auto] gap-3 mt-4"><input value={newStudentName} onChange={e=>setNewStudentName(e.target.value)} placeholder="Nhập họ tên học sinh" className="rounded-xl border border-slate-200 bg-white px-3 py-3 font-bold"/><input type="number" min="0" value={newStudentPoints} onChange={e=>setNewStudentPoints(Number(e.target.value))} placeholder="Điểm ban đầu" className="rounded-xl border border-slate-200 bg-white px-3 py-3 font-black"/><button onClick={addStudent} className="rounded-xl bg-emerald-600 px-5 py-3 text-white font-black">THÊM HỌC SINH</button></div></div>
        <div className="grid lg:grid-cols-2 gap-4 mt-6">
          <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 p-5"><div className="font-black text-indigo-900">👤 Điểm cá nhân</div><div className="grid sm:grid-cols-[1fr_130px] gap-3 mt-4"><select value={scoreStudentId} onChange={e=>setScoreStudentId(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 font-bold">{players.map(p=><option key={p.id} value={p.id}>{p.name} • {p.arena} điểm</option>)}</select><input type="number" value={studentPointDelta} onChange={e=>setStudentPointDelta(Number(e.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-3 font-black" aria-label="Điểm cộng hoặc trừ cá nhân" /></div><div className="text-xs text-slate-500 mt-2">Nhập số dương để cộng, số âm để trừ.</div><button onClick={addStudentPoints} className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-white font-black">CẬP NHẬT ĐIỂM CÁ NHÂN</button></div>
          <div className="rounded-2xl border-2 border-amber-100 bg-amber-50/50 p-5"><div className="font-black text-amber-900">👥 Điểm tổ / nhóm</div><div className="grid sm:grid-cols-[1fr_130px] gap-3 mt-4"><select value={scoreTeamName} onChange={e=>setScoreTeamName(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 font-bold">{teams.map(t=><option key={t.name} value={t.name}>{t.name} • {t.points} điểm</option>)}</select><input type="number" value={teamPointDelta} onChange={e=>setTeamPointDelta(Number(e.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-3 font-black" aria-label="Điểm cộng hoặc trừ tổ" /></div><div className="text-xs text-slate-500 mt-2">Điểm tổ tách riêng, không làm thay đổi hạng cá nhân.</div><button onClick={addTeamPoints} className="mt-4 w-full rounded-xl bg-amber-500 py-3 text-slate-950 font-black">CẬP NHẬT ĐIỂM TỔ</button></div>
        </div>
        {pointNotice&&<div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">✓ {pointNotice}</div>}
      </div>
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-black text-slate-900">Thiết lập Đấu trường dành cho giáo viên</h2></div><p className="text-slate-500 mt-1">Các luật dưới đây là cấu hình của Đấu trường; dữ liệu sẽ được đồng bộ qua backend ở giai đoạn kết nối.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[['Luật trận','Chính xác trước • thời gian phá hòa'],['Phạm vi thách đấu','Cùng cấp: tối đa 3 bậc phía trên'],['Vượt cấp','Mặc định: người cuối cấp trên'],['Đại Thách Đấu','Cho phép Top cấp dưới thách Top cấp trên'],['Bảo hộ','1 lượt miễn + 3 trận định vị'],['Guardian','GV chỉ định • HS vượt ải +40 • Guardian giữ ải +25 • không tự đổi hạng'],['Champion toàn lớp','1 danh hiệu duy nhất • Hạng 1 các cấp được quyền thách • thắng +120 • bảo vệ +60'],['Ban cán sự','Ải riêng • HS thắng +30 • cán sự giữ ải +20 • không tự đổi hạng'],['Đấu tổ','4 tổ • tiếp sức • công/giữ thành']].map(([a,b])=><div key={a} className="rounded-2xl border border-slate-200 p-4"><div className="font-black text-slate-800">{a}</div><div className="text-sm text-slate-500 mt-2">{b}</div></div>)}
      </div>
      </div>
    </section>}
  </div>
}
