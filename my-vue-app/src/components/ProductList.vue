<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <h1 class="text-3xl font-extrabold mb-8 text-center text-gray-800">
      Welcome to Ecommerce-Store
    </h1>

    <!-- Filters Section -->
    <div class="filters mb-8 flex justify-between">
      <Filter
        :categories="categories"
        :initialCategory="selectedCategory"
        @update:category="handleCategoryChange"
      />
      <Sort :initialSort="sortOrder" @update:sort="handleSortChange" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center">
      <ProductSkeleton v-for="n in 3" :key="n" />
    </div>

    <!-- Product List -->
    <div
      v-else
      class="product-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card card-modern"
      >
        <router-link
          :to="{ path: `/product/${product.id}`, query: $route.query }"
          class="block group"
        >
          <img
            :src="product.image"
            :alt="product.title"
            class="product-image w-full h-60 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
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
            :disabled="comparisonListLoading"
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

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ProductSkeleton from "./ProductSkeleton.vue";
import Filter from "./Filter.vue";
import Sort from "./Sort.vue";
import { filterProducts, fetchCategories } from "../productUtils";

const store = useStore();
const route = useRoute();
const router = useRouter();

const comparisonList = computed(() => store.state.comparisonList);
const comparisonListLoading = computed(() => store.state.comparisonListLoading);

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
  if (comparisonListLoading.value) return;

  let newList;
  if (isInComparisonList(product)) {
    newList = comparisonList.value.filter((item) => item.id !== product.id);
  } else {
    if (comparisonList.value.length >= 3) {
      alert("You can only compare up to 3 products.");
      return;
    }
    newList = [...comparisonList.value, product];
  }
  store.dispatch("updateComparisonList", newList);
};

const isInComparisonList = (product) => {
  return (
    Array.isArray(comparisonList.value) &&
    comparisonList.value.some((item) => item.id === product.id)
  );
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
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.filters {
  display: flex;
  gap: 1rem;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.card-modern {
  background-color: #fff; /* White background for the card */
  border-radius: 16px; /* Rounded corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Subtle shadow effect */
  overflow: hidden; /* Ensure content does not overflow */
  transition: transform 0.3s, box-shadow 0.3s; /* Smooth transition for hover effects */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card-modern:hover {
  transform: translateY(-8px); /* Lift the card on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25); /* Enhanced shadow on hover */
}

.card-modern img {
  width: 100%; /* Ensure image fills the card width */
  height: 200px; /* Fixed height for consistency */
  object-fit: cover; /* Cover the image area */
}

.card-modern .content {
  padding: 16px; /* Padding inside the card */
}

.title {
  font-size: 1.25rem; /* Title font size */
  color: #333; /* Dark text color for title */
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.125rem; /* Price font size */
  color: #007bff; /* Blue color for price */
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}

.add-to-cart-btn,
.add-to-wishlist-btn,
.bg-green-500 {
  padding: 0.5rem 1rem;
  border-radius: 9999px; /* Full round button */
  font-weight: 500;
}

.add-to-cart-btn {
  background-color: #4caf50;
  color: #fff;
  transition: background-color 0.3s;
}

.add-to-cart-btn:hover {
  background-color: #45a049;
}

.add-to-wishlist-btn {
  background-color: #f44336;
  color: #fff;
  transition: background-color 0.3s;
}

.add-to-wishlist-btn:hover {
  background-color: #d32f2f;
}

.bg-green-500 {
  background-color: #4caf50;
  color: #fff;
  transition: background-color 0.3s;
}

.bg-green-500:hover {
  background-color: #45a049;
}
</style>
