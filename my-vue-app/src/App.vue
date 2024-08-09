<template>
  <div id="app">
    <Header />
    <div class="container">
      <router-view :products="products" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import Header from "./components/Header.vue";

/**
 * The main application component.
 *
 * @component
 */
export default defineComponent({
  /**
   * The name of the component.
   *
   * @type {string}
   */
  name: "App",

  /**
   * The components used by this component.
   *
   * @type {object}
   */
  components: {
    /**
     * The header component.
     *
     * @type {Header}
     */
    Header,
  },

  /**
   * The setup function for the component.
   *
   * @returns {object} The component's data and methods.
   */
  setup() {
    /**
     * The products data.
     *
     * @type {array}
     */
    const products = ref([]);

    /**
     * Fetches the products data from the API when the component is mounted.
     *
     * @async
     */
    onMounted(async () => {
      try {
        /**
         * The response from the API.
         *
         * @type {Response}
         */
        const res = await fetch("https://fakestoreapi.com/products");

        /**
         * Sets the products data from the API response.
         *
         * @type {array}
         */
        products.value = await res.json();
      } catch (error) {
        /**
         * Logs an error message if the fetch fails.
         *
         * @param {Error} error The error object.
         */
        console.error("Failed to fetch products:", error);
      }
    });

    /**
     * Returns the component's data and methods.
     *
     * @returns {object}
     */
    return {
      /**
       * The products data.
       *
       * @type {array}
       */
      products,
    };
  },
});
</script>

<style>
header {
  background-color: #f8f8f8;
  padding: 1em;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2em;
}
</style>