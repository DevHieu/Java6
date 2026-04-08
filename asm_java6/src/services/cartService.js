import axios from "axios";

export const getCart = async () => {
  const res = await axios.get("/cart");
  return res.data;
};

export const addToCart = async (bookId, quantity = 1) => {
  const res = await axios.post("/cart/add", null, {
    params: { bookId, quantity },
  });
  return res.data;
};

export const updateQuantity = async (id, qty) => {
  const res = await axios.put("/cart/update", null, {
    params: { id, qty },
  });
  return res.data;
};

export const removeItem = async (id) => {
  const res = await axios.delete(`/cart/remove/${id}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await axios.delete("/cart/clear");
  return res.data;
};
