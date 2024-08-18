<template>
    <div class="comparison-list">
      <h2>Comparison List</h2>
      <div v-if="comparisonList.length === 0">
        No products added for comparison yet.
      </div>
      <div v-else class="comparison-grid">
        <div v-for="product in comparisonList" :key="product.id" class="comparison-item">
          <img :src="product.image" :alt="product.title" />
          <h3>{{ product.title }}</h3>
          <p>Price: ${{ product.price }}</p>
          <button @click="removeFromComparison(product.id)">Remove</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex'; // Corrected import path
  
  const store = useStore();
  const comparisonList = computed(() => store.state.comparisonList); // Corrected access to state
  
  const removeFromComparison = (productId) => {
    store.dispatch('removeFromComparison', productId); // Ensure the store action name is correct
  };
  </script>
  
  <style scoped>
  .comparison-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .comparison-item {
    border: 1px solid #ddd;
    padding: 1rem;
    text-align: center;
  }
  
  .comparison-item img {
    max-width: 100%;
    height: auto;
  }
  </style>
  