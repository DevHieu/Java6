<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "Đăng nhập",
  },
});
</script>

<template>
  <div class="header-gradient py-5 text-center">
    <router-link to="/">
      <img
        src="@/assets/logo.png"
        alt="logo"
        style="width: 200px; margin-bottom: 10px"
      />
    </router-link>
    <h1 class="fw-bold text-white">{{ props.title }}</h1>
  </div>
</template>

<style scoped></style>
