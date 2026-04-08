<script setup>
import { ref, onMounted, watch } from "vue";
import { getDashboard } from "@/services/admin/adminDashboardService";

const tab = ref("category");
const keyword = ref("");
const data = ref(null);
const loading = ref(false);

const formatPrice = (v) => new Intl.NumberFormat("vi-VN").format(v || 0) + " đ";
const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—");

const load = async () => {
  loading.value = true;
  data.value = await getDashboard(tab.value, keyword.value);
  loading.value = false;
};

onMounted(load);
watch(tab, () => {
  keyword.value = "";
  load();
});
</script>

<template>
  <div>
    <h4 class="fw-bold">Tổng quan</h4>

    <!-- STAT CARDS -->
    <div class="row g-3 mb-4" v-if="data">
      <div
        class="col-md-3"
        v-for="s in [
          {
            label: 'Tổng đơn hàng',
            value: data.totalOrder,
            icon: 'fa-bag-shopping',
          },
          {
            label: 'Sách đã bán',
            value: data.totalBooks,
            icon: 'fa-book-open',
          },
          { label: 'Người dùng', value: data.totalCustomers, icon: 'fa-users' },
          { label: 'Đầu sách', value: data.totalBook, icon: 'fa-book' },
        ]"
        :key="s.label"
      >
        <div class="stat-card">
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-value">{{ s.value }}</div>
          <i :class="`fas ${s.icon} stat-icon`"></i>
        </div>
      </div>
    </div>

    <!-- TABS -->
    <ul class="nav nav-pills mb-4">
      <li
        class="nav-item"
        v-for="t in [
          { key: 'category', label: 'Theo Loại Hàng', icon: 'fa-tags' },
          { key: 'product', label: 'Theo Sản Phẩm', icon: 'fa-book' },
          { key: 'customer', label: 'Khách Hàng VIP', icon: 'fa-users' },
        ]"
        :key="t.key"
      >
        <button
          class="nav-link me-2"
          :class="tab === t.key ? 'active' : ''"
          @click="tab = t.key"
        >
          <i :class="`fas ${t.icon} me-1`"></i> {{ t.label }}
        </button>
      </li>
    </ul>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger"></div>
    </div>

    <div v-else-if="data">
      <!-- CATEGORY -->
      <div v-if="tab === 'category'">
        <div class="table-card">
          <table class="table mb-0">
            <thead>
              <tr>
                <th>Loại sách</th>
                <th>Doanh thu</th>
                <th>Số lượng</th>
                <th>Max / Min / TB</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in data.categoryStats" :key="i">
                <td class="fw-bold">{{ row[0] }}</td>
                <td class="text-danger fw-bold">{{ formatPrice(row[1]) }}</td>
                <td>{{ row[2] }}</td>
                <td class="small text-muted">
                  Max: {{ row[3] }}<br />Min: {{ row[4] }}<br />Avg:
                  {{ formatPrice(row[5]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PRODUCT -->
      <div v-if="tab === 'product'">
        <div class="filter-bar d-flex gap-2 mb-4">
          <input
            v-model="keyword"
            class="form-control"
            placeholder="Tìm tên sách..."
            @keyup.enter="load"
          />
          <button class="btn btn-primary" @click="load">
            <i class="fas fa-search"></i>
          </button>
        </div>

        <div v-if="data.searchedBooks" class="mb-4">
          <h6 class="fw-bold text-primary">Kết quả tìm kiếm</h6>
          <div class="table-card">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th class="text-center">Số lượng bán</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!data.searchedBooks.length">
                  <td colspan="2" class="text-center text-muted">
                    Không tìm thấy.
                  </td>
                </tr>
                <tr v-for="(item, i) in data.searchedBooks" :key="i">
                  <td>{{ item[0].title }}</td>
                  <td class="text-center fw-bold text-primary">
                    {{ item[1] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <h6 class="fw-bold text-success">
              <i class="fas fa-arrow-trend-up me-1"></i> Top Bán Chạy
            </h6>
            <div class="table-card">
              <table class="table mb-0">
                <thead>
                  <tr>
                    <th>Tên sách</th>
                    <th>SL bán</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in data.topBook" :key="i">
                    <td>{{ item[0].title }}</td>
                    <td class="fw-bold text-center">{{ item[1] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-md-6">
            <h6 class="fw-bold text-danger">
              <i class="fas fa-arrow-trend-down me-1"></i> Top Bán Chậm
            </h6>
            <div class="table-card">
              <table class="table mb-0">
                <thead>
                  <tr>
                    <th>Tên sách</th>
                    <th>SL bán</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in data.lowBook" :key="i">
                    <td>{{ item[0].title }}</td>
                    <td class="fw-bold text-center">{{ item[1] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- CUSTOMER VIP -->
      <div v-if="tab === 'customer'">
        <div class="table-card">
          <table class="table mb-0">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Tổng chi tiêu</th>
                <th>Mua lần đầu</th>
                <th>Mua lần cuối</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vip, i) in data.vipCustomers" :key="i">
                <td class="fw-bold">{{ vip[0] }}</td>
                <td class="text-success fw-bold">{{ formatPrice(vip[1]) }}</td>
                <td>{{ formatDate(vip[2]) }}</td>
                <td>{{ formatDate(vip[3]) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
