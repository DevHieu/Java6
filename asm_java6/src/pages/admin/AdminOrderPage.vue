<script setup>
import { ref, onMounted } from "vue";
import {
  getOrders,
  getOrderDetail,
  updateOrder,
  deleteOrder,
} from "@/services/admin/adminOrderService";

const orders = ref([]);
const loading = ref(false);
const search = ref("");
const status = ref("");
const showDetail = ref(false);
const showEdit = ref(false);
const detailItems = ref([]);
const detailId = ref(null);
const editForm = ref({ id: null, name: "", phone: "", address: "", status: 0 });

const statusMap = {
  0: { text: "Đang xử lý", cls: "badge-new" },
  1: { text: "Đang giao", cls: "badge-shipping" },
  2: { text: "Đã giao", cls: "badge-done" },
  3: { text: "Đã hủy", cls: "badge-cancel" },
};

const formatPrice = (v) => new Intl.NumberFormat("vi-VN").format(v || 0) + " đ";
const formatDate = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "");
const getTotal = (o) =>
  (o.orderDetails || []).reduce((s, d) => s + d.price * d.quantity, 0);

const load = async () => {
  loading.value = true;
  orders.value = await getOrders({
    search: search.value,
    status: status.value,
  });
  loading.value = false;
};

onMounted(load);

const openDetail = async (order) => {
  detailId.value = order.id;
  detailItems.value = await getOrderDetail(order.id);
  showDetail.value = true;
};

const openEdit = (o) => {
  editForm.value = {
    id: o.id,
    name: o.account?.fullname || "",
    phone: o.phone,
    address: o.address,
    status: o.status,
  };
  showEdit.value = true;
};

const handleUpdate = async () => {
  await updateOrder(editForm.value);
  showEdit.value = false;
  load();
};
const handleDelete = async (id) => {
  if (!confirm("Xác nhận xóa?")) return;
  await deleteOrder(id);
  load();
};
</script>

<template>
  <div>
    <h4 class="fw-bold">Quản lý đơn hàng</h4>

    <div class="filter-bar">
      <div class="row g-2">
        <div class="col-md-8">
          <input
            v-model="search"
            class="form-control"
            placeholder="Tìm theo mã đơn hoặc tên khách..."
            @keyup.enter="load"
          />
        </div>
        <div class="col-md-3">
          <select v-model="status" class="form-select" @change="load">
            <option value="">Tất cả trạng thái</option>
            <option value="0">Đang xử lý</option>
            <option value="1">Đang giao</option>
            <option value="2">Đã giao</option>
            <option value="3">Đã hủy</option>
          </select>
        </div>
        <div class="col-md-1">
          <button class="btn btn-primary w-100" @click="load">Lọc</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger"></div>
    </div>

    <div v-else class="table-card">
      <table class="table mb-0">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="o in orders"
            :key="o.id"
            style="cursor: pointer"
            @click="openDetail(o)"
          >
            <td class="fw-bold">#{{ o.id }}</td>
            <td>
              <div class="fw-medium">{{ o.account?.fullname || "N/A" }}</div>
              <small class="text-muted">{{ o.account?.email }}</small>
            </td>
            <td>{{ formatDate(o.createDate) }}</td>
            <td class="fw-bold text-primary">{{ formatPrice(getTotal(o)) }}</td>
            <td>
              <span class="badge-status" :class="statusMap[o.status]?.cls">
                {{ statusMap[o.status]?.text }}
              </span>
            </td>
            <td class="text-center" @click.stop>
              <button
                class="btn btn-sm btn-outline-primary me-1"
                @click="openEdit(o)"
              >
                Sửa
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="handleDelete(o.id)"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL CHI TIẾT -->
    <div
      v-if="showDetail"
      class="modal d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết đơn hàng #{{ detailId }}</h5>
            <button class="btn-close" @click="showDetail = false"></button>
          </div>
          <div class="modal-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th class="text-end">Giá</th>
                  <th class="text-center">SL</th>
                  <th class="text-end">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(d, i) in detailItems" :key="i">
                  <td>{{ d.productName }}</td>
                  <td class="text-end">{{ formatPrice(d.price) }}</td>
                  <td class="text-center">{{ d.quantity }}</td>
                  <td class="text-end fw-bold">{{ formatPrice(d.total) }}</td>
                </tr>
              </tbody>
            </table>
            <div class="text-end">
              <h5 class="fw-bold">
                Tổng cộng:
                <span class="text-danger">{{
                  formatPrice(detailItems.reduce((s, d) => s + d.total, 0))
                }}</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL SỬA -->
    <div
      v-if="showEdit"
      class="modal d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cập nhật đơn hàng #{{ editForm.id }}</h5>
            <button class="btn-close" @click="showEdit = false"></button>
          </div>
          <div class="modal-body row g-3">
            <div class="col-12">
              <label class="form-label">Tên khách hàng</label>
              <input
                class="form-control bg-light"
                :value="editForm.name"
                readonly
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Số điện thoại</label>
              <input class="form-control" v-model="editForm.phone" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Trạng thái</label>
              <select class="form-select" v-model="editForm.status">
                <option :value="0">Đang xử lý</option>
                <option :value="1">Đang giao</option>
                <option :value="2">Đã giao</option>
                <option :value="3">Đã hủy</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Địa chỉ</label>
              <textarea
                class="form-control"
                v-model="editForm.address"
                rows="2"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="handleUpdate">
              Lưu cập nhật
            </button>
            <button class="btn btn-secondary" @click="showEdit = false">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
