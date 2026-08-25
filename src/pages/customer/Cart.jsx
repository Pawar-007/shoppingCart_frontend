import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import cartApi from "@/api/cartApi";
import CartItem from "@/components/cart/CartItem";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/utils/formatters";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const { refresh: refreshCartBadge } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

async function load(silent = false) {
  if (!silent) setLoading(true);
  setError(null);
  try {
    const data = await cartApi.get();
    console.log(data);
    const list = data?.items || data || [];
    setItems(list);
    setSelectedIds((prev) => {
      const keys = list.map((it) => it.cartItemId ?? it.id ?? it.product?.productId);
      // silent refresh: purani selection preserve karo (jo abhi bhi list me hai)
      if (silent) return new Set([...prev].filter((k) => keys.includes(k)));
      return new Set(keys);
    });
  } catch (err) {
    if (!silent) setError(err.friendlyMessage);
    else toast.error(err.friendlyMessage);
  } finally {
    if (!silent) setLoading(false);
  }
}

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function itemKey(item) {
    return item.cartItemId ?? item.id ?? item.product?.productId ?? item.productId;
  }

  function toggleSelect(item) {
    const key = itemKey(item);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleQuantityChange(item, quantity) { 
    const key = itemKey(item); 
    console.log(item, quantity);
    setUpdatingId(key); 
 
    try { 
        const productId = item.product?.productId ?? item.productId; 
        let res=await cartApi.updateQuantity(productId, quantity); 
        await load(true); 
        let refResp=await refreshCartBadge(); 
 
    } catch (err) { 
        toast.error(err.friendlyMessage); 
    } finally { 
        setUpdatingId(null); 
    } 
}
  // async function handleQuantityChange(item, quantity) {
  //   const key = itemKey(item);
  //   setUpdatingId(key);
  //   try {
  //     const productId = item.product?.productId ?? item.productId;
  //     await cartApi.add({ productId, quantity });
  //     await load();
  //     await refreshCartBadge();
  //   } catch (err) {
  //     toast.error(err.friendlyMessage);
  //   } finally {
  //     setUpdatingId(null);
  //   }
  // }

  async function handleRemove(item) {
    const key = itemKey(item);
    setUpdatingId(key);
    try {
      const productId = item.product?.productId ?? item.productId;
      await cartApi.remove(productId);
      await load(true); 
      await refreshCartBadge();
      toast.success("Removed from cart");
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setUpdatingId(null);
    }
  }

  const selectedItems = items.filter((it) => selectedIds.has(itemKey(it)));
  const subtotal = selectedItems.reduce(
    (sum, it) => sum + (it.product?.price ?? it.price ?? 0) * it.quantity,
    0
  );

  function handleCheckout() {
    if (selectedItems.length === 0) {
      toast.error("Select at least one item to check out");
      return;
    }
    navigate("/checkout", {
      state: { selectedCartItemIds: selectedItems.map((it) => itemKey(it)) },
    });
  }

  if (loading) return <LoadingSpinner label="Loading your cart" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  if (items.length === 0) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Find something you'll love and add it to your cart."
          actionLabel="Browse products"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="shell py-8">

      <div className="shelf-heading">
        <h2>Your cart</h2>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="card card-pad">
          {items.map((item) => (
            <CartItem
              key={itemKey(item)}
              item={item}
              selected={selectedIds.has(itemKey(item))}
              onToggleSelect={toggleSelect}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              updating={updatingId === itemKey(item)}
            />
          ))}
        </div>

        <div className="card card-pad lg:sticky lg:top-20">
          <h3 className="font-semibold text-sm mb-4">Order summary</h3>
          <div className="flex justify-between text-sm text-ink-soft mb-2">
            <span>Selected items</span>
            <span>{selectedItems.length}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-ink pt-3 border-t border-border">
            <span>Subtotal</span>
            <span className="price">{formatCurrency(subtotal)}</span>
          </div>
          <button onClick={handleCheckout} className="btn-primary btn-full mt-5">
            Checkout
          </button>
          <Link to="/products" className="block text-center text-sm text-primary hover:underline mt-3">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
