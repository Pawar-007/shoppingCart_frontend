import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LayoutGrid, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import SearchBar from "@/components/product/SearchBar";

const CUSTOMER_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
];

export default function Navbar() {
  const { isAuthenticated, firstName, role, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-ink-soft hover:text-ink"}`;

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
      <div className="shell flex items-center gap-4 h-16">
        <button
          className="md:hidden p-1.5 -ml-1.5 text-ink"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="font-display font-bold text-lg text-ink tracking-tight shrink-0">
          Shop<span className="text-primary">Cart</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-2">
          {CUSTOMER_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
          {role === "ADMIN" && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden md:block flex-1 max-w-md ml-4">
          <SearchBar compact />
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            className="md:hidden p-2 text-ink-soft"
            aria-label="Search"
            onClick={() => setMobileSearchOpen((v) => !v)}
          >
            <Search size={20} />
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/cart" className="relative p-2 text-ink-soft hover:text-ink" aria-label="Cart">
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 rounded-full bg-primary text-white text-[10px] leading-4 text-center font-medium">
                    {count}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="hidden sm:flex items-center gap-1.5 p-2 text-ink-soft hover:text-ink">
                <User size={18} />
                <span className="text-sm font-medium">{firstName || "Account"}</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost btn-sm hidden sm:inline-flex">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn-primary btn-sm hidden sm:inline-flex">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden shell pb-3">
          <SearchBar compact onClose={() => setMobileSearchOpen(false)} />
        </div>
      )}

      {menuOpen && (
        <nav className="md:hidden shell pb-4 flex flex-col gap-1 border-t border-border pt-3">
          {CUSTOMER_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-2 py-2.5 rounded text-sm font-medium ${isActive ? "bg-primary-light text-primary-dark" : "text-ink-soft"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <>
              <NavLink
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="px-2 py-2.5 rounded text-sm font-medium text-ink-soft"
              >
                My orders
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-2 py-2.5 rounded text-sm font-medium text-ink-soft"
              >
                Profile
              </NavLink>
              {role === "ADMIN" && (
                <NavLink
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2.5 rounded text-sm font-medium text-ink-soft flex items-center gap-1.5"
                >
                  <LayoutGrid size={15} /> Admin dashboard
                </NavLink>
              )}
              <button onClick={handleLogout} className="mt-1 px-2 py-2.5 rounded text-sm font-medium text-danger text-left">
                Log out
              </button>
            </>
          )}
          {!isAuthenticated && (
            <Link to="/register" onClick={() => setMenuOpen(false)} className="px-2 py-2.5 rounded text-sm font-medium text-ink-soft">
              Sign up
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
