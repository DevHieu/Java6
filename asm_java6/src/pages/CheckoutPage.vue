<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const { cartItems, cartTotal } = storeToRefs(cartStore);
const { loading } = storeToRefs(orderStore);
const user = computed(() => authStore.user);

const form = ref({
  fullName: "",
  phone: "",
  address: "",
  note: "",
  shippingMethod: "standard",
  paymentMethod: "cod",
});

const shippingFee = computed(() =>
  form.value.shippingMethod === "express" ? 50000 : 0,
);
const totalPrice = computed(() => (cartTotal.value || 0) + shippingFee.value);

const formatPrice = (value) =>
  new Intl.NumberFormat("vi-VN").format(value || 0) + " đ";

const getImage = (imgName) =>
  imgName ? `/books/${imgName}` : "/books/default-book.png";

onMounted(async () => {
  if (!authStore.isLogin) {
    router.push("/auth/login");
    return;
  }
  await cartStore.fetchCart();
  form.value.fullName = user.value?.fullname || "";
});

const handleSubmit = async () => {
  const success = await orderStore.placeOrder({
    fullName: form.value.fullName,
    phone: form.value.phone,
    address: form.value.address,
    note: form.value.note,
    shippingMethod: form.value.shippingMethod,
    paymentMethod: form.value.paymentMethod,
  });

  if (success) {
    await cartStore.fetchCart();
    router.push({ path: "/cart", query: { orderSuccess: "true" } });
  }
};
</script>

<template>
  <div class="bg-light pb-4 min-vh-100">
    <!-- HEADER -->
    <div class="bg-white border-bottom mb-4">
      <div class="container py-3">
        <router-link to="/cart" class="text-decoration-none text-muted">
          ← Quay lại giỏ hàng
        </router-link>
        <h4 class="fw-bold mt-2 mb-0">Thanh toán</h4>
      </div>
    </div>

    <div class="container">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4">
          <!-- ================= LEFT ================= -->
          <div class="col-lg-8">
            <!-- THÔNG TIN KHÁCH HÀNG -->
            <div class="bg-white rounded shadow-sm p-4 mb-4">
              <h6 class="fw-bold mb-3">
                <i class="fa-regular fa-user me-2 text-primary"></i>
                Thông tin khách hàng
              </h6>

              <div class="mb-3">
                <label class="form-label">Họ và tên *</label>
                <input
                  v-model="form.fullName"
                  type="text"
                  class="form-control"
                  placeholder="Nhập họ tên"
                  required
                />
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email *</label>
                  <input
                    :value="user?.email"
                    type="email"
                    class="form-control bg-light text-muted"
                    readonly
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Số điện thoại *</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="form-control"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- ĐỊA CHỈ GIAO HÀNG -->
            <div class="bg-white rounded shadow-sm p-4 mb-4">
              <h6 class="fw-bold mb-3">
                <i class="fa-solid fa-location-dot me-2 text-primary"></i>
                Địa chỉ giao hàng
              </h6>

              <div class="mb-3">
                <label class="form-label">Địa chỉ cụ thể *</label>
                <input
                  v-model="form.address"
                  type="text"
                  class="form-control"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                  required
                />
              </div>

              <div>
                <label class="form-label">Ghi chú (tuỳ chọn)</label>
                <textarea
                  v-model="form.note"
                  class="form-control"
                  rows="3"
                  placeholder="Ghi chú cho người giao hàng..."
                ></textarea>
              </div>
            </div>

            <!-- PHƯƠNG THỨC VẬN CHUYỂN -->
            <div class="bg-white rounded shadow-sm p-4 mb-4">
              <h6 class="fw-bold mb-3">
                <i class="fa-solid fa-truck me-2 text-primary"></i>
                Phương thức vận chuyển
              </h6>

              <div class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="radio"
                  id="shippingStandard"
                  v-model="form.shippingMethod"
                  value="standard"
                />
                <label class="form-check-label w-100" for="shippingStandard">
                  <div class="d-flex justify-content-between">
                    <span>Giao hàng tiêu chuẩn (3–5 ngày)</span>
                    <span class="text-success fw-bold">Miễn phí</span>
                  </div>
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  id="shippingExpress"
                  v-model="form.shippingMethod"
                  value="express"
                />
                <label class="form-check-label w-100" for="shippingExpress">
                  <div class="d-flex justify-content-between">
                    <span>Giao hàng nhanh (1–2 ngày)</span>
                    <span class="text-danger fw-bold">50.000 đ</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- PHƯƠNG THỨC THANH TOÁN -->
            <div class="bg-white rounded shadow-sm p-4">
              <h6 class="fw-bold mb-3">
                <i class="fa-regular fa-credit-card me-2 text-primary"></i>
                Phương thức thanh toán
              </h6>

              <div class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="radio"
                  id="paymentCOD"
                  v-model="form.paymentMethod"
                  value="cod"
                />
                <label class="form-check-label" for="paymentCOD">
                  <i class="fa-solid fa-money-bill-wave me-2 text-success"></i>
                  Thanh toán khi nhận hàng (COD)
                </label>
              </div>

              <div class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="radio"
                  id="paymentBank"
                  value="bank"
                  disabled
                />
                <label class="form-check-label text-muted" for="paymentBank">
                  <i class="fa-solid fa-building-columns me-2"></i>
                  Chuyển khoản ngân hàng
                  <span class="badge bg-secondary ms-2">Sắp ra mắt</span>
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  id="paymentCard"
                  value="card"
                  disabled
                />
                <label class="form-check-label text-muted" for="paymentCard">
                  <i class="fa-regular fa-credit-card me-2"></i>
                  Thẻ tín dụng / ghi nợ
                  <span class="badge bg-secondary ms-2">Sắp ra mắt</span>
                </label>
              </div>
            </div>
          </div>

          <!-- ================= RIGHT ================= -->
          <div class="col-lg-4">
            <div class="bg-white rounded shadow-sm p-4">
              <h6 class="fw-bold mb-3">Đơn hàng</h6>

              <div style="max-height: 300px; overflow: auto">
                <div
                  v-for="item in cartItems"
                  :key="item.cartDetailId"
                  class="d-flex justify-content-between mb-2"
                >
                  <div>
                    <div class="small fw-semibold">{{ item.title }}</div>
                    <small class="text-muted">x{{ item.quantity }}</small>
                  </div>
                  <div class="fw-bold small">{{ formatPrice(item.total) }}</div>
                </div>
              </div>

              <hr />

              <div class="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span>{{ formatPrice(cartTotal) }}</span>
              </div>

              <div class="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển:</span>
                <span
                  :class="
                    shippingFee > 0
                      ? 'text-danger fw-bold'
                      : 'text-success fw-bold'
                  "
                >
                  {{ shippingFee > 0 ? formatPrice(shippingFee) : "Miễn phí" }}
                </span>
              </div>

              <hr />

              <div class="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Tổng cộng:</span>
                <span class="text-danger">{{ formatPrice(totalPrice) }}</span>
              </div>

              <button
                type="submit"
                class="btn btn-addtocart w-100 mb-2"
                :disabled="loading"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{ loading ? "Đang xử lý..." : "Đặt hàng" }}
              </button>

              <router-link to="/cart" class="btn btn-outline-secondary w-100">
                Quay lại giỏ hàng
              </router-link>

              <div class="text-success small mt-3">
                <i class="fa-solid fa-lock me-1"></i>
                Thanh toán bảo mật & an toàn
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
