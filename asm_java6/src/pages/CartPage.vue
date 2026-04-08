<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();
const { cartItems, cartTotal, loading } = storeToRefs(cartStore);

const stockError = ref("");
const isEmpty = computed(() => cartItems.value.length === 0);

const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value || 0) + " đ";
};

const getImage = (imgName) => {
  return imgName ? `/books/${imgName}` : "/books/default-book.png";
};

onMounted(() => {
  cartStore.fetchCart();
});

const updateQuantity = async (id, qty) => {
  try {
    stockError.value = "";
    await cartStore.updateQuantity(id, qty);
  } catch (err) {
    stockError.value = err.response?.data?.message || "Lỗi cập nhật số lượng";
  }
};

const removeItem = async (id) => {
  await cartStore.removeItem(id);
};

const clearCart = async () => {
  await cartStore.clearCart();
};
</script>

<template>
  <div class="bg-light pb-4 min-vh-100">
    <!-- HEADER -->
    <div class="bg-white border-bottom mb-4">
      <div
        class="container d-flex justify-content-between align-items-center py-3"
      >
        <router-link to="/" class="text-decoration-none text-muted">
          ← Tiếp tục mua sắm
        </router-link>
        <h4 class="fw-bold mb-0">Giỏ hàng</h4>
        <button
          v-if="!isEmpty"
          @click="clearCart"
          class="btn btn-link text-danger text-decoration-none p-0 fw-bold"
        >
          Xóa tất cả
        </button>
        <span v-else></span>
      </div>
    </div>

    <div class="container">
      <!-- LOADING -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">Đang tải giỏ hàng...</p>
      </div>

      <!-- EMPTY CART -->
      <div v-else-if="isEmpty" class="text-center py-5">
        <i class="fa-solid fa-cart-shopping fs-1 text-muted mb-3 d-block"></i>
        <h5 class="fw-bold">Giỏ hàng trống</h5>
        <p class="text-muted">Hãy thêm sản phẩm để tiếp tục mua sắm</p>
        <router-link to="/" class="btn btn-addtocart px-4">
          Khám phá sách
        </router-link>
      </div>

      <!-- CART CONTENT -->
      <div v-else class="row g-4">
        <div
          v-if="stockError"
          class="alert alert-warning alert-dismissible mb-3"
        >
          {{ stockError }}
          <button class="btn-close" @click="stockError = ''"></button>
        </div>
        <!-- LEFT: Danh sách sản phẩm -->
        <div class="col-lg-8">
          <div
            v-for="item in cartItems"
            :key="item.cartDetailId"
            class="bg-white rounded shadow-sm p-4 mb-3"
          >
            <div class="row align-items-center">
              <!-- IMAGE -->
              <div class="col-md-3">
                <img
                  :src="getImage(item.image)"
                  class="img-fluid rounded"
                  style="height: 140px; object-fit: cover"
                  :alt="item.title"
                />
              </div>

              <!-- INFO -->
              <div class="col-md-6">
                <h6 class="fw-bold mb-1">{{ item.title }}</h6>
                <div class="text-muted small">{{ item.author }}</div>
                <div class="text-muted small mb-2">{{ item.category }}</div>
                <span class="fw-bold text-success">
                  {{ formatPrice(item.price) }}
                </span>
              </div>

              <!-- QTY + ACTIONS -->
              <div class="col-md-3 text-end">
                <div
                  class="d-flex justify-content-end align-items-center gap-2"
                >
                  <button
                    class="btn btn-outline-secondary btn-sm"
                    @click="
                      updateQuantity(item.cartDetailId, item.quantity - 1)
                    "
                  >
                    −
                  </button>

                  <span class="fw-bold px-2">{{ item.quantity }}</span>

                  <button
                    class="btn btn-outline-secondary btn-sm"
                    @click="
                      updateQuantity(item.cartDetailId, item.quantity + 1)
                    "
                  >
                    +
                  </button>
                </div>

                <div class="fw-bold mt-3">{{ formatPrice(item.total) }}</div>

                <button
                  class="btn btn-link text-danger p-0 mt-2"
                  @click="removeItem(item.cartDetailId)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Tổng đơn hàng -->
        <div class="col-lg-4">
          <div class="bg-white rounded shadow-sm p-4">
            <h5 class="fw-bold mb-3">Tổng đơn hàng</h5>

            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Tạm tính:</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>

            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Phí vận chuyển:</span>
              <span class="text-success">Miễn phí</span>
            </div>

            <hr />

            <div class="d-flex justify-content-between fw-bold fs-5 mb-4">
              <span>Tổng cộng:</span>
              <span class="text-danger fw-bold">{{
                formatPrice(cartTotal)
              }}</span>
            </div>

            <router-link to="/checkout" class="btn btn-addtocart w-100 mb-2">
              Tiến hành thanh toán
            </router-link>

            <router-link to="/" class="btn btn-outline-secondary w-100">
              Tiếp tục mua sắm
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
