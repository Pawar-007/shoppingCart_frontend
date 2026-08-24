import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Package, ClipboardList, Plus, FolderTree, Tag } from "lucide-react";
import adminApi from "@/api/adminApi";
import orderApi from "@/api/orderApi";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [users, orders, products, allOrders] = await Promise.all([
        adminApi.getTotalUsers(),
        adminApi.getTotalOrders(),
        adminApi.getTotalProducts(),
        orderApi.list().catch(() => []),
      ]);
      setStats({
        users: users?.count ?? users?.total ?? users ?? 0,
        orders: orders?.count ?? orders?.total ?? orders ?? 0,
        products: products?.count ?? products?.total ?? products ?? 0,
      });
      setRecentOrders((allOrders || []).slice(0, 5));
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const cards = [
    { label: "Total users", value: stats.users, icon: Users, to: "/admin/users" },
    { label: "Total orders", value: stats.orders, icon: ClipboardList, to: "/admin/orders" },
    { label: "Total products", value: stats.products, icon: Package, to: "/admin/products" },
  ];

  return (
    <div>
      <div className="shelf-heading">
        <h2>Dashboard</h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, to }) => (
        
          <Link key={label} to={to} className="card card-pad hover:border-primary transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
              <Icon size={16} className="text-primary" />
            </div>
            <p className="font-display font-bold text-3xl text-ink mt-2">{value}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/admin/products/add" className="btn-primary btn-sm"><Plus size={14} /> Add product</Link>
        <Link to="/admin/categories" className="btn-secondary btn-sm"><FolderTree size={14} /> Manage categories</Link>
        <Link to="/admin/brands" className="btn-secondary btn-sm"><Tag size={14} /> Manage brands</Link>
      </div>

      <div className="card">
        <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-sm">Recent orders</h3>
          <Link to="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-ink-soft px-5 sm:px-6 py-6">No orders yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.orderId} className="flex items-center justify-between px-5 sm:px-6 py-3.5 gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">Order #{order.orderId}</p>
                  <p className="text-xs text-ink-soft">{formatDate(order.orderDate || order.createdAt)}</p>
                </div>
                <span className="price text-sm shrink-0">{formatCurrency(order.totalAmount ?? order.total)}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
