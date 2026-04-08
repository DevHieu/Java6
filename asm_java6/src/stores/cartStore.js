import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getCart,
  addToCart as apiAddToCart,
  updateQuantity as apiUpdateQuantity,
  removeItem as apiRemoveItem,
  clearCart as apiClearCart,
} from "@/services/cartService";

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref([]);
  const cartTotal = ref(0);
  const cartCount = ref(0);
  const loading = ref(false);

  const fetchCart = async () => {
    try {
      loading.value = true;
      const data = await getCart();
      cartItems.value = data.cartItems ?? [];
      cartTotal.value = data.cartTotal ?? 0;

      cartCount.value = cartItems.value.length;
    } catch (err) {
      cartItems.value = [];
      cartTotal.value = 0;
      cartCount.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const addToCart = async (bookId, quantity = 1) => {
    await apiAddToCart(bookId, quantity);
    await fetchCart();
  };

  const updateQuantity = async (id, qty) => {
    if (qty < 1) {
      await apiRemoveItem(id);
      await fetchCart();
      return;
    }

    await apiUpdateQuantity(id, qty); // throw lỗi nếu vượt tồn kho
    await fetchCart();
  };

  const removeItem = async (id) => {
    await apiRemoveItem(id);
    await fetchCart();
  };

  const clearCart = async () => {
    await apiClearCart();
    await fetchCart();
  };

  const resetCart = () => {
    cartItems.value = [];
    cartTotal.value = 0;
    cartCount.value = 0;
  };

  return {
    cartItems,
    cartTotal,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    resetCart,
  };
});
