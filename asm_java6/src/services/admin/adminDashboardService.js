import axios from "axios";

export const getDashboard = (tab = "category", keyword = "") =>
  axios.get("/api/admin/dashboard", { params: { tab, keyword } }).then(r => r.data);
