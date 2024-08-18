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
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const cartItems = computed(() => store.state.cart.items)
    const cartTotal = computed(() => store.getters.cartTotal)

    const updateQuantity = (productId, newQuantity) => {
      if (newQuantity > 0) {
        store.dispatch('updateCartItemQuantity', { productId, quantity: newQuantity })
      }
    }

    const removeFromCart = (productId) => {
      store.dispatch('removeFromCart', productId)
    }

    const clearCart = () => {
      store.dispatch('clearCart')
    }

    return {
      cartItems,
      cartTotal,
      updateQuantity,
      removeFromCart,
      clearCart,
    }
  }
}
</script>

<style scoped>
.cart-container {
  padding: 20px;
}

.empty-cart {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
}

.cart-item-details {
  flex: 1;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-controls button {
  background-color: #ddd;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
}

.remove-btn {
  background-color: #ff4d4d;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

.cart-summary {
  text-align: right;
  margin-top: 20px;
}

.clear-cart-btn {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
</style>
