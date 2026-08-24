import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="shell py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <span className="font-display font-bold text-lg text-ink">
            Shop<span className="text-primary">Cart</span>
          </span>
          <p className="text-sm text-ink-soft mt-2 leading-relaxed">
            Considered goods, delivered without the runaround.
          </p>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-3">Shop</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="text-ink-soft hover:text-ink">All products</Link></li>
            <li><Link to="/" className="text-ink-soft hover:text-ink">Home</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-3">Account</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/orders" className="text-ink-soft hover:text-ink">My orders</Link></li>
            <li><Link to="/profile" className="text-ink-soft hover:text-ink">Profile</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-3">Help</h5>
          <ul className="space-y-2 text-sm">
            <li><span className="text-ink-soft">Shipping & returns</span></li>
            <li><span className="text-ink-soft">Contact us</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4">
        <p className="shell text-xs text-ink-faint">© {new Date().getFullYear()} ShopCart. All rights reserved.</p>
      </div>
    </footer>
  );
}
