<!-- src/components/Wishlist.vue -->
<template>
    <div class="wishlist-container">
      <h2>My Wishlist</h2>
      <div v-if="wishlistItems.length === 0" class="empty-wishlist">
        Your wishlist is empty.
      </div>
      <div v-else class="wishlist-items">
        <div v-for="item in wishlistItems" :key="item.id" class="wishlist-item">
          <img :src="item.image" :alt="item.title" class="wishlist-item-image">
          <div class="wishlist-item-details">
            <h3>{{ item.title }}</h3>
            <p>Price: ${{ item.price.toFixed(2) }}</p>
            <button @click="removeFromWishlist(item.id)" class="remove-btn">Remove</button>
            <button @click="addToCart(item)" class="add-to-cart-btn">Add to Cart</button>
          </div>
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
  
      const wishlistItems = computed(() => store.state.wishlist);
  
      const removeFromWishlist = (productId) => {
        store.dispatch('removeFromWishlist', productId);
      };
  
      const addToCart = (product) => {
        store.dispatch('addToCart', product);
        removeFromWishlist(product.id);
      };
  
      return {
        wishlistItems,
        removeFromWishlist,
        addToCart,
      };
    },
  };
  </script>
  
  <style scoped>
  .wishlist-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .wishlist-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .wishlist-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
  }
  
  .wishlist-item-image {
    max-width: 100%;
    height: 150px;
    object-fit: contain;
  }
  
  .remove-btn, .add-to-cart-btn {
    margin-top: 10px;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>