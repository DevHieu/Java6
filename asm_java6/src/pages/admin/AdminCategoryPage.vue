<script setup>
import { ref, onMounted } from "vue";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/admin/adminCategoryService";

const categories = ref([]);
const showAdd = ref(false);
const showEdit = ref(false);
const addName = ref("");
const editForm = ref({ id: null, name: "" });
const message = ref(null);
const isError = ref(false);

const load = async () => {
  categories.value = await getCategories();
};
onMounted(load);

const notify = (msg, error = false) => {
  message.value = msg;
  isError.value = error;
  setTimeout(() => (message.value = null), 3000);
};

const handleAdd = async () => {
  await createCategory({ name: addName.value });
  showAdd.value = false;
  addName.value = "";
  notify("Thêm danh mục thành công!");
  load();
};

const openEdit = (c) => {
  editForm.value = { id: c.id, name: c.name };
  showEdit.value = true;
};

const handleEdit = async () => {
  await updateCategory(editForm.value);
  showEdit.value = false;
  notify("Cập nhật thành công!");
  load();
};

const handleDelete = async (id) => {
  if (!confirm("Xóa danh mục này?")) return;
  try {
    await deleteCategory(id);
    notify("Xóa thành công!");
  } catch {
    notify("Không thể xóa danh mục đang chứa sách!", true);
  }
  load();
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold">Quản lý loại sách</h4>
      <button class="btn btn-primary" @click="showAdd = true">
        + Thêm loại sách
      </button>
    </div>

    <div
      v-if="message"
      :class="`alert alert-${isError ? 'danger' : 'success'} alert-dismissible`"
    >
      {{ message }}<button class="btn-close" @click="message = null"></button>
    </div>

    <div class="table-card">
      <table class="table mb-0">
        <thead>
          <tr>
            <th>Mã loại</th>
            <th>Tên loại sách</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in categories" :key="c.id">
            <td>{{ c.id }}</td>
            <td class="fw-bold">{{ c.name }}</td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-outline-primary me-1"
                @click="openEdit(c)"
              >
                Sửa
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="handleDelete(c.id)"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showAdd"
      class="modal d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm loại sách</h5>
            <button class="btn-close" @click="showAdd = false"></button>
          </div>
          <div class="modal-body">
            <label class="form-label">Tên thể loại</label>
            <input class="form-control" v-model="addName" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="handleAdd">Thêm mới</button>
            <button class="btn btn-secondary" @click="showAdd = false">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showEdit"
      class="modal d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thể loại</h5>
            <button class="btn-close" @click="showEdit = false"></button>
          </div>
          <div class="modal-body row g-3">
            <div class="col-md-6">
              <label class="form-label">ID</label>
              <input class="form-control" :value="editForm.id" readonly />
            </div>
            <div class="col-md-6">
              <label class="form-label">Tên thể loại</label>
              <input class="form-control" v-model="editForm.name" />
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
