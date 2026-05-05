import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiErrorDetail } from "@/lib/api";
import { ArrowUpRight, Lock } from "@phosphor-icons/react";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/data";

  const [mode, setMode] = useState("login"); // or "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const validate = () => {
    const e = {};
    if (mode === "register" && (!form.name || form.name.trim().length < 2)) e.name = "Enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setServerErr("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShakeKey((k) => k + 1);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      if (mode === "login") await login(form.email.toLowerCase(), form.password);
      else await register(form.name, form.email.toLowerCase(), form.password);
      navigate(from, { replace: true });
    } catch (e) {
      setServerErr(formatApiErrorDetail(e.response?.data?.detail) || e.message);
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  const change = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  return (
    <div data-testid="login-page" className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2">
      {/* Left: form */}
      <div className="p-8 md:p-16 flex items-center">
        <div className="max-w-md w-full mx-auto">
          <p className="overline mb-6">04 / Authentication</p>
          <h1 className="font-display font-black text-5xl md:text-6xl tracking-tighter leading-[0.95]">
            {mode === "login" ? "Enter." : "Register."}
          </h1>
          <p className="mt-4 text-zinc-600">
            {mode === "login"
              ? "Sign in to access the data dashboard."
              : "Create an account to archive records."}
          </p>

          <div className="mt-8 flex border border-zinc-200">
            <button
              type="button"
              data-testid="tab-login"
              onClick={() => setMode("login")}
              className={`flex-1 py-3 font-mono-tech text-xs tracking-[0.2em] uppercase ${mode === "login" ? "bg-[#09090b] text-white" : "hover:bg-zinc-50"}`}
            >
              Login
            </button>
            <button
              type="button"
              data-testid="tab-register"
              onClick={() => setMode("register")}
              className={`flex-1 py-3 font-mono-tech text-xs tracking-[0.2em] uppercase border-l border-zinc-200 ${mode === "register" ? "bg-[#09090b] text-white" : "hover:bg-zinc-50"}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={onSubmit} key={shakeKey} className={`mt-8 space-y-5 ${Object.keys(errors).length || serverErr ? "shake" : ""}`} data-testid="auth-form">
            {mode === "register" && (
              <div>
                <label className="arkiv-label">Full name</label>
                <input
                  data-testid="auth-name"
                  className="arkiv-input"
                  value={form.name}
                  onChange={(e) => change("name", e.target.value)}
                  placeholder="Ada Lovelace"
                />
                {errors.name && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.name}</p>}
              </div>
            )}
            <div>
              <label className="arkiv-label">Email</label>
              <input
                data-testid="auth-email"
                type="email"
                className="arkiv-input"
                value={form.email}
                onChange={(e) => change("email", e.target.value)}
                placeholder="you@university.edu"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.email}</p>}
            </div>
            <div>
              <label className="arkiv-label">Password</label>
              <input
                data-testid="auth-password"
                type="password"
                className="arkiv-input"
                value={form.password}
                onChange={(e) => change("password", e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              {errors.password && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.password}</p>}
            </div>

            {serverErr && (
              <p data-testid="auth-server-err" className="text-sm text-[#FF2400] font-mono-tech">{serverErr}</p>
            )}

            <button type="submit" disabled={loading} className="arkiv-btn w-full" data-testid="auth-submit">
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              <ArrowUpRight size={14} weight="bold" />
            </button>
          </form>

          <div className="mt-8 border border-zinc-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={14} />
              <span className="overline">Demo credentials</span>
            </div>
            <p className="font-mono-tech text-xs text-zinc-600">
              admin@arkiv.edu &nbsp;·&nbsp; Admin@123
            </p>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            ← <Link to="/" className="arkiv-link">Back to home</Link>
          </p>
        </div>
      </div>

      {/* Right: image */}
      <div className="relative hidden md:block border-l border-zinc-200">
        <img
          src="https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Data center"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 h-full flex items-end p-10 text-white">
          <div>
            <div className="overline !text-white/70 mb-3">Control room</div>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl tracking-tighter leading-[0.95]">
              Authenticated sessions. <br />Persistent archives.
            </h2>
            <p className="mt-4 max-w-md text-white/80">
              A secure, cookie-based session carries your identity from Login
              through Data and Contact — exactly what the brief asked for.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
