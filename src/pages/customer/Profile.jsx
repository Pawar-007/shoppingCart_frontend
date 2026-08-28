// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { KeyRound, MapPin } from "lucide-react";
// import authApi from "@/api/authApi";
// import LoadingSpinner from "@/components/common/LoadingSpinner";
// import ErrorState from "@/components/common/ErrorState";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/context/ToastContext";

// export default function Profile() {
//   const { updateLocalUser } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const toast = useToast();

//   async function load() {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await authApi.getProfile();
//       setProfile(data);
//       setForm({
//         firstName: data.firstName || "",
//         lastName: data.lastName || "",
//         email: data.email || "",
//         phone: data.phone || "",
//       });
//     } catch (err) {
//       setError(err.friendlyMessage);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const updated = await authApi.updateProfile(form);
//       updateLocalUser({ firstName: form.firstName, email: form.email });
//       setProfile(updated || { ...profile, ...form });
//       toast.success("Profile updated");
//     } catch (err) {
//       toast.error(err.friendlyMessage);
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) return <LoadingSpinner label="Loading profile" />;
//   if (error) return <ErrorState message={error} onRetry={load} />;

//   return (
//     <div className="shell py-8 max-w-2xl">
//       <div className="shelf-heading">
//         <h2>Profile</h2>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-3 mb-8">
//         <Link to="/orders" className="btn-secondary">My orders</Link>
//         <Link to="/addresses" className="btn-secondary"><MapPin size={15} /> Addresses</Link>
//         <Link to="/change-password" className="btn-secondary"><KeyRound size={15} /> Change password</Link>
//       </div>

//       <form onSubmit={handleSubmit} className="card card-pad space-y-4">
//         <h3 className="text-sm font-semibold">Personal information</h3>
//         <div className="grid sm:grid-cols-2 gap-4">
//           <div>
//             <label className="field-label" htmlFor="firstName">First name</label>
//             <input
//               id="firstName"
//               value={form.firstName}
//               onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
//               className="input"
//             />
//           </div>
//           <div>
//             <label className="field-label" htmlFor="lastName">Last name</label>
//             <input
//               id="lastName"
//               value={form.lastName}
//               onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
//               className="input"
//             />
//           </div>
//         </div>
//         <div>
//           <label className="field-label" htmlFor="email">Email</label>
//           <input
//             id="email"
//             type="email"
//             value={form.email}
//             onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
//             className="input"
//           />
//         </div>
//         <div>
//           <label className="field-label" htmlFor="phone">Phone</label>
//           <input
//             id="phone"
//             value={form.phone}
//             onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
//             className="input"
//           />
//         </div>
//         <button type="submit" disabled={saving} className="btn-primary">
//           {saving ? "Saving…" : "Save changes"}
//         </button>
//       </form>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  KeyRound,
  MapPin,
  ShoppingBag,
  UserRound,
  Mail,
  Phone,
  ChevronRight,
  ShieldCheck,
  Pencil,
} from "lucide-react";

import authApi from "@/api/authApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Profile() {
  const { updateLocalUser } = useAuth();

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

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

      updateLocalUser({
        firstName: form.firstName,
        email: form.email,
      });

      setProfile(updated || { ...profile, ...form });

      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading profile" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  const fullName =
    `${form.firstName} ${form.lastName}`.trim() || "ShopCart User";

  const initials =
    `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase() ||
    "U";

  return (
    <div className="shell py-5 sm:py-8 max-w-5xl">

      {/* ================= HEADER ================= */}

      <div className="mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm text-ink-soft mb-1">
          Account
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-ink">
          My Profile
        </h2>

        <p className="text-sm text-ink-soft mt-1 max-w-xl">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* ================= PROFILE HERO ================= */}

      <div className="card overflow-hidden mb-5 sm:mb-6">

        <div className="p-4 sm:p-6 lg:p-8">

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">

            {/* Avatar */}
            <div
              className="
                w-16 h-16
                sm:w-20 sm:h-20
                rounded-2xl
                flex items-center justify-center
                text-xl sm:text-2xl
                font-bold
                bg-primary
                text-white
                shadow-sm
                shrink-0
              "
            >
              {initials}
            </div>

            {/* User Information */}
            <div className="flex-1 min-w-0">

              <div className="flex items-center gap-2 min-w-0">

                <h1 className="text-lg sm:text-2xl font-bold text-ink truncate">
                  {fullName}
                </h1>

                <ShieldCheck
                  size={17}
                  className="text-accent shrink-0"
                />

              </div>

              <p className="text-sm text-ink-soft mt-1 truncate">
                {form.email}
              </p>

              {form.phone && (
                <p className="text-sm text-ink-soft mt-1">
                  {form.phone}
                </p>
              )}

            </div>

            {/* Account Status */}
            <div
              className="
                self-start
                sm:self-center
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-full
                bg-accent-light
                text-accent
                text-xs
                font-semibold
                whitespace-nowrap
              "
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              Active account
            </div>

          </div>

        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <div className="border-t border-border bg-surface-soft p-3 sm:p-4">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">

            <QuickAction
              to="/orders"
              icon={ShoppingBag}
              title="My Orders"
              description="Track your orders"
            />

            <QuickAction
              to="/addresses"
              icon={MapPin}
              title="Addresses"
              description="Manage saved addresses"
            />

            <QuickAction
              to="/change-password"
              icon={KeyRound}
              title="Password"
              description="Update your password"
            />

          </div>

        </div>

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

        {/* ================= PERSONAL INFORMATION ================= */}

        <div className="lg:col-span-2">

          <form
            onSubmit={handleSubmit}
            className="card card-pad"
          >

            {/* Section Header */}

            <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">

              <div className="min-w-0">

                <h3 className="text-base sm:text-lg font-semibold text-ink">
                  Personal information
                </h3>

                <p className="text-xs sm:text-sm text-ink-soft mt-1">
                  Keep your account details up to date.
                </p>

              </div>

              <div
                className="
                  w-9 h-9
                  sm:w-10 sm:h-10
                  rounded-xl
                  bg-primary/10
                  flex items-center justify-center
                  shrink-0
                "
              >
                <Pencil
                  size={16}
                  className="text-primary"
                />
              </div>

            </div>

            {/* Fields */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

              <ProfileField
                label="First name"
                icon={UserRound}
                value={form.firstName}
                onChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    firstName: value,
                  }))
                }
              />

              <ProfileField
                label="Last name"
                icon={UserRound}
                value={form.lastName}
                onChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    lastName: value,
                  }))
                }
              />

              <ProfileField
                label="Email address"
                icon={Mail}
                type="email"
                value={form.email}
                onChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    email: value,
                  }))
                }
              />

              <ProfileField
                label="Phone number"
                icon={Phone}
                type="tel"
                value={form.phone}
                onChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    phone: value,
                  }))
                }
              />

            </div>

            {/* Save */}

            <div
              className="
                mt-6
                pt-5
                border-t
                border-border
                flex
                flex-col-reverse
                sm:flex-row
                sm:justify-end
                gap-3
              "
            >

              <button
                type="submit"
                disabled={saving}
                className="
                  btn-primary
                  w-full
                  sm:w-auto
                  min-w-32
                "
              >
                {saving ? "Saving…" : "Save changes"}
              </button>

            </div>

          </form>

        </div>

        {/* ================= ACCOUNT OVERVIEW ================= */}

        <div>

          <div className="card card-pad">

            <h3 className="text-base sm:text-lg font-semibold text-ink">
              Account overview
            </h3>

            <p className="text-xs sm:text-sm text-ink-soft mt-1 mb-4 sm:mb-5">
              Quick access to your account.
            </p>

            <div className="space-y-1">

              <OverviewItem
                icon={ShoppingBag}
                title="My orders"
                description="View your purchases"
                to="/orders"
              />

              <OverviewItem
                icon={MapPin}
                title="Saved addresses"
                description="Manage delivery addresses"
                to="/addresses"
              />

              <OverviewItem
                icon={KeyRound}
                title="Security"
                description="Change your password"
                to="/change-password"
              />

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}


/* =========================================================
   PROFILE FIELD
========================================================= */

function ProfileField({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className="min-w-0">

      <label className="field-label">
        {label}
      </label>

      <div className="relative">

        <Icon
          size={16}
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-ink-soft
            pointer-events-none
          "
        />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input pl-10 w-full"
        />

      </div>

    </div>
  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="
        group
        flex
        items-center
        gap-3
        rounded-xl
        p-3
        bg-white
        border
        border-border
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-sm
        active:scale-[0.99]
      "
    >

      <div
        className="
          w-10
          h-10
          rounded-xl
          bg-primary/10
          text-primary
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-semibold text-ink truncate">
          {title}
        </p>

        <p className="text-xs text-ink-soft mt-0.5 truncate">
          {description}
        </p>

      </div>

      <ChevronRight
        size={16}
        className="
          text-ink-soft
          shrink-0
          transition
          group-hover:translate-x-0.5
        "
      />

    </Link>
  );
}


/* =========================================================
   OVERVIEW ITEM
========================================================= */

function OverviewItem({
  icon: Icon,
  title,
  description,
  to,
}) {
  return (
    <Link
      to={to}
      className="
        group
        flex
        items-center
        gap-3
        p-3
        rounded-xl
        transition
        duration-200
        hover:bg-surface-soft
        active:bg-surface-soft
      "
    >

      <div
        className="
          w-10
          h-10
          rounded-xl
          bg-primary/10
          text-primary
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">

        <p className="text-sm font-semibold text-ink truncate">
          {title}
        </p>

        <p className="text-xs text-ink-soft mt-0.5 truncate">
          {description}
        </p>

      </div>

      <ChevronRight
        size={16}
        className="
          text-ink-soft
          shrink-0
          transition
          group-hover:translate-x-0.5
        "
      />

    </Link>
  );
}