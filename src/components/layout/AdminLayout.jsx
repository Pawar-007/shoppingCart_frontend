import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, ArrowLeft } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg">
      <AdminSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 bg-surface border-b border-border h-14 flex items-center gap-3 px-4">
          <button onClick={() => setDrawerOpen(true)} aria-label="Open admin menu" className="p-1.5 text-ink">
            <Menu size={20} />
          </button>
          <span className="font-display font-semibold text-sm">Admin</span>
          <Link to="/" className="ml-auto text-xs text-ink-soft flex items-center gap-1">
            <ArrowLeft size={13} /> Back to store
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
