<script setup>
import { ref, onMounted } from "vue";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  uploadBookImage,
} from "@/services/admin/adminBookService";
import { getCategories } from "@/services/admin/adminCategoryService";
import { getPublishers } from "@/services/admin/adminPublisherService";
import { getBookImage } from "@/helpers/imageHelper.js";

const books = ref([]);
const categories = ref([]);
const publishers = ref([]);
const loading = ref(false);
const showAdd = ref(false);
const showEdit = ref(false);
const addPreview = ref(null);
const editPreview = ref(null);
const addImageFile = ref(null);
const editImageFile = ref(null);

const emptyForm = () => ({
  id: null,
  title: "",
  authorName: "",
  price: 0,
  quantity: 0,
  publishDate: "",
  pageCount: "",
  dimensions: "",
  translator: "",
  coverType: "Bìa mềm",
  available: true,
  description: "",
  image: "",
  "category.id": "",
  "publisher.id": "",
});

const addForm = ref(emptyForm());
const editForm = ref(emptyForm());
const formatPrice = (v) => new Intl.NumberFormat("vi-VN").format(v || 0) + " đ";

const getImage = (imgName) => {
  return imgName ? `/books/${imgName}` : "/books/default-book.png";
};

const load = async () => {
  loading.value = true;
  [books.value, categories.value, publishers.value] = await Promise.all([
    getBooks(),
    getCategories(),
    getPublishers(),
  ]);
  loading.value = false;
};

onMounted(load);

const onAddFile = (e) => {
  addImageFile.value = e.target.files[0];
  addPreview.value = URL.createObjectURL(addImageFile.value);
};

const onEditFile = (e) => {
  editImageFile.value = e.target.files[0];
  editPreview.value = URL.createObjectURL(editImageFile.value);
};

const openEdit = async (id) => {
  const b = await getBookById(id);
  editForm.value = {
    id: b.id,
    title: b.title,
    authorName: b.authorName,
    price: b.price,
    quantity: b.quantity,
    publishDate: b.publishDate?.substring(0, 10) || "",
    pageCount: b.pageCount || "",
    dimensions: b.dimensions || "",
    translator: b.translator || "",
    coverType: b.coverType || "Bìa mềm",
    available: b.available,
    description: b.description || "",
    image: b.image || "",
    "category.id": b.category?.id || "",
    "publisher.id": b.publisher?.id || "",
  };
  editPreview.value = b.image ? getBookImage(b.image) : null;
  editImageFile.value = null;
  showEdit.value = true;
};

const handleAdd = async () => {
  let imageName = addForm.value.image;
  if (addImageFile.value) imageName = await uploadBookImage(addImageFile.value);
  await createBook({ ...addForm.value, image: imageName });
  showAdd.value = false;
  addForm.value = emptyForm();
  addPreview.value = null;
  load();
};

const handleEdit = async () => {
  let imageName = editForm.value.image;
  if (editImageFile.value)
    imageName = await uploadBookImage(editImageFile.value);
  await updateBook({ ...editForm.value, image: imageName });
  showEdit.value = false;
  load();
};

const handleDelete = async (id) => {
  if (!confirm("Xóa sách này?")) return;
  await deleteBook(id);
  load();
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold">Quản lý sách</h4>
      <button class="btn btn-primary" @click="showAdd = true">
        + Thêm sách mới
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger"></div>
    </div>

    <div v-else class="table-card">
      <table class="table mb-0">
        <thead>
          <tr>
            <th>#</th>
            <th>Ảnh</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(b, i) in books" :key="b.id">
            <td>{{ i + 1 }}</td>
            <td>
              <img
                :src="b.image ? getBookImage(b.image) : null"
                style="
                  width: 55px;
                  height: 75px;
                  object-fit: cover;
                  border-radius: 4px;
                "
              />
            </td>
            <td class="fw-bold">{{ b.title }}</td>
            <td>{{ b.authorName }}</td>
            <td>{{ formatPrice(b.price) }}</td>
            <td>{{ b.quantity }}</td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-outline-primary me-1"
                @click="openEdit(b.id)"
              >
                Sửa
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="handleDelete(b.id)"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL THÊM -->
    <div
      v-if="showAdd"
      class="modal d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm sách mới</h5>
            <button class="btn-close" @click="showAdd = false"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Tên sách</label
                ><input class="form-control" v-model="addForm.title" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Tác giả</label
                ><input class="form-control" v-model="addForm.authorName" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Giá bán</label
                ><input
                  class="form-control"
                  type="number"
                  v-model="addForm.price"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Tồn kho</label
                ><input
                  class="form-control"
                  type="number"
                  v-model="addForm.quantity"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Ngày xuất bản</label
                ><input
                  class="form-control"
                  type="date"
                  v-model="addForm.publishDate"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số trang</label
                ><input
                  class="form-control"
                  type="number"
                  v-model="addForm.pageCount"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Kích thước</label
                ><input
                  class="form-control"
                  v-model="addForm.dimensions"
                  placeholder="VD: 14x20 cm"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Dịch giả</label
                ><input class="form-control" v-model="addForm.translator" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Loại bìa</label>
                <select class="form-select" v-model="addForm.coverType">
                  <option>Bìa mềm</option>
                  <option>Bìa cứng</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" v-model="addForm.available">
                  <option :value="true">Đang bán</option>
                  <option :value="false">Ngưng bán</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Danh mục</label>
                <select class="form-select" v-model="addForm['category.id']">
                  <option v-for="c in categories" :key="c.id" :value="c.id">
                    {{ c.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Nhà xuất bản</label>
                <select class="form-select" v-model="addForm['publisher.id']">
                  <option v-for="p in publishers" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Mô tả</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="addForm.description"
                ></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">Ảnh bìa</label>
                <input
                  type="file"
                  class="form-control"
                  accept="image/*"
                  @change="onAddFile"
                />
                <img
                  v-if="addPreview"
                  :src="addPreview"
                  class="mt-2 rounded"
                  style="max-height: 120px"
                />
              </div>
            </div>
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

    <!-- MODAL SỬA -->
    <div
      v-if="showEdit"
      class="modal d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa sách</h5>
            <button class="btn-close" @click="showEdit = false"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Tên sách</label
                ><input class="form-control" v-model="editForm.title" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Tác giả</label
                ><input class="form-control" v-model="editForm.authorName" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Giá bán</label
                ><input
                  class="form-control"
                  type="number"
                  v-model="editForm.price"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Tồn kho</label
                ><input
                  class="form-control"
                  type="number"
                  v-model="editForm.quantity"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Ngày xuất bản</label
                ><input
                  class="form-control"
                  type="date"
                  v-model="editForm.publishDate"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số trang</label
                ><input
                  class="form-control"
                  type="number"
                  v-model="editForm.pageCount"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Kích thước</label
                ><input class="form-control" v-model="editForm.dimensions" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Dịch giả</label
                ><input class="form-control" v-model="editForm.translator" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Loại bìa</label>
                <select class="form-select" v-model="editForm.coverType">
                  <option>Bìa mềm</option>
                  <option>Bìa cứng</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" v-model="editForm.available">
                  <option :value="true">Đang bán</option>
                  <option :value="false">Ngưng bán</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Danh mục</label>
                <select class="form-select" v-model="editForm['category.id']">
                  <option v-for="c in categories" :key="c.id" :value="c.id">
                    {{ c.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Nhà xuất bản</label>
                <select class="form-select" v-model="editForm['publisher.id']">
                  <option v-for="p in publishers" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Mô tả</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="editForm.description"
                ></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">Ảnh bìa</label>
                <input
                  type="file"
                  class="form-control"
                  accept="image/*"
                  @change="onEditFile"
                />
                <img
                  v-if="editPreview"
                  :src="editPreview"
                  class="mt-2 rounded"
                  style="max-height: 120px"
                />
              </div>
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
