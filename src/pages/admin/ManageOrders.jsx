import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import adminApi from "@/api/adminApi";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { formatCurrency, formatDate } from "@/utils/formatters";

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingChange, setPendingChange] = useState(null); // { order, status }
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getOrders();
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

  async function confirmStatusChange() {
    setUpdating(true);
    try {
      await adminApi.updateOrderStatus(pendingChange.order.orderId, pendingChange.status);
      toast.success("Order status updated");
      setPendingChange(null);
      await load();
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <div className="shelf-heading">
        <h2>Orders</h2>
      </div>

      {loading && <LoadingSpinner label="Loading orders" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && orders.length === 0 && (
        <EmptyState icon={ClipboardList} title="No orders yet" />
      )}
      {!loading && !error && orders.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td className="px-5 py-3.5 text-ink font-medium">#{order.orderId}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{formatDate(order.orderDate || order.createdAt)}</td>
                  <td className="px-5 py-3.5 price text-ink">{formatCurrency(order.totalAmount ?? order.total)}</td>
                  <td className="px-5 py-3.5"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => setPendingChange({ order, status: e.target.value })}
                        className="select !py-1.5 !text-xs w-36"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Link to={`/orders/${order.orderId}`} className="btn-ghost btn-sm">View</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingChange)}
        onClose={() => setPendingChange(null)}
        onConfirm={confirmStatusChange}
        title="Update order status?"
        message={`Order #${pendingChange?.order?.orderId} will be marked as ${pendingChange?.status}.`}
        confirmLabel="Update status"
        loading={updating}
      />
    </div>
  );
}
