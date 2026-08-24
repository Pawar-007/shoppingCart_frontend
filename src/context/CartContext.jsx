import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import cartApi from "@/api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await cartApi.get();
      setItems(data?.items || data || []);
    } catch {
      // Navbar badge silently falls back to empty on failure; the Cart
      // page itself surfaces the real error state.
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      await cartApi.add({ productId, quantity });
      await refresh();
    },
    [refresh]
  );

  const count = useMemo(() => items.reduce((sum, it) => sum + (it.quantity || 0), 0), [items]);

  const value = useMemo(
    () => ({ items, loading, count, refresh, addToCart }),
    [items, loading, count, refresh, addToCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
