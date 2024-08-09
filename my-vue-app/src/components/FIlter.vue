<template>
    <div class="filter">
      <select @change="handleCategoryChange" v-model="selectedCategory">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
  </template>
  
  <script>
import { ref, watch } from "vue";

export default {
  name: "Filter",
  props: {
    categories: Array,
    initialCategory: String,
  },
  emits: ["update:category"],
  setup(props, { emit }) {
    const selectedCategory = ref(props.initialCategory || "");

    const handleCategoryChange = () => {
      emit("update:category", selectedCategory.value);
    };

    watch(selectedCategory, () => {
      handleCategoryChange();
    });

    return {
      selectedCategory,
      handleCategoryChange,
    };
  },
};
</script>

<style scoped>
.filter {
  margin: 0.5rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: black;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

select {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background: #f9f9f9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  color: #333;
  outline: none;
}

select:focus {
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
}

@media (max-width: 768px) {
  .filter {
    margin: 0.5rem 0;
    width: 100%;
  }

  select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .filter {
    flex-direction: column;
    align-items: flex-start;
  }

  select {
    width: 100%;
  }
}
</style>

