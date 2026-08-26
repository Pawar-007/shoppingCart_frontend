import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import productApi from "@/api/productApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/utils/formatters";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.list();
      setProducts(data || []);

    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete() {
    setDeleting(true);
    try {
      await productApi.deleteProduct(deleteTarget.productId);
      toast.success("Product deleted");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="shelf-heading">
        <h2>Products</h2>
        <Link to="/admin/products/add" className="btn-primary btn-sm">
          <Plus size={15} /> Add product
        </Link>
      </div>

      {loading && <LoadingSpinner label="Loading products" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && products.length === 0 && (
        <EmptyState icon={Package} title="No products yet" actionLabel="Add product" actionTo="/admin/products/add" />
      )}
      {!loading && !error && products.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
  
                <tr key={p.productId}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-bg overflow-hidden shrink-0">
                        {p.images?.[0] || p.imageUrl ? (
                          <img src={p.images?.[0] || p.imageUrl[0]} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <span className="text-ink font-medium line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 price text-ink">{formatCurrency(p.price)}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{p.stockQuantity}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link to={`/admin/products/${p.productId}/edit`} className="btn-ghost btn-sm">
                        <Pencil size={13} /> Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="btn-ghost btn-sm !text-danger hover:!bg-danger-light"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete product?"
        message={`"${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
