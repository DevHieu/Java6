import axios from "axios";

export const getPublishers = () => axios.get("/api/admin/publishers").then(r => r.data);
export const createPublisher = (data) => axios.post("/api/admin/publishers", data).then(r => r.data);
export const updatePublisher = (data) => axios.put("/api/admin/publishers", data).then(r => r.data);
export const deletePublisher = (id) => axios.delete(`/api/admin/publishers/${id}`).then(r => r.data);
