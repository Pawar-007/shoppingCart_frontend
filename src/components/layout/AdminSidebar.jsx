import { NavLink,Link } from "react-router-dom";
import { LayoutDashboard, Users, Package, FolderTree, Tag, ClipboardList, X } from "lucide-react";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/brands", label: "Brands", icon: Tag },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export default function AdminSidebar({ open, onClose }) {
  const content = (
    <nav className="flex flex-col gap-1 p-4">
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <span className="font-display font-bold text-ink">Admin</span>
        <button onClick={onClose} aria-label="Close menu" className="p-1.5 text-ink-soft">
          <X size={20} />
        </button>
      </div>
      {LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
              isActive ? "bg-primary-light text-primary-dark" : "text-ink-soft hover:bg-bg hover:text-ink"
            }`
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}

    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 border-r border-border bg-surface">{content}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-surface shadow-elevated overflow-y-auto">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
