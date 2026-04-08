<script setup>
import { watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getById, getRelatedBooks } from "@/services/bookService";
import { useCartStore } from "@/stores/cartStore";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const book = ref(null);
const relatedBooks = ref([]);
const buyQuantity = ref(1);
const addingToCart = ref(false);
const successMsg = ref("");
const loaded = ref(false);

const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value || 0) + "đ";
};

const getImage = (imgName) => {
  return imgName ? `/books/${imgName}` : "/books/default-book.png";
};

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      loaded.value = false;
      const data = await getById(newId);
      book.value = data;
      if (data && data.category) {
        relatedBooks.value = await getRelatedBooks(data.category.id, newId);
      }
      buyQuantity.value = 1;
      setTimeout(() => (loaded.value = true), 50);
    }
  },
  { immediate: true },
);

const addToCart = async (buyNow = false) => {
  try {
    addingToCart.value = true;
    await cartStore.addToCart(book.value.id, buyQuantity.value);
    if (buyNow) {
      router.push("/cart");
    } else {
      successMsg.value = `Đã thêm ${buyQuantity.value} cuốn vào giỏ hàng!`;
      setTimeout(() => (successMsg.value = ""), 2500);
    }
  } catch (err) {
    if (err.response?.status === 401) {
      router.push("/auth/login");
    } else {
      alert(
        "Lỗi khi thêm vào giỏ: " + (err.response?.data?.message || err.message),
      );
    }
  } finally {
    addingToCart.value = false;
  }
};
</script>

<template>
  <!-- LOADING -->
  <div v-if="!book" class="container my-5 text-center">
    <div class="spinner-border text-danger" role="status"></div>
    <p class="mt-2 text-muted">Đang tải thông tin sách...</p>
  </div>

  <div v-else class="detail-page" :class="{ 'is-loaded': loaded }">
    <!-- TOAST -->
    <transition name="toast">
      <div v-if="successMsg" class="toast-msg">
        <i class="bi bi-check-circle-fill me-2"></i>{{ successMsg }}
      </div>
    </transition>

    <div class="container py-5">
      <!-- TOP SECTION -->
      <div class="row g-5 align-items-start">
        <!-- ẢNH -->
        <div class="col-md-5 slide-left">
          <div class="book-img-frame">
            <div class="img-glow"></div>
            <img
              class="book-cover"
              :src="getImage(book.image)"
              :alt="book.title"
            />
          </div>
        </div>

        <!-- INFO -->
        <div class="col-md-7 slide-right">
          <span v-if="book.category" class="category-badge">
            {{ book.category.name }}
          </span>

          <h1 class="book-title">{{ book.title }}</h1>

          <p class="book-author">
            <i class="bi bi-person me-1"></i>
            {{ book.authorName || "Chưa cập nhật" }}
          </p>

          <div class="price-row">
            <span class="price-main">{{ formatPrice(book.price) }}</span>
            <span
              class="stock-badge"
              :class="book.quantity > 0 ? 'in-stock' : 'out-stock'"
            >
              {{ book.quantity > 0 ? `Còn ${book.quantity} cuốn` : "Hết hàng" }}
            </span>
          </div>

          <div class="divider"></div>

          <div class="buy-section">
            <div class="qty-control">
              <button
                class="qty-btn"
                @click="buyQuantity = Math.max(1, buyQuantity - 1)"
                :disabled="book.quantity <= 0"
              >
                −
              </button>
              <input
                type="number"
                v-model="buyQuantity"
                class="qty-input"
                min="1"
                :max="book.quantity"
                :disabled="book.quantity <= 0"
              />
              <button
                class="qty-btn"
                @click="buyQuantity = Math.min(book.quantity, buyQuantity + 1)"
                :disabled="book.quantity <= 0"
              >
                +
              </button>
            </div>

            <div class="btn-group-buy">
              <button
                @click="addToCart(false)"
                class="btn-addcart"
                :disabled="book.quantity <= 0 || addingToCart"
              >
                <span
                  v-if="addingToCart"
                  class="spinner-border spinner-border-sm"
                ></span>
                <i v-else class="bi bi-bag"></i>
                Thêm vào giỏ
              </button>
              <button
                @click="addToCart(true)"
                class="btn-addtocart"
                :disabled="book.quantity <= 0 || addingToCart"
              >
                <i class="bi bi-lightning-fill"></i> Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MÔ TẢ CHI TIẾT -->
      <div class="detail-section slide-up">
        <button
          class="detail-toggle"
          data-bs-toggle="collapse"
          data-bs-target="#detailCollapse"
        >
          Thông tin chi tiết <i class="bi bi-chevron-down arrow"></i>
        </button>

        <div class="collapse show" id="detailCollapse">
          <div class="detail-grid">
            <div class="detail-item" v-if="book.publishDate">
              <span class="detail-label">Ngày xuất bản</span>
              <span class="detail-value">{{ book.publishDate }}</span>
            </div>
            <div class="detail-item" v-if="book.dimensions">
              <span class="detail-label">Kích thước</span>
              <span class="detail-value">{{ book.dimensions }}</span>
            </div>
            <div class="detail-item" v-if="book.translator">
              <span class="detail-label">Dịch giả</span>
              <span class="detail-value">{{ book.translator }}</span>
            </div>
            <div class="detail-item" v-if="book.coverType">
              <span class="detail-label">Loại bìa</span>
              <span class="detail-value">{{ book.coverType }}</span>
            </div>
            <div class="detail-item" v-if="book.pageCount">
              <span class="detail-label">Số trang</span>
              <span class="detail-value">{{ book.pageCount }}</span>
            </div>
          </div>
          <div
            class="book-desc"
            v-html="book.description || 'Chưa có mô tả chi tiết.'"
          ></div>
        </div>
      </div>

      <!-- SẢN PHẨM LIÊN QUAN -->
      <div class="related-section slide-up" style="animation-delay: 0.15s">
        <h2 class="section-title">Sản phẩm liên quan</h2>

        <div class="related-grid">
          <div
            class="related-card"
            v-for="(rel, i) in relatedBooks"
            :key="rel.id"
            :style="{ animationDelay: `${i * 60}ms` }"
          >
            <router-link :to="`/detail/${rel.id}`" class="related-img-wrap">
              <img :src="getImage(rel.image)" :alt="rel.title" />
              <div class="related-overlay"><span>Xem</span></div>
            </router-link>
            <div class="related-info">
              <router-link :to="`/detail/${rel.id}`" class="related-title">{{
                rel.title
              }}</router-link>
              <span class="related-price">{{ formatPrice(rel.price) }}</span>
            </div>
          </div>
          <p
            v-if="relatedBooks.length === 0"
            class="text-muted text-center w-100 py-3"
          >
            Hiện chưa có sản phẩm liên quan.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── SLIDE ANIMATIONS ─── */
.slide-left {
  opacity: 0;
  transform: translateX(-28px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.slide-right {
  opacity: 0;
  transform: translateX(28px);
  transition: opacity 0.55s ease, transform 0.55s ease;
  transition-delay: 0.08s;
}
.slide-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.is-loaded .slide-left,
.is-loaded .slide-right,
.is-loaded .slide-up {
  opacity: 1;
  transform: none;
}

/* ─── TOAST ─── */
.toast-msg {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  background: #1a1a1a;
  color: #fff;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
}
.toast-msg i {
  color: #4ade80;
}
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* ─── BOOK IMAGE ─── */
.book-img-frame {
  position: relative;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  border-radius: 16px;
  background: linear-gradient(145deg, #f8f6f3, #f0ece6);
  padding: 28px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04), 0 12px 40px rgba(0, 0, 0, 0.08);
}
.img-glow {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 40px;
  background: rgba(0, 0, 0, 0.12);
  filter: blur(20px);
  border-radius: 50%;
}
.book-cover {
  width: 100%;
  height: 380px;
  object-fit: contain;
  border-radius: 6px;
  transition: transform 0.4s ease;
  display: block;
}
.book-img-frame:hover .book-cover {
  transform: scale(1.03) translateY(-4px);
}

/* ─── INFO ─── */
.category-badge {
  display: inline-block;
  background: #fef3f2;
  color: #c0392b;
  border: 1px solid #fecaca;
  border-radius: 20px;
  padding: 3px 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 14px;
}
.book-title {
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  margin-bottom: 10px;
}
.book-author {
  color: #6b6b6b;
  font-size: 15px;
  margin-bottom: 16px;
}
.price-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}
.price-main {
  font-size: 32px;
  font-weight: 800;
  color: #c0392b;
  letter-spacing: -0.5px;
}
.stock-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}
.in-stock {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
.out-stock {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.divider {
  height: 1px;
  background: #f0f0f0;
  margin: 20px 0;
}

/* ─── BUY SECTION ─── */
.buy-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.qty-control {
  display: flex;
  align-items: center;
  width: fit-content;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  overflow: hidden;
}
.qty-btn {
  width: 40px;
  height: 42px;
  background: #f8f8f8;
  border: none;
  font-size: 18px;
  color: #444;
  cursor: pointer;
  transition: background 0.15s;
}
.qty-btn:hover:not(:disabled) {
  background: #efefef;
}
.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.qty-input {
  width: 52px;
  height: 42px;
  text-align: center;
  border: none;
  border-left: 1.5px solid #e5e5e5;
  border-right: 1.5px solid #e5e5e5;
  font-size: 15px;
  font-weight: 600;
  outline: none;
  color: #1a1a1a;
}
.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.btn-group-buy {
  display: flex;
  gap: 12px;
}
.btn-addcart,
.btn-buynow {
  flex: 1;
  padding: 13px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.btn-addcart {
  background: #fff;
  color: #c0392b;
  border: 2px solid #c0392b;
}
.btn-addcart:hover:not(:disabled) {
  background: #fef3f2;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(192, 57, 43, 0.15);
}
.btn-buynow {
  background: #c0392b;
  color: #fff;
}
.btn-buynow:hover:not(:disabled) {
  background: #a93226;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(192, 57, 43, 0.3);
}
.btn-addcart:disabled,
.btn-buynow:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

/* ─── DETAIL SECTION ─── */
.detail-section {
  margin-top: 48px;
  border-top: 1px solid #f0f0f0;
  padding-top: 32px;
}
.detail-toggle {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 0 20px;
}
.arrow {
  transition: transform 0.3s ease;
  font-size: 16px;
  color: #888;
}
button:not(.collapsed) .arrow {
  transform: rotate(180deg);
}
button.collapsed .arrow {
  transform: rotate(0deg);
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #f0f0f0;
}
.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.detail-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #999;
}
.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.book-desc {
  font-size: 15px;
  line-height: 1.75;
  color: #444;
}

/* ─── RELATED ─── */
.related-section {
  margin-top: 48px;
}
.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
}
.related-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ebebeb;
  background: #fff;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
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
.related-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.09);
}
.related-img-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 190px;
  background: #f5f5f3;
  overflow: hidden;
}
.related-img-wrap img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  padding: 12px;
  transition: transform 0.3s ease;
}
.related-overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 26, 26, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.22s ease;
}
.related-overlay span {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 5px 16px;
}
.related-card:hover .related-img-wrap img {
  transform: scale(1.06);
}
.related-card:hover .related-overlay {
  opacity: 1;
}
.related-info {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.related-title {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px;
  line-height: 1.4;
  transition: color 0.15s;
}
.related-title:hover {
  color: #c0392b;
}
.related-price {
  font-size: 15px;
  font-weight: 700;
  color: #c0392b;
}
</style>
