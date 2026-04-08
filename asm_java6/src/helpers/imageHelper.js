const BASE = "http://localhost:8080";

export const getBookImage = (imgName) => {
  if (!imgName) return `${BASE}/uploads/books/default-book.png`;
  return `${BASE}/uploads/books/${imgName}`;
};

export const getAvatarImage = (imgName) => {
  if (!imgName) return `${BASE}/uploads/avatar/default-avatar.png`;
  return `${BASE}/uploads/avatar/${imgName}`;
};
