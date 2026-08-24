import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.friendlyMessage || "Couldn't log you in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell max-w-md py-12 sm:py-20">
      <h1 className="text-2xl font-display font-bold mb-1">Log in</h1>
      <p className="text-sm text-ink-soft mb-8">Welcome back to ShopCart.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div className="rounded bg-danger-light text-danger text-sm px-3.5 py-2.5">{formError}</div>
        )}
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={`input ${errors.email ? "input-error" : ""}`}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="field-label">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className={`input ${errors.password ? "input-error" : ""}`}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        <button type="submit" disabled={submitting} className="btn-primary btn-full">
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6 text-center">
        New to ShopCart?{" "}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
