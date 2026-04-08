<script setup>
import { ref, onMounted } from "vue";
import { getPublishers, createPublisher, updatePublisher, deletePublisher } from "@/services/admin/adminPublisherService";

const publishers = ref([]);
const showAdd = ref(false); const showEdit = ref(false);
const addForm = ref({ name: "", address: "", contactEmail: "" });
const editForm = ref({ id: null, name: "", address: "", contactEmail: "" });
const message = ref(null); const isError = ref(false);

const load = async () => { publishers.value = await getPublishers(); };
onMounted(load);

const notify = (msg, error = false) => {
  message.value = msg; isError.value = error;
  setTimeout(() => (message.value = null), 3000);
};

const handleAdd = async () => {
  await createPublisher(addForm.value); showAdd.value = false;
  addForm.value = { name: "", address: "", contactEmail: "" };
  notify("Thêm nhà xuất bản thành công!"); load();
};

const openEdit = (p) => { editForm.value = { ...p }; showEdit.value = true; };

const handleEdit = async () => {
  await updatePublisher(editForm.value); showEdit.value = false;
  notify("Cập nhật thành công!"); load();
};

const handleDelete = async (id) => {
  if (!confirm("Xóa nhà xuất bản này?")) return;
  try { await deletePublisher(id); notify("Xóa thành công!"); }
  catch { notify("Không thể xóa vì còn sách liên kết!", true); }
  load();
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold">Quản lý nhà xuất bản</h4>
      <button class="btn btn-primary" @click="showAdd = true">+ Thêm nhà xuất bản</button>
    </div>

    <div v-if="message" :class="`alert alert-${isError ? 'danger' : 'success'} alert-dismissible`">
      {{ message }}<button class="btn-close" @click="message = null"></button>
    </div>

    <div class="table-card">
      <table class="table mb-0">
        <thead><tr><th>ID</th><th>Tên NXB</th><th>Địa chỉ</th><th>Email liên hệ</th><th class="text-center">Thao tác</th></tr></thead>
        <tbody>
          <tr v-for="p in publishers" :key="p.id">
            <td>{{ p.id }}</td><td class="fw-bold">{{ p.name }}</td>
            <td>{{ p.address }}</td><td>{{ p.contactEmail }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(p)">Sửa</button>
              <button class="btn btn-sm btn-outline-danger" @click="handleDelete(p.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showAdd" class="modal d-block" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Thêm nhà xuất bản</h5>
            <button class="btn-close" @click="showAdd = false"></button></div>
          <div class="modal-body">
            <div class="mb-3"><label class="form-label">Tên NXB</label><input class="form-control" v-model="addForm.name" /></div>
            <div class="mb-3"><label class="form-label">Địa chỉ</label><input class="form-control" v-model="addForm.address" /></div>
            <div class="mb-3"><label class="form-label">Email liên hệ</label><input class="form-control" v-model="addForm.contactEmail" /></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="handleAdd">Thêm mới</button>
            <button class="btn btn-secondary" @click="showAdd = false">Hủy</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEdit" class="modal d-block" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Cập nhật nhà xuất bản</h5>
            <button class="btn-close" @click="showEdit = false"></button></div>
          <div class="modal-body">
            <div class="mb-3"><label class="form-label">Tên NXB</label><input class="form-control" v-model="editForm.name" /></div>
            <div class="mb-3"><label class="form-label">Địa chỉ</label><input class="form-control" v-model="editForm.address" /></div>
            <div class="mb-3"><label class="form-label">Email liên hệ</label><input class="form-control" v-model="editForm.contactEmail" /></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="handleEdit">Cập nhật</button>
            <button class="btn btn-secondary" @click="showEdit = false">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
