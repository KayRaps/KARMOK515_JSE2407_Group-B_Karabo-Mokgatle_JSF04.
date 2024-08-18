<template>
  <div id="app" :class="{ 'dark-theme': isDarkTheme }" :data-theme="theme">
    <Header :cartItemCount="cartItemCount" :comparisonCount="comparisonCount">
      <ThemeToggle />
    </Header>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/compare">Compare ({{ comparisonCount }})</router-link>
    </nav>
    <main>
      <div class="container">
        <router-view :products="products" />
      </div>
    </main>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import Header from './components/Header.vue';
import ThemeToggle from './components/ThemeToggle.vue';

export default defineComponent({
  name: 'App',
  components: {
    Header,
    ThemeToggle
  },
  setup() {
    const store = useStore();
    const products = ref([]);
    const cartItemCount = computed(() => store.getters.cartItemCount || 0);
    const comparisonCount = computed(() => store.getters.comparisonList.length);
    const theme = computed(() => store.getters.currentTheme);
    const isDarkTheme = computed(() => store.state.theme === 'dark');

    onMounted(async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        products.value = await res.json();
        await store.dispatch('checkAuth');
        store.dispatch('initializeApp');
      } catch (error) {
        console.error("Failed to initialize app:", error);
      }
    });

    return {
      products,
      cartItemCount,
      comparisonCount,
      theme,
      isDarkTheme
    };
  }
});
</script>

<style>
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --primary-color: #4a90e2;
  --secondary-color: #f5a623;
}

[data-theme="dark"] {
  --bg-color: #333333;
  --text-color: #ffffff;
  --primary-color: #61dafb;
  --secondary-color: #ffc600;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.dark-theme {
  --bg-color: #333333;
  --text-color: #ffffff;
  --primary-color: #61dafb;
  --secondary-color: #ffc600;
}

/* Add any additional styles here */
</style>