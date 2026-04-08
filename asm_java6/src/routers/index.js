import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

import HomePage from "@/pages/HomePage.vue";
import SearchPage from "@/pages/SearchPage.vue";
import DetailPage from "@/pages/DetailPage.vue";
import CartPage from "@/pages/CartPage.vue";
import AccountPage from "@/pages/AccountPage.vue";
import CheckoutPage from "@/pages/CheckoutPage.vue";
import OrderDetailPage from "@/pages/OrderDetailPage.vue";

import LoginPage from "@/pages/auth/LoginPage.vue";
import RegisterPage from "@/pages/auth/RegisterPage.vue";
import VerifyPage from "@/pages/auth/VerifyPage.vue";
import ForgotPage from "@/pages/auth/ForgotPage.vue";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage.vue";

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage.vue";
import AdminBooksPage from "@/pages/admin/AdminBookPage.vue";
import AdminCategoriesPage from "@/pages/admin/AdminCategoryPage.vue";
import AdminOrdersPage from "@/pages/admin/AdminOrderPage.vue";
import AdminCustomersPage from "@/pages/admin/AdminCustomerPage.vue";
import AdminPublishersPage from "@/pages/admin/AdminPublisherPage.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", component: HomePage },
      { path: "search", component: SearchPage },
      { path: "detail/:id", component: DetailPage },
      { path: "cart", component: CartPage },
      { path: "account", component: AccountPage },
      { path: "checkout", component: CheckoutPage },
      { path: "orders/:id", component: OrderDetailPage },
    ],
  },
  {
    path: "/auth",
    component: BlankLayout,
    children: [
      { path: "login", component: LoginPage },
      { path: "register", component: RegisterPage },
      { path: "forgot-password", component: ForgotPage },
      { path: "verify", component: VerifyPage },
      { path: "reset-password", component: ResetPasswordPage },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: "", redirect: "/admin/dashboard" },
      { path: "dashboard", component: AdminDashboardPage },
      { path: "books", component: AdminBooksPage },
      { path: "categories", component: AdminCategoriesPage },
      { path: "orders", component: AdminOrdersPage },
      { path: "customers", component: AdminCustomersPage },
      { path: "publishers", component: AdminPublishersPage },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard
router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAdmin) {
    if (!authStore.isLogin) return "/auth/login";
    if (!authStore.isAdmin) return "/";
  }
});
