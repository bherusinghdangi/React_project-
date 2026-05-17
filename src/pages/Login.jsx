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
    --display: 'Barlow Condensed', sans-serif;
    --body:    'DM Sans', sans-serif;
  }

  .auth-root {
    background: var(--bg);
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: var(--body);
    color: var(--text);
  }

  /* LEFT PANEL */
  .auth-left {
    position: relative;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    overflow: hidden;
  }
  .auth-left-grid {
    position: absolute; inset: 0; opacity: 0.05;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }
  .auth-left-glow {
    position: absolute; bottom: -120px; left: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(200,241,53,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .auth-logo {
    font-family: var(--display);
    font-size: 20px; font-weight: 800; letter-spacing: 2px;
    color: var(--text); text-decoration: none; position: relative; z-index: 1;
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
    font-family: var(--display);
    font-size: clamp(48px, 5vw, 72px);
    font-weight: 900; line-height: 0.92;
    text-transform: uppercase; margin-bottom: 20px;
  }
  .auth-left-title span { color: var(--accent); display: block; }
  .auth-left-sub {
    font-size: 14px; line-height: 1.75; color: var(--muted);
    font-weight: 300; max-width: 340px;
  }

  .auth-left-stats {
    display: flex; gap: 40px; position: relative; z-index: 1;
    padding-top: 32px; border-top: 1px solid var(--border);
  }
  .auth-stat-num {
    font-family: var(--display); font-size: 32px; font-weight: 800;
    color: var(--text); line-height: 1; margin-bottom: 2px;
  }
  .auth-stat-num em { font-style: normal; color: var(--accent); }
  .auth-stat-label { font-size: 11px; color: var(--muted); letter-spacing: 0.3px; }

  /* RIGHT PANEL */
  .auth-right {
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    padding: 48px;
  }
  .auth-form-wrap { width: 100%; max-width: 400px; }

  .auth-form-title {
    font-family: var(--display);
    font-size: 36px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.5px;
    margin-bottom: 6px;
  }
  .auth-form-sub {
    font-size: 14px; color: var(--muted); font-weight: 300;
    margin-bottom: 36px;
  }
  .auth-form-sub a { color: var(--accent); text-decoration: none; }
  .auth-form-sub a:hover { text-decoration: underline; }

  .auth-field { margin-bottom: 20px; }
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
  .auth-input.error { border-color: var(--error); }

  .auth-input-wrap { position: relative; }
  .auth-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 16px; padding: 4px;
    transition: color 0.2s;
  }
  .auth-eye:hover { color: var(--text); }

  .auth-error-msg {
    font-size: 12px; color: var(--error); margin-top: 6px;
  }

  .auth-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px;
  }
  .auth-remember { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .auth-checkbox {
    width: 16px; height: 16px; border-radius: 3px;
    border: 1px solid var(--border); background: var(--surface);
    appearance: none; cursor: pointer; position: relative;
    transition: border-color 0.2s, background 0.2s;
  }
  .auth-checkbox:checked { background: var(--accent); border-color: var(--accent); }
  .auth-checkbox:checked::after {
    content: ''; position: absolute; left: 4px; top: 1px;
    width: 5px; height: 9px; border: 2px solid #0a0a0a;
    border-top: none; border-left: none;
    transform: rotate(45deg);
  }
  .auth-remember-label { font-size: 13px; color: var(--muted); }
  .auth-forgot { font-size: 13px; color: var(--accent); text-decoration: none; }
  .auth-forgot:hover { text-decoration: underline; }

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

  .auth-divider {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 20px;
  }
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
  .auth-google-icon { width: 18px; height: 18px; }

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
    .auth-right { padding: 40px 24px; justify-content: flex-start; padding-top: 80px; }
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim())               e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)                   e.password = "Password is required";
    else if (form.password.length < 6)    e.password = "Minimum 6 characters";
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
    // TODO: replace with Firebase signInWithEmailAndPassword
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/dashboard");
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
              Welcome back
            </div>
            <h2 className="auth-left-title">
              Good to<br /><span>see you.</span>
            </h2>
            <p className="auth-left-sub">
              Log back in to check today's nutrition targets,
              continue your workout streak, and see your posture scores.
            </p>
          </div>

          <div className="auth-left-stats">
            <div>
              <div className="auth-stat-num">0<em>₹</em></div>
              <div className="auth-stat-label">Forever free</div>
            </div>
            <div>
              <div className="auth-stat-num">3<em>+</em></div>
              <div className="auth-stat-label">AI-powered tools</div>
            </div>
            <div>
              <div className="auth-stat-num">Real<em>-</em>time</div>
              <div className="auth-stat-label">Posture feedback</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h1 className="auth-form-title">Sign In</h1>
            <p className="auth-form-sub">
              Don't have an account?{" "}
              <Link to="/signup">Create one free</Link>
            </p>

            <form onSubmit={handleSubmit} noValidate>

              <div className="auth-field">
                <label className="auth-label" htmlFor="email">Email</label>
                <input
                  id="email" type="email" className={`auth-input ${errors.email ? "error" : ""}`}
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
                    className={`auth-input ${errors.password ? "error" : ""}`}
                    placeholder="••••••••"
                    value={form.password} onChange={handleChange("password")}
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPass((p) => !p)}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.password && <div className="auth-error-msg">{errors.password}</div>}
              </div>

              <div className="auth-row">
                <label className="auth-remember">
                  <input
                    type="checkbox" className="auth-checkbox"
                    checked={remember} onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="auth-remember-label">Remember me</span>
                </label>
                <a href="#" className="auth-forgot">Forgot password?</a>
              </div>

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading && <span className="auth-spinner" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="auth-divider">
                <div className="auth-divider-line" />
                <span className="auth-divider-text">or</span>
                <div className="auth-divider-line" />
              </div>

              <button type="button" className="auth-google">
                <svg className="auth-google-icon" viewBox="0 0 24 24">
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