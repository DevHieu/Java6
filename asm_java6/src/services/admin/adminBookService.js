import axios from "axios";

export const getBooks = () => axios.get("/api/admin/books").then((r) => r.data);
export const getBookById = (id) =>
  axios.get(`/api/admin/books/${id}`).then((r) => r.data);
export const createBook = (data) =>
  axios.post("/api/admin/books", data).then((r) => r.data);
export const updateBook = (data) =>
  axios.put("/api/admin/books", data).then((r) => r.data);
export const deleteBook = (id) =>
  axios.delete(`/api/admin/books/${id}`).then((r) => r.data);
export const uploadBookImage = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios
    .post("/api/admin/books/upload-image", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data.fileName);
};
