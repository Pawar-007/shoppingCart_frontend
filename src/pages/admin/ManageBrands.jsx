import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import brandApi from "@/api/brandApi";
import Modal from "@/components/common/Modal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { useToast } from "@/context/ToastContext";

export default function ManageBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [brandName, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await brandApi.list();
      setBrands(data || []);
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditing(null);
    setName("");
    setNameError("");
    setFormOpen(true);
  }

  function openEdit(brand) {
    setEditing(brand);
    setName(brand.brandName);

    setNameError("");
    setFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!brandName.trim()) {
  
      setNameError("Required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await brandApi.update(editing.brandId ?? editing.id, { brandName: brandName.trim() });
    
    
        toast.success("Brand updated");
      } else {
        await brandApi.create({ brandName: brandName.trim() });
    
    
        toast.success("Brand added");
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await brandApi.remove(deleteTarget.brandId ?? deleteTarget.id);
      toast.success("Brand deleted");
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
        <h2>Brands</h2>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={15} /> Add brand
        </button>
      </div>

      {loading && <LoadingSpinner label="Loading brands" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && brands.length === 0 && (
        <EmptyState icon={Tag} title="No brands yet" actionLabel="Add brand" onAction={openAdd} />
      )}
      {!loading && !error && brands.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {brands.map((b) => (
            <div key={b.brandId ?? b.id} className="card card-pad flex items-center justify-between">
              <span className="text-sm font-medium text-ink">{b.brandName}</span>
          
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(b)} className="btn-ghost btn-sm !px-2">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(b)}
                  className="btn-ghost btn-sm !px-2 !text-danger hover:!bg-danger-light"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit brand" : "Add brand"}
        size="sm"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="brandName">Brand brandName</label>
      
          <input
            id="brandName"
            value={brandName}
        
            onChange={(e) => setName(e.target.value)}
            className={`input ${nameError ? "input-error" : ""}`}
          />
          {nameError && <p className="error-text">{nameError}</p>}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete brand?"
        message={`"${deleteTarget?.brandName}" will be permanently removed.`}
    
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
