import axiosClient from "./axiosClient";
import { ENDPOINTS } from "@/config/api.config";

// NOTE: the backend spec lists add / remove / get / clear only — there is
// no dedicated "update quantity" endpoint. This service assumes POST
// /api/cart/add is an upsert (sending the same productId again updates the
// line's quantity). If the backend instead always increments, swap the
// quantity-change UI to remove() + add() with the new absolute quantity.
const cartApi = {
  get: () => axiosClient.get(ENDPOINTS.cart.get).then((r) => r.data),

  // payload: { productId, quantity }
  add: (payload) => axiosClient.post(ENDPOINTS.cart.add, payload).then((r) => r.data),

  remove: (productId) => axiosClient.delete(ENDPOINTS.cart.remove(productId)).then((r) => r.data),

  clear: () => axiosClient.delete(ENDPOINTS.cart.clear).then((r) => r.data),
};

export default cartApi;
