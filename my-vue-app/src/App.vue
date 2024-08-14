<!-- App.vue -->
<template>
  <div id="app">
    <Header :cartItemCount="cartItemCount" />
    <div class="container">
      <router-view :products="products" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Header from "./components/Header.vue";
import { jwtDecode } from "jwt-decode";  // Changed to named import


export default defineComponent({
  name: "App",
  components: {
    Header,
  },
  setup() {
    const store = useStore();
    const products = ref([]);
    const cartItemCount = computed(() => store.getters.cartItemCount);

    onMounted(async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        products.value = await res.json();
        
        // Check for existing token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          store.commit('setUser', { id: decodedToken.userId, token });
          await store.dispatch('fetchCart');
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    });

    return {
      products,
      cartItemCount,
    };
  },
});
</script>