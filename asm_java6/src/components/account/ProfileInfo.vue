<script setup>
import { ref, onMounted, watch } from "vue";
import defaultAvatar from "@/assets/defaultuser.png";
import { updateProfile } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { getAvatarImage } from "@/helpers/imageHelper";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const userData = ref({
  fullname: "",
  email: "",
  avatar: "",
});

const imagePreview = ref(null);
const selectedFile = ref(null);

// Hàm load data từ Store vào Form
const loadData = () => {
  if (user.value) {
    userData.value = {
      fullname: user.value.fullname || "",
      email: user.value.email || "",
      avatar: user.value.avatar || "",
    };
  }
};

onMounted(loadData);

// Theo dõi nếu Store cập nhật (ví dụ sau khi login/fetch) thì update lại form
watch(user, loadData, { deep: true });

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    // Tạo đường dẫn tạm để hiển thị ảnh ngay lập tức
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleUpdate = async () => {
  const formData = new FormData();
  formData.append("fullname", userData.value.fullname);
  formData.append("email", userData.value.email);

  if (selectedFile.value) {
    formData.append("photo", selectedFile.value);
  }

  const res = await updateProfile(formData);

  if (res.status === 200) {
    authStore.setCurrentUser(res.data);
    alert("Cập nhật thành công!");
  }
};
</script>

<template>
  <div class="card border-0 shadow-sm rounded-4">
    <div class="card-header bg-white py-3 border-bottom-0 pt-4 px-4">
      <h5 class="mb-0 text-uppercase fw-bold text-dark">
        <i class="fas fa-user-circle me-2 text-primary"></i>Hồ sơ cá nhân
      </h5>
    </div>
    <div class="card-body p-4">
      <form @submit.prevent="handleUpdate">
        <div class="row g-4">
          <div
            class="col-md-4 text-center border-end d-flex flex-column align-items-center py-3"
          >
            <div class="avatar-wrapper position-relative">
              <div
                class="p-1 bg-white shadow-sm rounded-circle border"
                style="width: 160px; height: 160px"
              >
                <img
                  :src="
                    imagePreview ||
                    (userData.avatar
                      ? getAvatarImage(userData.avatar)
                      : defaultAvatar)
                  "
                  class="rounded-circle w-100 h-100"
                  style="object-fit: cover"
                />
              </div>
              <label
                for="photo"
                class="btn btn-success btn-sm position-absolute rounded-circle shadow"
                style="
                  width: 40px;
                  height: 40px;
                  bottom: 5px;
                  right: 5px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                "
              >
                <i class="pi pi-camera" style="font-size: 1rem"></i>
                <input
                  type="file"
                  id="photo"
                  class="d-none"
                  accept="image/*"
                  @change="onFileChange"
                />
              </label>
            </div>
            <p class="text-muted mt-3 small">
              Thay đổi ảnh sẽ có hiệu lực sau khi Lưu.
            </p>
          </div>

          <div class="col-md-8">
            <div class="mb-3 text-start">
              <label class="form-label fw-semibold">Họ và tên</label>
              <input
                type="text"
                v-model="userData.fullname"
                class="form-control rounded-pill px-3"
                placeholder="Nhập họ tên của bạn"
              />
            </div>
            <div class="mb-3 text-start">
              <label class="form-label fw-semibold">Email</label>
              <input
                type="email"
                :value="userData.email"
                class="form-control bg-light rounded-pill px-3 text-muted"
                readonly
              />
              <div class="form-text small ps-2">Email không thể thay đổi.</div>
            </div>
            <div class="text-end mt-4">
              <button
                type="submit"
                class="btn btn-md btn-addtocart rounded-pill shadow-sm fw-bold"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
