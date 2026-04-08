<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useOrderStore } from "@/stores/orderStore";

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const { currentOrder, ordersLoading } = storeToRefs(orderStore);

onMounted(() => {
  orderStore.fetchOrderDetail(route.params.id);
});

const formatPrice = (value) =>
  new Intl.NumberFormat("vi-VN").format(value || 0) + " đ";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const statusConfig = {
  0: { text: "Mới", class: "bg-warning text-dark" },
  1: { text: "Đang giao", class: "bg-primary" },
  2: { text: "Hoàn tất", class: "bg-success" },
  3: { text: "Đã hủy", class: "bg-danger" },
};

const getStatus = (status) =>
  statusConfig[status] ?? { text: "Không xác định", class: "bg-secondary" };

const getOrderTotal = (order) => {
  if (!order?.orderDetails) return 0;
  return order.orderDetails.reduce(
    (sum, d) => sum + (d.price ?? 0) * (d.quantity ?? 0),
    0,
  );
};
</script>

<template>
  <div class="bg-light min-vh-100 pb-5">
    <!-- HEADER -->
    <div class="bg-white border-bottom mb-4">
      <div class="container py-3">
        <button
          class="btn btn-link text-decoration-none text-muted p-0"
          @click="router.back()"
        >
          ← Quay lại danh sách
        </button>
        <h4 class="fw-bold mt-2 mb-0">
          Chi tiết đơn hàng
          <span v-if="currentOrder" class="text-danger"
            >#{{ currentOrder.id }}</span
          >
        </h4>
      </div>
    </div>

    <div class="container">
      <!-- LOADING -->
      <div v-if="ordersLoading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-2 text-muted">Đang tải đơn hàng...</p>
      </div>

      <!-- NOT FOUND -->
      <div v-else-if="!currentOrder" class="text-center py-5">
        <i
          class="fa-solid fa-circle-exclamation fs-1 text-muted mb-3 d-block"
        ></i>
        <h6 class="fw-bold">Không tìm thấy đơn hàng</h6>
        <router-link to="/account" class="btn btn-addtocart mt-3">
          Quay lại tài khoản
        </router-link>
      </div>

      <!-- CONTENT -->
      <div v-else class="row g-4">
        <!-- THÔNG TIN ĐƠN HÀNG -->
        <div class="col-lg-5">
          <div class="bg-white rounded shadow-sm p-4 h-100">
            <h6 class="fw-bold mb-3">
              <i class="fa-solid fa-circle-info me-2 text-primary"></i>
              Thông tin đơn hàng
            </h6>

            <table class="table table-borderless mb-0 small">
              <tbody>
                <tr>
                  <td class="text-muted ps-0" style="width: 130px">
                    Người đặt
                  </td>
                  <td class="fw-semibold">
                    {{ currentOrder.account?.fullname }}
                  </td>
                </tr>
                <tr>
                  <td class="text-muted ps-0">Email</td>
                  <td>{{ currentOrder.account?.email }}</td>
                </tr>
                <tr>
                  <td class="text-muted ps-0">Số điện thoại</td>
                  <td>{{ currentOrder.phone }}</td>
                </tr>
                <tr>
                  <td class="text-muted ps-0">Ngày đặt</td>
                  <td>{{ formatDate(currentOrder.createDate) }}</td>
                </tr>
                <tr>
                  <td class="text-muted ps-0">Địa chỉ</td>
                  <td>{{ currentOrder.address }}</td>
                </tr>
                <tr>
                  <td class="text-muted ps-0">Trạng thái</td>
                  <td>
                    <span
                      class="badge"
                      :class="getStatus(currentOrder.status).class"
                    >
                      {{ getStatus(currentOrder.status).text }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- DANH SÁCH SÁCH -->
        <div class="col-lg-7">
          <div class="bg-white rounded shadow-sm p-4">
            <h6 class="fw-bold mb-3">
              <i class="fa-solid fa-book me-2 text-primary"></i>
              Sản phẩm đã đặt
            </h6>

            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Tên sách</th>
                    <th class="text-end">Giá</th>
                    <th class="text-center">SL</th>
                    <th class="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="d in currentOrder.orderDetails" :key="d.id">
                    <td class="fw-semibold small">{{ d.book?.title }}</td>
                    <td class="text-end small">{{ formatPrice(d.price) }}</td>
                    <td class="text-center">{{ d.quantity }}</td>
                    <td class="text-end fw-bold text-danger">
                      {{ formatPrice(d.price * d.quantity) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-top">
                    <td colspan="3" class="text-end fw-bold">Tổng cộng:</td>
                    <td class="text-end fw-bold fs-5 text-danger">
                      {{ formatPrice(getOrderTotal(currentOrder)) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
