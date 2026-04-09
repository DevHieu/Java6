import axios from "axios";

// ĐĂNG NHẬP
export const login = async (loginForm) => {
  const res = await axios.post("/api/auth/login", loginForm);
  return res.data;
};

// ĐĂNG NHẬP BẰNG GOOGLE
export const googleLogin = async (idToken) => {
  const res = await axios.post("/api/auth/google", { idToken });
  return res.data;
};

// ĐĂNG XUẤT
export const logout = async () => {
  await axios.post("/api/auth/logout");
};

// ĐĂNG KÝ
export const register = async (form) => {
  const res = await axios.post("/api/auth/register", form);
  return res.data;
};

// XÁC THỰC OTP
export const verifyOtp = async (otpCode) => {
  const res = await axios.post("/api/auth/verify-otp", null, {
    params: { otpCode },
  });
  return res.data; // có thể chứa token nếu là register
};

// QUÊN MẬT KHẨU
export const forgotPassword = async (email) => {
  const res = await axios.post("/api/auth/forgot-password", null, {
    params: { email },
  });
  return res.data;
};

// ĐỔI MẬT KHẨU
export const resetPassword = async (newPassword) => {
  const res = await axios.post("/api/auth/change-password", null, {
    params: { newPassword },
  });
  return res.data;
};
