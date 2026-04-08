import { defineStore } from "pinia";
import { ref } from "vue";
import {
  placeOrder as apiPlaceOrder,
  getOrders,
  getOrderDetail as apiGetOrderDetail,
  getPurchasedBooks as apiGetPurchasedBooks,
} from "@/services/orderService";

export const useOrderStore = defineStore("order", () => {
  const loading = ref(false);
  const orders = ref([]);
  const ordersLoading = ref(false);
  const currentOrder = ref(null);
  const purchasedBooks = ref([]);

  const placeOrder = async (payload) => {
    try {
      loading.value = true;
      await apiPlaceOrder(payload);
      return true;
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const fetchOrders = async () => {
    try {
      ordersLoading.value = true;
      orders.value = await getOrders();
      console.log(orders.value);
    } catch (err) {
      console.error("Lỗi lấy đơn hàng:", err);
      orders.value = [];
    } finally {
      ordersLoading.value = false;
    }
  };

  const fetchOrderDetail = async (id) => {
    try {
      ordersLoading.value = true;
      currentOrder.value = await apiGetOrderDetail(id);
    } catch (err) {
      console.error("Lỗi lấy chi tiết đơn hàng:", err);
      currentOrder.value = null;
    } finally {
      ordersLoading.value = false;
    }
  };

  const fetchPurchasedBooks = async () => {
    try {
      ordersLoading.value = true;
      purchasedBooks.value = await apiGetPurchasedBooks();
    } catch (err) {
      console.error("Lỗi lấy sách đã mua:", err);
      purchasedBooks.value = [];
    } finally {
      ordersLoading.value = false;
    }
  };

  return {
    loading,
    orders,
    ordersLoading,
    currentOrder,
    purchasedBooks,
    placeOrder,
    fetchOrders,
    fetchOrderDetail,
    fetchPurchasedBooks,
  };
});
