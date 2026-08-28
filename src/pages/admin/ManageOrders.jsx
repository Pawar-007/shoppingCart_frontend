import { useEffect, useMemo, useState } from "react";
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

// Tab config — order here decides tab order in the UI. "ALL" is a special
// case: no filter applied, shows everything.
const TABS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "OUT_FOR_DELIVERY", label: "OUT_FOR_DELIVERY" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingChange, setPendingChange] = useState(null); // { order, status }
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
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

  // Har status ka count — tab ke saath badge dikhane ke liye.
  const countsByStatus = useMemo(() => {
    const counts = { ALL: orders.length };
    STATUS_OPTIONS.forEach((s) => {
      counts[s] = orders.filter((o) => o.status === s).length;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "ALL") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  return (
    <div>
      <div className="shelf-heading">
        <h2>Orders</h2>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = countsByStatus[tab.key] ?? 0;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-ink-soft hover:bg-bg hover:text-ink"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20" : "bg-bg text-ink-faint"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading && <LoadingSpinner label="Loading orders" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && filteredOrders.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title={activeTab === "ALL" ? "No orders yet" : `No ${activeTab.toLowerCase()} orders`}
        />
      )}
      {!loading && !error && filteredOrders.length > 0 && (
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
              {filteredOrders.map((order) => (
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