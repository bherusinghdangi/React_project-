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
    --text:    #EDE9E0;
    --muted:   #5A6068;
    --error:   #F87171;
    --display: 'Barlow Condensed', sans-serif;
    --body:    'DM Sans', sans-serif;
  }

  .ob-root {
    background: var(--bg); min-height: 100vh;
    font-family: var(--body); color: var(--text);
    display: grid; grid-template-columns: 520px 1fr;
  }

  /* ── LEFT PANEL (form side) ── */
  .ob-left {
    display: flex; flex-direction: column;
    border-right: 1px solid var(--border);
    background: var(--surface);
    height: 100vh; position: sticky; top: 0;
    overflow-y: auto;
  }

  .ob-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 32px; border-bottom: 1px solid var(--border);
    position: sticky; top: 0; background: rgba(14,18,20,0.95);
    backdrop-filter: blur(12px); z-index: 10; flex-shrink: 0;
  }
  .ob-logo {
    font-family: var(--display); font-size: 18px; font-weight: 800;
    letter-spacing: 2px; color: var(--text); text-decoration: none;
  }
  .ob-logo span { color: var(--accent); }

  /* PROGRESS DOTS */
  .ob-progress { display: flex; align-items: center; gap: 6px; }
  .ob-step-dot {
    width: 26px; height: 26px; border-radius: 50%;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 500; color: var(--muted);
    transition: all 0.3s;
  }
  .ob-step-dot.active { border-color: var(--accent); background: rgba(200,241,53,0.1); color: var(--accent); }
  .ob-step-dot.done   { border-color: var(--accent); background: var(--accent); color: #0a0a0a; font-size: 12px; }
  .ob-step-line { width: 20px; height: 1px; background: var(--border); transition: background 0.3s; }
  .ob-step-line.done { background: var(--accent); }

  /* FORM BODY */
  .ob-form-body {
    flex: 1; padding: 36px 32px;
    display: flex; flex-direction: column;
  }

  .ob-step-tag {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(200,241,53,0.25); border-radius: 2px;
    padding: 4px 12px; margin-bottom: 16px;
    font-size: 10px; letter-spacing: 2px; font-weight: 500;
    color: var(--accent); text-transform: uppercase;
  }
  .ob-step-num-badge {
    background: rgba(200,241,53,0.15); color: var(--accent);
    width: 16px; height: 16px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700;
  }
  .ob-title {
    font-family: var(--display); font-size: 42px; font-weight: 900;
    text-transform: uppercase; line-height: 0.95; margin-bottom: 8px;
  }
  .ob-title em { font-style: normal; color: var(--accent); }
  .ob-subtitle {
    font-size: 13px; color: var(--muted); font-weight: 300;
    line-height: 1.6; margin-bottom: 28px;
  }

  /* FIELDS */
  .ob-field { margin-bottom: 18px; }
  .ob-label {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 11px; font-weight: 500; letter-spacing: 0.5px;
    color: var(--muted); text-transform: uppercase; margin-bottom: 8px;
  }
  .ob-label-hint { font-size: 10px; color: var(--muted); text-transform: none; letter-spacing: 0; font-weight: 300; }

  .ob-input-row { display: flex; gap: 10px; }
  .ob-input-wrap { flex: 1; position: relative; }
  .ob-input {
    width: 100%; padding: 12px 14px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 6px; color: var(--text);
    font-family: var(--body); font-size: 14px;
    outline: none; transition: border-color 0.2s, background 0.2s;
    appearance: none;
  }
  .ob-input:focus { border-color: rgba(200,241,53,0.4); background: #161C1F; }
  .ob-input.has-error { border-color: var(--error); }
  .ob-input-unit {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    font-size: 11px; color: var(--muted); pointer-events: none;
  }
  .ob-error { font-size: 11px; color: var(--error); margin-top: 5px; }

  /* UNIT TOGGLE */
  .ob-unit-toggle {
    display: flex; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 4px; overflow: hidden;
  }
  .ob-unit-btn {
    padding: 4px 12px; font-size: 11px; font-weight: 500;
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-family: var(--body);
    transition: background 0.2s, color 0.2s;
  }
  .ob-unit-btn.active { background: rgba(200,241,53,0.1); color: var(--accent); }

  /* GENDER */
  .ob-gender-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .ob-gender-card {
    padding: 16px; border: 1px solid var(--border);
    border-radius: 8px; background: var(--surface2);
    cursor: pointer; text-align: center;
    transition: border-color 0.2s, background 0.2s;
  }
  .ob-gender-card:hover { border-color: rgba(200,241,53,0.2); }
  .ob-gender-card.selected { border-color: var(--accent); background: rgba(200,241,53,0.06); }
  .ob-gender-icon { font-size: 22px; margin-bottom: 6px; }
  .ob-gender-label { font-size: 12px; font-weight: 500; color: var(--text); }

  /* GOALS */
  .ob-goals { display: flex; flex-direction: column; gap: 8px; }
  .ob-goal-card {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border: 1px solid var(--border);
    border-radius: 8px; background: var(--surface2);
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
  }
  .ob-goal-card:hover { border-color: rgba(200,241,53,0.2); }
  .ob-goal-card.selected { border-color: var(--accent); background: rgba(200,241,53,0.06); }
  .ob-goal-icon {
    width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .ob-goal-title { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .ob-goal-desc  { font-size: 11px; color: var(--muted); font-weight: 300; }
  .ob-goal-check {
    margin-left: auto; width: 18px; height: 18px; border-radius: 50%;
    border: 1px solid var(--border); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 10px;
    transition: all 0.2s;
  }
  .ob-goal-card.selected .ob-goal-check { background: var(--accent); border-color: var(--accent); color: #0a0a0a; }

  /* ACTIVITY */
  .ob-activity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .ob-activity-card {
    padding: 14px; border: 1px solid var(--border);
    border-radius: 8px; background: var(--surface2);
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
  }
  .ob-activity-card:hover { border-color: rgba(200,241,53,0.2); }
  .ob-activity-card.selected { border-color: var(--accent); background: rgba(200,241,53,0.06); }
  .ob-activity-icon { font-size: 18px; margin-bottom: 6px; }
  .ob-activity-title { font-size: 12px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .ob-activity-desc  { font-size: 11px; color: var(--muted); font-weight: 300; line-height: 1.4; }

  /* RESULTS */
  .ob-results { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-bottom: 20px; }
  .ob-results-title {
    font-size: 10px; letter-spacing: 1.5px; font-weight: 500;
    color: var(--muted); text-transform: uppercase; margin-bottom: 16px;
  }
  .ob-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .ob-result-item { background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 12px; }
  .ob-result-num { font-family: var(--display); font-size: 26px; font-weight: 800; color: var(--accent); line-height: 1; }
  .ob-result-unit { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .ob-result-label { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .ob-macro-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .ob-macro-row:last-child { margin-bottom: 0; }
  .ob-macro-label { font-size: 12px; color: var(--muted); min-width: 56px; }
  .ob-macro-bar-wrap { flex: 1; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
  .ob-macro-bar { height: 100%; border-radius: 2px; }
  .ob-macro-val { font-size: 12px; font-weight: 500; min-width: 40px; text-align: right; }
  .ob-result-note {
    font-size: 11px; color: var(--muted); line-height: 1.6;
    padding: 10px 12px; background: rgba(200,241,53,0.04);
    border-left: 2px solid rgba(200,241,53,0.3); border-radius: 3px;
  }

  /* ACTIONS */
  .ob-actions { display: flex; gap: 10px; margin-top: auto; padding-top: 24px; }
  .ob-btn-back {
    padding: 13px 24px; background: transparent;
    border: 1px solid var(--border); border-radius: 6px;
    color: var(--muted); font-family: var(--body); font-size: 13px;
    cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .ob-btn-back:hover { border-color: rgba(255,255,255,0.15); color: var(--text); }
  .ob-btn-next {
    flex: 1; padding: 13px;
    background: var(--accent); color: #0a0a0a;
    border: none; border-radius: 6px;
    font-family: var(--body); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s;
  }
  .ob-btn-next:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .ob-btn-next:disabled { opacity: 0.45; cursor: not-allowed; }
  .ob-spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(10,10,10,0.3); border-top-color: #0a0a0a;
    display: inline-block; animation: spin 0.7s linear infinite;
    margin-right: 6px; vertical-align: middle;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ob-step-anim { animation: fadeUp 0.35s ease both; }

  /* ── RIGHT PANEL (dashboard preview) ── */
  .ob-right {
    position: relative; overflow: hidden;
    background: var(--bg);
  }
  .ob-preview-blur {
    position: absolute; inset: 0;
    pointer-events: none; overflow: hidden;
    padding: 32px;
  }

  /* lock overlay — blur applied here, not on the dashboard */
  .ob-lock-overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 10; gap: 16px;
    backdrop-filter: blur(5px);
    background: rgba(7,9,10,0.5);
  }
  .ob-lock-icon {
    width: 64px; height: 64px; border-radius: 16px;
    background: rgba(200,241,53,0.1); border: 1px solid rgba(200,241,53,0.25);
    display: flex; align-items: center; justify-content: center; font-size: 28px;
  }
  .ob-lock-title {
    font-family: var(--display); font-size: 28px; font-weight: 800;
    text-transform: uppercase; text-align: center; line-height: 1;
  }
  .ob-lock-title span { color: var(--accent); display: block; }
  .ob-lock-sub {
    font-size: 13px; color: var(--muted); text-align: center;
    max-width: 280px; line-height: 1.6; font-weight: 300;
  }
  .ob-lock-steps {
    display: flex; flex-direction: column; gap: 8px; margin-top: 8px;
  }
  .ob-lock-step {
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; color: var(--muted);
  }
  .ob-lock-step-dot {
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; font-size: 9px;
    transition: all 0.3s;
  }
  .ob-lock-step-dot.done { background: var(--accent); border-color: var(--accent); color: #0a0a0a; }
  .ob-lock-step-dot.active { border-color: var(--accent); color: var(--accent); }

  /* fake dashboard elements in blur layer */
  .ob-fake-dash { font-family: var(--body); }
  .ob-fake-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .ob-fake-title { font-family: var(--display); font-size: 28px; font-weight: 900; text-transform: uppercase; color: #EDE9E0; }
  .ob-fake-btn {
    padding: 8px 18px; background: #C8F135; color: #0a0a0a;
    border-radius: 4px; font-size: 12px; font-weight: 500;
  }
  .ob-fake-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .ob-fake-card { background: #1C2428; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 18px; }
  .ob-fake-card-label { font-size: 10px; color: #6B7280; margin-bottom: 12px; letter-spacing: 1px; }
  .ob-fake-num { font-family: var(--display); font-size: 36px; font-weight: 900; color: #C8F135; }
  .ob-fake-sub { font-size: 11px; color: #6B7280; margin-top: 2px; }
  .ob-fake-bar-wrap { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; margin-top: 10px; }
  .ob-fake-bar { height: 100%; border-radius: 3px; background: #C8F135; }
  .ob-fake-grid2 { display: grid; grid-template-columns: 1.4fr 1fr; gap: 12px; }
  .ob-fake-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ob-fake-row:last-child { border-bottom: none; }
  .ob-fake-row-label { font-size: 11px; color: #6B7280; }
  .ob-fake-row-val { font-family: var(--display); font-size: 16px; font-weight: 800; color: #C8F135; }
  .ob-fake-streak { display: flex; gap: 6px; margin-top: 12px; }
  .ob-fake-dot {
    flex: 1; height: 28px; border-radius: 6px;
    background: rgba(200,241,53,0.2); border: 1px solid rgba(200,241,53,0.4);
  }
  .ob-fake-dot.dim { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }

  @media (max-width: 900px) {
    .ob-root { grid-template-columns: 1fr; }
    .ob-right { display: none; }
    .ob-left { height: auto; position: static; }
  }
`;

const GOALS = [
  { id: "lose",     icon: "🔥", title: "Lose Fat",    desc: "Caloric deficit — burn more than you eat"         },
  { id: "gain",     icon: "💪", title: "Build Muscle", desc: "Caloric surplus — fuel growth and strength"       },
  { id: "maintain", icon: "⚖️", title: "Stay Fit",    desc: "Maintain weight — improve endurance and health"   },
];

const ACTIVITY = [
  { id: "sedentary", icon: "🪑", title: "Sedentary",        desc: "Desk job, little exercise"       },
  { id: "light",     icon: "🚶", title: "Lightly Active",   desc: "1–3 workouts per week"           },
  { id: "moderate",  icon: "🏃", title: "Moderately Active",desc: "3–5 workouts per week"           },
  { id: "very",      icon: "🏋️", title: "Very Active",      desc: "6–7 intense sessions per week"  },
];

const STEPS_LABELS = ["Personal Info", "Your Goal", "Activity Level", "Your Targets"];

function calcBMR({ weight, height, age, gender, unit }) {
  const w = unit === "imperial" ? weight * 0.453592 : Number(weight);
  const h = unit === "imperial" ? height * 2.54     : Number(height);
  const a = Number(age);
  return gender === "female"
    ? 447.593 + 9.247 * w + 3.098 * h - 4.330 * a
    : 88.362  + 13.397 * w + 4.799 * h - 5.677 * a;
}
const MULTIPLIERS = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 };
function calcTargets(data) {
  const bmr  = calcBMR(data);
  const tdee = bmr * MULTIPLIERS[data.activity];
  let calories = data.goal === "lose" ? Math.round(tdee - 400) : data.goal === "gain" ? Math.round(tdee + 300) : Math.round(tdee);
  const protein = Math.round((data.unit === "imperial" ? data.weight * 0.453592 : Number(data.weight)) * 2.0);
  const fat     = Math.round((calories * 0.25) / 9);
  const carbs   = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, fat, carbs, bmr: Math.round(bmr), tdee: Math.round(tdee) };
}

// Fake dashboard preview rendered blurred on the right
function FakeDashboard() {
  return (
    <div className="ob-fake-dash">
      <div className="ob-fake-topbar">
        <div>
          <div style={{ fontSize: 10, color: "#C8F135", letterSpacing: 2, marginBottom: 4 }}>GOOD MORNING</div>
          <div className="ob-fake-title">Your Dashboard</div>
        </div>
        <div className="ob-fake-btn">+ Log Meal</div>
      </div>
      <div className="ob-fake-grid">
        <div className="ob-fake-card">
          <div className="ob-fake-card-label">CALORIES TODAY</div>
          <div className="ob-fake-num">1,640</div>
          <div className="ob-fake-sub">of 2,400 kcal</div>
          <div className="ob-fake-bar-wrap"><div className="ob-fake-bar" style={{ width: "68%" }} /></div>
        </div>
        <div className="ob-fake-card">
          <div className="ob-fake-card-label">PROTEIN</div>
          <div className="ob-fake-num">108g</div>
          <div className="ob-fake-sub">of 160g target</div>
          <div className="ob-fake-bar-wrap"><div className="ob-fake-bar" style={{ width: "67%", background: "#35F1A0" }} /></div>
        </div>
        <div className="ob-fake-card">
          <div className="ob-fake-card-label">WEEKLY STREAK</div>
          <div className="ob-fake-num">4/6</div>
          <div className="ob-fake-sub">days on target</div>
          <div className="ob-fake-streak">
            {["","","dim","","","today","dim"].map((c,i) => <div key={i} className={`ob-fake-dot ${c}`} />)}
          </div>
        </div>
      </div>
      <div className="ob-fake-grid2">
        <div className="ob-fake-card">
          <div className="ob-fake-card-label">TODAY'S MEALS</div>
          {["Oats + Banana — 380 kcal","Paneer Rice Bowl — 620 kcal","Protein Shake — 180 kcal"].map(m => (
            <div className="ob-fake-row" key={m}>
              <span className="ob-fake-row-label">{m}</span>
            </div>
          ))}
        </div>
        <div className="ob-fake-card">
          <div className="ob-fake-card-label">THIS WEEK</div>
          {[["Avg Calories","2,180"],["Avg Protein","142g"],["Workouts","3 / 5"],["Posture Score","9.1"]].map(([l,v]) => (
            <div className="ob-fake-row" key={l}>
              <span className="ob-fake-row-label">{l}</span>
              <span className="ob-fake-row-val">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const INIT = { gender: "", age: "", height: "", weight: "", unit: "metric", goal: "", activity: "" };

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep]     = useState(0);
  const [data, setData]     = useState(INIT);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (field) => (val) => {
    setData((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const targets = step === 3 ? calcTargets(data) : null;

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!data.gender)                                 e.gender = "Select a gender";
      if (!data.age || data.age < 10 || data.age > 100) e.age    = "Enter a valid age (10–100)";
      if (!data.height || data.height < 1)              e.height = "Enter your height";
      if (!data.weight || data.weight < 1)              e.weight = "Enter your weight";
    }
    if (step === 1 && !data.goal)     e.goal     = "Select a goal";
    if (step === 2 && !data.activity) e.activity = "Select an activity level";
    return e;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep((s) => s + 1); setErrors({});
  };

  const handleFinish = async () => {
    setSaving(true);
    // TODO: POST /api/users/profile with { ...data, ...targets }
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    navigate("/dashboard");
  };

  const switchUnit = (newUnit) => {
    if (newUnit === data.unit) return;
    setData((p) => {
      const h = parseFloat(p.height);
      const w = parseFloat(p.weight);
      return {
        ...p,
        unit: newUnit,
        height: p.height && !isNaN(h)
          ? newUnit === "imperial"
            ? (h / 2.54).toFixed(1)      // cm → inches
            : (h * 2.54).toFixed(1)       // inches → cm
          : p.height,
        weight: p.weight && !isNaN(w)
          ? newUnit === "imperial"
            ? (w * 2.20462).toFixed(1)    // kg → lbs
            : (w / 2.20462).toFixed(1)    // lbs → kg
          : p.weight,
      };
    });
  };
  const hPlaceholder = data.unit === "imperial" ? "e.g. 65" : "e.g. 175";
  const wPlaceholder = data.unit === "imperial" ? "e.g. 165" : "e.g. 75";
  const hUnit        = data.unit === "imperial" ? "in" : "cm";
  const wUnit        = data.unit === "imperial" ? "lbs" : "kg";

  return (
    <>
      <style>{CSS}</style>
      <div className="ob-root">

        {/* ── LEFT: FORM ── */}
        <div className="ob-left">

          {/* topbar */}
          <div className="ob-topbar">
            <div className="ob-logo">FIT<span>CORE</span></div>
            <div className="ob-progress">
              {STEPS_LABELS.map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div className={`ob-step-dot ${i < step ? "done" : i === step ? "active" : ""}`} title={label}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  {i < STEPS_LABELS.length - 1 && (
                    <div className={`ob-step-line ${i < step ? "done" : ""}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* form */}
          <div className="ob-form-body">
            <div className="ob-step-anim" key={step}>

              {/* STEP 0 */}
              {step === 0 && <>
                <div className="ob-step-tag"><div className="ob-step-num-badge">1</div>Personal Info</div>
                <h2 className="ob-title">Tell us about<br /><em>yourself.</em></h2>
                <p className="ob-subtitle">Used to calculate your daily calorie and protein targets. Nothing leaves this app.</p>

                <div className="ob-field">
                  <div className="ob-label">Biological Sex <span className="ob-label-hint">for BMR calculation</span></div>
                  <div className="ob-gender-row">
                    {[{ id: "male", icon: "♂", label: "Male" }, { id: "female", icon: "♀", label: "Female" }].map((g) => (
                      <div key={g.id} className={`ob-gender-card ${data.gender === g.id ? "selected" : ""}`} onClick={() => set("gender")(g.id)}>
                        <div className="ob-gender-icon">{g.icon}</div>
                        <div className="ob-gender-label">{g.label}</div>
                      </div>
                    ))}
                  </div>
                  {errors.gender && <div className="ob-error">{errors.gender}</div>}
                </div>

                <div className="ob-field">
                  <label className="ob-label">Age</label>
                  <div className="ob-input-wrap">
                    <input type="number" min="10" max="100"
                      className={`ob-input ${errors.age ? "has-error" : ""}`}
                      placeholder="e.g. 22" value={data.age}
                      onChange={(e) => set("age")(e.target.value)}
                      style={{ paddingRight: 48 }} />
                    <span className="ob-input-unit">yrs</span>
                  </div>
                  {errors.age && <div className="ob-error">{errors.age}</div>}
                </div>

                <div className="ob-field">
                  <div className="ob-label">
                    Measurements
                    <div className="ob-unit-toggle">
                      <button className={`ob-unit-btn ${data.unit === "metric" ? "active" : ""}`} onClick={() => switchUnit("metric")}>Metric</button>
                      <button className={`ob-unit-btn ${data.unit === "imperial" ? "active" : ""}`} onClick={() => switchUnit("imperial")}>Imperial</button>
                    </div>
                  </div>
                  <div className="ob-input-row">
                    <div className="ob-input-wrap">
                      <input type="number" min="1"
                        className={`ob-input ${errors.height ? "has-error" : ""}`}
                        placeholder={hPlaceholder} value={data.height}
                        onChange={(e) => set("height")(e.target.value)}
                        style={{ paddingRight: 40 }} />
                      <span className="ob-input-unit">{hUnit}</span>
                    </div>
                    <div className="ob-input-wrap">
                      <input type="number" min="1"
                        className={`ob-input ${errors.weight ? "has-error" : ""}`}
                        placeholder={wPlaceholder} value={data.weight}
                        onChange={(e) => set("weight")(e.target.value)}
                        style={{ paddingRight: 44 }} />
                      <span className="ob-input-unit">{wUnit}</span>
                    </div>
                  </div>
                  {(errors.height || errors.weight) && <div className="ob-error">{errors.height || errors.weight}</div>}
                </div>
              </>}

              {/* STEP 1 */}
              {step === 1 && <>
                <div className="ob-step-tag"><div className="ob-step-num-badge">2</div>Fitness Goal</div>
                <h2 className="ob-title">What's your<br /><em>main goal?</em></h2>
                <p className="ob-subtitle">Sets your calorie target. Changeable later from your profile.</p>
                <div className="ob-goals">
                  {GOALS.map((g) => (
                    <div key={g.id} className={`ob-goal-card ${data.goal === g.id ? "selected" : ""}`} onClick={() => set("goal")(g.id)}>
                      <div className="ob-goal-icon">{g.icon}</div>
                      <div>
                        <div className="ob-goal-title">{g.title}</div>
                        <div className="ob-goal-desc">{g.desc}</div>
                      </div>
                      <div className="ob-goal-check">{data.goal === g.id ? "✓" : ""}</div>
                    </div>
                  ))}
                </div>
                {errors.goal && <div className="ob-error" style={{ marginTop: 10 }}>{errors.goal}</div>}
              </>}

              {/* STEP 2 */}
              {step === 2 && <>
                <div className="ob-step-tag"><div className="ob-step-num-badge">3</div>Activity Level</div>
                <h2 className="ob-title">How active<br /><em>are you?</em></h2>
                <p className="ob-subtitle">Be honest — overestimating activity is the #1 reason people miss targets.</p>
                <div className="ob-activity-grid">
                  {ACTIVITY.map((a) => (
                    <div key={a.id} className={`ob-activity-card ${data.activity === a.id ? "selected" : ""}`} onClick={() => set("activity")(a.id)}>
                      <div className="ob-activity-icon">{a.icon}</div>
                      <div className="ob-activity-title">{a.title}</div>
                      <div className="ob-activity-desc">{a.desc}</div>
                    </div>
                  ))}
                </div>
                {errors.activity && <div className="ob-error" style={{ marginTop: 10 }}>{errors.activity}</div>}
              </>}

              {/* STEP 3 */}
              {step === 3 && targets && <>
                <div className="ob-step-tag"><div className="ob-step-num-badge">4</div>Your Targets</div>
                <h2 className="ob-title">Your daily<br /><em>numbers.</em></h2>
                <p className="ob-subtitle">Calculated using the Mifflin–St Jeor formula. FitCore tracks these every single day.</p>
                <div className="ob-results">
                  <div className="ob-results-title">Daily Targets</div>
                  <div className="ob-result-grid">
                    {[
                      { num: targets.calories, unit: "kcal / day", label: "Calories"      },
                      { num: targets.protein,  unit: "g / day",    label: "Protein"       },
                      { num: targets.carbs,    unit: "g / day",    label: "Carbohydrates" },
                      { num: targets.fat,      unit: "g / day",    label: "Fats"          },
                    ].map((r) => (
                      <div className="ob-result-item" key={r.label}>
                        <div className="ob-result-num">{r.num}</div>
                        <div className="ob-result-unit">{r.unit}</div>
                        <div className="ob-result-label">{r.label}</div>
                      </div>
                    ))}
                  </div>
                  {[
                    { label: "Protein", g: targets.protein, cal: targets.protein * 4, color: "#C8F135" },
                    { label: "Carbs",   g: targets.carbs,   cal: targets.carbs * 4,   color: "#35F1A0" },
                    { label: "Fats",    g: targets.fat,     cal: targets.fat * 9,     color: "#6B7280" },
                  ].map((m) => (
                    <div className="ob-macro-row" key={m.label}>
                      <span className="ob-macro-label">{m.label}</span>
                      <div className="ob-macro-bar-wrap">
                        <div className="ob-macro-bar" style={{ width: `${Math.round((m.cal / targets.calories) * 100)}%`, background: m.color }} />
                      </div>
                      <span className="ob-macro-val" style={{ color: m.color }}>{m.g}g</span>
                    </div>
                  ))}
                  <div className="ob-result-note" style={{ marginTop: 14 }}>
                    BMR <strong style={{ color: "var(--text)" }}>{targets.bmr} kcal</strong> · TDEE <strong style={{ color: "var(--text)" }}>{targets.tdee} kcal</strong>
                    {data.goal === "lose"     && " · 400 kcal deficit applied"}
                    {data.goal === "gain"     && " · 300 kcal surplus applied"}
                    {data.goal === "maintain" && " · Maintenance calories"}
                  </div>
                </div>
              </>}

            </div>

            {/* BUTTONS */}
            <div className="ob-actions">
              {step > 0 && <button className="ob-btn-back" onClick={() => setStep((s) => s - 1)}>← Back</button>}
              {step < 3
                ? <button className="ob-btn-next" onClick={handleNext}>Continue →</button>
                : <button className="ob-btn-next" onClick={handleFinish} disabled={saving}>
                    {saving && <span className="ob-spinner" />}
                    {saving ? "Saving..." : "Go to Dashboard →"}
                  </button>
              }
            </div>
          </div>
        </div>

        {/* ── RIGHT: BLURRED DASHBOARD PREVIEW ── */}
        <div className="ob-right">
          {/* blurred dashboard behind */}
          <div className="ob-preview-blur">
            <FakeDashboard />
          </div>

          {/* lock overlay on top */}
          <div className="ob-lock-overlay">
            <div className="ob-lock-icon">🔒</div>
            <div className="ob-lock-title">
              Complete setup<br /><span>to unlock</span>
            </div>
            <p className="ob-lock-sub">
              Your personalised dashboard is waiting. Finish the 4-step setup to get access.
            </p>
            <div className="ob-lock-steps">
              {STEPS_LABELS.map((label, i) => (
                <div className="ob-lock-step" key={label}>
                  <div className={`ob-lock-step-dot ${i < step ? "done" : i === step ? "active" : ""}`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span style={{ color: i <= step ? "var(--text)" : "var(--muted)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}