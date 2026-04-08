import axios from "axios";

export const getCustomers = (params) => axios.get("/api/admin/customers", { params }).then(r => r.data);
export const getCustomerDetail = (email) => axios.get(`/api/admin/customers/${email}`).then(r => r.data);
export const createCustomer = (data) => axios.post("/api/admin/customers", data).then(r => r.data);
export const updateCustomer = (data) => axios.put("/api/admin/customers", data).then(r => r.data);
export const toggleCustomer = (email) => axios.post(`/api/admin/customers/${email}/toggle`).then(r => r.data);
