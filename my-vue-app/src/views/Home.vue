<template>
  <div class="home-page container mx-auto p-6">
    <!-- Hero Section -->
    <section class="hero mb-12">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold mb-4 text-gray-800">
          Welcome to Ecommerce-Store
        </h1>
        <p class="text-lg text-gray-600 mb-8">
          Explore the latest products and deals tailored just for you!
        </p>
        <router-link
          to="/products"
          class="shop-now-btn bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300"
        >
          Shop Now
        </router-link>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-products mb-12">
      <h2 class="text-3xl font-semibold mb-6 text-center text-gray-800">
        Featured Products
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="product in featuredProducts"
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
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories mb-12">
      <h2 class="text-3xl font-semibold mb-6 text-center text-gray-800">
        Shop by Category
      </h2>
      <div class="flex justify-center gap-4 flex-wrap">
        <router-link
          v-for="category in categories"
          :key="category"
          :to="{ path: '/products', query: { category } }"
          class="category-btn bg-gray-200 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-300 transition-colors duration-300"
        >
          {{ category }}
        </router-link>
      </div>
    </section>

    <!-- Promotions Section -->
    <section class="promotions mb-12">
      <h2 class="text-3xl font-semibold mb-6 text-center text-gray-800">
        Current Promotions
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div
          class="promotion-card bg-yellow-100 p-6 rounded-lg shadow-lg text-center"
        >
          <h3 class="text-xl font-bold mb-4">Summer Sale</h3>
          <p class="text-gray-600 mb-6">
            Get up to 50% off on selected items. Limited time offer!
          </p>
          <router-link
            to="/products?promotion=summer-sale"
            class="shop-now-btn bg-yellow-500 text-white py-2 px-6 rounded-full hover:bg-yellow-600 transition-colors duration-300"
          >
            Shop Now
          </router-link>
        </div>
        <div
          class="promotion-card bg-red-100 p-6 rounded-lg shadow-lg text-center"
        >
          <h3 class="text-xl font-bold mb-4">Clearance</h3>
          <p class="text-gray-600 mb-6">
            Final sale on selected items. Hurry, while stocks last!
          </p>
          <router-link
            to="/products?promotion=clearance"
            class="shop-now-btn bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition-colors duration-300"
          >
            Shop Now
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    const featuredProducts = ref([]);
    const categories = ref([]);

    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products?limit=5');
        if (!response.ok) throw new Error('Failed to fetch featured products');
        const data = await response.json();
        featuredProducts.value = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching featured products:', error);
        featuredProducts.value = [];
      }
    };

    const fetchCategoriesData = async () => {
      categories.value = await store.dispatch("fetchCategories");
    };

    onMounted(async () => {
      await fetchFeaturedProducts();
      await fetchCategoriesData();
    });

    return {
      featuredProducts,
      categories
    };
  }
});
</script>

<style scoped>
.hero {
  background: url("path-to-your-hero-image.jpg") no-repeat center center;
  background-size: cover;
  padding: 100px 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.featured-products {
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
}

.categories {
  background-color: #edf2f7;
  padding: 20px;
  border-radius: 8px;
}

.promotions {
  background-color: #fff5f5;
  padding: 20px;
  border-radius: 8px;
}

.product-card img {
  transition: transform 0.3s ease;
}

.product-card:hover img {
  transform: scale(1.05);
}

.shop-now-btn {
  display: inline-block;
  text-align: center;
}

.category-btn {
  margin: 0 5px;
  font-size: 14px;
  padding: 8px 12px;
}
</style>
