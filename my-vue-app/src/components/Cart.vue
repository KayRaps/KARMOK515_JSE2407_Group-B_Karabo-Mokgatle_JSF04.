<!-- Cart.vue -->
<template>
  <div class="cart-container">
    <h2>Shopping Cart</h2>
    <div v-if="cartItems.length === 0" class="empty-cart">
      Your cart is empty.
    </div>
    <div v-else>
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" :alt="item.title" class="cart-item-image">
        <div class="cart-item-details">
          <h3>{{ item.title }}</h3>
          <p>Price: ${{ item.price.toFixed(2) }}</p>
          <div class="quantity-controls">
            <button @click="updateQuantity(item.id, item.quantity - 1)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <button @click="removeFromCart(item.id)" class="remove-btn">Remove</button>
        </div>
      </div>
      <div class="cart-summary">
        <p>Total: ${{ cartTotal.toFixed(2) }}</p>
        <button @click="clearCart" class="clear-cart-btn">Clear Cart</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const cartItems = computed(() => store.state.cart.items);
    const cartTotal = computed(() => store.getters.cartTotal);

    const updateQuantity = (productId, newQuantity) => {
      if (newQuantity > 0) {
        store.dispatch('updateCartItemQuantity', { productId, quantity: newQuantity });
      }
    };

    const removeFromCart = (productId) => {
      store.dispatch('removeFromCart', productId);
    };

    const clearCart = () => {
      store.dispatch('clearCart');
    };

    return {
      cartItems,
      cartTotal,
      updateQuantity,
      removeFromCart,
      clearCart,
    };
  },
};
</script>