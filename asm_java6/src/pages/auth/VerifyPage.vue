<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { verifyOtp, register } from "@/services/authService";

import AuthHeader from "@/components/AuthHeader.vue";

const route = useRoute();
const router = useRouter();
const email = route.query.email || "người dùng";
const otpInputs = ref(["", "", "", "", "", ""]);
const inputRefs = ref([]);
const error = ref("");

// Tự động focus ô đầu tiên khi vào trang
onMounted(() => {
  inputRefs.value[0]?.focus();
});

const handleInput = (index, event) => {
  const val = event.target.value;

  // Chỉ cho phép nhập số
  if (!/^\d*$/.test(val)) {
    otpInputs.value[index] = "";
    return;
  }

  if (val && index < 5) {
    inputRefs.value[index + 1].focus();
  }

  if (otpInputs.value.every((v) => v !== "")) {
    handleVerify();
  }
};

const handleBackspace = (index, event) => {
  if (event.key === "Backspace" && !otpInputs.value[index] && index > 0) {
    inputRefs.value[index - 1].focus();
  }
};

const handleVerify = async () => {
  const otpCode = otpInputs.value.join("");
  if (otpCode.length < 6) {
    error.value = "Vui lòng nhập đủ 6 số!";
    return;
  }

  try {
    const res = await verifyOtp(otpCode);

    if (res === "REGISTER_SUCCESS") {
      alert("Đăng ký thành công!");
      router.push("/auth/login");
    } else if (res === "OTP_VALID_FOR_RESET") {
      // Đúng mã cho luồng quên mật khẩu -> Sang trang nhập pass mới
      router.push("/auth/reset-password");
    }
  } catch (err) {
    error.value = err.response?.data || "Mã OTP không chính xác!";
  }
};

// Gửi lại mã
const handleResend = async () => {
  try {
    await register({ email: email }); // Gọi lại hàm gửi mail
    alert("Mã mới đã được gửi!");
  } catch (err) {
    error.value = "Không thể gửi lại mã lúc này.";
  }
};
</script>

<template>
  <AuthHeader title="Xác thực OTP" />
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 text-center shadow p-5 bg-white rounded">
        <h4 class="fw-bold">Xác thực mã OTP</h4>
        <p class="text-muted">
          Mã xác thực đã được gửi đến: <br />
          <strong class="text-dark">{{ email }}</strong>
        </p>

        <div v-if="error" class="alert alert-danger py-2 small">
          {{ error }}
        </div>

        <div class="d-flex justify-content-center gap-2 mb-3">
          <input
            v-for="(digit, index) in 6"
            :key="index"
            type="text"
            maxlength="1"
            class="form-control text-center fw-bold"
            style="width: 45px; height: 50px"
            v-model="otpInputs[index]"
            :ref="(el) => (inputRefs[index] = el)"
            @input="handleInput(index, $event)"
            @keydown="handleBackspace(index, $event)"
          />
        </div>

        <button
          @click="handleVerify"
          class="btn mt-3 w-100 bg-orange text-white fw-bold py-2 shadow-sm"
        >
          XÁC NHẬN
        </button>

        <div class="mt-4">
          <small class="text-muted"
            >Không nhận được mã?
            <button
              @click="handleResend"
              class="btn btn-link text-primary text-decoration-none fw-bold p-0 small"
            >
              Thử lại
            </button>
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
