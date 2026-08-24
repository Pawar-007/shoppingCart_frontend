import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import authApi from "@/api/authApi";
import { useToast } from "@/context/ToastContext";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  function validate() {
    const next = {};
    if (!form.currentPassword) next.currentPassword = "Required";
    if (!form.newPassword || form.newPassword.length < 6) next.newPassword = "At least 6 characters";
    if (form.confirmPassword !== form.newPassword) next.confirmPassword = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await authApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password updated");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell py-8 max-w-md">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-6">
        <ChevronLeft size={15} /> Back to profile
      </Link>
      <h2 className="text-xl font-display font-semibold mb-6">Change password</h2>

      <form onSubmit={handleSubmit} noValidate className="card card-pad space-y-4">
        <div>
          <label className="field-label" htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
            className={`input ${errors.currentPassword ? "input-error" : ""}`}
          />
          {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
            className={`input ${errors.newPassword ? "input-error" : ""}`}
          />
          {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            className={`input ${errors.confirmPassword ? "input-error" : ""}`}
          />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" disabled={submitting} className="btn-primary btn-full">
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
