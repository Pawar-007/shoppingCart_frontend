// Single source of truth for the backend base URL and every endpoint path.
// If a controller prefix changes on the backend (e.g. admin routes move to
// /admin), update it here only — nothing else in the app should hardcode a path.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const ENDPOINTS = {
  auth: {
    register: "/api/users/register",
    login: "/api/users/login",
    createAdmin: "/api/users/createAdmin",
    profile: "/api/users/profile",
    updateProfile: "/api/users/profile",
    changePassword: "/api/users/profile/password",
    deleteAccount: "/api/users/profile",
  },
  products: {
    add: "/products/addProduct",
    update: (id) => `/products/${id}`,
    remove: (id) => `/products/${id}`,
    getOne: (id) => `/products/${id}`,
    list: "/products",
    search: "/products/search",
    byCategory: (categoryId) => `/products/category/${categoryId}`,
    byBrand: (brandId) => `/products/brand/${brandId}`,
    byPriceRange: "/products/price",
  },
  categories: {
    list: "/categories",
    getOne: (id) => `/categories/${id}`,
    create: "/categories",
    update: (id) => `/categories/${id}`,
    remove: (id) => `/categories/${id}`,
  },
  brands: {
    list: "/brands",
    getOne: (id) => `/brands/${id}`,
    create: "/brands",
    update: (id) => `/brands/${id}`,
    remove: (id) => `/brands/${id}`,
  },
  cart: {
    get: "/api/cart",
    add: "/api/cart/add",
    remove: (productId) => `/api/cart/remove/${productId}`,
    clear: "/api/cart/clear",
    updateQuantity: (productId, quantity) =>
    `/api/cart/update/${productId}?quantity=${quantity}`,

  },
  // NOT CONFIRMED IN BACKEND SPEC: the AddressController's exact routes
  // were not provided. These paths are a best-guess REST convention and
  // are isolated here so they can be corrected in one place once the
  // real controller is available. See addressApi.js for details.
  addresses: {
    list: "/api/addresses",
    getOne: (id) => `/api/addresses/${id}`,
    create: "/api/addresses",
    update: (id) => `/api/addresses/${id}`,
    remove: (id) => `/api/addresses/${id}`,
    setDefault: (id) => `/api/addresses/${id}/default`,
  },
  orders: {
    place: "/orders/place",
    list: "/orders",
    active: "/orders/active",
    getOne: (id) => `/orders/${id}`,
    cancel: (id) => `/orders/${id}/cancel`,
  },
  admin: {
    users: "/admin/users",
    orders: "/admin/orders",
    updateOrderStatus: (orderId) => `/admin/status/${orderId}`,
    totalUsers: "/admin/total-users",
    totalOrders: "/admin/total-orders",
    totalProducts: "/admin/total-products",
  },
};
