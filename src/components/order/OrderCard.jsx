import { Link } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";

const CANCELLABLE_STATUSES = ["PENDING", "PROCESSING"];

export default function OrderCard({ order, onCancel, cancelling }) {
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <div className="card card-pad flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
          <span className="text-sm font-semibold text-ink">Order #{order.orderId}</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-xs text-ink-soft">{formatDate(order.orderDate || order.createdAt)}</p>
      </div>

      <div className="text-sm price text-ink sm:text-right shrink-0">
        {formatCurrency(order.totalAmount ?? order.total)}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link to={`/orders/${order.orderId}`} className="btn-secondary btn-sm">
          View details
        </Link>
        {canCancel && (
          <button
            onClick={() => onCancel?.(order)}
            disabled={cancelling}
            className="btn-ghost btn-sm !text-danger hover:!bg-danger-light"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
