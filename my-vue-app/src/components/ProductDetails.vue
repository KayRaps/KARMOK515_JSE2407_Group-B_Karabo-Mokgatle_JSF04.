<template>
  <div>
    <div class="container mx-auto p-4">
      <div v-if="loading">
        <card-skeleton />
      </div>
      <div v-else-if="product" class="product-detail">
        <img :src="product.image" :alt="product.title" class="product-image" />
        <div class="product-info">
          <h2>{{ product.title }}</h2>
          <p>{{ product.description }}</p>
          <p class="price">${{ product.price }}</p>
          <p>Category: {{ product.category }}</p>
          <p>
            Ratings: {{ product.rating.rate }} (Based on
            {{ product.rating.count }} reviews)
          </p>
          <button @click="goBack" class="back-button">
            Back to Product List
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import CardSkeleton from "./CardSkeleton.vue";

export default {
name: "ProductDetail",
components: {
  CardSkeleton,
},
setup() {
  const route = useRoute();
  const router = useRouter();
  const product = ref(null);
  const loading = ref(true);

  const fetchProduct = async () => {
    const id = route.params.id;
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      product.value = await response.json();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const goBack = () => {
    router.push({ path: "/", query: route.query });
  };

  onMounted(fetchProduct);

  return {
    product,
    loading,
    goBack,
  };
},
};
</script>

<style>
.product-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 2rem;
  background-color: rgb(240, 222, 222);
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 800px;
  margin: 2rem auto;
}
.product-image {
  flex: 1;
  max-width: 300px;
  width: 100%;
  height: auto;
  border-radius: 8px;
}
.product-info {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.price {
  color: blue;
  font-weight: bold;
  margin-bottom: 1rem;
}
p {
  margin-bottom: 0.5rem;
}
.back-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}
.back-button:hover {
  background-color: #a1c1e2;
}
</style>
