import { useState } from "react";

// Zara's REAL class schedule
const CLASSES = [
  { id: "piano", day: "Monday", time: "4:30-5:00", name: "Bernard Piano", location: "PNC", emoji: "🎹", color: "#8b5cf6", type: "music", cancelPolicy: "24 hours", makeupWindow: "Within 2 weeks" },
  { id: "peterpan", day: "Monday", time: "6:00-7:30", name: "Peter Pan Jr", location: "Lighthouse Productions Fremont", emoji: "🎭", color: "#ec4899", type: "theater", cancelPolicy: "48 hours", makeupWindow: "No makeups" },
  { id: "tennis", day: "Tuesday", time: "5:00-6:00", name: "Tennis", location: "Bob McGuire Park", emoji: "🎾", color: "#22c55e", type: "sport", cancelPolicy: "24 hours", makeupWindow: "Within 1 week" },
  { id: "drums", day: "Tuesday", time: "6:30-7:30", name: "Drums", location: "Online", emoji: "🥁", color: "#f59e0b", type: "music", cancelPolicy: "24 hours", makeupWindow: "Within 2 weeks" },
  { id: "keyboard", day: "Wednesday", time: "5:00-6:00", name: "Online Keyboard", location: "Spardha Online", emoji: "🎹", color: "#a855f7", type: "music", cancelPolicy: "12 hours", makeupWindow: "Within 1 month", highlight: true },
  { id: "disney", day: "Thursday", time: "5:00-6:30", name: "Disney On Broadway", location: "San Jose CMT", emoji: "🎭", color: "#f472b6", type: "theater", cancelPolicy: "48 hours", makeupWindow: "No makeups" },
  { id: "western_vocal", day: "Friday", time: "5:00-6:00", name: "Western Vocal", location: "Spardha Online — Ritika", emoji: "🎤", color: "#e91e8c", type: "music", cancelPolicy: "12 hours", makeupWindow: "Within 1 month", highlight: true },
  { id: "guitar", day: "Friday", time: "6:30-7:30", name: "Guitar", location: "Rishabh Rane", emoji: "🎸", color: "#3b82f6", type: "music", cancelPolicy: "24 hours", makeupWindow: "Within 2 weeks" },
  { id: "perf_vocal", day: "Saturday", time: "10:00-10:30", name: "Performance Vocal", location: "School of Rock", emoji: "🎤", color: "#ef4444", type: "music", cancelPolicy: "24 hours", makeupWindow: "Within 1 week" },
  { id: "carnatic", day: "Saturday", time: "1:00-2:00", name: "Carnatic Vocals", location: "Raaga School of Music", emoji: "🎵", color: "#f97316", type: "music", cancelPolicy: "24 hours", makeupWindow: "Within 2 weeks" },
  { id: "art", day: "Sunday", time: "9:00-10:30", name: "Art", location: "TBD", emoji: "🎨", color: "#14b8a6", type: "art", cancelPolicy: "Same day OK", makeupWindow: "Flexible", highlight: true },
];

const MUSIC_CLASSES = CLASSES.filter(c => c.type === "music");

const MILESTONES = {
  piano: ["Find middle C", "Play a simple scale", "Learn first melody (right hand)", "Add left hand chords", "Play with both hands", "Memorize a short piece", "Perform from memory"],
  drums: ["Keep steady beat 30s", "Keep steady beat 60s", "Basic rock beat", "Play along to a song", "Try a drum fill", "First full song", "Play at full speed"],
  keyboard: ["Scales with both hands", "Simple chord progressions", "Accompany a melody", "Play a pop song", "Improvise over chords", "Perform a full piece", "Compose something original"],
  western_vocal: ["Match pitch accurately", "Sing a full song on key", "Sing in front of family", "Try harmonizing", "Sing with emotion/dynamics", "Write original lyrics", "Record a full song"],
  guitar: ["Learn first chord (G)", "Learn second chord (C)", "Smooth chord transitions", "Basic strumming pattern", "Play along to a song", "Learn a barre chord", "Perform a song start to finish"],
  perf_vocal: ["Stage presence basics", "Perform 1 song on stage", "Use a microphone confidently", "Perform 2 songs back to back", "Engage the audience", "Perform a 3-song setlist", "Own the stage"],
  carnatic: ["Learn Sa Re Ga Ma", "Sing basic swaras in rhythm", "Learn first raga", "Sing an alapana", "Learn a kriti", "Perform a kriti with swaras", "Sing a full concert piece"],
};

const TUTORIALS = {
  piano: ["Finger exercises for beginners", "How to read sheet music basics", "Playing Happy Birthday", "Left hand chord patterns", "Dynamics — playing soft and loud"],
  drums: ["Basic 4/4 rock beat", "Hi-hat patterns", "Simple drum fills", "Playing to a metronome", "Paradiddle rudiments"],
  keyboard: ["Two-hand coordination drills", "Common chord progressions (I-IV-V-I)", "Playing by ear techniques", "Pop song chord patterns", "Improvisation basics"],
  western_vocal: ["Breathing exercises", "Warm-up scales (do-re-mi)", "Pitch matching practice", "Singing with vibrato", "Vocal range exploration"],
  guitar: ["How to hold a pick", "G chord finger placement", "C to G chord transitions", "Strumming patterns", "Easy 2-chord songs"],
  perf_vocal: ["Stage fright techniques", "Microphone technique", "Connecting with the audience", "Song selection strategy", "Movement on stage"],
  carnatic: ["Sarali varisai practice", "Tala keeping with hand", "Raga recognition exercises", "Gamakas for beginners", "Kriti lyric memorization"],
};

const SAMPLE_EVENTS = [
  { date: "2026-03-14", title: "🏖️ Spring Break Starts", type: "vacation", days: 7 },
  { date: "2026-03-12", title: "🦷 Zara — Dentist", type: "appointment", time: "4:00 PM" },
  { date: "2026-03-10", title: "🎮 Playdate with Sophia", type: "playdate", time: "5:00 PM" },
  { date: "2026-03-25", title: "🏥 Zara — Pediatrician", type: "appointment", time: "4:30 PM" },
  { date: "2026-04-05", title: "✈️ Family Trip to Portland", type: "vacation", days: 4 },
  { date: "2026-03-15", title: "🎮 Playdate with Aiden", type: "playdate", time: "2:00 PM" },
  { date: "2026-03-27", title: "🎭 Peter Pan Dress Rehearsal", type: "event", time: "5:00 PM" },
];

const DAY_MAP = { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };
const DAYS_LABEL = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function getConflicts(events, classes) {
  const conflicts = [];
  const today = new Date();
  events.forEach(ev => {
    const evDate = new Date(ev.date + "T00:00:00");
    if (evDate < today) return;
    const daysToCheck = ev.type === "vacation" ? (ev.days || 1) : 1;
    for (let d = 0; d < daysToCheck; d++) {
      const checkDate = new Date(evDate);
      checkDate.setDate(checkDate.getDate() + d);
      const dayName = checkDate.toLocaleDateString("en-US", { weekday: "long" });
      classes.forEach(cls => {
        if (cls.day === dayName) {
          const classDate = checkDate.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" });
          const hrs = cls.cancelPolicy.includes("48") ? 48 : cls.cancelPolicy.includes("24") ? 24 : cls.cancelPolicy.includes("12") ? 12 : 0;
          const cancelBy = new Date(checkDate);
          cancelBy.setHours(cancelBy.getHours() - hrs);
          const daysUntilCancel = (cancelBy - today) / (1000*60*60*24);
          conflicts.push({
            cls, date: classDate, reason: ev.title, type: ev.type,
            cancelBy: hrs === 0 ? "Same day OK" : cancelBy.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" }),
            makeupBy: cls.makeupWindow,
            urgency: daysUntilCancel < 3 ? "urgent" : daysUntilCancel < 7 ? "soon" : "upcoming",
          });
        }
      });
    }
  });
  return conflicts.sort((a, b) => a.urgency === "urgent" ? -1 : b.urgency === "urgent" ? 1 : 0);
}

function Confetti({ show }) {
  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {Array.from({ length: 50 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: `${Math.random()*100}%`, top: -20,
          width: 6+Math.random()*8, height: 6+Math.random()*8,
          background: ["#e91e8c","#f59e0b","#3b82f6","#8b5cf6","#3fb950","#ef4444"][i%6],
          borderRadius: Math.random()>.5?"50%":"2px",
          animation: `fall 2s ${Math.random()*.5}s ease-in forwards` }} />
      ))}
      <style>{`@keyframes fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

function StageMode({ onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"radial-gradient(ellipse at 50% 120%,#1a0533,#0a0a0a 70%)",zIndex:9998,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
      {[...Array(12)].map((_,i) => (
        <div key={i} style={{ position:"absolute",bottom:"45%",left:`${8+i*7.5}%`,width:3,height:"50%",
          background:`linear-gradient(to top,${["#e91e8c","#f59e0b","#3b82f6","#8b5cf6"][i%4]}44,transparent)`,
          transform:`rotate(${-25+i*4.5}deg)`,transformOrigin:"bottom",opacity:.5,
          animation:`sw 3s ${i*.2}s ease-in-out infinite alternate` }} />
      ))}
      <div style={{ fontSize:72,animation:"pls 1.5s ease-in-out infinite" }}>🎤</div>
      <div style={{ fontSize:32,fontWeight:800,color:"#fff",marginTop:16,textShadow:"0 0 40px rgba(139,92,246,.8)" }}>🔥 STAGE MODE 🔥</div>
      <div style={{ color:"#8b5cf6",fontSize:16,marginTop:8 }}>7-day streak! You're a STAR, Zara! ⭐</div>
      <div style={{ color:"#555",fontSize:13,marginTop:40 }}>tap anywhere to close</div>
      <style>{`@keyframes pls{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@keyframes sw{0%{opacity:.3}100%{opacity:.6}}`}</style>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [completed, setCompleted] = useState(() => {
    const o = {}; MUSIC_CLASSES.forEach(c => { if(MILESTONES[c.id]) o[c.id] = Array(7).fill(false); }); return o;
  });
  const [streaks, setStreaks] = useState(() => {
    const o = {}; MUSIC_CLASSES.forEach(c => o[c.id] = Math.floor(Math.random()*5)); return o;
  });
  const [todayLog, setTodayLog] = useState({});
  const [practiceGoals, setPracticeGoals] = useState(() => {
    const o = {}; MUSIC_CLASSES.forEach(c => o[c.id] = 15); return o;
  });
  const [practiceDays, setPracticeDays] = useState(() => {
    const o = {}; MUSIC_CLASSES.forEach(c => { o[c.id] = [false,false,false,false,false,false,false]; o[c.id][DAY_MAP[c.day]] = true; }); return o;
  });
  const [selInst, setSelInst] = useState("piano");
  const [setlist, setSetlist] = useState(["Let It Go — Vocals + Keyboard", "We Will Rock You — Drums + Vocals"]);
  const [newSong, setNewSong] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStage, setShowStage] = useState(false);
  const [calConnected, setCalConnected] = useState({ outlook: false, gmail: false });
  const [makeups, setMakeups] = useState([]);

  const conflicts = getConflicts(SAMPLE_EVENTS, CLASSES);
  const urgentCount = conflicts.filter(c => c.urgency === "urgent").length;
  const totalXP = Object.values(completed).reduce((s, a) => s + a.filter(Boolean).length * 100, 0);
  const maxXP = Object.keys(completed).length * 700;
  const level = Math.floor(totalXP / 300) + 1;
  const minStreak = Math.min(...Object.values(streaks));

  const logPractice = (id) => {
    if (todayLog[id]) return;
    setTodayLog(p => ({...p, [id]: true}));
    setStreaks(p => { const n = (p[id]||0)+1; if(n>=7 && p[id]<7) setShowStage(true); return {...p,[id]:n}; });
    setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2500);
  };
  const toggleMile = (id, idx) => {
    setCompleted(p => { const a=[...p[id]]; a[idx]=!a[idx]; if(a[idx]){setShowConfetti(true);setTimeout(()=>setShowConfetti(false),2500);} return {...p,[id]:a}; });
  };

  const inst = MUSIC_CLASSES.find(c => c.id === selInst);
  const tb = (t) => ({ padding:"7px 12px",borderRadius:18,border:"none",cursor:"pointer",fontSize:11.5,fontWeight:600,fontFamily:"inherit",background:tab===t?"#e91e8c":"#1e1e2e",color:tab===t?"#fff":"#777",transition:"all .15s",whiteSpace:"nowrap" });

  return (
    <div style={{ minHeight:"100vh",background:"#0a0a0f",color:"#e6edf3",fontFamily:"'Segoe UI',-apple-system,sans-serif" }}>
      <Confetti show={showConfetti} />
      {showStage && <StageMode onClose={() => setShowStage(false)} />}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1a0533,#0d1117 60%)",padding:"18px 20px 12px",borderBottom:"1px solid #222" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8 }}>
          <div>
            <div style={{ fontSize:20,fontWeight:800 }}>🎵 Zara's Music Journey</div>
            <div style={{ color:"#8b949e",fontSize:11,marginTop:1 }}>7 instruments · 11 classes · Calendar-aware · Self-learning</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:22,fontWeight:800,color:"#f59e0b" }}>Level {level}</div>
            <div style={{ fontSize:10,color:"#8b949e" }}>{totalXP}/{maxXP} XP</div>
          </div>
        </div>
        <div style={{ marginTop:8,background:"#1e1e2e",borderRadius:8,height:6,overflow:"hidden" }}>
          <div style={{ height:"100%",borderRadius:8,background:"linear-gradient(90deg,#e91e8c,#f59e0b,#3b82f6,#8b5cf6,#22c55e)",width:`${Math.min((totalXP/maxXP)*100,100)}%`,transition:"width .5s" }} />
        </div>
        <div style={{ display:"flex",gap:5,marginTop:10,flexWrap:"wrap" }}>
          {[["dashboard","🏠 Home"],["calendar","📅 Calendar"],["week","🗓️ Week"],["classes","🎓 Classes"],["skills","🌳 Skills"],["practice","⏰ Practice"],["discover","🔍 Discover"],["setlist","🎶 Setlist"]].map(([id,l]) => (
            <button key={id} style={tb(id)} onClick={()=>setTab(id)}>
              {l}{id==="calendar"&&conflicts.length>0&&<span style={{background:"#f85149",color:"#fff",borderRadius:8,padding:"1px 5px",fontSize:9,fontWeight:800,marginLeft:3}}>{conflicts.length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px 20px 50px",maxWidth:820 }}>

        {/* DASHBOARD */}
        {tab==="dashboard" && (<div>
          {urgentCount>0 && (
            <div style={{ background:"#2d1118",border:"1px solid #f8514944",borderRadius:10,padding:12,marginBottom:14,borderLeft:"4px solid #f85149" }}>
              <div style={{ fontSize:12,fontWeight:700,color:"#f85149",marginBottom:4 }}>⚠️ {urgentCount} Class Cancellation{urgentCount>1?"s":""} Need Action</div>
              {conflicts.filter(c=>c.urgency==="urgent").slice(0,3).map((c,i) => (
                <div key={i} style={{ fontSize:11,color:"#e6edf3",marginBottom:3 }}>{c.cls.emoji} <strong>{c.cls.name}</strong> on {c.date} — {c.reason}. Cancel by <strong style={{color:"#f85149"}}>{c.cancelBy}</strong></div>
              ))}
            </div>
          )}
          <h2 style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>Today's Music Practice</h2>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
            {MUSIC_CLASSES.map(cls => {
              const done = todayLog[cls.id];
              const dayIdx = new Date().getDay();
              const scheduled = practiceDays[cls.id] && practiceDays[cls.id][(dayIdx+6)%7];
              return (
                <div key={cls.id} style={{ background:`${cls.color}11`,border:`1px solid ${cls.color}33`,borderRadius:10,padding:12,opacity:scheduled?1:.4 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div><span style={{fontSize:18}}>{cls.emoji}</span><span style={{fontSize:13,fontWeight:700,marginLeft:5}}>{cls.name.replace("Online ","")}</span></div>
                    <span style={{ background:"#0a0a0f",borderRadius:6,padding:"2px 7px",fontSize:10,color:cls.color,fontWeight:700 }}>🔥{streaks[cls.id]||0}d</span>
                  </div>
                  <div style={{ fontSize:10,color:"#8b949e",marginTop:3 }}>{scheduled?`Goal: ${practiceGoals[cls.id]}m`:"Rest day"} · {(completed[cls.id]||[]).filter(Boolean).length}/7 milestones</div>
                  {scheduled && <button onClick={()=>logPractice(cls.id)} disabled={done} style={{ marginTop:8,width:"100%",padding:"7px",borderRadius:7,border:"none",background:done?"#1a3a1a":cls.color,color:"#fff",fontSize:11,fontWeight:700,cursor:done?"default":"pointer",fontFamily:"inherit" }}>{done?"✅ Done!":"Log practice"}</button>}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:14,background:"#1e1e2e",borderRadius:10,padding:12,textAlign:"center" }}>
            <div style={{ fontSize:11,color:"#8b949e" }}>Combined Musician Streak</div>
            <div style={{ fontSize:28,fontWeight:800,color:minStreak>=7?"#f59e0b":"#e6edf3" }}>{minStreak>=7?"🏟️":"🔥"} {minStreak}d</div>
            {minStreak>=7?<button onClick={()=>setShowStage(true)} style={{ marginTop:6,padding:"5px 14px",borderRadius:14,border:"2px solid #8b5cf6",background:"transparent",color:"#8b5cf6",fontSize:11,fontWeight:700,cursor:"pointer" }}>🎤 Stage Mode</button>
            :<div style={{fontSize:10,color:"#555",marginTop:3}}>{7-minStreak} more for Stage Mode</div>}
          </div>
        </div>)}

        {/* WEEKLY VIEW */}
        {tab==="week" && (<div>
          <h2 style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>🗓️ Zara's Full Weekly Schedule</h2>
          <p style={{ color:"#8b949e",fontSize:12,marginBottom:14 }}>11 classes across music, theater, sport & art — every single week!</p>
          {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => {
            const dayCls = CLASSES.filter(c=>c.day===day);
            if(!dayCls.length) return null;
            return (
              <div key={day} style={{ marginBottom:12 }}>
                <div style={{ fontSize:13,fontWeight:700,color:"#8b949e",marginBottom:6 }}>{day}</div>
                {dayCls.map(cls => (
                  <div key={cls.id} style={{ background:`${cls.color}11`,border:`1px solid ${cls.color}33`,borderRadius:8,padding:"10px 14px",marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div>
                      <span style={{ fontSize:14 }}>{cls.emoji}</span>
                      <span style={{ fontSize:13,fontWeight:600,marginLeft:6,color:cls.highlight?"#e91e8c":"#e6edf3" }}>{cls.name}</span>
                      <span style={{ fontSize:11,color:"#666",marginLeft:8 }}>{cls.time}</span>
                    </div>
                    <div style={{ fontSize:10,color:"#8b949e",textAlign:"right",maxWidth:160 }}>{cls.location}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>)}

        {/* CALENDAR */}
        {tab==="calendar" && (<div>
          <h2 style={{ fontSize:15,fontWeight:700,marginBottom:4 }}>📅 Calendar & Smart Scheduling</h2>
          <p style={{ color:"#8b949e",fontSize:11,marginBottom:14 }}>Connects to Mom's Outlook + Zara's Gmail. Auto-detects conflicts with all 11 classes.</p>
          <div style={{ display:"flex",gap:8,marginBottom:16 }}>
            {[["outlook","Mom's Outlook"],["gmail","Zara's Gmail"]].map(([k,l]) => (
              <button key={k} onClick={()=>setCalConnected(p=>({...p,[k]:!p[k]}))} style={{ flex:1,padding:12,borderRadius:10,border:`1px solid ${calConnected[k]?"#3fb950":"#333"}`,background:calConnected[k]?"#1a3a1a":"#1e1e2e",color:calConnected[k]?"#3fb950":"#888",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600 }}>{calConnected[k]?"✅":"🔗"} {l}</button>
            ))}
          </div>
          <h3 style={{ fontSize:13,fontWeight:700,color:"#8b949e",marginBottom:6 }}>Upcoming Events</h3>
          <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:16 }}>
            {SAMPLE_EVENTS.map((ev,i) => (
              <div key={i} style={{ background:"#1e1e2e",border:"1px solid #333",borderRadius:8,padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div><div style={{fontSize:12,fontWeight:600}}>{ev.title}</div><div style={{fontSize:10,color:"#666"}}>{ev.date}{ev.time?` at ${ev.time}`:""}{ev.days?` (${ev.days} days)`:""}</div></div>
                <span style={{ fontSize:10,padding:"2px 8px",borderRadius:6,fontWeight:600,background:ev.type==="vacation"?"#f59e0b22":ev.type==="appointment"?"#f8514922":"#58a6ff22",color:ev.type==="vacation"?"#f59e0b":ev.type==="appointment"?"#f85149":"#58a6ff" }}>
                  {ev.type==="vacation"?"🏖️ Vacation":ev.type==="appointment"?"🏥 Appt":ev.type==="event"?"🎭 Event":"🎮 Playdate"}
                </span>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize:13,fontWeight:700,color:"#f85149",marginBottom:6 }}>⚠️ Detected Conflicts ({conflicts.length})</h3>
          {conflicts.length===0?<div style={{color:"#3fb950",fontSize:12,padding:16,textAlign:"center"}}>✅ No conflicts!</div>:(
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {conflicts.map((c,i) => (
                <div key={i} style={{ background:c.urgency==="urgent"?"#2d1118":"#1e1e2e",border:`1px solid ${c.urgency==="urgent"?"#f8514944":"#333"}`,borderRadius:10,padding:14,borderLeft:`4px solid ${c.cls.color}` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontSize:13,fontWeight:700 }}>{c.cls.emoji} {c.cls.name} — {c.date}</div>
                      <div style={{ fontSize:11,color:"#8b949e",marginTop:2 }}>Conflicts with: {c.reason}</div>
                      <div style={{ fontSize:11,color:"#8b949e" }}>{c.cls.location} · {c.cls.time}</div>
                    </div>
                    {c.urgency==="urgent"&&<span style={{background:"#f85149",color:"#fff",padding:"2px 7px",borderRadius:6,fontSize:9,fontWeight:800}}>URGENT</span>}
                    {c.urgency==="soon"&&<span style={{background:"#f59e0b",color:"#000",padding:"2px 7px",borderRadius:6,fontSize:9,fontWeight:800}}>SOON</span>}
                  </div>
                  <div style={{ display:"flex",gap:8,marginTop:8,flexWrap:"wrap" }}>
                    <div style={{ background:"#0a0a0f",borderRadius:6,padding:"4px 10px",fontSize:10 }}><span style={{color:"#f85149",fontWeight:700}}>Cancel by:</span> {c.cancelBy}</div>
                    <div style={{ background:"#0a0a0f",borderRadius:6,padding:"4px 10px",fontSize:10 }}><span style={{color:"#3fb950",fontWeight:700}}>Makeup:</span> {c.makeupBy}</div>
                  </div>
                  <div style={{ display:"flex",gap:6,marginTop:8 }}>
                    <button style={{ padding:"5px 12px",borderRadius:6,border:"1px solid #f85149",background:"transparent",color:"#f85149",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>📧 Notify Teacher</button>
                    <button onClick={()=>setMakeups(p=>[...p,c])} style={{ padding:"5px 12px",borderRadius:6,border:"1px solid #3fb950",background:"transparent",color:"#3fb950",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>📅 Schedule Makeup</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {makeups.length>0&&(<div style={{marginTop:16}}>
            <h3 style={{fontSize:13,fontWeight:700,color:"#3fb950",marginBottom:6}}>📋 Makeup Classes Pending ({makeups.length})</h3>
            {makeups.map((m,i)=>(<div key={i} style={{background:"#1e1e2e",border:"1px solid #23863633",borderRadius:8,padding:"8px 14px",marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11}}>{m.cls.emoji} {m.cls.name} — missed {m.date}. Makeup: {m.makeupBy}</span>
              <span style={{color:"#f59e0b",fontSize:10,fontWeight:700}}>Pending</span>
            </div>))}
          </div>)}
        </div>)}

        {/* CLASSES */}
        {tab==="classes" && (<div>
          <h2 style={{ fontSize:15,fontWeight:700,marginBottom:4 }}>🎓 Class Schedule & Policies</h2>
          <p style={{ color:"#8b949e",fontSize:11,marginBottom:14 }}>All 11 classes with cancellation policies and makeup windows.</p>
          {CLASSES.map(cls => (
            <div key={cls.id} style={{ background:`${cls.color}08`,border:`1px solid ${cls.color}22`,borderRadius:10,padding:14,marginBottom:8 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                <div style={{ fontSize:14,fontWeight:700 }}>{cls.emoji} {cls.name}</div>
                <span style={{ fontSize:10,padding:"2px 8px",borderRadius:6,background:`${cls.color}22`,color:cls.color,fontWeight:600 }}>{cls.type}</span>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4 }}>
                {[["Day",cls.day],["Time",cls.time],["Location",cls.location],["Cancel Policy",cls.cancelPolicy],["Makeup",cls.makeupWindow],["Teacher/School",cls.location]].map(([k,v],j) => (
                  <div key={j} style={{ background:"#0a0a0f",borderRadius:6,padding:"6px 10px" }}>
                    <div style={{ fontSize:9,color:"#555",fontWeight:700,textTransform:"uppercase" }}>{k}</div>
                    <div style={{ fontSize:11,color:"#e6edf3",fontWeight:600,marginTop:1 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>)}

        {/* SKILLS */}
        {tab==="skills" && (<div>
          <h2 style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>🌳 Skill Trees</h2>
          <div style={{ display:"flex",gap:5,marginBottom:14,flexWrap:"wrap" }}>
            {MUSIC_CLASSES.filter(c=>MILESTONES[c.id]).map(c => (
              <button key={c.id} onClick={()=>setSelInst(c.id)} style={{ padding:"6px 10px",borderRadius:7,border:`1px solid ${selInst===c.id?c.color:"#333"}`,background:selInst===c.id?`${c.color}18`:"transparent",color:selInst===c.id?c.color:"#777",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit" }}>{c.emoji} {c.name.replace("Online ","").replace("Western ","").replace("Performance ","Perf ")}</button>
            ))}
          </div>
          {inst && MILESTONES[selInst] && MILESTONES[selInst].map((m,idx) => {
            const done = completed[selInst] && completed[selInst][idx];
            const locked = idx>0 && completed[selInst] && !completed[selInst][idx-1];
            return (
              <div key={idx} onClick={()=>!locked&&completed[selInst]&&toggleMile(selInst,idx)} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 14px",marginBottom:5,background:done?`${inst.color}15`:"#1e1e2e",border:`1px solid ${done?inst.color+"44":"#333"}`,borderRadius:8,cursor:locked?"default":"pointer",opacity:locked?.3:1 }}>
                <div style={{ width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:done?inst.color:"#0a0a0f",border:`2px solid ${done?inst.color:"#444"}`,fontSize:11,fontWeight:700,color:done?"#fff":"#666",flexShrink:0 }}>{done?"✓":idx+1}</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:done?inst.color:"#e6edf3"}}>{m}</div><div style={{fontSize:9,color:"#555"}}>{locked?"🔒 Previous first":done?"+100 XP!":"+100 XP"}</div></div>
              </div>
            );
          })}
        </div>)}

        {/* PRACTICE */}
        {tab==="practice" && (<div>
          <h2 style={{ fontSize:15,fontWeight:700,marginBottom:4 }}>⏰ Practice Schedule</h2>
          <p style={{ color:"#8b949e",fontSize:11,marginBottom:12 }}>Set your own practice goals per instrument. Tap days to toggle.</p>
          {MUSIC_CLASSES.map(cls => (
            <div key={cls.id} style={{ background:"#1e1e2e",borderRadius:8,padding:12,marginBottom:6 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                <span style={{ fontSize:12,fontWeight:700 }}>{cls.emoji} {cls.name.replace("Online ","").replace("Western ","W.").replace("Performance ","Perf ")}</span>
                <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                  <button onClick={()=>setPracticeGoals(p=>({...p,[cls.id]:Math.max(5,p[cls.id]-5)}))} style={{width:22,height:22,borderRadius:5,border:"1px solid #444",background:"transparent",color:"#888",cursor:"pointer",fontSize:12}}>−</button>
                  <span style={{fontSize:11,fontWeight:700,color:cls.color,minWidth:36,textAlign:"center"}}>{practiceGoals[cls.id]}m</span>
                  <button onClick={()=>setPracticeGoals(p=>({...p,[cls.id]:Math.min(60,p[cls.id]+5)}))} style={{width:22,height:22,borderRadius:5,border:"1px solid #444",background:"transparent",color:"#888",cursor:"pointer",fontSize:12}}>+</button>
                </div>
              </div>
              <div style={{ display:"flex",gap:3 }}>
                {DAYS_LABEL.map((d,di) => (
                  <button key={di} onClick={()=>setPracticeDays(p=>{const a=[...(p[cls.id]||[])];a[di]=!a[di];return{...p,[cls.id]:a};})} style={{
                    flex:1,padding:"5px 0",borderRadius:5,border:`1px solid ${(practiceDays[cls.id]||[])[di]?cls.color:"#333"}`,
                    background:(practiceDays[cls.id]||[])[di]?`${cls.color}22`:"transparent",
                    color:(practiceDays[cls.id]||[])[di]?cls.color:"#555",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"
                  }}>{d}</button>
                ))}
              </div>
            </div>
          ))}
        </div>)}

        {/* DISCOVER */}
        {tab==="discover" && (<div>
          <h2 style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>🔍 Discovery Mode</h2>
          <div style={{ display:"flex",gap:5,marginBottom:14,flexWrap:"wrap" }}>
            {MUSIC_CLASSES.filter(c=>TUTORIALS[c.id]).map(c => (
              <button key={c.id} onClick={()=>setSelInst(c.id)} style={{ padding:"6px 10px",borderRadius:7,border:`1px solid ${selInst===c.id?c.color:"#333"}`,background:selInst===c.id?`${c.color}18`:"transparent",color:selInst===c.id?c.color:"#777",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit" }}>{c.emoji} {c.name.replace("Online ","").replace("Western ","").replace("Performance ","Perf ")}</button>
            ))}
          </div>
          {TUTORIALS[selInst]&&TUTORIALS[selInst].map((t,i) => (
            <div key={i} style={{ background:"#1e1e2e",border:"1px solid #333",borderRadius:8,padding:"10px 14px",marginBottom:5,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div><div style={{fontSize:12,fontWeight:600}}>{t}</div><div style={{fontSize:9,color:"#555",marginTop:1}}>Matched to your level</div></div>
              <span style={{ fontSize:10,color:inst?.color||"#58a6ff",fontWeight:600 }}>Try →</span>
            </div>
          ))}
        </div>)}

        {/* SETLIST */}
        {tab==="setlist" && (<div>
          <h2 style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>🎶 Concert Setlist</h2>
          {setlist.map((s,i) => (
            <div key={i} style={{ background:"#1e1e2e",border:"1px solid #333",borderRadius:8,padding:"10px 14px",marginBottom:5,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:"#f59e0b",fontWeight:800,fontSize:15}}>{i+1}</span><span style={{fontSize:12,fontWeight:600}}>{s}</span></div>
              <button onClick={()=>setSetlist(p=>p.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:"#f85149",cursor:"pointer",fontSize:13}}>✕</button>
            </div>
          ))}
          <div style={{ display:"flex",gap:5,marginTop:8 }}>
            <input value={newSong} onChange={e=>setNewSong(e.target.value)} placeholder="Add a song..." onKeyDown={e=>{if(e.key==="Enter"&&newSong.trim()){setSetlist(p=>[...p,newSong.trim()]);setNewSong("");}}}
              style={{flex:1,padding:"8px 10px",borderRadius:7,border:"1px solid #333",background:"#1e1e2e",color:"#e6edf3",fontSize:11,fontFamily:"inherit",outline:"none"}} />
            <button onClick={()=>{if(newSong.trim()){setSetlist(p=>[...p,newSong.trim()]);setNewSong("");}}} style={{padding:"8px 14px",borderRadius:7,border:"none",background:"#e91e8c",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Add</button>
          </div>
        </div>)}
      </div>

      <div style={{ textAlign:"center",padding:"12px",color:"#2a2a2a",fontSize:9 }}>Built with ❤️ by Mom — vibe-coded with Claude & Cursor</div>
    </div>
  );
}
