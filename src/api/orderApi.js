import axiosClient from "./axiosClient";
import { ENDPOINTS } from "@/config/api.config";

const orderApi = {
  // payload: { addressId, selectedCartItemIds } — never send userId, the
  // backend derives the logged-in user from the JWT.
  place: (payload) => axiosClient.post(ENDPOINTS.orders.place, payload).then((r) => r.data),

  list: () => axiosClient.get(ENDPOINTS.orders.list).then((r) => r.data),
  active: () => axiosClient.get(ENDPOINTS.orders.active).then((r) => r.data),
  getOne: (orderId) => axiosClient.get(ENDPOINTS.orders.getOne(orderId)).then((r) => r.data),
  cancel: (orderId) => axiosClient.put(ENDPOINTS.orders.cancel(orderId)).then((r) => r.data),
};

export default orderApi;
