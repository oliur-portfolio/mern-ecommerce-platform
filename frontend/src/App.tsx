import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import Layout from "./components/Layout/Layout";
import DashboardLayout from "./components/Layout/DashboardLayout";

import AuthRedirect from "./components/Common/AuthRedirect";
import RequireAdmin from "./components/Common/RequireAdmin";
import RequireUser from "./components/Common/RequireUser";
import RequireAuth from "./components/Common/RequireAuth";
import ScrollToTop from "./components/Common/ScrollToTop";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const ProfileEditPage = lazy(() => import("./pages/ProfileEditPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CheckoutSuccessPage = lazy(() => import("./pages/CheckoutSuccessPage"));
const CheckoutCancelPage = lazy(() => import("./pages/CheckoutCancelPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));

const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage"));
const AdminProductsCreatePage = lazy(
  () => import("./pages/AdminProductsCreatePage"),
);
const AdminProductsEditPage = lazy(
  () => import("./pages/AdminProductsEditPage"),
);
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 font-medium">Loading page...</p>
    </div>
  );
};

function App() {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<AuthRedirect />}>
            <Route element={<Layout />}>
              <Route path="register" element={<RegisterPage />} />
              <Route path="login" element={<LoginPage />} />
            </Route>
          </Route>

          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route
              path="products/:productId"
              element={<ProductDetailsPage />}
            />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Auth routes - user + admin */}
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="profile-edit" element={<ProfileEditPage />} />
            </Route>
          </Route>

          {/* User routes */}
          <Route element={<RequireUser />}>
            <Route element={<Layout />}>
              <Route path="checkout" element={<CheckoutPage />} />
              <Route
                path="checkout/success"
                element={<CheckoutSuccessPage />}
              />
              <Route path="checkout/cancel" element={<CheckoutCancelPage />} />
              <Route path="my-orders" element={<MyOrdersPage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<RequireAdmin />}>
            <Route element={<DashboardLayout />}>
              <Route path="admin-dashboard" element={<AdminDashboardPage />} />

              <Route path="admin-products">
                <Route index element={<AdminProductsPage />} />
                <Route path="create" element={<AdminProductsCreatePage />} />
                <Route
                  path="edit/:productId"
                  element={<AdminProductsEditPage />}
                />
              </Route>

              <Route path="admin-orders" element={<AdminOrdersPage />} />
              <Route path="admin-users" element={<AdminUsersPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
