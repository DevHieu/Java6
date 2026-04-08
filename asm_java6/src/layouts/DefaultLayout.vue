<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <div>
    <Navbar />
    <div class="p-0 min-vh-100"><RouterView /></div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped></style>
