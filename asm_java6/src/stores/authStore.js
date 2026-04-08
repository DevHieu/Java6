import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { login as apiLogin, logout as apiLogout } from "@/services/authService";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));

  const isLogin = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.isAdmin === true);

  // Set JWT vào axios header mỗi lần gọi
  const setAxiosToken = (t) => {
    console.log(t);
    console.log(user);

    if (t) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Khởi tạo khi app load - đọc token từ localStorage
  const initAuth = () => {
    if (token.value) {
      setAxiosToken(token.value);
    }
  };

  const login = (userData) => {
    token.value = userData.token;
    user.value = {
      email: userData.email,
      fullname: userData.fullname,
      avatar: userData.avatar || "",
      isAdmin: userData.isAdmin,
    };
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(user.value));
    setAxiosToken(userData.token);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (_) {
      // Không cần xử lý lỗi logout
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAxiosToken(null);
    }
  };

  // Gọi sau khi verify OTP register thành công (nhận token từ server)
  const loginWithToken = (data) => {
    token.value = data.token;
    user.value = {
      email: data.email,
      fullname: data.fullname,
      avatar: data.avatar || "",
      isAdmin: false,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(user.value));
    setAxiosToken(data.token);
  };

  const setCurrentUser = (updatedUser) => {
    user.value = {
      email: updatedUser.email,
      fullname: updatedUser.fullname,
      avatar: updatedUser.avatar || "",
      isAdmin: updatedUser.isAdmin ?? user.value?.isAdmin,
    };
    localStorage.setItem("user", JSON.stringify(user.value));
  };

  return {
    token,
    user,
    isLogin,
    isAdmin,
    initAuth,
    login,
    logout,
    loginWithToken,
    setCurrentUser,
  };
});
