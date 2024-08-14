<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold mb-4 text-center">
      Welcome to Ecommerce-store
    </h1>

    <!-- Filters Section -->
    <div class="filters mb-4">
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
    <div
      v-else
      class="product-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card card-modern"
      >
        <router-link
          :to="{ path: `/product/${product.id}`, query: $route.query }"
        >
          <img
            :src="product.image"
            :alt="product.title"
            class="product-image w-full h-48 object-cover rounded-t-lg"
          />
          <div class="p-4">
            <h3 class="title text-lg font-semibold">{{ product.title }}</h3>
            <p class="price text-gray-600">${{ product.price }}</p>
            <p>{{ product.category }}</p>
            <p>Ratings: {{ product.rating.rate }}</p>
            <p>Reviews: {{ product.rating.count }}</p>
          </div>
        </router-link>
        <div class="button-group mt-4 flex justify-between items-center">
          <button
            v-if="isLoggedIn"
            @click="addToCart(product)"
            class="add-to-cart-btn bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-300"
          >
            Add to Cart
          </button>
          <button
            v-if="isLoggedIn"
            @click="addToWishlist(product)"
            class="add-to-wishlist-btn bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-300"
          >
            Add to Wishlist
          </button>
          <button
            v-if="isLoggedIn"
            @click="toggleComparison(product)"
            class="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition-colors duration-300"
          >
            {{
              isInComparisonList(product)
                ? "Remove from Comparison"
                : "Add to Comparison"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ProductSkeleton from "./ProductSkeleton.vue";
import Filter from "./Filter.vue";
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
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const comparisonList = computed(() => store.getters.comparisonList);


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

    const isLoggedIn = computed(() => store.getters.isAuthenticated);

    const addToCart = (product) => {
      store.dispatch("addToCart", product);
    };

    const addToWishlist = (product) => {
      store.dispatch("addToWishlist", product);
    };

    const toggleComparison = (product) => {
      if (isInComparisonList(product)) {
        store.dispatch("removeFromComparison", product.id);
      } else {
        store.dispatch("addToComparison", product);
      }
    };

    const isInComparisonList = (product) => {
      return comparisonList.some(item => item.id === product.id);
    };

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
      isLoggedIn,
      addToCart,
      addToWishlist,
      toggleComparison,
      comparisonList,
      isInComparisonList,
      fetchProducts,
      fetchCategoriesData,
      handleCategoryChange,
      handleSortChange,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.filters {
  display: flex;
  gap: 1rem;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.product-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: auto;
}

.title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.price {
  color: blue;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 10px;
}

.add-to-cart-btn {
  background-color: #4caf50;
  color: white;
}

.add-to-cart-btn:hover {
  background-color: #45a049;
}

.add-to-wishlist-btn {
  background-color: #f44336;
  color: white;
}

.add-to-wishlist-btn:hover {
  background-color: #d32f2f;
}

.card-modern {
  background-color: #ffffff; /* White background for the card */
  border-radius: 12px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow effect */
  overflow: hidden; /* Ensure content does not overflow */
  transition: transform 0.3s, box-shadow 0.3s; /* Smooth transition for hover effects */
}

.card-modern:hover {
  transform: translateY(-10px); /* Lift the card on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover */
}

.card-modern img {
  width: 100%; /* Ensure image fills the card width */
  height: auto; /* Maintain aspect ratio */
  border-bottom: 2px solid #eeeeee; /* Light border below image */
}

.card-modern .content {
  padding: 16px; /* Padding inside the card */
}

.card-modern .title {
  font-size: 1.25rem; /* Slightly larger font size for the title */
  font-weight: bold; /* Bold title */
  margin-bottom: 8px; /* Space below the title */
  color: #333333; /* Dark text color for better readability */
}

.card-modern .description {
  font-size: 1rem; /* Font size for description */
  color: #666666; /* Lighter text color */
  margin-bottom: 16px; /* Space below description */
}

.card-modern .button-group {
  display: flex; /* Flexbox for button alignment */
  gap: 8px; /* Space between buttons */
}
</style>
