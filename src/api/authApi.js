import axiosClient from "./axiosClient";
import { ENDPOINTS } from "@/config/api.config";

const authApi = {
  register: (payload) => axiosClient.post(ENDPOINTS.auth.register, payload).then((r) => r.data),

  login: (payload) => axiosClient.post(ENDPOINTS.auth.login, payload).then((r) => r.data),

  createAdmin: (payload) => axiosClient.post(ENDPOINTS.auth.createAdmin, payload).then((r) => r.data),

  getProfile: () => axiosClient.get(ENDPOINTS.auth.profile).then((r) => r.data),

  updateProfile: (payload) => axiosClient.put(ENDPOINTS.auth.updateProfile, payload).then((r) => r.data),

  changePassword: (payload) => axiosClient.put(ENDPOINTS.auth.changePassword, payload).then((r) => r.data),

  deleteAccount: () => axiosClient.delete(ENDPOINTS.auth.deleteAccount).then((r) => r.data),
};

export default authApi;
