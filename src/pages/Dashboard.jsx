import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #07090A;
    --surface: #0E1214;
    --surface2:#131A1D;
    --border:  rgba(255,255,255,0.07);
    --accent:  #C8F135;
    --accent2: #35F1A0;
    --text:    #EDE9E0;
    --muted:   #5A6068;
    --warn:    #F59E0B;
    --display: 'Barlow Condensed', sans-serif;
    --body:    'DM Sans', sans-serif;
  }

  .db-root {
    background: var(--bg); min-height: 100vh;
    font-family: var(--body); color: var(--text);
    display: flex;
  }

  /* ── SIDEBAR ── */
  .db-sidebar {
    width: 220px; flex-shrink: 0;
    background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 28px 0; position: sticky; top: 0; height: 100vh;
  }
  .db-logo {
    font-family: var(--display); font-size: 18px; font-weight: 800;
    letter-spacing: 2px; color: var(--text); padding: 0 24px;
    margin-bottom: 36px; text-decoration: none;
  }
  .db-logo span { color: var(--accent); }

  .db-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 0 12px; }
  .db-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 6px; cursor: pointer;
    font-size: 13px; font-weight: 400; color: var(--muted);
    transition: background 0.2s, color 0.2s; text-decoration: none;
    border: none; background: none; font-family: var(--body); width: 100%;
    text-align: left;
  }
  .db-nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text); }
  .db-nav-item.active { background: rgba(200,241,53,0.08); color: var(--accent); }
  .db-nav-item.active .db-nav-icon { color: var(--accent); }
  .db-nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .db-nav-section {
    font-size: 10px; letter-spacing: 1.5px; color: var(--muted);
    text-transform: uppercase; padding: 16px 12px 8px; font-weight: 500;
  }

  .db-sidebar-bottom { padding: 16px 12px; border-top: 1px solid var(--border); }
  .db-user-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px; border-radius: 6px; cursor: pointer;
    transition: background 0.2s;
  }
  .db-user-row:hover { background: rgba(255,255,255,0.04); }
  .db-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(200,241,53,0.15); border: 1px solid rgba(200,241,53,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--display); font-size: 14px; font-weight: 700;
    color: var(--accent); flex-shrink: 0;
  }
  .db-user-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .db-user-goal { font-size: 11px; color: var(--muted); }

  /* ── MAIN ── */
  .db-main { flex: 1; overflow-y: auto; padding: 36px 40px; }

  /* TOPBAR */
  .db-topbar {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 32px;
  }
  .db-greeting-tag {
    font-size: 11px; letter-spacing: 2px; font-weight: 500;
    color: var(--accent); text-transform: uppercase; margin-bottom: 6px;
  }
  .db-greeting {
    font-family: var(--display); font-size: 36px; font-weight: 800;
    text-transform: uppercase; line-height: 1; margin-bottom: 4px;
  }
  .db-date { font-size: 13px; color: var(--muted); font-weight: 300; }
  .db-topbar-actions { display: flex; gap: 10px; }
  .db-action-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 6px;
    font-size: 13px; font-weight: 500; font-family: var(--body);
    cursor: pointer; transition: all 0.2s; border: none;
  }
  .db-action-btn.primary { background: var(--accent); color: #0a0a0a; }
  .db-action-btn.primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .db-action-btn.ghost {
    background: transparent; color: var(--muted);
    border: 1px solid var(--border);
  }
  .db-action-btn.ghost:hover { border-color: rgba(255,255,255,0.15); color: var(--text); }

  /* GRID */
  .db-grid { display: grid; gap: 16px; }
  .db-grid-top { grid-template-columns: 1fr 1fr 1fr; margin-bottom: 0; }
  .db-grid-mid { grid-template-columns: 1.4fr 1fr; }
  .db-grid-bot { grid-template-columns: 1fr 1fr; }

  /* CARDS */
  .db-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 24px;
    transition: border-color 0.2s;
  }
  .db-card:hover { border-color: rgba(255,255,255,0.1); }
  .db-card-label {
    font-size: 11px; letter-spacing: 1.5px; font-weight: 500;
    color: var(--muted); text-transform: uppercase; margin-bottom: 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .db-card-label-action {
    font-size: 11px; color: var(--accent); cursor: pointer; letter-spacing: 0;
    text-transform: none; font-weight: 400;
  }
  .db-card-label-action:hover { text-decoration: underline; }

  /* CALORIE RING */
  .db-ring-wrap {
    display: flex; align-items: center; gap: 24px;
  }
  .db-ring-svg { flex-shrink: 0; }
  .db-ring-center { text-align: center; }
  .db-ring-num {
    font-family: var(--display); font-size: 38px; font-weight: 900;
    color: var(--text); line-height: 1;
  }
  .db-ring-of { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .db-ring-label { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .db-ring-stats { flex: 1; display: flex; flex-direction: column; gap: 12px; }
  .db-ring-stat-row { display: flex; align-items: center; justify-content: space-between; }
  .db-ring-stat-name { font-size: 12px; color: var(--muted); }
  .db-ring-stat-val  { font-size: 13px; font-weight: 500; }

  /* MACRO BARS */
  .db-macro-row {
    display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
  }
  .db-macro-row:last-child { margin-bottom: 0; }
  .db-macro-name { font-size: 13px; color: var(--muted); min-width: 64px; }
  .db-macro-bar-bg { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
  .db-macro-bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease; }
  .db-macro-nums { font-size: 12px; color: var(--muted); min-width: 72px; text-align: right; }
  .db-macro-nums span { color: var(--text); font-weight: 500; }

  /* STREAK */
  .db-streak-row { display: flex; gap: 8px; margin-bottom: 16px; }
  .db-streak-day {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .db-streak-dot {
    width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; transition: all 0.2s;
  }
  .db-streak-dot.hit   { background: rgba(200,241,53,0.15); border-color: rgba(200,241,53,0.4); color: var(--accent); }
  .db-streak-dot.miss  { background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.2); color: #F87171; }
  .db-streak-dot.today { background: var(--accent); border-color: var(--accent); color: #0a0a0a; font-weight: 700; }
  .db-streak-dot.empty { color: var(--muted); }
  .db-streak-lbl { font-size: 10px; color: var(--muted); }
  .db-streak-summary {
    display: flex; gap: 20px; padding-top: 16px; border-top: 1px solid var(--border);
  }
  .db-streak-sum-num {
    font-family: var(--display); font-size: 24px; font-weight: 800;
    color: var(--text); line-height: 1; margin-bottom: 2px;
  }
  .db-streak-sum-num span { color: var(--accent); }
  .db-streak-sum-label { font-size: 11px; color: var(--muted); }

  /* MEAL LOG */
  .db-meal-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .db-meal-item:last-child { border-bottom: none; }
  .db-meal-name { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .db-meal-time { font-size: 11px; color: var(--muted); }
  .db-meal-cals { font-size: 13px; font-weight: 500; color: var(--text); }
  .db-meal-protein { font-size: 11px; color: var(--accent); text-align: right; }
  .db-add-btn {
    width: 100%; padding: 10px; margin-top: 14px;
    background: transparent; border: 1px dashed rgba(255,255,255,0.1);
    border-radius: 6px; color: var(--muted);
    font-family: var(--body); font-size: 13px; cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .db-add-btn:hover { border-color: rgba(200,241,53,0.3); color: var(--accent); }

  /* AI CARD */
  .db-ai-card {
    background: rgba(200,241,53,0.04);
    border: 1px solid rgba(200,241,53,0.15);
    border-radius: 12px; padding: 20px 22px;
    margin-top: 16px;
    display: flex; gap: 14px; align-items: flex-start;
  }
  .db-ai-icon {
    width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
    background: rgba(200,241,53,0.12); border: 1px solid rgba(200,241,53,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .db-ai-label { font-size: 10px; letter-spacing: 1.5px; color: var(--accent); text-transform: uppercase; font-weight: 500; margin-bottom: 4px; }
  .db-ai-msg { font-size: 13px; color: #9AA0A8; line-height: 1.6; font-style: italic; }

  /* WORKOUT CARD */
  .db-workout-status {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 8px; margin-bottom: 14px;
  }
  .db-workout-status.done { border-color: rgba(200,241,53,0.2); background: rgba(200,241,53,0.04); }
  .db-workout-dot {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
    background: var(--muted);
  }
  .db-workout-dot.done { background: var(--accent); }
  .db-workout-status-text { font-size: 13px; color: var(--muted); }
  .db-workout-status-text strong { color: var(--text); font-weight: 500; }
  .db-exercise-list { display: flex; flex-direction: column; gap: 8px; }
  .db-exercise-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 12px; background: var(--surface2); border-radius: 6px;
    border: 1px solid var(--border);
  }
  .db-exercise-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .db-exercise-detail { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .db-exercise-sets {
    font-size: 11px; font-weight: 500; padding: 3px 8px;
    background: rgba(200,241,53,0.08); color: var(--accent);
    border-radius: 3px;
  }

  /* POSTURE */
  .db-posture-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .db-posture-row:last-child { border-bottom: none; }
  .db-posture-exercise { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .db-posture-date { font-size: 11px; color: var(--muted); }
  .db-posture-score {
    font-family: var(--display); font-size: 22px; font-weight: 800;
  }
  .db-posture-score.good { color: var(--accent); }
  .db-posture-score.warn { color: var(--warn); }

  /* EMPTY STATE */
  .db-empty {
    text-align: center; padding: 28px 16px;
    color: var(--muted); font-size: 13px; line-height: 1.7;
  }
  .db-empty-icon { font-size: 28px; margin-bottom: 10px; }
  .db-empty-btn {
    margin-top: 14px; padding: 10px 22px;
    background: var(--accent); color: #0a0a0a;
    border: none; border-radius: 6px;
    font-family: var(--body); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: opacity 0.2s;
  }
  .db-empty-btn:hover { opacity: 0.88; }

  @media (max-width: 1100px) {
    .db-grid-top { grid-template-columns: 1fr 1fr; }
    .db-grid-mid, .db-grid-bot { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .db-sidebar { display: none; }
    .db-main { padding: 24px 20px; }
    .db-grid-top { grid-template-columns: 1fr; }
    .db-topbar { flex-direction: column; gap: 16px; }
    .db-topbar-actions { width: 100%; }
    .db-action-btn { flex: 1; justify-content: center; }
  }
`;

// ── mock data (replace with real API calls) ───────────────────────────────

const USER = {
  name: "Rahul",
  goal: "Build Muscle",
  initials: "R",
  targets: { calories: 2400, protein: 160, carbs: 260, fat: 70 },
};

const TODAY_NUTRITION = {
  calories: 1640, protein: 108, carbs: 174, fat: 44,
};

const MEALS = [
  { id: 1, name: "Oats + Banana",      time: "8:30 AM",  calories: 380, protein: 12 },
  { id: 2, name: "Paneer Rice Bowl",   time: "1:00 PM",  calories: 620, protein: 46 },
  { id: 3, name: "Protein Shake",      time: "4:30 PM",  calories: 180, protein: 30 },
  { id: 4, name: "Dal + Roti",         time: "7:30 PM",  calories: 460, protein: 20 },
];

const WORKOUT_TODAY = {
  done: true,
  focus: "Push Day — Chest & Shoulders",
  exercises: [
    { name: "Bench Press",       detail: "Chest compound",        sets: "4 × 8" },
    { name: "Overhead Press",    detail: "Shoulder compound",     sets: "3 × 10" },
    { name: "Incline Dumbbell",  detail: "Upper chest",           sets: "3 × 12" },
  ],
};

const WEEK_STREAK = [
  { day: "Mon", status: "hit"   },
  { day: "Tue", status: "hit"   },
  { day: "Wed", status: "miss"  },
  { day: "Thu", status: "hit"   },
  { day: "Fri", status: "hit"   },
  { day: "Sat", status: "today" },
  { day: "Sun", status: "empty" },
];

const POSTURE_SESSIONS = [
  { exercise: "Squat",       date: "Today, 5:10 PM",      score: 8.2, status: "good" },
  { exercise: "Deadlift",    date: "Yesterday, 6:00 PM",  score: 6.5, status: "warn" },
  { exercise: "Shoulder Press", date: "Thu, 5:45 PM",     score: 9.1, status: "good" },
];

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── helpers ───────────────────────────────────────────────────────────────

function pct(val, max) { return Math.min(100, Math.round((val / max) * 100)); }

function CalorieRing({ consumed, target }) {
  const r = 52; const circ = 2 * Math.PI * r;
  const offset = circ - (pct(consumed, target) / 100) * circ;
  return (
    <svg width="130" height="130" className="db-ring-svg">
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={r} fill="none"
        stroke="#C8F135" strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="65" y="60" textAnchor="middle" fill="#EDE9E0"
        style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, fontWeight: 900 }}>
        {consumed}
      </text>
      <text x="65" y="76" textAnchor="middle" fill="#5A6068"
        style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10 }}>
        of {target} kcal
      </text>
    </svg>
  );
}

// ── component ─────────────────────────────────────────────────────────────

const NAV = [
  { icon: "⬡", label: "Dashboard",   active: true  },
  { icon: "◈", label: "Meal Tracker", active: false },
  { icon: "◇", label: "Workouts",     active: false },
  { icon: "◎", label: "Posture AI",   active: false },
  { icon: "↗", label: "Progress",     active: false },
  { icon: "✦", label: "Profile",      active: false },
];

export default function Dashboard() {
  const navigate   = useNavigate();
  const now        = new Date();
  const dateStr    = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const hour       = now.getHours();
  const greeting   = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const remaining  = USER.targets.calories - TODAY_NUTRITION.calories;

  const [activeNav, setActiveNav] = useState("Dashboard");

  const macros = [
    { name: "Protein", consumed: TODAY_NUTRITION.protein, target: USER.targets.protein, color: "#C8F135" },
    { name: "Carbs",   consumed: TODAY_NUTRITION.carbs,   target: USER.targets.carbs,   color: "#35F1A0" },
    { name: "Fats",    consumed: TODAY_NUTRITION.fat,     target: USER.targets.fat,     color: "#6B7280" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="db-root">

        {/* SIDEBAR */}
        <aside className="db-sidebar">
          <div className="db-logo">FIT<span>CORE</span></div>

          <nav className="db-nav">
            <div className="db-nav-section">Main</div>
            {NAV.slice(0, 5).map((n) => (
              <button
                key={n.label}
                className={`db-nav-item ${activeNav === n.label ? "active" : ""}`}
                onClick={() => setActiveNav(n.label)}
              >
                <span className="db-nav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
            <div className="db-nav-section">Account</div>
            <button
              className={`db-nav-item ${activeNav === "Profile" ? "active" : ""}`}
              onClick={() => navigate("/profile")}
            >
              <span className="db-nav-icon">✦</span>
              Profile
            </button>
          </nav>

          <div className="db-sidebar-bottom">
            <div className="db-user-row" onClick={() => navigate("/profile")}>
              <div className="db-avatar">{USER.initials}</div>
              <div>
                <div className="db-user-name">{USER.name}</div>
                <div className="db-user-goal">{USER.goal}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="db-main">

          {/* TOPBAR */}
          <div className="db-topbar">
            <div>
              <div className="db-greeting-tag">{greeting}</div>
              <div className="db-greeting">{USER.name}'s Dashboard</div>
              <div className="db-date">{dateStr}</div>
            </div>
            <div className="db-topbar-actions">
              <button className="db-action-btn ghost" onClick={() => navigate("/posture")}>
                ◎ Start Posture Session
              </button>
              <button className="db-action-btn primary" onClick={() => navigate("/meals")}>
                + Log Meal
              </button>
            </div>
          </div>

          {/* ROW 1 — Calories + Macros + Streak */}
          <div className="db-grid db-grid-top" style={{ marginBottom: 16 }}>

            {/* Calorie Ring */}
            <div className="db-card">
              <div className="db-card-label">
                Calories Today
                <span className="db-card-label-action" onClick={() => navigate("/meals")}>View meals →</span>
              </div>
              <div className="db-ring-wrap">
                <CalorieRing consumed={TODAY_NUTRITION.calories} target={USER.targets.calories} />
                <div className="db-ring-stats">
                  <div className="db-ring-stat-row">
                    <span className="db-ring-stat-name">Consumed</span>
                    <span className="db-ring-stat-val" style={{ color: "var(--accent)" }}>{TODAY_NUTRITION.calories} kcal</span>
                  </div>
                  <div className="db-ring-stat-row">
                    <span className="db-ring-stat-name">Remaining</span>
                    <span className="db-ring-stat-val" style={{ color: remaining > 0 ? "var(--text)" : "#F87171" }}>
                      {remaining > 0 ? remaining : 0} kcal
                    </span>
                  </div>
                  <div className="db-ring-stat-row">
                    <span className="db-ring-stat-name">Target</span>
                    <span className="db-ring-stat-val">{USER.targets.calories} kcal</span>
                  </div>
                  <div className="db-ring-stat-row">
                    <span className="db-ring-stat-name">Progress</span>
                    <span className="db-ring-stat-val" style={{ color: "var(--accent)" }}>
                      {pct(TODAY_NUTRITION.calories, USER.targets.calories)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Macros */}
            <div className="db-card">
              <div className="db-card-label">Macro Breakdown</div>
              {macros.map((m) => (
                <div className="db-macro-row" key={m.name}>
                  <span className="db-macro-name">{m.name}</span>
                  <div className="db-macro-bar-bg">
                    <div
                      className="db-macro-bar-fill"
                      style={{ width: `${pct(m.consumed, m.target)}%`, background: m.color }}
                    />
                  </div>
                  <span className="db-macro-nums">
                    <span style={{ color: m.color }}>{m.consumed}</span>/{m.target}g
                  </span>
                </div>
              ))}
              <div className="db-ai-card">
                <div className="db-ai-icon">◈</div>
                <div>
                  <div className="db-ai-label">AI Tip</div>
                  <div className="db-ai-msg">
                    You're {USER.targets.protein - TODAY_NUTRITION.protein}g short on protein.
                    Add 200g paneer or a scoop of whey to hit your target.
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Streak */}
            <div className="db-card">
              <div className="db-card-label">Weekly Streak</div>
              <div className="db-streak-row">
                {WEEK_STREAK.map((d) => (
                  <div className="db-streak-day" key={d.day}>
                    <div className={`db-streak-dot ${d.status}`}>
                      {d.status === "hit"   && "✓"}
                      {d.status === "miss"  && "✕"}
                      {d.status === "today" && "→"}
                      {d.status === "empty" && "·"}
                    </div>
                    <span className="db-streak-lbl">{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="db-streak-summary">
                <div>
                  <div className="db-streak-sum-num">4<span>/6</span></div>
                  <div className="db-streak-sum-label">Days on target</div>
                </div>
                <div>
                  <div className="db-streak-sum-num">3<span>×</span></div>
                  <div className="db-streak-sum-label">Workouts this week</div>
                </div>
                <div>
                  <div className="db-streak-sum-num">87<span>%</span></div>
                  <div className="db-streak-sum-label">Avg protein hit</div>
                </div>
              </div>
            </div>

          </div>

          {/* ROW 2 — Meals + Workout */}
          <div className="db-grid db-grid-mid" style={{ marginBottom: 16 }}>

            {/* Meal Log */}
            <div className="db-card">
              <div className="db-card-label">
                Today's Meals
                <span className="db-card-label-action" onClick={() => navigate("/meals")}>Full log →</span>
              </div>
              {MEALS.map((m) => (
                <div className="db-meal-item" key={m.id}>
                  <div>
                    <div className="db-meal-name">{m.name}</div>
                    <div className="db-meal-time">{m.time}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="db-meal-cals">{m.calories} kcal</div>
                    <div className="db-meal-protein">{m.protein}g protein</div>
                  </div>
                </div>
              ))}
              <button className="db-add-btn" onClick={() => navigate("/meals")}>
                + Add a meal
              </button>
            </div>

            {/* Workout */}
            <div className="db-card">
              <div className="db-card-label">
                Today's Workout
                <span className="db-card-label-action" onClick={() => navigate("/workouts")}>Log →</span>
              </div>
              <div className={`db-workout-status ${WORKOUT_TODAY.done ? "done" : ""}`}>
                <div className={`db-workout-dot ${WORKOUT_TODAY.done ? "done" : ""}`} />
                <div className="db-workout-status-text">
                  {WORKOUT_TODAY.done
                    ? <><strong>Completed</strong> — {WORKOUT_TODAY.focus}</>
                    : <><strong>Not logged yet</strong> — tap to log your workout</>
                  }
                </div>
              </div>
              {WORKOUT_TODAY.done ? (
                <div className="db-exercise-list">
                  {WORKOUT_TODAY.exercises.map((e) => (
                    <div className="db-exercise-item" key={e.name}>
                      <div>
                        <div className="db-exercise-name">{e.name}</div>
                        <div className="db-exercise-detail">{e.detail}</div>
                      </div>
                      <span className="db-exercise-sets">{e.sets}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="db-empty">
                  <div className="db-empty-icon">🏋️</div>
                  No workout logged today.
                  <br />Don't break the streak.
                  <br />
                  <button className="db-empty-btn" onClick={() => navigate("/workouts")}>
                    Log Workout
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* ROW 3 — Posture Sessions */}
          <div className="db-grid db-grid-bot">

            <div className="db-card">
              <div className="db-card-label">
                Recent Posture Sessions
                <span className="db-card-label-action" onClick={() => navigate("/posture")}>Start session →</span>
              </div>
              {POSTURE_SESSIONS.length > 0 ? (
                POSTURE_SESSIONS.map((s) => (
                  <div className="db-posture-row" key={s.exercise + s.date}>
                    <div>
                      <div className="db-posture-exercise">{s.exercise}</div>
                      <div className="db-posture-date">{s.date}</div>
                    </div>
                    <div>
                      <div className={`db-posture-score ${s.status}`}>{s.score}<span style={{ fontSize: 13, color: "var(--muted)" }}>/10</span></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="db-empty">
                  <div className="db-empty-icon">◎</div>
                  No posture sessions yet.
                  <br />
                  <button className="db-empty-btn" onClick={() => navigate("/posture")}>
                    Start Session
                  </button>
                </div>
              )}
            </div>

            {/* Weekly Summary */}
            <div className="db-card">
              <div className="db-card-label">This Week's Summary</div>
              {[
                { label: "Avg Daily Calories",  val: "2,180 kcal", sub: "of 2,400 target",  color: "var(--accent)"  },
                { label: "Avg Daily Protein",   val: "142g",       sub: "of 160g target",   color: "#35F1A0"        },
                { label: "Workouts Completed",  val: "3 / 5",      sub: "this week",         color: "var(--accent)"  },
                { label: "Posture Sessions",    val: "3",          sub: "sessions logged",   color: "#35F1A0"        },
                { label: "Best Posture Score",  val: "9.1 / 10",   sub: "Shoulder Press",    color: "var(--accent)"  },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 0", borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{s.sub}</div>
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, fontWeight: 800, color: s.color }}>
                    {s.val}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </main>
      </div>
    </>
  );
}