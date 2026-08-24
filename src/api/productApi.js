import axiosClient from "./axiosClient";
import { ENDPOINTS } from "@/config/api.config";

const productApi = {
  list: () => axiosClient.get(ENDPOINTS.products.list).then((r) => r.data),

  getOne: (productId) => axiosClient.get(ENDPOINTS.products.getOne(productId)).then((r) => r.data),

  search: (keyword) =>
    axiosClient.get(ENDPOINTS.products.search, { params: { keyword } }).then((r) => r.data),

  byCategory: (categoryId) => axiosClient.get(ENDPOINTS.products.byCategory(categoryId)).then((r) => r.data),

  byBrand: (brandId) => axiosClient.get(ENDPOINTS.products.byBrand(brandId)).then((r) => r.data),

  byPriceRange: (min, max) =>
    axiosClient.get(ENDPOINTS.products.byPriceRange, { params: { min, max } }).then((r) => r.data),

  // ADMIN only
  addProduct: (payload) => axiosClient.post(ENDPOINTS.products.add, payload).then((r) => r.data),
  updateProduct: (productId, payload) =>
    axiosClient.put(ENDPOINTS.products.update(productId), payload).then((r) => r.data),
  deleteProduct: (productId) => axiosClient.delete(ENDPOINTS.products.remove(productId)).then((r) => r.data),
};

export default productApi;
