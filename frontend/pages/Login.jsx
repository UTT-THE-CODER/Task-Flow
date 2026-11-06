import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return setError("Enter your email and password.");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Enter a valid email address.");
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Check your connection and try again.");
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-logo"><span className="logo-box"><Check size={14} /></span>TaskFlow<span className="dot">.</span></div>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <p className="auth-eyebrow">Your space, a little clearer</p>
        <h1>Welcome back.</h1>
        <p className="auth-sub">A quiet space to organize your work.</p>

        <label htmlFor="email">Email address</label>
        <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <div className="password-wrap">
          <input id="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn-primary full" disabled={loading}>{loading ? "Logging in..." : <>Log in <ArrowRight size={13} /></>}</button>
        <p className="auth-switch">New to TaskFlow? <Link to="/signup">Create an account</Link></p>
      </form>
      <p className="auth-footer">Less noise. More focus.</p>
    </div>
  );
}
