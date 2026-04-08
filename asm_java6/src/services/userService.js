import axios from "axios";

export const getCurrentUser = async (email) => {
  const res = await axios.get(`/users/me?email=${email}`);
  return res.data;
};

export const updateProfile = async (userData) => {
  const res = await axios.put("/users/update", userData);
  return res;
};

export const changePassword = async (passwordData) => {
  const res = await axios.put("/users/change-password", passwordData);
  return res;
};
