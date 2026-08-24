# ShopCart Frontend

A React + Vite + JavaScript frontend for the ShopCart e-commerce platform, built against
the Spring Boot backend described in the project brief (JWT auth, CUSTOMER/ADMIN roles,
products/categories/brands/cart/orders).

## Getting started

```bash
npm install
cp .env.example .env      # then set VITE_API_BASE_URL to your backend
npm run dev
```

Requires Node 18+. Tailwind, PostCSS and the dev server are already configured.

## Architecture

```
src/
  api/            One service module per resource (authApi, productApi, cartApi, ...).
                   Every module calls axiosClient, which injects the JWT and turns
                   errors into user-friendly messages. No component calls axios directly.
  config/
    api.config.js  Single source of truth for the backend base URL and every endpoint
                   path. Change a route here, not in the service files.
  context/
    AuthContext    isAuthenticated / userId / role / token, persisted to localStorage,
                   with a global 401 handler that logs the user out.
    CartContext    Cart item count for the navbar badge, add/refresh helpers.
    ToastContext   success/error/info notifications, replaces alert().
  routes/
    ProtectedRoute Redirects to /login if not authenticated.
    AdminRoute     Redirects CUSTOMER users away from /admin/*.
  components/
    layout/        Navbar (responsive, role-aware), Footer, MainLayout, AdminLayout,
                   AdminSidebar (becomes a drawer on mobile).
    common/         LoadingSpinner, Skeleton, EmptyState, ErrorState, Modal,
                   ConfirmDialog — used everywhere instead of one-off markup.
    product/, cart/, order/, address/
                   ProductCard, ProductGrid, filters, QuantitySelector, CartItem,
                   OrderCard, OrderStatusBadge, AddressCard/Form, ProductForm.
  pages/
    customer/       Home, ProductListing, ProductDetails, SearchResults,
                   CategoryProducts, BrandProducts, Cart, Checkout, Addresses,
                   OrderConfirmation, MyOrders, ActiveOrders, OrderDetails, Profile,
                   ChangePassword, Login, Register.
    admin/          Dashboard, ManageUsers, ManageProducts, AddProduct, EditProduct,
                   ManageCategories, ManageBrands, ManageOrders.
```

## Auth model

Login stores `{ userId, firstName, email, role, token }` in `AuthContext` (backed by
localStorage). The axios request interceptor attaches `Authorization: Bearer <token>`
to every request automatically — no component ever touches the token directly, and
`userId` is never sent in request bodies (cart, orders); the backend derives it from
the JWT, per the spec.

A 401 response anywhere clears the session and shows a toast; `ProtectedRoute` then
sends the user to `/login`. `AdminRoute` sends an authenticated CUSTOMER back to `/`
if they try to reach an `/admin/*` route.

## ⚠️ Known gaps vs. the backend spec

- **Address endpoints are unconfirmed.** The brief didn't include the
  `AddressController`'s routes, so `src/api/addressApi.js` calls a best-guess REST
  convention (`/api/addresses/...`) defined in `api.config.js`. Everything is isolated
  behind that one config object — once you share the real controller, update the
  `addresses` block in `api.config.js` and nothing else needs to change.
- **Cart quantity updates** assume `POST /api/cart/add` is an upsert (sending the same
  `productId` again updates that line's quantity), since the spec only lists
  add/remove/get/clear. If the backend always increments instead, swap the quantity
  stepper in `Cart.jsx` to call `remove()` then `add()` with the new absolute quantity.
- **Payments and Reviews are intentionally not implemented**, per the brief — the order
  confirmation page explicitly is not a payment step, and there's no review UI. The
  component/API structure (isolated service modules, per-resource folders) is meant to
  make both easy to slot in later without restructuring.

## Design system

Tokens live in `tailwind.config.js` (colors, radii, shadows) and `src/styles/global.css`
(`.btn`, `.input`, `.card`, `.badge`, `.shelf-heading` component classes). Palette is a
deep emerald primary on a soft neutral background, Sora for display type and Inter for
body text — built to read as a considered, trustworthy storefront rather than a default
template.
