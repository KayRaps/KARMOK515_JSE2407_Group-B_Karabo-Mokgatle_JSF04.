<template>
    <div class="comparison-view container mx-auto mt-8">
      <h1 class="text-2xl font-semibold mb-4">Product Comparison</h1>
      <div v-if="comparisonList.length > 0">
        <div class="overflow-x-auto">
          <table class="table-auto w-full text-left bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr class="bg-gray-200">
                <th class="p-4 text-sm font-semibold text-gray-700">Product</th>
                <th v-for="item in comparisonList" :key="item.id" class="p-4 text-sm font-semibold text-gray-700">
                  {{ item.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-4 text-sm text-gray-600">Image</td>
                <td v-for="item in comparisonList" :key="item.id" class="p-4">
                  <img :src="item.image" alt="Product Image" class="w-32 h-32 object-cover rounded-lg shadow-md" />
                </td>
              </tr>
              <tr class="border-b">
                <td class="p-4 text-sm text-gray-600">Description</td>
                <td v-for="item in comparisonList" :key="item.id" class="p-4 text-sm text-gray-600">
                  {{ item.description }}
                </td>
              </tr>
              <tr class="border-b">
                <td class="p-4 text-sm text-gray-600">Price</td>
                <td v-for="item in comparisonList" :key="item.id" class="p-4 text-sm text-gray-600">
                  {{ item.price | currency }}
                </td>
              </tr>
              <tr class="border-b">
                <td class="p-4 text-sm text-gray-600">Rating</td>
                <td v-for="item in comparisonList" :key="item.id" class="p-4 text-sm text-gray-600">
                  {{ item.rating.rate }}
                </td>
              </tr>
              <tr class="border-b">
                <td class="p-4 text-sm text-gray-600">Actions</td>
                <td v-for="item in comparisonList" :key="item.id" class="p-4 text-sm text-gray-600">
                  <button @click="removeFromComparison(item.id)" class="text-red-500 hover:underline">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 text-right">
          <button class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300 shadow-lg"
                  @click="clearComparisonList">
            Clear Comparison List
          </button>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-600">No products in the comparison list.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    setup() {
      const store = useStore();
  
      const comparisonList = computed(() => store.state.comparisonList);
  
      const removeFromComparison = (productId) => {
        store.dispatch('removeFromComparison', productId);
      };
  
      const clearComparisonList = () => {
        store.dispatch('clearComparisonList');
      };
  
      return {
        comparisonList,
        removeFromComparison,
        clearComparisonList,
      };
    },
  };
  </script>
  
  <style scoped>
  table {
    @apply border-collapse;
  }
  th,
  td {
    @apply border px-4 py-2;
  }
  th {
    @apply bg-gray-100 text-gray-700;
  }
  tr:nth-child(even) {
    @apply bg-gray-50;
  }
  </style>
  