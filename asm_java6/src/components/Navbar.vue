<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark"
    style="background-color: var(--red-1)"
  >
    <div class="container px-4">
      <!-- Logo -->
      <router-link class="navbar-brand me-5" to="/">
        <img
          src="@/assets/logo.png"
          style="
            height: 70px;
            width: auto;
            max-width: 100%;
            object-fit: contain;
          "
        />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarTogglerDemo03"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 fw-medium"></ul>

        <!-- Search -->
        <form @submit.prevent="handleSearch" class="d-flex align-items-center">
          <div class="input-group">
            <input
              v-model="keyword"
              type="search"
              class="form-control"
              placeholder="Search..."
            />
            <button class="btn btn-light" type="submit">
              <i class="pi pi-search" style="font-size: 1rem"></i>
            </button>
          </div>
        </form>

        <div
          class="border-end border-secondary mx-2"
          style="height: 20px"
        ></div>

        <!-- Đã đăng nhập -->
        <div v-if="isLogin" class="dropdown">
          <a
            href="#"
            class="text-white text-decoration-none ms-4 me-4 dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <i class="fas fa-user fs-5 me-1"></i>
            {{ user?.fullname }}
          </a>
          <ul class="dropdown-menu dropdown-menu-end shadow">
            <li>
              <router-link class="dropdown-item" to="/account"
                >Tài khoản</router-link
              >
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <router-link
                v-if="user.isAdmin"
                class="dropdown-item"
                to="/admin/dashboard"
                >Quản lí ADMIN</router-link
              >
            </li>
            <li v-if="user.isAdmin"><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#" @click="logout">Đăng xuất</a>
            </li>
          </ul>
        </div>

        <!-- Chưa đăng nhập -->
        <div v-else>
          <router-link
            to="/auth/login"
            class="text-white text-decoration-none fw-medium"
          >
            Đăng nhập
          </router-link>
        </div>

        <!-- Cart với badge -->
        <div
          v-if="isLogin"
          class="d-flex justify-content-center align-items-center"
        >
          <div
            class="border-end border-secondary mx-2"
            style="height: 20px"
          ></div>

          <router-link
            to="/cart"
            class="text-white text-decoration-none ms-2 position-relative"
          >
            <i class="pi pi-shopping-cart fs-5"></i>

            <span
              v-if="cartCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success text-white"
              style="font-size: 0.65rem; min-width: 18px"
            >
              {{ cartCount > 99 ? "99+" : cartCount }}
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { storeToRefs } from "pinia";

const router = useRouter();

const authStore = useAuthStore();
const { user, isLogin } = storeToRefs(authStore);

const cartStore = useCartStore();
const { cartCount } = storeToRefs(cartStore);

const keyword = ref("");

onMounted(() => {
  if (isLogin.value) cartStore.fetchCart();
});

watch(isLogin, (val) => {
  if (val) cartStore.fetchCart();
  else cartStore.resetCart();
});

const handleSearch = () => {
  router.push({ path: "/search", query: { keyword: keyword.value } });
};

const logout = () => {
  authStore.logout();
  window.location.href = "/auth/login";
};
</script>

<style>
@media (min-width: 992px) {
  .dropdown:hover .dropdown-menu {
    display: block;
    margin-top: 0;
  }
}
</style>
