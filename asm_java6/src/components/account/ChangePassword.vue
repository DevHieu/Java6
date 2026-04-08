<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { changePassword } from "@/services/userService";
import axios from "axios";

const authStore = useAuthStore();
const form = ref({ oldPass: "", newPass: "", confirmPass: "" });
const loading = ref(false);
const errorMessage = ref("");

const handleUpdatePassword = async () => {
  // 1. Validate nhanh tại Frontend
  if (form.value.newPass !== form.value.confirmPass) {
    errorMessage.value = "Mật khẩu xác nhận không khớp!";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    const res = await changePassword({
      email: authStore.currentUser.email,
      oldPassword: form.value.oldPass,
      newPassword: form.value.newPass,
    });

    alert(res.data.message || "Đổi mật khẩu thành công!");

    // 3. Reset form sau khi thành công
    form.value = { oldPass: "", newPass: "", confirmPass: "" };
  } catch (err) {
    console.log("Full Error Object:", err.response);
    const backendMessage = err.response?.data?.message || err.response?.data;

    errorMessage.value = backendMessage || "Đổi mật khẩu thất bại!";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="card border-0 shadow-sm rounded-4 p-4">
    <h4 class="mb-4 text-uppercase fw-bold">Đổi mật khẩu</h4>

    <div v-if="errorMessage" class="alert alert-danger small py-2">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleUpdatePassword" style="max-width: 500px">
      <div class="mb-3 text-start">
        <label class="form-label fw-bold small">Mật khẩu hiện tại</label>
        <input
          type="password"
          v-model="form.oldPass"
          class="form-control"
          placeholder="Nhập mật khẩu cũ"
          required
        />
      </div>
      <div class="mb-3 text-start">
        <label class="form-label fw-bold small">Mật khẩu mới</label>
        <input
          type="password"
          v-model="form.newPass"
          class="form-control"
          placeholder="Nhập mật khẩu mới"
          required
        />
      </div>
      <div class="mb-3 text-start">
        <label class="form-label fw-bold small">Xác nhận mật khẩu</label>
        <input
          type="password"
          v-model="form.confirmPass"
          class="form-control"
          placeholder="Nhập lại mật khẩu"
          required
        />
      </div>

      <button
        type="submit"
        class="btn btn-addtocart px-5 py-2 mt-3 rounded-pill fw-bold"
        :disabled="loading"
      >
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-2"
        ></span>
        Xác nhận đổi
      </button>
    </form>
  </div>
</template>
