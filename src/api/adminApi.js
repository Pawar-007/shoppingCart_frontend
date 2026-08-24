import axiosClient from "./axiosClient";
import { ENDPOINTS } from "@/config/api.config";

const adminApi = {
  getUsers: () => axiosClient.get(ENDPOINTS.admin.users).then((r) => r.data),
  getOrders: () => axiosClient.get(ENDPOINTS.admin.orders).then((r) => r.data),

  updateOrderStatus: (orderId, status) =>
    axiosClient
      .put(ENDPOINTS.admin.updateOrderStatus(orderId), null, { params: { status } })
      .then((r) => r.data),

  getTotalUsers: () => axiosClient.get(ENDPOINTS.admin.totalUsers).then((r) => r.data),
  getTotalOrders: () => axiosClient.get(ENDPOINTS.admin.totalOrders).then((r) => r.data),
  getTotalProducts: () => axiosClient.get(ENDPOINTS.admin.totalProducts).then((r) => r.data),
};

export default adminApi;
