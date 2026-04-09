import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "@/routers";
import { useAuthStore } from "@/stores/authStore";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "primeicons/primeicons.css";

import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

import vue3GoogleLogin from 'vue3-google-login';

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(vue3GoogleLogin, {
  clientId: '552007878326-5jd67pegt3lp8lnk7bmrq38t1nm12drv.apps.googleusercontent.com'
});
app.mount("#app");
const authStore = useAuthStore();
authStore.initAuth();
