import axios from "axios";

export const getById = async (id) => {
  const res = await axios.get(`/books/${id}`);
  return res.data;
};

export const getNewestBook = async () => {
  const res = await axios.get("/books/newest");
  return res.data.content;
};

export const getTopBook = async () => {
  const res = await axios.get("/books/top");
  return res.data.content;
};

export const getByCategory = async (categoryId) => {
  console.log(categoryId);
  const res = await axios.get(
    `/books/by-category${categoryId ? `?categoryId=${categoryId}` : ""}`
  );
  console.log(res);
  return res.data.content;
};

export const findByKeyword = async (keyword, page, size, filters) => {
  const response = await axios.get("/books/search", {
    params: {
      keyword: keyword,
      page: page,
      size: size,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
    },
  });
  return response.data;
};

export const getRelatedBooks = async (categoryId, bookId) => {
  const response = await axios.get("/books/related", {
    params: {
      categoryId: categoryId,
      bookId: bookId,
    },
  });

  console.log(response.data);
  return response.data;
};
