import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="shell py-24 text-center">
      <p className="font-display font-bold text-6xl text-primary-light mb-2">404</p>
      <h1 className="text-xl font-display font-semibold text-ink mb-2">Page not found</h1>
      <p clas="text-sm text-ink-soft mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  );
}
