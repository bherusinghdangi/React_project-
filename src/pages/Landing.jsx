import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #07090A;
    --surface: #0E1214;
    --border:  rgba(255,255,255,0.07);
    --accent:  #C8F135;
    --accent2: #35F1A0;
    --text:    #EDE9E0;
    --muted:   #5A6068;
    --display: 'Barlow Condensed', sans-serif;
    --body:    'DM Sans', sans-serif;
  }

  .lp-root {
    background: var(--bg);
    color: var(--text);
    font-family: var(--body);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* NAV */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    background: rgba(7,9,10,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .lp-logo {
    font-family: var(--display);
    font-size: 22px; font-weight: 800; letter-spacing: 2px;
    color: var(--text);
  }
  .lp-logo span { color: var(--accent); }
  .lp-nav-links { display: flex; gap: 36px; }
  .lp-nav-links a {
    font-size: 13px; font-weight: 400; color: var(--muted);
    text-decoration: none; letter-spacing: 0.5px;
    transition: color 0.2s;
  }
  .lp-nav-links a:hover { color: var(--text); }
  .lp-nav-cta {
    background: var(--accent); color: #0a0a0a;
    border: none; border-radius: 4px;
    padding: 10px 24px; font-size: 13px; font-weight: 500;
    font-family: var(--body); cursor: pointer; letter-spacing: 0.3px;
    transition: opacity 0.2s, transform 0.15s;
  }
  .lp-nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

  /* HERO */
  .lp-hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    padding: 120px 48px 80px;
    position: relative; overflow: hidden;
  }
  .lp-hero-grid {
    position: absolute; inset: 0; opacity: 0.06;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .lp-hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(200,241,53,0.3); border-radius: 2px;
    padding: 6px 14px; margin-bottom: 28px;
    font-size: 11px; letter-spacing: 2px; font-weight: 500;
    color: var(--accent); text-transform: uppercase;
    animation: fadeUp 0.6s ease both;
  }
  .lp-hero-tag-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent);
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .lp-hero-title {
    font-family: var(--display);
    font-size: clamp(72px, 10vw, 140px);
    font-weight: 900; line-height: 0.92;
    letter-spacing: -1px; text-transform: uppercase;
    margin-bottom: 32px;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .lp-hero-title .accent-line { color: var(--accent); display: block; }
  .lp-hero-title .stroke-line {
    -webkit-text-stroke: 1.5px var(--muted);
    color: transparent; display: block;
  }
  .lp-hero-sub {
    max-width: 480px; font-size: 16px; font-weight: 300;
    line-height: 1.7; color: #8A9099; margin-bottom: 44px;
    animation: fadeUp 0.6s 0.2s ease both;
  }
  .lp-hero-actions {
    display: flex; align-items: center; gap: 20px;
    animation: fadeUp 0.6s 0.3s ease both;
  }
  .lp-btn-primary {
    background: var(--accent); color: #0a0a0a;
    border: none; border-radius: 4px;
    padding: 16px 36px; font-size: 14px; font-weight: 500;
    font-family: var(--body); cursor: pointer; letter-spacing: 0.3px;
    transition: opacity 0.2s, transform 0.15s;
  }
  .lp-btn-primary:hover { opacity: 0.88; transform: translateY(-2px); }
  .lp-btn-ghost {
    background: transparent; color: var(--muted);
    border: 1px solid var(--border); border-radius: 4px;
    padding: 15px 28px; font-size: 14px; font-weight: 400;
    font-family: var(--body); cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .lp-btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
  .lp-hero-stats {
    display: flex; gap: 48px; margin-top: 72px;
    padding-top: 48px; border-top: 1px solid var(--border);
    animation: fadeUp 0.6s 0.4s ease both;
  }
  .lp-stat-num {
    font-family: var(--display); font-size: 42px; font-weight: 800;
    color: var(--text); line-height: 1; margin-bottom: 4px;
  }
  .lp-stat-num span { color: var(--accent); }
  .lp-stat-label { font-size: 12px; color: var(--muted); letter-spacing: 0.5px; }

  /* FLOATING CARD */
  .lp-hero-card {
    position: absolute; right: 80px; top: 50%; transform: translateY(-50%);
    width: 300px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 12px; padding: 24px;
    animation: floatCard 4s ease-in-out infinite, fadeUp 0.8s 0.5s ease both;
  }
  @keyframes floatCard {
    0%,100% { transform: translateY(-50%) translateY(0); }
    50%      { transform: translateY(-50%) translateY(-12px); }
  }
  .lp-card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .lp-card-title { font-size: 12px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
  .lp-card-badge {
    font-size: 10px; font-weight: 500; padding: 3px 8px;
    background: rgba(200,241,53,0.12); color: var(--accent);
    border-radius: 2px; letter-spacing: 0.5px;
  }
  .lp-macro-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .lp-macro-label { font-size: 13px; color: #8A9099; }
  .lp-macro-bar-wrap { flex: 1; margin: 0 14px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
  .lp-macro-bar { height: 100%; border-radius: 2px; transition: width 1s ease; }
  .lp-macro-val { font-size: 13px; font-weight: 500; min-width: 36px; text-align: right; }
  .lp-card-ai-msg {
    margin-top: 18px; padding: 12px 14px;
    background: rgba(200,241,53,0.06); border-left: 2px solid var(--accent);
    border-radius: 4px; font-size: 12px; line-height: 1.6; color: #9AA0A8; font-style: italic;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* FEATURES */
  .lp-section { padding: 100px 48px; }
  .lp-section-tag {
    font-size: 11px; letter-spacing: 2.5px; font-weight: 500;
    color: var(--accent); text-transform: uppercase; margin-bottom: 16px;
  }
  .lp-section-title {
    font-family: var(--display); font-size: clamp(40px, 5vw, 64px);
    font-weight: 800; line-height: 1; text-transform: uppercase; margin-bottom: 64px;
  }
  .lp-section-title em { font-style: normal; color: var(--accent); }
  .lp-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
  .lp-feature-card {
    background: var(--surface); padding: 40px 36px;
    border: 1px solid var(--border);
    transition: border-color 0.25s, background 0.25s;
    cursor: default; position: relative; overflow: hidden;
  }
  .lp-feature-card:hover { border-color: rgba(200,241,53,0.25); background: #0F1416; }
  .lp-feature-card:hover .lp-feat-icon-wrap { border-color: rgba(200,241,53,0.3); }
  .lp-feat-num {
    font-family: var(--display); font-size: 72px; font-weight: 900;
    color: rgba(255,255,255,0.04); position: absolute;
    top: 20px; right: 24px; line-height: 1; pointer-events: none;
  }
  .lp-feat-icon-wrap {
    width: 48px; height: 48px; border-radius: 8px; border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 28px; font-size: 22px; transition: border-color 0.25s;
  }
  .lp-feat-title {
    font-family: var(--display); font-size: 28px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; line-height: 1;
  }
  .lp-feat-desc { font-size: 14px; line-height: 1.75; color: #6B7280; font-weight: 300; }
  .lp-feat-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 28px; }
  .lp-feat-tag {
    font-size: 10px; letter-spacing: 1px; padding: 4px 10px;
    border: 1px solid var(--border); border-radius: 2px; color: var(--muted); text-transform: uppercase;
  }

  /* HOW IT WORKS */
  .lp-how {
    background: var(--surface); padding: 100px 48px;
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  }
  .lp-steps { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 64px; }
  .lp-step { padding: 40px; border-right: 1px solid var(--border); position: relative; }
  .lp-step:last-child { border-right: none; }
  .lp-step-num {
    font-family: var(--display); font-size: 13px; font-weight: 600;
    color: var(--accent); letter-spacing: 2px; margin-bottom: 20px;
  }
  .lp-step-title {
    font-family: var(--display); font-size: 26px; font-weight: 700;
    text-transform: uppercase; margin-bottom: 14px; line-height: 1;
  }
  .lp-step-desc { font-size: 14px; line-height: 1.75; color: #6B7280; font-weight: 300; }
  .lp-step-arrow {
    position: absolute; right: -12px; top: 50%; transform: translateY(-50%);
    width: 24px; height: 24px; background: var(--bg);
    border: 1px solid var(--border); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: var(--muted); z-index: 1;
  }
  .lp-step:last-child .lp-step-arrow { display: none; }

  /* POSTURE */
  .lp-posture { padding: 100px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .lp-posture-visual {
    aspect-ratio: 1; background: var(--surface);
    border: 1px solid var(--border); border-radius: 12px;
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .lp-posture-visual svg { width: 70%; height: 70%; opacity: 0.9; }
  .lp-posture-badge {
    position: absolute; bottom: 20px; left: 20px; right: 20px;
    background: rgba(7,9,10,0.9); border: 1px solid rgba(200,241,53,0.2);
    border-radius: 8px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .lp-badge-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
    flex-shrink: 0; animation: blink 1.5s ease-in-out infinite;
  }
  .lp-badge-text { font-size: 12px; color: #9AA0A8; }
  .lp-badge-text strong { color: var(--text); display: block; font-weight: 500; font-size: 13px; }
  .lp-posture-content p { font-size: 15px; line-height: 1.8; color: #6B7280; font-weight: 300; margin-bottom: 32px; }
  .lp-angle-list { display: flex; flex-direction: column; gap: 14px; }
  .lp-angle-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 6px;
  }
  .lp-angle-name { font-size: 13px; color: #8A9099; }
  .lp-angle-val { font-family: var(--display); font-size: 22px; font-weight: 700; }
  .lp-angle-val.good { color: var(--accent); }
  .lp-angle-val.warn { color: #F59E0B; }
  .lp-angle-status { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px; border-radius: 2px; }
  .lp-angle-status.good { background: rgba(200,241,53,0.1); color: var(--accent); }
  .lp-angle-status.warn { background: rgba(245,158,11,0.1); color: #F59E0B; }

  /* CTA */
  .lp-cta {
    padding: 100px 48px; text-align: center; border-top: 1px solid var(--border);
    background: radial-gradient(ellipse 60% 40% at 50% 100%, rgba(200,241,53,0.05) 0%, transparent 70%);
  }
  .lp-cta-title {
    font-family: var(--display); font-size: clamp(48px, 7vw, 96px);
    font-weight: 900; text-transform: uppercase; line-height: 0.92; margin-bottom: 28px;
  }
  .lp-cta-title span { color: var(--accent); }
  .lp-cta-sub { font-size: 15px; color: var(--muted); margin-bottom: 44px; font-weight: 300; }
  .lp-cta-form { display: flex; gap: 12px; justify-content: center; max-width: 420px; margin: 0 auto; }
  .lp-email-input {
    flex: 1; padding: 15px 20px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 4px;
    color: var(--text); font-family: var(--body); font-size: 14px;
    outline: none; transition: border-color 0.2s;
  }
  .lp-email-input::placeholder { color: var(--muted); }
  .lp-email-input:focus { border-color: rgba(200,241,53,0.4); }

  /* FOOTER */
  .lp-footer {
    padding: 40px 48px; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .lp-footer-logo { font-family: var(--display); font-size: 16px; font-weight: 800; letter-spacing: 2px; }
  .lp-footer-logo span { color: var(--accent); }
  .lp-footer-copy { font-size: 12px; color: var(--muted); }
  .lp-footer-links { display: flex; gap: 24px; }
  .lp-footer-links a { font-size: 12px; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .lp-footer-links a:hover { color: var(--text); }

  .lp-auth-backdrop {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.55);
    display: flex; justify-content: flex-end; z-index: 200;
    padding: 24px;
  }
  .lp-auth-panel {
    width: min(480px, 100%); max-width: 100%; height: 100%;
    background: var(--surface); border-left: 1px solid var(--border);
    box-shadow: -12px 0 48px rgba(0, 0, 0, 0.45);
    display: flex; flex-direction: column; gap: 22px;
    padding: 32px; overflow-y: auto;
  }
  .lp-auth-panel-header {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px;
  }
  .lp-auth-panel-title {
    font-family: var(--display); font-size: 26px; font-weight: 800;
  }
  .lp-auth-panel-sub { color: var(--muted); font-size: 14px; line-height: 1.6; }
  .lp-auth-close {
    border: none; background: transparent; color: var(--text);
    font-size: 26px; cursor: pointer; line-height: 1;
  }
  .lp-auth-tab-list { display: flex; gap: 10px; }
  .lp-auth-tab {
    flex: 1; padding: 12px 14px; border-radius: 8px;
    background: rgba(255,255,255,0.03); color: var(--text);
    border: 1px solid transparent; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .lp-auth-tab.active {
    background: rgba(200,241,53,0.16); border-color: rgba(200,241,53,0.3);
  }
  .lp-auth-form { display: grid; gap: 18px; }
  .lp-auth-field { display: grid; gap: 8px; }
  .lp-auth-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .lp-auth-input {
    width: 100%; padding: 14px 16px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--bg); color: var(--text);
    font-family: var(--body); font-size: 14px;
  }
  .lp-auth-input:focus { outline: none; border-color: rgba(200,241,53,0.35); }
  .lp-auth-error { color: var(--error); font-size: 12px; }
  .lp-auth-submit {
    width: 100%; padding: 15px 18px; font-size: 14px;
    border: none; border-radius: 8px; background: var(--accent);
    color: #0a0a0a; cursor: pointer;
  }
  .lp-auth-submit:disabled { opacity: 0.65; cursor: not-allowed; }
  .lp-auth-helper { color: var(--muted); font-size: 13px; }
  .lp-auth-link {
    border: none; background: transparent; color: var(--accent);
    cursor: pointer; text-decoration: underline; font-size: 13px;
    padding: 0;
  }

  @media (max-width: 900px) {
    .lp-nav { padding: 16px 24px; }
    .lp-nav-links { display: none; }
    .lp-hero { padding: 100px 24px 60px; }
    .lp-hero-card { display: none; }
    .lp-section, .lp-how, .lp-posture, .lp-cta { padding: 72px 24px; }
    .lp-features-grid, .lp-steps, .lp-posture { grid-template-columns: 1fr; }
    .lp-step { border-right: none; border-bottom: 1px solid var(--border); }
    .lp-step:last-child { border-bottom: none; }
    .lp-step-arrow { display: none; }
    .lp-footer { flex-direction: column; gap: 16px; text-align: center; }
  }
`;

const features = [
  {
    num: "01", icon: "◎", title: "Posture Correction",
    desc: "Real-time angle analysis via your camera. Detects shoulder, spine, and hip alignment across 33 body keypoints. Alerts you the moment form breaks.",
    tags: ["MediaPipe", "Angle Analysis", "Real-time"],
  },
  {
    num: "02", icon: "◈", title: "AI Meal Advisor",
    desc: "Tell the AI what you ate. It calculates your macros, checks your remaining targets for the day, and tells you exactly what to eat next based on your body.",
    tags: ["Claude AI", "Nutritionix", "Personalised"],
  },
  {
    num: "03", icon: "◇", title: "Progress Tracking",
    desc: "Weekly summaries for calories, protein, workouts completed. See the trajectory, not just today's numbers. Know if you're actually improving.",
    tags: ["Weekly Charts", "Streak Tracking", "Goals"],
  },
];

const steps = [
  {
    num: "STEP 01", title: "Set Your Profile",
    desc: "Enter height, weight, age, and fitness goal. FitCore calculates your daily calorie and protein targets using TDEE and BMR formulas.",
  },
  {
    num: "STEP 02", title: "Train & Eat Smart",
    desc: "Log meals by talking naturally to the AI. Start the camera for posture feedback mid-exercise. Log your workout sets and reps.",
  },
  {
    num: "STEP 03", title: "See the Progress",
    desc: "Weekly charts show your nutrition consistency, workout frequency, and posture improvement over time. Data-driven, not guesswork.",
  },
];

const angles = [
  { name: "Shoulder alignment", val: "12°", status: "good", label: "Correct" },
  { name: "Spine angle",        val: "47°", status: "warn", label: "Adjust"  },
  { name: "Hip symmetry",       val: "6°",  status: "good", label: "Correct" },
];

export default function Landing() {
  const [macros, setMacros]     = useState({ cal: 0, protein: 0, carbs: 0 });
  const [email, setEmail]       = useState("");
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirm, setAuthConfirm] = useState("");
  const [authErrors, setAuthErrors] = useState({});
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMacros({ cal: 68, protein: 54, carbs: 41 }), 800);
    return () => clearTimeout(t);
  }, []);

  const openAuthPanel = (mode, initialEmail = "") => {
    setAuthMode(mode);
    setAuthErrors({});
    setAuthName("");
    setAuthPassword("");
    setAuthConfirm("");
    setAuthEmail(initialEmail || email || "");
    setShowAuthPanel(true);
  };

  const closeAuthPanel = () => {
    setShowAuthPanel(false);
    setAuthErrors({});
  };

  const validateAuth = () => {
    const errors = {};
    if (!authEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(authEmail)) {
      errors.email = "Enter a valid email";
    }
    if (!authPassword) {
      errors.password = "Password is required";
    } else if (authPassword.length < 6) {
      errors.password = "Minimum 6 characters";
    }
    if (authMode === "signup") {
      if (!authName.trim()) {
        errors.name = "Name is required";
      }
      if (!authConfirm) {
        errors.confirm = "Confirm your password";
      } else if (authConfirm !== authPassword) {
        errors.confirm = "Passwords do not match";
      }
    }
    return errors;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const errors = validateAuth();
    if (Object.keys(errors).length) {
      setAuthErrors(errors);
      return;
    }
    setAuthLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setAuthLoading(false);
    setShowAuthPanel(false);
    if (authMode === "signup") {
      navigate("/onboarding");
    } else {
      navigate("/dashboard");
    }
  };

  const handleCTA = (e) => {
    e.preventDefault();
    openAuthPanel("signup", email);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="lp-root">

        {/* NAV */}
        <nav className="lp-nav">
          <div className="lp-logo">FIT<span>CORE</span></div>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#posture">Posture AI</a>
          </div>
          <button className="lp-nav-cta" type="button" onClick={() => openAuthPanel("signup")}>Get Early Access</button>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-hero-grid" />
          <div className="lp-hero-tag">
            <div className="lp-hero-tag-dot" />
            AI-powered fitness for gym beginners
          </div>
          <h1 className="lp-hero-title">
            <span>Train</span>
            <span className="accent-line">Smarter.</span>
            <span className="stroke-line">Not Harder.</span>
          </h1>
          <p className="lp-hero-sub">
            FitCore watches your form, plans your meals, and tracks your progress —
            all powered by AI. Built for beginners who want results without a personal trainer.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-primary" type="button" onClick={() => openAuthPanel("signup")}>Start For Free</button>
            <button className="lp-btn-ghost" type="button">Watch Demo →</button>
          </div>
          <div className="lp-hero-stats">
            <div>
              <div className="lp-stat-num">33<span>+</span></div>
              <div className="lp-stat-label">Body keypoints tracked</div>
            </div>
            <div>
              <div className="lp-stat-num">Real<span>-</span>time</div>
              <div className="lp-stat-label">Posture feedback</div>
            </div>
            <div>
              <div className="lp-stat-num">0<span>₹</span></div>
              <div className="lp-stat-label">To get started</div>
            </div>
          </div>

          {/* floating card */}
          <div className="lp-hero-card">
            <div className="lp-card-header">
              <div className="lp-card-title">Today's Nutrition</div>
              <div className="lp-card-badge">LIVE</div>
            </div>
            {[
              { label: "Calories", color: "#C8F135", width: macros.cal,     val: `${macros.cal}%`     },
              { label: "Protein",  color: "#35F1A0", width: macros.protein, val: `${macros.protein}%` },
              { label: "Carbs",    color: "#6B7280", width: macros.carbs,   val: `${macros.carbs}%`   },
            ].map((m) => (
              <div className="lp-macro-row" key={m.label}>
                <span className="lp-macro-label">{m.label}</span>
                <div className="lp-macro-bar-wrap">
                  <div className="lp-macro-bar" style={{ width: `${m.width}%`, background: m.color }} />
                </div>
                <span className="lp-macro-val" style={{ color: m.color }}>{m.val}</span>
              </div>
            ))}
            <div className="lp-card-ai-msg">
              "You need 48g more protein today. Try 200g paneer or 2 eggs with chicken."
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="lp-section" id="features">
          <div className="lp-section-tag">What FitCore does</div>
          <h2 className="lp-section-title">Three tools.<br /><em>One platform.</em></h2>
          <div className="lp-features-grid">
            {features.map((f) => (
              <div className="lp-feature-card" key={f.num}>
                <div className="lp-feat-num">{f.num}</div>
                <div className="lp-feat-icon-wrap">{f.icon}</div>
                <div className="lp-feat-title">{f.title}</div>
                <div className="lp-feat-desc">{f.desc}</div>
                <div className="lp-feat-tags">
                  {f.tags.map((t) => <span className="lp-feat-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="lp-how" id="how">
          <div className="lp-section-tag">Process</div>
          <h2 className="lp-section-title">How it <em>works</em></h2>
          <div className="lp-steps">
            {steps.map((s, i) => (
              <div className="lp-step" key={s.num}>
                {i < steps.length - 1 && <div className="lp-step-arrow">→</div>}
                <div className="lp-step-num">{s.num}</div>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* POSTURE DEMO */}
        <section className="lp-posture" id="posture">
          <div className="lp-posture-visual">
            <svg viewBox="0 0 200 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="30" r="18" stroke="#C8F135" strokeWidth="1.5" />
              <line x1="100" y1="48"  x2="100" y2="130" stroke="#C8F135" strokeWidth="1.5" />
              <line x1="100" y1="70"  x2="52"  y2="110" stroke="#35F1A0" strokeWidth="1.5" />
              <line x1="100" y1="70"  x2="148" y2="110" stroke="#35F1A0" strokeWidth="1.5" />
              <line x1="52"  y1="110" x2="36"  y2="155" stroke="#35F1A0" strokeWidth="1.2" />
              <line x1="148" y1="110" x2="164" y2="155" stroke="#35F1A0" strokeWidth="1.2" />
              <line x1="100" y1="130" x2="72"  y2="200" stroke="#C8F135" strokeWidth="1.5" />
              <line x1="100" y1="130" x2="128" y2="200" stroke="#C8F135" strokeWidth="1.5" />
              <line x1="72"  y1="200" x2="64"  y2="280" stroke="#6B7280" strokeWidth="1.2" />
              <line x1="128" y1="200" x2="136" y2="280" stroke="#6B7280" strokeWidth="1.2" />
              {[[100,30],[100,70],[52,110],[148,110],[100,130],[36,155],[164,155],[72,200],[128,200],[64,280],[136,280]].map(([cx,cy],i) => (
                <circle key={i} cx={cx} cy={cy} r="4" fill="#C8F135" opacity="0.8" />
              ))}
              <path d="M 68 95 A 20 20 0 0 1 100 68" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />
              <text x="58" y="88" fill="#F59E0B" fontSize="10" fontFamily="monospace">47°</text>
            </svg>
            <div className="lp-posture-badge">
              <div className="lp-badge-dot" />
              <div className="lp-badge-text">
                <strong>Posture Alert</strong>
                Spine angle is off — straighten your back
              </div>
            </div>
          </div>

          <div className="lp-posture-content">
            <div className="lp-section-tag">Posture AI</div>
            <h2 className="lp-section-title" style={{ marginBottom: 24 }}>
              Your form,<br /><em>analysed live.</em>
            </h2>
            <p>
              FitCore uses your webcam and MediaPipe to extract 33 body keypoints in real time.
              Custom angle calculation detects deviations in your squat, deadlift, or shoulder press —
              and alerts you before bad form becomes injury.
            </p>
            <div className="lp-angle-list">
              {angles.map((a) => (
                <div className="lp-angle-item" key={a.name}>
                  <span className="lp-angle-name">{a.name}</span>
                  <span className={`lp-angle-val ${a.status}`}>{a.val}</span>
                  <span className={`lp-angle-status ${a.status}`}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-cta">
          <h2 className="lp-cta-title">Start your<br /><span>first week free.</span></h2>
          <p className="lp-cta-sub">No credit card. No personal trainer. Just results.</p>
          <form className="lp-cta-form" onSubmit={handleCTA}>
            <input
              className="lp-email-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="lp-btn-primary" type="submit">Get Access</button>
          </form>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-footer-logo">FIT<span>CORE</span></div>
          <div className="lp-footer-copy">© 2025 FitCore. Built for beginners.</div>
          <div className="lp-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </footer>

      </div>

      {showAuthPanel && (
        <div className="lp-auth-backdrop" onClick={closeAuthPanel}>
          <div className="lp-auth-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lp-auth-panel-header">
              <div>
                <div className="lp-auth-panel-title">
                  {authMode === "signup" ? "Create your account" : "Sign in to FitCore"}
                </div>
                <div className="lp-auth-panel-sub">
                  {authMode === "signup"
                    ? "Fill in your details and start building your habit."
                    : "Enter your email and password to continue."}
                </div>
              </div>
              <button className="lp-auth-close" type="button" onClick={closeAuthPanel}>✕</button>
            </div>

            <div className="lp-auth-tab-list">
              <button
                type="button"
                className={`lp-auth-tab ${authMode === "signup" ? "active" : ""}`}
                onClick={() => setAuthMode("signup")}
              >
                Sign Up
              </button>
              <button
                type="button"
                className={`lp-auth-tab ${authMode === "login" ? "active" : ""}`}
                onClick={() => setAuthMode("login")}
              >
                Sign In
              </button>
            </div>

            <form className="lp-auth-form" onSubmit={handleAuthSubmit} noValidate>
              {authMode === "signup" && (
                <div className="lp-auth-field">
                  <label className="lp-auth-label" htmlFor="auth-name">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    className="lp-auth-input"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="John Doe"
                  />
                  {authErrors.name && <div className="lp-auth-error">{authErrors.name}</div>}
                </div>
              )}

              <div className="lp-auth-field">
                <label className="lp-auth-label" htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  className="lp-auth-input"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@email.com"
                />
                {authErrors.email && <div className="lp-auth-error">{authErrors.email}</div>}
              </div>

              <div className="lp-auth-field">
                <label className="lp-auth-label" htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  className="lp-auth-input"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                />
                {authErrors.password && <div className="lp-auth-error">{authErrors.password}</div>}
              </div>

              {authMode === "signup" && (
                <div className="lp-auth-field">
                  <label className="lp-auth-label" htmlFor="auth-confirm">Confirm password</label>
                  <input
                    id="auth-confirm"
                    type="password"
                    className="lp-auth-input"
                    value={authConfirm}
                    onChange={(e) => setAuthConfirm(e.target.value)}
                    placeholder="••••••••"
                  />
                  {authErrors.confirm && <div className="lp-auth-error">{authErrors.confirm}</div>}
                </div>
              )}

              <button className="lp-auth-submit" type="submit" disabled={authLoading}>
                {authLoading ? "Working..." : authMode === "signup" ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="lp-auth-helper">
              {authMode === "signup" ? (
                <>Already have an account? <button className="lp-auth-link" type="button" onClick={() => setAuthMode("login")}>Sign in</button>.</>
              ) : (
                <>Need an account? <button className="lp-auth-link" type="button" onClick={() => setAuthMode("signup")}>Sign up</button>.</>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}