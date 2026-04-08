<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/services/authService";

import AuthHeader from "@/components/AuthHeader.vue";

const router = useRouter();
const error = ref("");
const loading = ref(false);

const registerForm = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const handleRegister = async () => {
  error.value = "";
  loading.value = true;

  try {
    // Gọi API đăng ký (Backend sẽ gửi OTP và lưu DTO vào Session)
    const response = await register(registerForm.value);

    if (response === "OTP_SENT") {
      // Chuyển sang trang Verify và truyền email qua query để hiển thị cho user biết
      router.push({
        path: "/auth/verify",
        query: { email: registerForm.value.email },
      });
    }
  } catch (err) {
    // Hiện lỗi từ Backend (ví dụ: Email đã tồn tại)
    error.value = err.response?.data || "Đăng ký thất bại, vui lòng thử lại!";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="register-page">
    <AuthHeader title="Đăng ký" />
    <div class="container my-5 pb-5">
      <div
        class="row g-0 border-orange shadow-sm mx-auto rounded-3 overflow-hidden"
        style="max-width: 900px"
      >
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
          <div class="mt-4 text-center">
            <p class="small mb-2">Đã có tài khoản?</p>
            <router-link
              to="/auth/login"
              class="btn btn-outline-light px-5 py-2 fw-bold rounded-2"
            >
              Đăng nhập
            </router-link>
          </div>
        </div>

        <div class="col-md-7 p-4 p-lg-5 bg-white text-dark">
          <h4 class="fw-bold mb-4 text-start">Đăng ký tài khoản</h4>

          <form @submit.prevent="handleRegister">
            <div
              v-if="error"
              class="alert alert-danger py-2 small mb-3 text-center"
            >
              {{ error }}
            </div>

            <div class="row">
              <div class="col-md-6 mb-3 text-start">
                <label class="form-label small fw-bold"
                  >Họ <span class="text-danger">*</span></label
                >
                <input
                  v-model="registerForm.firstName"
                  type="text"
                  class="form-control rounded-1"
                  placeholder="Họ"
                  required
                />
              </div>
              <div class="col-md-6 mb-3 text-start">
                <label class="form-label small fw-bold"
                  >Tên <span class="text-danger">*</span></label
                >
                <input
                  v-model="registerForm.lastName"
                  type="text"
                  class="form-control rounded-1"
                  placeholder="Tên"
                  required
                />
              </div>
            </div>

            <div class="mb-3 text-start">
              <label class="form-label small fw-bold"
                >Email <span class="text-danger">*</span></label
              >
              <input
                v-model="registerForm.email"
                type="email"
                class="form-control rounded-1"
                placeholder="Email"
                required
              />
            </div>

            <div class="mb-4 text-start">
              <label class="form-label small fw-bold"
                >Mật khẩu <span class="text-danger">*</span></label
              >
              <input
                v-model="registerForm.password"
                type="password"
                class="form-control rounded-1"
                placeholder="Mật khẩu"
                required
              />
            </div>

            <button
              type="submit"
              class="btn bg-orange text-white w-100 fw-bold py-2 rounded-1 shadow-sm"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ" }}
            </button>
          </form>
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
