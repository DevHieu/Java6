import axios from "axios";

export const getAll = async () => {
  const res = await axios.get("/categories");
  return res.data;
};
