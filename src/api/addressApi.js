import axiosClient from "./axiosClient";
import { ENDPOINTS } from "@/config/api.config";

// ⚠️ UNCONFIRMED BACKEND CONTRACT
// The exact AddressController routes were not provided in the spec. The
// paths below (/api/addresses/...) are a reasonable REST guess, kept
// isolated here behind the same function names the UI calls, so that once
// the real controller is shared, only ENDPOINTS.addresses in
// api.config.js needs to change — no component code changes.
const addressApi = {
  list: () => axiosClient.get(ENDPOINTS.addresses.list).then((r) => r.data),
  getOne: (id) => axiosClient.get(ENDPOINTS.addresses.getOne(id)).then((r) => r.data),
  create: (payload) => axiosClient.post(ENDPOINTS.addresses.create, payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(ENDPOINTS.addresses.update(id), payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(ENDPOINTS.addresses.remove(id)).then((r) => r.data),
  setDefault: (id) => axiosClient.put(ENDPOINTS.addresses.setDefault(id)).then((r) => r.data),
};

export default addressApi;
