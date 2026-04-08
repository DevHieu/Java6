// Hàm lưu dữ liệu có kèm thời gian sống (ttl tính bằng miligiây)
export const setLocalStorageWithExpiry = (key, value, ttl) => {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttl, // Thời điểm hiện tại + thời gian sống
  };
  localStorage.setItem(key, JSON.stringify(item));
};

// Hàm lấy dữ liệu và kiểm tra xem đã hết hạn chưa
export const getLocalStorageWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  // So sánh thời gian hiện tại với thời gian hết hạn
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key); // Hết hạn thì xóa luôn cho sạch
    return null;
  }
  return item.value;
};
