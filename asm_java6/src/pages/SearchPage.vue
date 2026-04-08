<script setup>
import { useRoute, useRouter } from "vue-router";
import { findByKeyword } from "@/services/bookService";
import { getAll } from "@/services/categoryService";
import { ref, watch, onMounted } from "vue";

const route = useRoute();
const router = useRouter();

// Trạng thái dữ liệu
const results = ref([]);
const suggestions = ref([]); // Cho phần gợi ý khi không tìm thấy
const categories = ref([]);
const totalPages = ref(0);
const isEmpty = ref(false);

// Trạng thái bộ lọc (Gom nhóm để dễ quản lý)
const filters = ref({
  keyword: route.query.keyword || "",
  category: route.query.category || "",
  minPrice: route.query.minPrice || "",
  maxPrice: route.query.maxPrice || "",
  sort: route.query.sort || "",
  page: parseInt(route.query.page) || 1,
});

// Hàm gọi API chính
const fetchResults = async () => {
  const response = await findByKeyword(
    filters.value.keyword,
    filters.value.page - 1, // Spring Boot bắt đầu từ 0
    12,
    filters.value
  );

  results.value = response.content;
  totalPages.value = response.totalPages;
  isEmpty.value = response.empty;

  if (isEmpty.value) {
    // suggestions.value = await getTopBook();
  }
};

onMounted(async () => {
  categories.value = await getAll();
});

watch(
  () => route.query,
  (newQuery) => {
    filters.value = {
      keyword: newQuery.keyword || "",
      category: newQuery.category || "",
      minPrice: newQuery.minPrice || "",
      maxPrice: newQuery.maxPrice || "",
      sort: newQuery.sort || "",
      page: parseInt(newQuery.page) || 1,
    };
    fetchResults();
  },
  { immediate: true, deep: true }
);

// Hàm thực hiện lọc (Cập nhật URL)
const handleFilter = () => {
  filters.value.page = 1; // Reset về trang 1 khi lọc mới
  router.push({ path: "/search", query: filters.value });
};

// Hàm chuyển trang
const changePage = (p) => {
  if (p < 1 || p > totalPages.value) return;
  router.push({ path: "/search", query: { ...filters.value, page: p } });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price || 0);
};

const getImage = (imgName) => {
  return imgName ? `/books/${imgName}` : "/books/default-book.png";
};
</script>

<template>
  <div class="search-page">
    <div class="header-gradient py-5 text-center">
      <router-link
        to="/"
        class="link-dark link-offset-2 link-underline-opacity-0 fw-medium back-home"
      >
        Trang chủ
      </router-link>
      <h1 class="fw-bold text-white">Tìm kiếm</h1>
    </div>

    <div class="search-body">
      <!-- FILTER BAR -->
      <div class="filter-bar">
        <div class="filter-group">
          <label class="filter-label">Danh mục</label>
          <select v-model="filters.category" class="filter-select">
            <option value="">Tất cả</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Giá từ</label>
          <input
            type="number"
            v-model="filters.minPrice"
            class="filter-input"
            placeholder="0đ"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">Giá đến</label>
          <input
            type="number"
            v-model="filters.maxPrice"
            class="filter-input"
            placeholder="∞"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">Sắp xếp</label>
          <select v-model="filters.sort" class="filter-select">
            <option value="">Mặc định</option>
            <option value="az">Tên A → Z</option>
            <option value="za">Tên Z → A</option>
            <option value="priceAsc">Giá thấp → cao</option>
            <option value="priceDesc">Giá cao → thấp</option>
          </select>
        </div>

        <button @click="handleFilter" class="filter-btn">
          <i class="bi bi-sliders2"></i> Lọc
        </button>
      </div>

      <!-- LOADING SKELETON -->
      <div v-if="isLoading" class="books-grid">
        <div v-for="i in 8" :key="i" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-line long"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="isEmpty" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Không tìm thấy kết quả</h3>
        <p>Thử tìm với từ khóa khác hoặc bỏ bộ lọc đang áp dụng</p>
        <button @click="router.push('/search')" class="filter-btn mt-3">
          Xóa bộ lọc
        </button>
      </div>

      <!-- BOOK GRID -->
      <div v-else class="books-grid">
        <div
          class="book-card"
          v-for="(book, index) in results"
          :key="book.id"
          :style="{ animationDelay: `${index * 40}ms` }"
        >
          <router-link :to="`/detail/${book.id}`" class="book-img-wrap">
            <img
              :src="getImage(book.image)"
              :alt="book.title"
              class="book-img"
            />
            <div class="book-overlay">
              <span class="overlay-text">Xem chi tiết</span>
            </div>
          </router-link>

          <div class="book-info">
            <router-link :to="`/detail/${book.id}`" class="book-title">
              {{ book.title }}
            </router-link>
            <div class="book-pricing">
              <span class="book-price">{{ formatPrice(book.price) }}đ</span>
              <span v-if="book.oldPrice" class="book-old-price">
                {{ formatPrice(book.oldPrice) }}đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.back-home {
  text-decoration: none;
  font-weight: 500;
  transition: 150ms;
  color: white !important;
}

.back-home:hover {
  color: rgb(216, 204, 204) !important;
}

.search-content-wrapper {
  max-width: 80%;
  margin: 0 auto;
}

.img-wrapper {
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  border-radius: 6px;
  overflow: hidden;
}

.img-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.book-title {
  font-size: 14px;
  min-height: 40px;
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.pagination .page-link {
  color: #b13b3b;
  border-color: #f5afaf;
  background-color: #fbefef;
}

.pagination .page-item.active .page-link {
  color: #fff;
  background-color: #b13b3b;
  border-color: #b13b3b;
}

.btn-filter {
  background-color: #bde8f5;
  color: #0e21a0;
  border: 1px solid #0e21a0;
  font-weight: 600;
  transition: all 0.25s ease;
}

.btn-filter:hover {
  background-color: #0e21a0;
  color: #fff;
}

.search-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.filter-bar {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  background: #fff;
  border-radius: var(--radius);
  padding: 20px 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07), 0 0 0 1px var(--border);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 120px;
}

.filter-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--muted);
}

.filter-select,
.filter-input {
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: "DM Sans", sans-serif;
  color: var(--ink);
  background: #fafafa;
  transition: border-color var(--transition), box-shadow var(--transition);
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.filter-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238a8a8a' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.filter-select:focus,
.filter-input:focus {
  border-color: var(--red);
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.1);
  background: #fff;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background-color: var(--green-2-opacity);
  color: var(--green-1);
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  font-family: "DM Sans", sans-serif;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
  align-self: flex-end;
}

.filter-btn:hover {
  background: var(--green-1);
  color: var(--wheat);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--green-2-opacity);
}

.filter-btn:active {
  transform: translateY(0);
}

/* ─── BOOK GRID ─── */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.book-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--border);
  transition: transform var(--transition), box-shadow var(--transition);
  animation: fadeUp 0.4s ease both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.book-img-wrap {
  display: block;
  position: relative;
  height: 220px;
  background: #f5f5f3;
  overflow: hidden;
}

.book-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  transition: transform var(--transition);
}

.book-card:hover .book-img {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 26, 26, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition);
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.overlay-text {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 6px 16px;
}

.book-info {
  padding: 14px 16px 16px;
}

.book-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  text-decoration: none;
  line-height: 1.45;
  min-height: 40px;
  margin-bottom: 10px;
  transition: color var(--transition);
}

.book-card:hover .book-info .book-title {
  color: var(--red-2);
}

.book-pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: var(--red-2);
}

.book-price {
  font-size: 16px;
  font-weight: 700;
  color: var(--red);
}

.book-old-price {
  font-size: 13px;
  color: var(--muted);
  text-decoration: line-through;
}

/* ─── SKELETON ─── */
.skeleton-card {
  background: #fff;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  padding-bottom: 16px;
}

.skeleton-img {
  height: 220px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  margin: 12px 16px 0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line.long {
  width: 75%;
}
.skeleton-line.short {
  width: 45%;
  margin-top: 8px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ─── EMPTY STATE ─── */
.empty-state {
  text-align: center;
  padding: 80px 24px;
  color: var(--ink);
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-family: "DM Serif Display", serif;
  font-weight: 400;
  font-size: 24px;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--muted);
  font-size: 15px;
}
</style>
