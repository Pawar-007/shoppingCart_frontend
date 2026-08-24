import axiosClient from "./axiosClient";
import { ENDPOINTS } from "@/config/api.config";

const brandApi = {
  list: () => axiosClient.get(ENDPOINTS.brands.list).then((r) => r.data),
  getOne: (id) => axiosClient.get(ENDPOINTS.brands.getOne(id)).then((r) => r.data),

  // ADMIN only
  create: (payload) => axiosClient.post(ENDPOINTS.brands.create, payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(ENDPOINTS.brands.update(id), payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(ENDPOINTS.brands.remove(id)).then((r) => r.data),
};

export default brandApi;
