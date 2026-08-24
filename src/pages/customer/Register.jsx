import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "@/api/authApi";
import { useToast } from "@/context/ToastContext";

const EMPTY = { firstName: "", lastName: "", email: "", password: "" };

export default function Register() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Required";
    if (!form.lastName.trim()) next.lastName = "Required";
    if (!form.email.trim()) next.email = "Required";
    if (!form.password || form.password.length < 6) next.password = "At least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await authApi.register(form);
      toast.success("Account created — please log in");
      navigate("/login");
    } catch (err) {
      setFormError(err.friendlyMessage || "Couldn't create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell max-w-md py-12 sm:py-20">
      <h1 className="text-2xl font-display font-bold mb-1">Create your account</h1>
      <p className="text-sm text-ink-soft mb-8">It only takes a minute.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && <div className="rounded bg-danger-light text-danger text-sm px-3.5 py-2.5">{formError}</div>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="firstName">First name</label>
            <input
              id="firstName"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className={`input ${errors.firstName ? "input-error" : ""}`}
            />
            {errors.firstName && <p className="error-text">{errors.firstName}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className={`input ${errors.lastName ? "input-error" : ""}`}
            />
            {errors.lastName && <p className="error-text">{errors.lastName}</p>}
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={`input ${errors.email ? "input-error" : ""}`}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className={`input ${errors.password ? "input-error" : ""}`}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        <button type="submit" disabled={submitting} className="btn-primary btn-full">
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
