<template>
    <div class="sort">
      <select @change="handleSortChange" v-model="sortOrder">
        <option value="">Default</option>
        <option value="low-to-high">Price: Low to High</option>
        <option value="high-to-low">Price: High to Low</option>
      </select>
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted } from "vue";
  
  export default {
    name: "Sort",
    props: {
      initialSort: String,
    },
    emits: ["update:sort"],
    setup(props, { emit }) {
      const sortOrder = ref(props.initialSort || "");
  
      const handleSortChange = () => {
        emit("update:sort", sortOrder.value);
      };
  
      watch(sortOrder, () => {
        handleSortChange();
      });
  
      onMounted(() => {
        emit("update:sort", sortOrder.value);
      });
  
      return {
        sortOrder,
        handleSortChange,
      };
    },
  };
  </script>
  
  <style scoped>
  .sort {
    margin: 0.5rem;
    display: flex;
    align-items: center;
    padding: 0.5rem;
    background-color: white;
    border-radius: 7px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 10px solid black;
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
    .sort {
      margin: 0.5rem 0;
      width: 100%;
    }
  
    select {
      width: 100%;
    }
  }
  
  @media (max-width: 480px) {
    .sort {
      flex-direction: column;
      align-items: flex-start;
    }
  
    select {
      width: 100%;
    }
  }
  </style>
  