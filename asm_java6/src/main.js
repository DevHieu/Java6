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

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount("#app");

const authStore = useAuthStore();
authStore.initAuth();
