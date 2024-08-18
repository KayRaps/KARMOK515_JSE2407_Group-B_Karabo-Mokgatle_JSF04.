import { jwtDecode } from "jwt-decode";
import { createStore } from "vuex";


const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    cart: {
      items: JSON.parse(localStorage.getItem("cart")) || [],
    },
    wishlist: JSON.parse(localStorage.getItem("wishlist")) || [],
    selectedCategory: "",
    sortOrder: "",
    comparisonList: JSON.parse(localStorage.getItem("comparisonList")) || [],
    comparisonListLoading: false,
    theme: localStorage.getItem("theme") || "light",
  },

  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    setProducts(state, products) {
      state.products = products;
    },
    setCart(state, cart) {
      state.cart = { items: Array.isArray(cart.items) ? cart.items : [] };
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    setWishlist(state, wishlist) {
      state.wishlist = wishlist;
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    },
    setCategory(state, category) {
      state.selectedCategory = category;
    },
    setSortOrder(state, sortOrder) {
      state.sortOrder = sortOrder;
    },
    addToCart(state, product) {
      const existingItem = state.cart.items.find(
        (item) => item.id === product.id
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.cart.items.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    updateCartItemQuantity(state, { productId, quantity }) {
      const item = state.cart.items.find((item) => item.id === productId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    removeFromCart(state, productId) {
      state.cart.items = state.cart.items.filter(
        (item) => item.id !== productId
      );
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart(state) {
      state.cart.items = [];
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    addToWishlist(state, product) {
      if (!state.wishlist.some((item) => item.id === product.id)) {
        state.wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
      }
    },
    removeFromWishlist(state, productId) {
      state.wishlist = state.wishlist.filter((item) => item.id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
    addToComparison(state, product) {
      if (
        state.comparisonList.length < 3 &&
        !state.comparisonList.some((item) => item.id === product.id)
      ) {
        state.comparisonList.push(product);
        localStorage.setItem(
          "comparisonList",
          JSON.stringify(state.comparisonList)
        );
      }
    },
    removeFromComparison(state, productId) {
      state.comparisonList = state.comparisonList.filter(
        (item) => item.id !== productId
      );
      localStorage.setItem(
        "comparisonList",
        JSON.stringify(state.comparisonList)
      );
    },
    clearComparisonList(state) {
      state.comparisonList = [];
      localStorage.setItem(
        "comparisonList",
        JSON.stringify(state.comparisonList)
      );
    },
    SET_COMPARISON_LIST(state, list) {
      state.comparisonList = Array.isArray(list) ? list : [];
      localStorage.setItem(
        "comparisonList",
        JSON.stringify(state.comparisonList)
      );
    },
    SET_COMPARISON_LIST_LOADING(state, loading) {
      state.comparisonListLoading = loading;
    },
    setTheme(state, theme) {
      state.theme = theme;
      localStorage.setItem("theme", theme);
    },
  },

  actions: {
    async login({ commit, dispatch }, credentials) {
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const token = data.token;
      const decodedToken = jwtDecode(token);

      commit("setToken", token);
      commit("setUser", {
        id: decodedToken.userId,
        username: credentials.username,
      });

      await dispatch("fetchCart");
      await dispatch("fetchWishlist");
    },
    logout({ commit }) {
      commit("setUser", null);
      commit("setToken", null);
      commit("clearCart");
      commit("setWishlist", []);
      commit("clearComparisonList");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      localStorage.removeItem("wishlist");
      localStorage.removeItem("comparisonList");
    },
    async fetchUser({ commit, state }) {
      if (state.user) {
        return state.user;
      }
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        commit("setUser", user);
        return user;
      }
      return null;
    },
    async fetchCategories({ commit }) {
      try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();
        return categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    async fetchCart({ commit, state }) {
      if (!state.user) {
        console.log('User is not logged in');
        commit("setCart", { items: [] });
        return;
      }
      try {
        const userId = state.user.id;
        if (!userId) {
          console.error('User ID is not available');
          commit("setCart", { items: [] });
          return;
        }
        const response = await fetch(`https://fakestoreapi.com/carts/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        const cartData = await response.json();
        const cartItems = Array.isArray(cartData) ? cartData : [];
        commit("setCart", { items: cartItems });
      } catch (error) {
        console.error("Error fetching cart:", error);
        commit("setCart", { items: [] });
      }
    },
    async initializeApp({ dispatch }) {
      await dispatch("checkAuth");
      await dispatch("fetchCart");
      await dispatch("initializeTheme");
    },
    checkAuth({ commit }) {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (token && user) {
        commit("setUser", user);
        commit("setToken", token);
      }
    },
    async fetchProducts({ commit }) {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        commit('setProducts', products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchWishlist({ commit, state }) {
      if (!state.user) {
        const storedWishlist = localStorage.getItem("wishlist");
        if (storedWishlist) {
          commit("setWishlist", JSON.parse(storedWishlist));
        } else {
          const response = await fetch(
            `https://fakestoreapi.com/wishlist/${state.user.id}`
          );
          const wishlist = await response.json();
          commit("setWishlist", wishlist);
        }
      }
    },
    updateCategory({ commit }, category) {
      commit("setCategory", category);
    },
    updateSortOrder({ commit }, sortOrder) {
      commit("setSortOrder", sortOrder);
    },
    addProductToCart({ commit }, product) {
      commit("addToCart", product);
    },
    updateCartItemQuantity({ commit }, payload) {
      commit("updateCartItemQuantity", payload);
    },
    removeFromCart({ commit }, productId) {
      commit("removeFromCart", productId);
    },
    clearCart({ commit }) {
      commit("clearCart");
    },
    addProductToWishlist({ commit }, product) {
      commit("addToWishlist", product);
    },
    removeFromWishlist({ commit }, productId) {
      commit("removeFromWishlist", productId);
    },
    addToComparison({ commit }, product) {
      commit("addToComparison", product);
    },
    removeFromComparison({ commit }, productId) {
      commit("removeFromComparison", productId);
    },
    async updateComparisonList({ commit }, list) {
      commit("SET_COMPARISON_LIST_LOADING", true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        commit("SET_COMPARISON_LIST", list);
      } finally {
        commit("SET_COMPARISON_LIST_LOADING", false);
      }
    },
    initializeTheme({ commit }) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        commit("setTheme", savedTheme);
      } else {
        commit("setTheme", "light");
      }
    },
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === "light" ? "dark" : "light";
      commit("setTheme", newTheme);
    },
  },

  getters: {
    comparisonList: (state) => state.comparisonList,
    comparisonListLoading: (state) => state.comparisonListLoading,
    isAuthenticated: (state) => !!state.user,
    cartItemCount: (state) => {
      if (!Array.isArray(state.cart.items)) {
        console.error('Cart items is not an array:', state.cart.items);
        return 0;
      }
      return state.cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
    },
    cartTotalPrice: (state) =>
      state.cart.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      ),
    currentTheme: (state) => state.theme,
  },
});

export { store };
export default store;