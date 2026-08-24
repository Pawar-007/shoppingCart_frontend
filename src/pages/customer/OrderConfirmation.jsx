import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import orderApi from "@/api/orderApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <LoadingSpinner label="Loading order" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!order) return null;

  return (
    <div className="shell max-w-lg py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={32} className="text-primary" />
      </div>
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Order placed successfully</h1>
      <p className="text-sm text-ink-soft mb-8">Thanks — we're getting your order ready.</p>

      <div className="card card-pad text-left space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Order ID</span>
          <span className="font-medium text-ink">#{order.orderId ?? order.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Order date</span>
          <span className="font-medium text-ink">{formatDate(order.orderDate || order.createdAt)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Total amount</span>
          <span className="price font-medium text-ink">{formatCurrency(order.totalAmount ?? order.total)}</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-ink-soft">Status</span>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-7">
        <Link to={`/orders/${order.orderId ?? order.id}`} className="btn-secondary flex-1">
          View order
        </Link>
        <Link to="/orders" className="btn-secondary flex-1">
          My orders
        </Link>
        <Link to="/products" className="btn-primary flex-1">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
