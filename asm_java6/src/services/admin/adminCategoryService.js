import axios from "axios";

export const getCategories = () => axios.get("/api/admin/categories").then(r => r.data);
export const createCategory = (data) => axios.post("/api/admin/categories", data).then(r => r.data);
export const updateCategory = (data) => axios.put("/api/admin/categories", data).then(r => r.data);
export const deleteCategory = (id) => axios.delete(`/api/admin/categories/${id}`).then(r => r.data);
