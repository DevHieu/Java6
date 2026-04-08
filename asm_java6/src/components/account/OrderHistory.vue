<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";

const router = useRouter();
const orderStore = useOrderStore();
const { orders, ordersLoading } = storeToRefs(orderStore);

onMounted(() => {
  orderStore.fetchOrders();
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

const getTotal = (order) => {
  if (order.totalPrice != null) return order.totalPrice;
  if (!order.orderDetails) return 0;
  return order.orderDetails.reduce(
    (sum, d) => sum + (d.price ?? 0) * (d.quantity ?? 0),
    0,
  );
};
</script>

<template>
  <div class="card border-0 shadow-sm rounded-4 p-4">
    <h4 class="mb-4 text-uppercase fw-bold">Đơn hàng của bạn</h4>

    <!-- LOADING -->
    <div v-if="ordersLoading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-2 text-muted">Đang tải đơn hàng...</p>
    </div>

    <!-- EMPTY -->
    <div v-else-if="orders.length === 0" class="text-center py-5">
      <i class="fa-solid fa-box-open fs-1 text-muted mb-3 d-block"></i>
      <h6 class="fw-bold">Bạn chưa có đơn hàng nào</h6>
      <p class="text-muted small">Hãy mua sắm và quay lại đây nhé!</p>
      <router-link to="/" class="btn btn-addtocart px-4">
        Khám phá sách
      </router-link>
    </div>

    <!-- TABLE -->
    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="text-white" style="background-color: #f36f21">
          <tr>
            <th>Đơn hàng</th>
            <th>Ngày đặt</th>
            <th>Địa chỉ</th>
            <th>Giá trị</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            style="cursor: pointer"
            @click="router.push(`/orders/${order.id}`)"
          >
            <td class="fw-bold">#{{ order.id }}</td>
            <td>{{ formatDate(order.createDate) }}</td>
            <td class="text-truncate" style="max-width: 180px">
              {{ order.address }}
            </td>
            <td class="text-danger fw-bold">
              {{ formatPrice(getTotal(order)) }}
            </td>
            <td>
              <span class="badge" :class="getStatus(order.status).class">
                {{ getStatus(order.status).text }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-muted small text-center mt-2">
        Nhấn vào đơn hàng để xem chi tiết
      </p>
    </div>
  </div>
</template>
