<template>
  <div>
    <div class="container mx-auto p-4">
      <!-- Header -->
      <h1 class="text-2xl font-bold mb-4 text-center">Welcome to Ecommerce-store</h1>

      <!-- Filters Section -->
      <div class="filters">
        <Filter
          :categories="categories"
          :initialCategory="selectedCategory"
          @update:category="handleCategoryChange"
        />
        <Sort :initialSort="sortOrder" @update:sort="handleSortChange" />
      </div>

      <!-- Loading State -->
      <div v-if="loading">
        <ProductSkeleton v-for="n in 3" :key="n" />
      </div>

      <!-- Product List -->
      <div v-else class="product-list">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
        >
          <router-link
            :to="{ path: `/product/${product.id}`, query: $route.query }"
          >
            <img
              :src="product.image"
              :alt="product.title"
              class="product-image"
            />
            <h3 class="title">{{ product.title }}</h3>
            <p class="price">${{ product.price }}</p>
            <p>{{ product.category }}</p>
            <p>Ratings: {{ product.rating.rate }}</p>
            <p>Reviews: {{ product.rating.count }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProductSkeleton from "./ProductSkeleton.vue";
import Filter from "./FIlter.vue";
import Sort from "./Sort.vue";
import { filterProducts, fetchCategories } from "../productUtils";

export default {
  name: "ProductList",
  components: {
    ProductSkeleton,
    Filter,
    Sort,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const loading = ref(true);
    const products = ref([]);
    const categories = ref([]);
    const selectedCategory = ref(route.query.category || "");
    const sortOrder = ref(route.query.sort || "");

    const filteredProducts = computed(() => {
      return filterProducts(
        products.value,
        selectedCategory.value,
        sortOrder.value
      );
    });

    const fetchProducts = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate loading
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        products.value = data;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const fetchCategoriesData = async () => {
      categories.value = await fetchCategories();
    };

    const handleCategoryChange = (newCategory) => {
      selectedCategory.value = newCategory;
      const newQuery = { ...route.query, category: newCategory };
      if (!newCategory) {
        delete newQuery.category;
      }
      router.push({ query: newQuery });
    };

    const handleSortChange = (newSort) => {
      sortOrder.value = newSort;
      const newQuery = { ...route.query, sort: newSort };
      if (!newSort) {
        delete newQuery.sort;
      }
      router.push({ query: newQuery });
    };

    onMounted(async () => {
      await fetchCategoriesData();
      await fetchProducts();
    });

    watch(
      () => route.query,
      (newQuery) => {
        selectedCategory.value = newQuery.category || "";
        sortOrder.value = newQuery.sort || "";
      },
      { immediate: true }
    );

    return {
      route,
      router,
      loading,
      products,
      categories,
      selectedCategory,
      sortOrder,
      filteredProducts,
      fetchProducts,
      fetchCategoriesData,
      handleCategoryChange,
      handleSortChange,
    };
  },
};
</script>

<style>
.container {
  max-width: 1200px;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.product-card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 20px;
  background-color: rgb(169, 211, 230);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: auto;
  margin-top: auto;
}

.title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.price {
  color: blue;
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 1em;
}
</style>
