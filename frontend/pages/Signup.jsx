import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { registerUser } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) return setError("Fill in all fields.");
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setError("");
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      navigate("/login");
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
        <h1>Make room for what matters.</h1>
        <p className="auth-sub">Create your TaskFlow account to get started.</p>

        <label htmlFor="name">Full name</label>
        <input id="name" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} />

        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />

        <label htmlFor="password">Password</label>
        <div className="password-wrap">
          <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" value={form.password} onChange={handleChange} />
          <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <label htmlFor="confirm">Confirm password</label>
        <input id="confirm" name="confirm" type="password" placeholder="Enter your password again" value={form.confirm} onChange={handleChange} />

        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn-primary full" disabled={loading}>{loading ? "Creating account..." : <>Create account <ArrowRight size={13} /></>}</button>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
      <p className="auth-footer">Less noise. More focus.</p>
    </div>
  );
}
