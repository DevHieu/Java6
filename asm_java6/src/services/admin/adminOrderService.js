import axios from "axios";

export const getOrders = (params) => axios.get("/api/admin/orders", { params }).then(r => r.data);
export const getOrderDetail = (id) => axios.get(`/api/admin/orders/${id}`).then(r => r.data);
export const updateOrder = (data) => axios.put("/api/admin/orders", data).then(r => r.data);
export const deleteOrder = (id) => axios.delete(`/api/admin/orders/${id}`).then(r => r.data);
