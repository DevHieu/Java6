<script setup>
import { ref, computed } from "vue";
import ProfileInfo from "@/components/account/ProfileInfo.vue";
import OrderHistory from "@/components/account/OrderHistory.vue";
import ChangePassword from "@/components/account/ChangePassword.vue";

import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();

const user = computed(() => authStore.user);

// Logic chuyển Tab
const currentTab = ref("profile");

const tabs = {
  profile: ProfileInfo,
  orders: OrderHistory,
  password: ChangePassword,
};

const logout = () => {
  authStore.logout();
  window.location.href = "/auth/login";
};
</script>

<template>
  <div class="account-page">
    <section class="account-banner text-center header-gradient py-5">
      <div class="container">
        <h1 class="display-5 fw-bold text-white mb-3">Tài khoản</h1>
      </div>
    </section>

    <div class="container my-5 pb-5">
      <div class="row g-4">
        <div class="col-lg-4 col-md-5">
          <div class="sidebar-card shadow-sm p-4 rounded-4 bg-white">
            <div class="user-greeting mb-4 border-bottom pb-3">
              <h5 class="mb-0 fw-bold text-dark">
                Xin chào,
                <span class="text-pink">{{ user.fullname || "Khách" }}</span>
              </h5>
            </div>

            <div class="list-group account-nav border-0">
              <button
                @click="currentTab = 'profile'"
                class="list-group-item list-group-item-action border-0 rounded-3 mb-2"
                :class="{ 'active-link': currentTab === 'profile' }"
              >
                <i class="fas fa-user-circle me-2"></i> Thông tin tài khoản
              </button>

              <button
                @click="currentTab = 'password'"
                class="list-group-item list-group-item-action border-0 rounded-3 mb-2"
                :class="{ 'active-link': currentTab === 'password' }"
              >
                <i class="fas fa-key me-2"></i> Đổi mật khẩu
              </button>

              <button
                @click="currentTab = 'orders'"
                class="list-group-item list-group-item-action border-0 rounded-3 mb-2"
                :class="{ 'active-link': currentTab === 'orders' }"
              >
                <i class="fas fa-shopping-bag me-2"></i> Đơn hàng của bạn
              </button>

              <button
                @click="logout"
                class="list-group-item list-group-item-action border-0 text-danger rounded-3"
              >
                <i class="fas fa-sign-out-alt me-2"></i> Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <div class="col-lg-8 col-md-7">
          <div class="content-card h-100">
            <transition name="fade" mode="out-in">
              <component :is="tabs[currentTab]" :user="user" />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-pink {
  color: var(--red-1);
}
.active-link {
  background-color: #f8f9fa !important;
  color: var(--red-1) !important;
  font-weight: bold;
  border-left: 4px solid var(--red-1) !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
