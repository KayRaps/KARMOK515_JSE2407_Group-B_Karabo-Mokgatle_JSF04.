<template>
    <button @click="toggleTheme" class="theme-toggle">
      {{ theme === 'light' ? '🌙' : '☀️' }}
    </button>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    computed: {
    ...mapGetters(['currentTheme'])
  },
  methods: {
    ...mapActions(['toggleTheme'])
  },
    name: 'ThemeToggle',
    setup() {
      const store = useStore();
  
      const theme = computed(() => store.state.theme);
  
      const toggleTheme = () => {
        store.dispatch('toggleTheme');
      };
  
      return {
        theme,
        toggleTheme,
      };
    },
  };
  </script>
  
  <style scoped>
  .theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
  }
  </style>
  