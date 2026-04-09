<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login, googleLogin } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { setLocalStorageWithExpiry } from "@/helpers/LocalStorageHelper";

import AuthHeader from "@/components/AuthHeader.vue";

const router = useRouter();
const authStore = useAuthStore();
const loginForm = ref({ email: "", password: "", rememberMe: false });
const error = ref("");

const handleLogin = async () => {
  try {
    const userData = await login(loginForm.value);

    const oneDay = 24 * 60 * 60 * 1000;
    const expired = loginForm.value.rememberMe ? oneDay * 7 : oneDay; // 7 ngày nếu nhớ tài khoản, 1 ngày nếu không
    setLocalStorageWithExpiry("user", userData.email, expired);

    authStore.login(userData);
    router.push("/");
  } catch (err) {
    error.value = err.response?.data?.message || "Đăng nhập thất bại";
  }
};

const handleGoogleLogin = async (response) => {
  try {
    const userData = await googleLogin(response.credential);

    const oneDay = 24 * 60 * 60 * 1000;
    const expired = loginForm.value.rememberMe ? oneDay * 7 : oneDay; 
    setLocalStorageWithExpiry("user", userData.email, expired);

    authStore.login(userData);
    router.push("/");
  } catch (err) {
    error.value = err.response?.data?.message || "Đăng nhập Google thất bại";
  }
};
</script>

<template>
  <div class="auth-page">
    <AuthHeader />

    <div class="container my-5 pb-5">
      <div
        class="row g-0 border-orange shadow-sm mx-auto rounded-3 bg-white overflow-hidden"
        style="max-width: 900px"
      >
        <div class="col-md-7 p-4 p-lg-5 text-dark">
          <h4 class="fw-bold mb-4 text-start">Đăng nhập tài khoản</h4>

          <form @submit.prevent="handleLogin">
            <div
              v-if="error"
              class="alert alert-danger py-2 small mb-3 text-center"
            >
              <span>{{ error }}</span>
            </div>

            <div class="mb-3 text-start">
              <label class="form-label small fw-bold">
                Email <span class="text-danger">*</span>
              </label>
              <input
                v-model="loginForm.email"
                type="email"
                class="form-control rounded-1"
                placeholder="Email"
                required
              />
            </div>

            <div class="mb-4 text-start">
              <label class="form-label small fw-bold">
                Mật khẩu <span class="text-danger">*</span>
              </label>
              <input
                v-model="loginForm.password"
                type="password"
                class="form-control rounded-1"
                placeholder="Mật khẩu"
                required
              />
            </div>

            <div class="mb-3 d-flex justify-content-between align-items-center">
              <div class="form-check">
                <input
                  v-model="loginForm.rememberMe"
                  type="checkbox"
                  class="form-check-input"
                  id="rememberMe"
                />
                <label class="form-check-label small fw-bold" for="rememberMe">
                  Nhớ tài khoản
                </label>
              </div>
            </div>

            <button
              type="submit"
              class="btn bg-orange text-white w-100 fw-bold py-2 rounded-1 shadow-sm"
            >
              ĐĂNG NHẬP
            </button>

            <div class="mt-4 text-center">
              <p class="text-muted small mb-2">Hoặc đăng nhập bằng</p>
              <div class="d-flex justify-content-center">
                <GoogleLogin :callback="handleGoogleLogin" />
              </div>
            </div>
          </form>

          <p class="text-center small mb-0 mt-3 text-muted">
            Bạn quên mật khẩu bấm
            <router-link
              to="/auth/forgot-password"
              class="text-success fw-bold text-decoration-none"
            >
              vào đây
            </router-link>
          </p>
        </div>

        <div
          class="col-md-5 bg-orange text-white p-4 p-lg-5 d-none d-md-flex flex-column justify-content-between text-start"
        >
          <div>
            <h5 class="fw-bold mb-4">Quyền lợi với thành viên</h5>
            <ul class="list-unstyled">
              <li class="mb-3">
                <i class="fas fa-check-circle me-2"></i> Vận chuyển siêu tốc
              </li>
              <li class="mb-3">
                <i class="fas fa-check-circle me-2"></i> Sản phẩm đa dạng
              </li>
              <li class="mb-3">
                <i class="fas fa-check-circle me-2"></i> Đổi trả dễ dàng
              </li>
              <li class="mb-3">
                <i class="fas fa-check-circle me-2"></i> Tích điểm đổi quà
              </li>
              <li class="mb-3">
                <i class="fas fa-check-circle me-2"></i> Giảm giá lên đến 10%
              </li>
            </ul>
          </div>
          <div class="mt-4">
            <router-link
              to="/auth/register"
              class="btn btn-outline-light px-5 py-2 fw-bold rounded-2"
            >
              Đăng ký
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom Brand Colors */
.bg-orange {
  background-color: var(--red-2) !important;
}

.border-orange {
  border: 2px solid var(--red-1) !important;
}

/* Register Button */
.btn-outline-white {
  border: 1px solid white !important;
  color: white !important;
  text-decoration: none;
  transition: 0.3s;
}

.btn-outline-white:hover {
  background: white;
  color: var(--red-1) !important;
}

.back-home {
  text-decoration: none;
  font-weight: 500;
  transition: 150ms;
}

.back-home:hover {
  color: black !important;
}

.otp-input {
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  border: 2px solid #ced4da;
  border-radius: 8px;
}

.otp-input:focus {
  border-color: var(--red-1);
  box-shadow: 0 0 8px #632804;
  outline: none;
}

/* Ẩn mũi tên tăng giảm của input type number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
