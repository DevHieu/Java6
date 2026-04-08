<script setup>
import { ref, onMounted } from "vue";
import {
  getCustomers,
  getCustomerDetail,
  createCustomer,
  updateCustomer,
  toggleCustomer,
} from "@/services/admin/adminCustomerService";
import { getAvatarImage } from "@/helpers/imageHelper.js";

const customers = ref([]);
const loading = ref(false);
const keyword = ref("");
const rankFilter = ref("");
const statusFilter = ref("");
const showAdd = ref(false);
const showEdit = ref(false);
const showDetail = ref(false);
const detail = ref(null);
const error = ref(null);
const addForm = ref({ email: "", fullname: "", password: "" });
const editForm = ref({ email: "", fullname: "", password: "" });

const rankClass = (r) =>
  r === "Vàng"
    ? "bg-warning text-dark"
    : r === "Bạc"
    ? "bg-light text-dark border"
    : "bg-secondary";
const formatPrice = (v) => new Intl.NumberFormat("vi-VN").format(v || 0) + " đ";
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("vi-VN") : "Chưa có";

const load = async () => {
  loading.value = true;
  customers.value = await getCustomers({
    keyword: keyword.value,
    rank: rankFilter.value,
    status: statusFilter.value,
  });

  loading.value = false;
};

onMounted(load);

const openDetail = async (email) => {
  detail.value = await getCustomerDetail(email);
  console.log(detail.value);
  showDetail.value = true;
};
const openEdit = (c) => {
  editForm.value = { email: c.email, fullname: c.name, password: "" };
  showEdit.value = true;
};

const handleAdd = async () => {
  try {
    await createCustomer(addForm.value);
    showAdd.value = false;
    addForm.value = { email: "", fullname: "", password: "" };
    load();
  } catch (e) {
    error.value = e.response?.data?.message || "Lỗi tạo khách hàng";
  }
};

const handleEdit = async () => {
  await updateCustomer(editForm.value);
  showEdit.value = false;
  load();
};

const handleToggle = async (email) => {
  await toggleCustomer(email);
  load();
  if (showDetail.value) detail.value = await getCustomerDetail(email);
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold">Quản lý khách hàng</h4>
      <button class="btn btn-primary" @click="showAdd = true">
        Thêm khách hàng
      </button>
    </div>

    <div v-if="error" class="alert alert-danger alert-dismissible">
      {{ error }}<button class="btn-close" @click="error = null"></button>
    </div>

    <div class="filter-bar">
      <div class="row g-2">
        <div class="col-md-6">
          <input
            class="form-control"
            v-model="keyword"
            placeholder="Tìm theo tên, email..."
            @keyup.enter="load"
          />
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="statusFilter" @change="load">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Đã khóa</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="rankFilter" @change="load">
            <option value="">Tất cả hạng</option>
            <option>Vàng</option>
            <option>Bạc</option>
            <option>Thường</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger"></div>
    </div>

    <div v-else class="table-card">
      <table class="table align-middle mb-0">
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Hạng</th>
            <th>Đơn hàng</th>
            <th>Tổng chi</th>
            <th>Trạng thái</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in customers" :key="c.email">
            <td>
              <div class="fw-medium">{{ c.name }}</div>
              <small class="text-muted">{{ c.email }}</small>
            </td>
            <td>
              <span class="badge rounded-pill" :class="rankClass(c.rank)">{{
                c.rank
              }}</span>
            </td>
            <td>
              <b>{{ c.orders }} đơn</b><br /><small class="text-muted">{{
                formatDate(c.lastOrder)
              }}</small>
            </td>
            <td class="fw-bold">{{ formatPrice(c.total) }}</td>
            <td>
              <span
                v-if="c.status"
                class="badge bg-success-subtle text-success rounded-pill"
                >Hoạt động</span
              >
              <span
                v-else
                class="badge bg-danger-subtle text-danger rounded-pill"
                >Đã khóa</span
              >
            </td>
            <td class="text-center">
              <a class="action-icon me-1" @click="openDetail(c.email)">👁️</a>
              <a class="action-icon me-1" @click="openEdit(c)">✏️</a>
              <a class="action-icon" @click="handleToggle(c.email)">{{
                c.status ? "🔒" : "🔓"
              }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL CHI TIẾT -->
    <div
      v-if="showDetail && detail"
      class="modal d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Chi tiết khách hàng</h5>
            <button class="btn-close" @click="showDetail = false"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-4">
              <div class="col-md-6">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <img
                    :src="getAvatarImage(detail.avatar)"
                    style="
                      width: 56px;
                      height: 56px;
                      border-radius: 50%;
                      object-fit: cover;
                      border: 2px solid #eee;
                    "
                    @error="
                      (e) =>
                        (e.target.src =
                          'http://localhost:8080/uploads/avatars/default-avatar.jpg')
                    "
                  />
                  <div>
                    <h5 class="fw-bold mb-1">{{ detail.name }}</h5>
                    <span class="badge bg-warning text-dark">{{
                      detail.rank
                    }}</span>
                  </div>
                </div>
                <div class="detail-info-list">
                  <div class="detail-info-item">
                    <i class="fas fa-envelope"></i> {{ detail.email }}
                  </div>
                  <div class="detail-info-item">
                    <i class="fas fa-location-dot"></i> {{ detail.address }}
                  </div>
                  <div class="detail-info-item">
                    <i class="fas fa-calendar"></i> Đăng ký:
                    {{ formatDate(detail.registerDate) }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="row g-2">
                  <div class="col-6">
                    <div class="detail-stat-card text-center">
                      <div class="detail-stat-value text-primary">
                        {{ detail.totalOrders }}
                      </div>
                      <div class="detail-stat-label">Tổng đơn</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="detail-stat-card text-center">
                      <div
                        class="detail-stat-value text-success"
                        style="font-size: 14px"
                      >
                        {{ formatPrice(detail.totalAmount) }}
                      </div>
                      <div class="detail-stat-label">Tổng chi</div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="detail-stat-card text-center">
                      <div
                        class="detail-stat-value text-info"
                        style="font-size: 15px"
                      >
                        {{ formatDate(detail.lastOrder) }}
                      </div>
                      <div class="detail-stat-label">Đơn gần nhất</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h6 class="fw-bold mb-2">📦 Lịch sử đơn hàng</h6>
            <div class="order-history-list">
              <div
                v-for="o in detail.orders"
                :key="o.id"
                class="order-history-item d-flex justify-content-between"
              >
                <div>
                  <div class="fw-bold">Đơn hàng #{{ o.id }}</div>
                  <small class="text-muted"
                    >{{ formatDate(o.date) }} • {{ o.itemCount }} sản
                    phẩm</small
                  >
                </div>
                <div class="text-end">
                  <div class="fw-bold">{{ formatPrice(o.total) }}</div>
                  <span class="badge bg-success-subtle text-success">{{
                    o.status
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-outline-secondary"
              @click="showDetail = false"
            >
              Đóng
            </button>
            <button
              class="btn"
              :class="detail.status ? 'btn-danger' : 'btn-success'"
              @click="handleToggle(detail.email)"
            >
              {{ detail.status ? "Khóa tài khoản" : "Mở tài khoản" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL THÊM -->
    <div
      v-if="showAdd"
      class="modal d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Thêm khách hàng</h5>
            <button class="btn-close" @click="showAdd = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Họ tên</label
              ><input class="form-control" v-model="addForm.fullname" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label
              ><input
                class="form-control"
                type="email"
                v-model="addForm.email"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Mật khẩu</label
              ><input
                class="form-control"
                type="password"
                v-model="addForm.password"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="handleAdd">
              Tạo khách hàng
            </button>
            <button class="btn btn-secondary" @click="showAdd = false">
              Hủy
            </button>
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
            <h5 class="modal-title fw-bold">Chỉnh sửa khách hàng</h5>
            <button class="btn-close" @click="showEdit = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Họ tên</label
              ><input class="form-control" v-model="editForm.fullname" />
            </div>
            <div class="mb-3">
              <label class="form-label">Mật khẩu mới</label>
              <input
                class="form-control"
                type="password"
                v-model="editForm.password"
                placeholder="Để trống nếu không đổi"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="handleEdit">
              Cập nhật
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
