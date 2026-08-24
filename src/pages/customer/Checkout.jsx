import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Plus, MapPin } from "lucide-react";
import addressApi from "@/api/addressApi";
import cartApi from "@/api/cartApi";
import orderApi from "@/api/orderApi";
import AddressCard from "@/components/address/AddressCard";
import AddressForm from "@/components/address/AddressForm";
import Modal from "@/components/common/Modal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/utils/formatters";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { refresh: refreshCartBadge } = useCart();

  const selectedCartItemIds = location.state?.selectedCartItemIds;

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  function itemKey(item) {
    return item.cartItemId ?? item.id ?? item.product?.productId ?? item.productId;
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [cartData, addressData] = await Promise.all([cartApi.get(), addressApi.list()]);
      const list = cartData?.items || cartData || [];
      const relevant = selectedCartItemIds
        ? list.filter((it) => selectedCartItemIds.includes(itemKey(it)))
        : list;
      setCartItems(relevant);
      setAddresses(addressData || []);
      const def = (addressData || []).find((a) => a.isDefault);
      setSelectedAddressId(def?.addressId ?? def?.id ?? addressData?.[0]?.addressId ?? addressData?.[0]?.id ?? null);
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddAddress(values) {
    setSavingAddress(true);
    try {
      const created = await addressApi.create(values);
      toast.success("Address added");
      setFormOpen(false);
      await load();
      if (created?.addressId || created?.id) {
        setSelectedAddressId(created.addressId ?? created.id);
      }
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setSavingAddress(false);
    }
  }

  const subtotal = cartItems.reduce((sum, it) => sum + (it.product?.price ?? it.price ?? 0) * it.quantity, 0);

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      toast.error("Select a delivery address first");
      return;
    }
    setPlacingOrder(true);
    try {
      const order = await orderApi.place({
        addressId: selectedAddressId,
        selectedCartItemIds: cartItems.map(itemKey),
      });
      await refreshCartBadge();
      toast.success("Order placed successfully");
      navigate(`/order-confirmation/${order.orderId ?? order.id}`);
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) return <LoadingSpinner label="Preparing checkout" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="shell py-8">
      <div className="shelf-heading">
        <h2>Checkout</h2>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-8">
          {/* Step 1: Address */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">1. Delivery address</h3>
              <button onClick={() => setFormOpen(true)} className="btn-ghost btn-sm">
                <Plus size={14} /> New address
              </button>
            </div>
            {addresses.length === 0 ? (
              <div className="card card-pad text-center text-sm text-ink-soft">
                <MapPin size={20} className="mx-auto mb-2 text-ink-faint" />
                No saved addresses.{" "}
                <button onClick={() => setFormOpen(true)} className="text-primary font-medium hover:underline">
                  Add one
                </button>{" "}
                to continue.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.addressId ?? addr.id}
                    address={addr}
                    selectable
                    selected={selectedAddressId === (addr.addressId ?? addr.id)}
                    onSelect={(a) => setSelectedAddressId(a.addressId ?? a.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Step 2: Review items */}
          <section>
            <h3 className="font-semibold text-sm mb-3">2. Review items</h3>
            <div className="card card-pad divide-y divide-border">
              {cartItems.map((item) => {
                const product = item.product || item;
                return (
                  <div key={itemKey(item)} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="h-14 w-14 rounded bg-bg overflow-hidden shrink-0">
                      {product.images?.[0] || product.imageUrl ? (
                        <img src={product.images?.[0] || product.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink line-clamp-1">{product.name}</p>
                      <p className="text-xs text-ink-soft">Qty {item.quantity}</p>
                    </div>
                    <span className="price text-sm">{formatCurrency((product.price || 0) * item.quantity)}</span>
                  </div>
                );
              })}
              {cartItems.length === 0 && (
                <p className="text-sm text-ink-soft py-2">No items selected for checkout.</p>
              )}
            </div>
          </section>
        </div>

        {/* Step 3 & 4: Summary + place order */}
        <div className="card card-pad lg:sticky lg:top-20">
          <h3 className="font-semibold text-sm mb-4">3. Order summary</h3>
          <div className="flex justify-between text-sm text-ink-soft mb-2">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-ink pt-3 border-t border-border">
            <span>Total</span>
            <span className="price">{formatCurrency(subtotal)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder || cartItems.length === 0}
            className="btn-primary btn-full mt-5"
          >
            {placingOrder ? "Placing order…" : "4. Place order"}
          </button>
          <Link to="/cart" className="block text-center text-sm text-ink-soft hover:text-ink mt-3">
            Back to cart
          </Link>
        </div>
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add address">
        <AddressForm onSubmit={handleAddAddress} onCancel={() => setFormOpen(false)} submitting={savingAddress} />
      </Modal>
    </div>
  );
}
