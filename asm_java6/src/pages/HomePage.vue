<template>
  <div class="container-fluid m-0 p-0">
    <section class="mb-5">
      <div
        id="carouselExampleIndicators"
        class="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="/src/assets/slider_3.png" class="d-block w-100" />
          </div>
          <div class="carousel-item">
            <img src="/src/assets/slider_4.png" class="d-block w-100" />
          </div>
          <div class="carousel-item">
            <img src="/src/assets/slider_5.png" class="d-block w-100" />
          </div>
        </div>
      </div>
    </section>

    <section class="mb-5 container-90">
      <div class="text-center mb-4">
        <h2 class="text-uppercase fw-bold text-red-1">
          Top 8 Sản Phẩm Bán Chạy
        </h2>
        <div
          class="d-inline-block border-bottom border-green-1 border-3"
          style="width: 50px"
        ></div>
      </div>

      <div class="row gy-5 gx-4">
        <div class="col-6 col-md-3" v-for="book in topBooks" :key="book.id">
          <div class="card h-100 shadow-sm product-card">
            <router-link :to="`/detail/${book.id}`">
              <div class="product-img-wrapper">
                <img class="product-img" :src="getImage(book.image)" />
              </div>
            </router-link>

            <div class="card-body d-flex flex-column wheat-background">
              <small class="text-muted mb-1">{{ book.authorName }}</small>
              <h6 class="fw-bold">{{ book.title }}</h6>
              <div class="mt-auto">
                <div class="fw-bold text-danger fs-5 mb-2">
                  {{ formatPrice(book.price) }}đ
                </div>
                <button
                  class="btn btn-sm btn-addtocart w-100"
                  @click="addToCart(book.id)"
                >
                  <i class="fas fa-shopping-cart me-1"></i> Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-5 container-90">
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <div class="overflow-hidden rounded shadow-sm group-hover">
            <img src="@/assets/slider_1.png" class="w-100 small-banner-img" />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="overflow-hidden rounded shadow-sm group-hover">
            <img src="@/assets/slider_2.png" class="w-100 small-banner-img" />
          </div>
        </div>
      </div>
    </section>

    <section v-if="lastestBook" class="mb-5 container-90">
      <div class="text-center mb-5">
        <h2 class="text-uppercase fw-bold text-red-1">Sách Mới Phát Hành</h2>
        <div
          class="d-inline-block border-bottom border-green-1 border-3"
          style="width: 50px"
        ></div>
      </div>

      <div class="row align-items-center">
        <div class="col-12 col-md-4 mb-4 mb-md-0">
          <span class="badge bg-warning text-dark mb-2">Mới Phát Hành</span>
          <h3 class="fw-bold display-6">{{ lastestBook.title }}</h3>
          <p class="text-muted lead fs-6">{{ lastestBook.description }}</p>
          <div class="d-flex align-items-end mb-4">
            <span class="fw-bold text-red-2 display-6"
              >{{ formatPrice(lastestBook.price) }}đ</span
            >
          </div>
          <button
            @click="addToCart(lastestBook.id)"
            class="btn btn-addtocart btn-lg rounded-pill px-4 w-100 shadow"
          >
            <i class="fas fa-shopping-cart me-2"></i> ĐẶT MUA SÁCH NGAY
          </button>
          <div class="mt-2 text-center text-muted small">
            <i class="fas fa-truck me-1"></i> Miễn phí vận chuyển toàn quốc
          </div>
        </div>

        <div class="col-12 col-md-4 text-center mb-4 mb-md-0">
          <router-link :to="`/detail/${lastestBook.id}`">
            <img
              :src="getImage(lastestBook.image)"
              class="rounded shadow-lg bg-noibat"
            />
          </router-link>
        </div>

        <div class="col-12 col-md-4">
          <h5 class="fw-bold mb-3 border-start border-4 border-green-1 ps-2">
            Có thể bạn quan tâm
          </h5>
          <div class="row row-cols-2 g-3">
            <div
              class="col"
              v-for="related in relatedNewBooks"
              :key="related.id"
            >
              <div class="card h-100 border-0">
                <router-link
                  :to="`/detail/${related.id}`"
                  class="text-decoration-none wheat-background"
                >
                  <div class="product-img-wrapper sm-wrapper rounded">
                    <img class="product-img" :src="getImage(related.image)" />
                  </div>
                  <div class="card-body p-2 text-center border-none">
                    <h3
                      class="card-title fs-6 mb-1 text-truncate text-dark fw-bold"
                    >
                      {{ related.title }}
                    </h3>
                    <div class="fw-bold text-danger small">
                      {{ formatPrice(related.price) }}đ
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-5 pb-5">
      <div class="text-center mb-3">
        <h2 class="text-uppercase fw-bold">Sách Dành Cho Bạn</h2>
      </div>

      <div class="d-flex justify-content-center mb-4 gap-2">
        <button
          class="btn btn-outline-red fw-bold"
          :class="{ active: selectedCate === null }"
          @click="getBookByCategory(null)"
        >
          Tất cả
        </button>
        <button
          v-for="cate in categories"
          :key="cate.id"
          class="btn btn-outline-red fw-bold"
          :class="{ active: selectedCate === cate.id }"
          @click="getBookByCategory(cate.id)"
        >
          {{ cate.name }}
        </button>
      </div>

      <div class="row g-4 container-90">
        <div class="col-6 col-md-3" v-for="book in booksForYou" :key="book.id">
          <div class="card h-100 shadow-sm product-card">
            <router-link :to="`/detail/${book.id}`">
              <div class="product-img-wrapper">
                <img class="product-img" :src="getImage(book.image)" />
              </div>
            </router-link>
            <div class="card-body d-flex flex-column wheat-background">
              <small class="text-muted mb-1">{{ book.authorName }}</small>
              <h6 class="fw-bold">{{ book.title }}</h6>
              <div class="mt-auto">
                <div class="fw-bold text-danger fs-5 mb-2">
                  {{ formatPrice(book.price) }}đ
                </div>
                <button
                  class="btn btn-outline-dark w-100 btn-addtocart fw-semibold"
                  @click="addToCart(book.id)"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getTopBook,
  getNewestBook,
  getByCategory,
} from "@/services/bookService";
import { getAll } from "@/services/categoryService";

import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "vue-router";

const router = useRouter();
const cartStore = useCartStore();

const topBooks = ref([]);
const booksForYou = ref([]);
const categories = ref([]);

const lastestBook = ref(null);
const relatedNewBooks = ref([]);

const selectedCate = ref(null);

onMounted(async () => {
  topBooks.value = await getTopBook();
  categories.value = await getAll();

  await getBookByCategory(null); // Load tất cả sách ban đầu

  const newest = await getNewestBook();

  if (newest.length > 0) {
    console.log(newest[0]);
    lastestBook.value = newest[0];
    relatedNewBooks.value = newest.slice(1, 5); // Lấy 4 cuốn tiếp theo làm liên quan
  }
});

const getBookByCategory = async (cateId) => {
  selectedCate.value = cateId;
  booksForYou.value = await getByCategory(cateId);
};

const addToCart = async (id) => {
  try {
    await cartStore.addToCart(id, 1);
    alert("Đã thêm vào giỏ hàng!");
  } catch (err) {
    if (err.response?.status === 401) {
      router.push("/auth/login");
    } else {
      alert(err.response?.data?.message || "Lỗi khi thêm vào giỏ");
    }
  }
};

const getImage = (imgName) => {
  return imgName ? `/books/${imgName}` : "/books/default-book.png";
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};
</script>

<style scoped>
.product-img-wrapper {
  width: 100%;
  height: 420px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img-wrapper:hover .product-img {
  transform: scale(1.05);
}

.product-img-wrapper--sm {
  height: 240px;
}

.product-img-wrapper--sm .product-img {
  object-fit: cover;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.btn-outline-red {
  border-color: var(--red-2);
  color: var(--red-2);
}

.btn-outline-red:hover {
  background-color: var(--red-2);
  color: #fff;
}

.btn-outline-red.active {
  background-color: var(--red-2);
  color: #fff;
}

.border-green-1 {
  border-color: var(--green-1) !important;
}

.bg-noibat {
  background-color: var(--red-1);
  padding: 10px;
}
</style>
