import { useEffect, useState } from "react";
import { PackageSearch } from "lucide-react";
import orderApi from "@/api/orderApi";
import OrderCard from "@/components/order/OrderCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useToast } from "@/context/ToastContext";

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const toast = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await orderApi.active();
      setOrders(data || []);
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel() {
    setCancelling(true);
    try {
      await orderApi.cancel(cancelTarget.orderId);
      toast.success("Order cancelled successfully");
      setCancelTarget(null);
      await load();
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="shell py-8 max-w-3xl">
      <div className="shelf-heading">
        <h2>Active orders</h2>
      </div>

      {loading && <LoadingSpinner label="Loading orders" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && orders.length === 0 && (
        <EmptyState icon={PackageSearch} title="No active orders" message="Orders in progress will show up here." />
      )}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.orderId} order={order} onCancel={setCancelTarget} cancelling={cancelling} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel this order?"
        message={`Order #${cancelTarget?.orderId} will be cancelled. This can't be undone.`}
        confirmLabel="Cancel order"
        danger
        loading={cancelling}
      />
    </div>
  );
}
