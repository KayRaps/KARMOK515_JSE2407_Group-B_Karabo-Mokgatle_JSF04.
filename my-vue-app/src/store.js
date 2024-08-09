import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      selectedCategory: "",
      sortOrder: "",
    };
  },
  mutations: {
    setCategory(state, category) {
      state.selectedCategory = category;
    },
    setSortOrder(state, sortOrder) {
      state.sortOrder = sortOrder;
    },
  },
  actions: {
    updateCategory({ commit }, category) {
      commit("setCategory", category);
    },
    updateSortOrder({ commit }, sortOrder) {
      commit("setSortOrder", sortOrder);
    },
  },
});
