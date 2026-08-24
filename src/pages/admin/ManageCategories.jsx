import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import categoryApi from "@/api/categoryApi";
import Modal from "@/components/common/Modal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { useToast } from "@/context/ToastContext";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryApi.list();
      console.log(data);
      setCategories(data || []);
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

  function openEdit(cat) {
    setEditing(cat);
    setName(cat.name);
    setNameError("");
    setFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await categoryApi.update(editing.categoryId ?? editing.id, { name: name.trim() });
        toast.success("Category updated");
      } else {
        await categoryApi.create({ name: name.trim() });
        toast.success("Category added");
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
      await categoryApi.remove(deleteTarget.categoryId ?? deleteTarget.id);
      toast.success("Category deleted");
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
        <h2>Categories</h2>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={15} /> Add category
        </button>
      </div>

      {loading && <LoadingSpinner label="Loading categories" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && categories.length === 0 && (
        <EmptyState icon={FolderTree} title="No categories yet" actionLabel="Add category" onAction={openAdd} />
      )}
      {!loading && !error && categories.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c) => (
            <div key={c.categoryId ?? c.id} className="card card-pad flex items-center justify-between">
              <span className="text-sm font-medium text-ink">{c.categoryName}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(c)} className="btn-ghost btn-sm !px-2">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(c)}
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
        title={editing ? "Edit category" : "Add category"}
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
          <label className="field-label" htmlFor="categoryName">Category name</label>
          <input
            id="categoryName"
            value={name}
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
        title="Delete category?"
        message={`"${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
