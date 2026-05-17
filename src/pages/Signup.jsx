import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    --success: #34D399;
    --display: 'Barlow Condensed', sans-serif;
    --body:    'DM Sans', sans-serif;
  }

  .auth-root {
    background: var(--bg); min-height: 100vh;
    display: grid; grid-template-columns: 1fr 1fr;
    font-family: var(--body); color: var(--text);
  }

  /* LEFT */
  .auth-left {
    position: relative; background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    justify-content: space-between; padding: 48px; overflow: hidden;
  }
  .auth-left-grid {
    position: absolute; inset: 0; opacity: 0.05;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 48px 48px; pointer-events: none;
  }
  .auth-left-glow {
    position: absolute; top: -100px; right: -100px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(200,241,53,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .auth-logo {
    font-family: var(--display); font-size: 20px; font-weight: 800;
    letter-spacing: 2px; color: var(--text); text-decoration: none;
    position: relative; z-index: 1;
  }
  .auth-logo span { color: var(--accent); }

  .auth-left-body { position: relative; z-index: 1; }
  .auth-left-tag {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(200,241,53,0.25); border-radius: 2px;
    padding: 5px 12px; margin-bottom: 24px;
    font-size: 10px; letter-spacing: 2px; font-weight: 500;
    color: var(--accent); text-transform: uppercase;
  }
  .auth-left-tag-dot {
    width: 5px; height: 5px; border-radius: 50%; background: var(--accent);
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .auth-left-title {
    font-family: var(--display); font-size: clamp(48px, 5vw, 72px);
    font-weight: 900; line-height: 0.92;
    text-transform: uppercase; margin-bottom: 20px;
  }
  .auth-left-title span { color: var(--accent); display: block; }
  .auth-left-sub {
    font-size: 14px; line-height: 1.75; color: var(--muted);
    font-weight: 300; max-width: 340px;
  }

  /* perks list */
  .auth-perks { display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 1; }
  .auth-perk { display: flex; align-items: flex-start; gap: 12px; }
  .auth-perk-icon {
    width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0;
    background: rgba(200,241,53,0.1); border: 1px solid rgba(200,241,53,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; margin-top: 1px;
  }
  .auth-perk-title { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .auth-perk-desc  { font-size: 12px; color: var(--muted); font-weight: 300; line-height: 1.5; }

  /* RIGHT */
  .auth-right {
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    padding: 48px; overflow-y: auto;
  }
  .auth-form-wrap { width: 100%; max-width: 400px; }

  .auth-form-title {
    font-family: var(--display); font-size: 36px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;
  }
  .auth-form-sub {
    font-size: 14px; color: var(--muted); font-weight: 300; margin-bottom: 36px;
  }
  .auth-form-sub a { color: var(--accent); text-decoration: none; }
  .auth-form-sub a:hover { text-decoration: underline; }

  .auth-field { margin-bottom: 18px; }
  .auth-label {
    display: block; font-size: 12px; font-weight: 500;
    letter-spacing: 0.5px; color: var(--muted);
    text-transform: uppercase; margin-bottom: 8px;
  }
  .auth-input {
    width: 100%; padding: 14px 16px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; color: var(--text);
    font-family: var(--body); font-size: 14px;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  .auth-input::placeholder { color: var(--muted); }
  .auth-input:focus { border-color: rgba(200,241,53,0.4); background: var(--surface2); }
  .auth-input.has-error { border-color: var(--error); }
  .auth-input.is-valid  { border-color: rgba(52,211,153,0.4); }

  .auth-input-wrap { position: relative; }
  .auth-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 16px; padding: 4px;
    transition: color 0.2s;
  }
  .auth-eye:hover { color: var(--text); }

  .auth-error-msg { font-size: 12px; color: var(--error); margin-top: 6px; }

  /* password strength */
  .auth-strength { margin-top: 10px; }
  .auth-strength-bars { display: flex; gap: 4px; margin-bottom: 6px; }
  .auth-strength-bar {
    flex: 1; height: 3px; border-radius: 2px;
    background: var(--border); transition: background 0.3s;
  }
  .auth-strength-bar.weak   { background: var(--error); }
  .auth-strength-bar.medium { background: #F59E0B; }
  .auth-strength-bar.strong { background: var(--success); }
  .auth-strength-label { font-size: 11px; color: var(--muted); }
  .auth-strength-label.weak   { color: var(--error); }
  .auth-strength-label.medium { color: #F59E0B; }
  .auth-strength-label.strong { color: var(--success); }

  .auth-terms {
    display: flex; align-items: flex-start; gap: 10px;
    margin-bottom: 24px; cursor: pointer;
  }
  .auth-checkbox {
    width: 16px; height: 16px; border-radius: 3px; flex-shrink: 0; margin-top: 2px;
    border: 1px solid var(--border); background: var(--surface);
    appearance: none; cursor: pointer; position: relative;
    transition: border-color 0.2s, background 0.2s;
  }
  .auth-checkbox:checked { background: var(--accent); border-color: var(--accent); }
  .auth-checkbox:checked::after {
    content: ''; position: absolute; left: 4px; top: 1px;
    width: 5px; height: 9px; border: 2px solid #0a0a0a;
    border-top: none; border-left: none; transform: rotate(45deg);
  }
  .auth-terms-text { font-size: 13px; color: var(--muted); line-height: 1.5; }
  .auth-terms-text a { color: var(--accent); text-decoration: none; }

  .auth-submit {
    width: 100%; padding: 15px;
    background: var(--accent); color: #0a0a0a;
    border: none; border-radius: 6px;
    font-family: var(--body); font-size: 14px; font-weight: 500;
    cursor: pointer; letter-spacing: 0.3px;
    transition: opacity 0.2s, transform 0.15s;
    margin-bottom: 20px;
  }
  .auth-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .auth-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .auth-divider-line { flex: 1; height: 1px; background: var(--border); }
  .auth-divider-text { font-size: 12px; color: var(--muted); }

  .auth-google {
    width: 100%; padding: 14px;
    background: transparent; border: 1px solid var(--border);
    border-radius: 6px; color: var(--text);
    font-family: var(--body); font-size: 14px; font-weight: 400;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: border-color 0.2s, background 0.2s;
  }
  .auth-google:hover { border-color: rgba(255,255,255,0.15); background: var(--surface); }

  .auth-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(10,10,10,0.3); border-top-color: #0a0a0a;
    display: inline-block; animation: spin 0.7s linear infinite;
    margin-right: 8px; vertical-align: middle;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .auth-root { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { padding: 40px 24px; justify-content: flex-start; padding-top: 60px; }
  }
`;

const perks = [
  { icon: "◎", title: "Posture correction", desc: "Real-time camera analysis catches bad form before it becomes injury." },
  { icon: "◈", title: "AI meal advisor",    desc: "Tell it what you ate. It tells you what you still need today." },
  { icon: "◇", title: "Progress tracking",  desc: "Weekly charts for calories, protein, and workout frequency." },
];

function getStrength(pw) {
  if (!pw) return { level: 0, label: "", cls: "" };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak",   cls: "weak"   };
  if (score <= 2) return { level: 2, label: "Medium", cls: "medium" };
  return               { level: 3, label: "Strong", cls: "strong" };
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                    e.name     = "Full name is required";
    if (!form.email.trim())                   e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email  = "Enter a valid email";
    if (!form.password)                       e.password = "Password is required";
    else if (form.password.length < 6)        e.password = "Minimum 6 characters";
    if (form.confirm !== form.password)       e.confirm  = "Passwords do not match";
    if (!agreed)                              e.terms    = "You must agree to continue";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // TODO: replace with Firebase createUserWithEmailAndPassword
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/onboarding");
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-root">

        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-left-grid" />
          <div className="auth-left-glow" />
          <Link to="/" className="auth-logo">FIT<span>CORE</span></Link>

          <div className="auth-left-body">
            <div className="auth-left-tag">
              <div className="auth-left-tag-dot" />
              Start for free
            </div>
            <h2 className="auth-left-title">
              Build the<br /><span>habit.</span>
            </h2>
            <p className="auth-left-sub" style={{ marginBottom: 36 }}>
              Everything a gym beginner needs —
              posture coaching, meal tracking, and progress analytics.
              All in one place, all powered by AI.
            </p>
          </div>

          <div className="auth-perks">
            {perks.map((p) => (
              <div className="auth-perk" key={p.title}>
                <div className="auth-perk-icon">{p.icon}</div>
                <div>
                  <div className="auth-perk-title">{p.title}</div>
                  <div className="auth-perk-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-sub">
              Already have one?{" "}
              <Link to="/login">Sign in</Link>
            </p>

            <form onSubmit={handleSubmit} noValidate>

              <div className="auth-field">
                <label className="auth-label" htmlFor="name">Full Name</label>
                <input
                  id="name" type="text"
                  className={`auth-input ${errors.name ? "has-error" : form.name ? "is-valid" : ""}`}
                  placeholder="John Doe"
                  value={form.name} onChange={handleChange("name")}
                  autoComplete="name"
                />
                {errors.name && <div className="auth-error-msg">{errors.name}</div>}
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="email">Email</label>
                <input
                  id="email" type="email"
                  className={`auth-input ${errors.email ? "has-error" : form.email ? "is-valid" : ""}`}
                  placeholder="you@email.com"
                  value={form.email} onChange={handleChange("email")}
                  autoComplete="email"
                />
                {errors.email && <div className="auth-error-msg">{errors.email}</div>}
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="password">Password</label>
                <div className="auth-input-wrap">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    className={`auth-input ${errors.password ? "has-error" : ""}`}
                    placeholder="••••••••"
                    value={form.password} onChange={handleChange("password")}
                    autoComplete="new-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPass((p) => !p)}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
                {form.password && (
                  <div className="auth-strength">
                    <div className="auth-strength-bars">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`auth-strength-bar ${i <= strength.level ? strength.cls : ""}`}
                        />
                      ))}
                    </div>
                    <span className={`auth-strength-label ${strength.cls}`}>
                      {strength.label} password
                    </span>
                  </div>
                )}
                {errors.password && <div className="auth-error-msg">{errors.password}</div>}
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="confirm">Confirm Password</label>
                <div className="auth-input-wrap">
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    className={`auth-input ${errors.confirm ? "has-error" : form.confirm && form.confirm === form.password ? "is-valid" : ""}`}
                    placeholder="••••••••"
                    value={form.confirm} onChange={handleChange("confirm")}
                    autoComplete="new-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowConfirm((p) => !p)}>
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.confirm && <div className="auth-error-msg">{errors.confirm}</div>}
              </div>

              <label className="auth-terms">
                <input
                  type="checkbox" className="auth-checkbox"
                  checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, terms: "" })); }}
                />
                <span className="auth-terms-text">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && <div className="auth-error-msg" style={{ marginTop: -16, marginBottom: 16 }}>{errors.terms}</div>}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading && <span className="auth-spinner" />}
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <div className="auth-divider">
                <div className="auth-divider-line" />
                <span className="auth-divider-text">or</span>
                <div className="auth-divider-line" />
              </div>

              <button type="button" className="auth-google">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

            </form>
          </div>
        </div>

      </div>
    </>
  );
}