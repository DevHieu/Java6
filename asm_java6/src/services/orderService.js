import axios from "axios";

export const placeOrder = async (payload) => {
  const res = await axios.post("/checkout", payload);
  return res.data;
};

export const getOrders = async () => {
  const res = await axios.get("/orders");
  return res.data;
};

export const getOrderDetail = async (id) => {
  const res = await axios.get(`/orders/${id}`);
  return res.data;
};

export const getPurchasedBooks = async () => {
  const res = await axios.get("/orders/purchased-books");
  return res.data;
};

export const getCheckoutInfo = async () => {
  const res = await axios.get("/checkout/info");
  return res.data;
};
