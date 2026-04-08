<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { resetPassword } from "@/services/authService";

import AuthHeader from "@/components/AuthHeader.vue";

const router = useRouter();
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const isMismatched = ref(false);

const handleReset = async () => {
  if (newPassword.value !== confirmPassword.value) {
    isMismatched.value = true;
    return;
  }
  isMismatched.value = false;

  try {
    await resetPassword(newPassword.value);
    alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
    router.push("/auth/login");
  } catch (err) {
    error.value = "Có lỗi xảy ra. Vui lòng thử lại!";
  }
};
</script>

<template>
  <AuthHeader title="Đặt lại mật khẩu" />
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 shadow p-5 bg-white rounded text-center">
        <h4 class="fw-bold text-uppercase mb-2">Thiết lập mật khẩu mới</h4>
        <p class="text-muted mb-4 small">
          Nhập mật khẩu mới để khôi phục tài khoản.
        </p>

        <form @submit.prevent="handleReset">
          <div class="mb-3 text-start">
            <label class="form-label small fw-bold">Mật khẩu mới</label>
            <input
              v-model="newPassword"
              type="password"
              class="form-control"
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>

          <div class="mb-3 text-start">
            <label class="form-label small fw-bold">Xác nhận mật khẩu</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': isMismatched }"
              placeholder="Nhập lại mật khẩu"
              required
            />
            <div v-if="isMismatched" class="text-danger small mt-2 fw-bold">
              Mật khẩu xác nhận không khớp!
            </div>
          </div>

          <button
            type="submit"
            class="btn mt-3 w-100 bg-orange text-white fw-bold py-2 text-uppercase"
          >
            Đổi mật khẩu
          </button>
        </form>

        <div class="mt-4">
          <small class="text-muted"
            >Quay lại trang
            <router-link
              to="/auth/login"
              class="text-primary fw-bold text-decoration-none"
              >Đăng nhập</router-link
            >
          </small>
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
  border: 1px solid var(--red-1) !important;
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
