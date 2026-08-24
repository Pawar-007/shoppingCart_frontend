import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import orderApi from "@/api/orderApi";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { formatCurrency, formatDate } from "@/utils/formatters";

const CANCELLABLE_STATUSES = ["PENDING", "PROCESSING"];

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await orderApi.getOne(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function handleCancel() {
    setCancelling(true);
    try {
      await orderApi.cancel(orderId);
      toast.success("Order cancelled successfully");
      setConfirmOpen(false);
      await load();
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading order" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!order) return null;

  const address = order.address || order.deliveryAddress;
  const items = order.items || order.orderItems || [];
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <div className="shell py-8 max-w-3xl">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-6">
        <ChevronLeft size={15} /> Back
      </button>

      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <h1 className="font-display font-bold text-xl">Order #{order.orderId}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="card card-pad">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">Order info</h3>
          <p className="text-sm text-ink-soft">Date: <span className="text-ink">{formatDate(order.orderDate || order.createdAt)}</span></p>
          <p className="text-sm text-ink-soft mt-1">
            Total: <span className="price text-ink">{formatCurrency(order.totalAmount ?? order.total)}</span>
          </p>
        </div>
        {address && (
          <div className="card card-pad">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">Delivery address</h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              {address.fullName || address.name}<br />
              {address.line1 || address.addressLine1}
              {address.line2 || address.addressLine2 ? `, ${address.line2 || address.addressLine2}` : ""}<br />
              {address.city}, {address.state} {address.postalCode || address.zipCode}
            </p>
          </div>
        )}
      </div>

      <div className="card card-pad">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-3">Items</h3>
        <div className="divide-y divide-border">
          {items.map((item, i) => {
            const product = item.product || item;
            return (
              <div key={product.productId ?? i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="h-14 w-14 rounded bg-bg overflow-hidden shrink-0">
                  {product.images?.[0] || product.imageUrl ? (
                    <img src={product.images?.[0] || product.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink line-clamp-1">{product.name}</p>
                  <p className="text-xs text-ink-soft">Qty {item.quantity} · {formatCurrency(product.price)} each</p>
                </div>
                <span className="price text-sm">{formatCurrency((product.price || 0) * item.quantity)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {canCancel && (
        <button onClick={() => setConfirmOpen(true)} className="btn-danger mt-6">
          Cancel order
        </button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleCancel}
        title="Cancel this order?"
        message="This can't be undone."
        confirmLabel="Cancel order"
        danger
        loading={cancelling}
      />
    </div>
  );
}
