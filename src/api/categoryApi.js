import axiosClient from "./axiosClient";
import { ENDPOINTS } from "@/config/api.config";

const categoryApi = {
  list: () => axiosClient.get(ENDPOINTS.categories.list).then((r) => r.data),
  getOne: (id) => axiosClient.get(ENDPOINTS.categories.getOne(id)).then((r) => r.data),

  // ADMIN only
  create: (payload) => axiosClient.post(ENDPOINTS.categories.create, payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(ENDPOINTS.categories.update(id), payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(ENDPOINTS.categories.remove(id)).then((r) => r.data),
};

export default categoryApi;
