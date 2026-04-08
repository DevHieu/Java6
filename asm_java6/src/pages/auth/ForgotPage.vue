<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { forgotPassword } from "@/services/authService";

import AuthHeader from "@/components/AuthHeader.vue";

const router = useRouter();
const email = ref("");
const error = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";
  try {
    await forgotPassword(email.value);
    // Gửi mail xong thì đá sang trang Verify
    router.push({
      path: "/auth/verify",
      query: { email: email.value, mode: "reset" },
    });
  } catch (err) {
    error.value = err.response?.data || "Email không tồn tại trong hệ thống!";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AuthHeader title="Quên mật khẩu" />

  <div class="container my-5 pb-5">
    <div
      class="row g-0 border-orange shadow-sm mx-auto rounded-3 overflow-hidden"
      style="max-width: 900px"
    >
      <div class="col-md-7 p-4 p-lg-5 bg-white">
        <h4 class="fw-bold mb-4">Quên mật khẩu</h4>
        <p>
          Chúng tôi sẽ gửi cho bạn một mã OTP qua email để kích hoạt việc đặt
          lại mật khẩu.
        </p>

        <form @submit.prevent="handleSubmit">
          <div
            v-if="error"
            class="alert alert-danger py-2 small mb-3 text-center"
          >
            {{ error }}
          </div>

          <div class="mb-3 text-start">
            <label class="form-label small fw-bold"
              >Email <span class="text-danger">*</span></label
            >
            <input
              v-model="email"
              type="email"
              class="form-control"
              placeholder="Email"
              required
            />
          </div>

          <button
            type="submit"
            class="btn bg-orange text-white w-100 fw-bold py-2 shadow-sm"
            :disabled="loading"
          >
            {{ loading ? "ĐANG GỬI..." : "XÁC NHẬN" }}
          </button>
        </form>
      </div>

      <div
        class="col-md-5 bg-orange text-white p-4 p-lg-5 d-none d-md-flex flex-column justify-content-between"
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
        <router-link to="/auth/register" class="btn btn-outline-light fw-bold"
          >Đăng ký</router-link
        >
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
