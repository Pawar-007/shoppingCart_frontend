import { useEffect, useState } from "react";
import { Plus, MapPin } from "lucide-react";
import addressApi from "@/api/addressApi";
import AddressCard from "@/components/address/AddressCard";
import AddressForm from "@/components/address/AddressForm";
import Modal from "@/components/common/Modal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { useToast } from "@/context/ToastContext";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await addressApi.list();
      setAddresses(data || []);
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
    setEditingAddress(null);
    setFormOpen(true);
  }

  function openEdit(address) {
    setEditingAddress(address);
    setFormOpen(true);
  }

  async function handleSubmit(values) {
    setSaving(true);
    try {
      if (editingAddress) {
        await addressApi.update(editingAddress.addressId ?? editingAddress.id, values);
        toast.success("Address updated");
      } else {
        await addressApi.create(values);
        toast.success("Address added");
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
    try {
      await addressApi.remove(deleteTarget.addressId ?? deleteTarget.id);
      toast.success("Address removed");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err.friendlyMessage);
    }
  }

  return (
    <div className="shell py-8 max-w-3xl">
      <div className="shelf-heading">
        <h2>Your addresses</h2>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={15} /> Add address
        </button>
      </div>

      {loading && <LoadingSpinner label="Loading addresses" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && addresses.length === 0 && (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          message="Add an address so checkout is faster next time."
          actionLabel="Add address"
          onAction={openAdd}
        />
      )}
      {!loading && !error && addresses.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.addressId ?? addr.id}
              address={addr}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingAddress ? "Edit address" : "Add address"}>
        <AddressForm
          initialValue={editingAddress}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          submitting={saving}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete address?"
        message="This address will be permanently removed from your account."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
