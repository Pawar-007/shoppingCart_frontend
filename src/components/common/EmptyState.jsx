import { PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({
  icon: Icon = PackageSearch,
  title = "Nothing here yet",
  message,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="h-14 w-14 rounded-full bg-primary-light flex items-center justify-center mb-4">
        <Icon size={26} className="text-primary" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      {message && <p className="text-sm text-ink-soft max-w-sm mb-5">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
