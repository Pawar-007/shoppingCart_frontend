import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, MapPin } from "lucide-react";
import authApi from "@/api/authApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Profile() {
  const { updateLocalUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.getProfile();
      setProfile(data);
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authApi.updateProfile(form);
      updateLocalUser({ firstName: form.firstName, email: form.email });
      setProfile(updated || { ...profile, ...form });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading profile" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="shell py-8 max-w-2xl">
      <div className="shelf-heading">
        <h2>Profile</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Link to="/orders" className="btn-secondary">My orders</Link>
        <Link to="/addresses" className="btn-secondary"><MapPin size={15} /> Addresses</Link>
        <Link to="/change-password" className="btn-secondary"><KeyRound size={15} /> Change password</Link>
      </div>

      <form onSubmit={handleSubmit} className="card card-pad space-y-4">
        <h3 className="text-sm font-semibold">Personal information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="firstName">First name</label>
            <input
              id="firstName"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="input"
            />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">Phone</label>
          <input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="input"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
