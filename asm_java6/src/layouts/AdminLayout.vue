<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const navItems = [
  { path: "/admin/dashboard", label: "Tổng quan", icon: "fa-chart-pie" },
  { path: "/admin/categories", label: "Quản lý loại sách", icon: "fa-tags" },
  { path: "/admin/books", label: "Quản lý sách", icon: "fa-book" },
  { path: "/admin/orders", label: "Quản lý đơn hàng", icon: "fa-shopping-bag" },
  { path: "/admin/customers", label: "Quản lý khách hàng", icon: "fa-users" },
  { path: "/admin/publishers", label: "Nhà xuất bản", icon: "fa-building" },
];

const isActive = (path) => route.path.startsWith(path);

const logout = () => {
  authStore.logout();
  router.push("/auth/login");
};
</script>

<template>
  <div>
    <!-- HEADER -->
    <div
      class="admin-header d-flex justify-content-between align-items-center px-4"
    >
      <h5 class="fw-bold mb-0">Admin SynkrokBooks</h5>
      <div class="d-flex gap-2">
        <router-link to="/" class="btn-home">Quay về trang chủ</router-link>
        <button
          @click="logout"
          class="btn-home"
          style="border: none; cursor: pointer"
        >
          Đăng xuất
        </button>
      </div>
    </div>

    <div class="d-flex">
      <!-- SIDEBAR -->
      <div class="admin-sidebar">
        <div class="sidebar-label">Menu</div>
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="isActive(item.path) ? 'active' : ''"
        >
          <i :class="`fas ${item.icon}`"></i>
          {{ item.label }}
        </router-link>
      </div>

      <!-- CONTENT -->
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style src="@/admin.css"></style>
