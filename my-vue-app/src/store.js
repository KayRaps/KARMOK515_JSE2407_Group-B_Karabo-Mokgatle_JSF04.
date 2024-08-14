import { createStore } from "vuex";
import { jwtDecode } from "jwt-decode"; // Corrected the import for jwtDecode

export default createStore({
  state() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      token: localStorage.getItem("token") || null,
      cart: {
        items: JSON.parse(localStorage.getItem("cart")) || [],
      },
      wishlist: JSON.parse(localStorage.getItem("wishlist")) || [],
      selectedCategory: "",
      sortOrder: "",
      comparisonList: [],
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    setCart(state, cart) {
      state.cart = cart;
    },
    setWishlist(state, wishlist) {
      state.wishlist = wishlist;
    },
    setCategory(state, category) {
      state.selectedCategory = category;
    },
    setSortOrder(state, sortOrder) {
      state.sortOrder = sortOrder;
    },
    setCart(state, cart) {
      state.cart = { items: cart.items || [] };
    },
    addToCart(state, product) {
      if (!state.cart.items) state.cart.items = [];
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
      if (!state.cart.items) state.cart.items = [];
      const item = state.cart.items.find((item) => item.id === productId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    removeFromCart(state, productId) {
      if (!state.cart.items) state.cart.items = [];
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

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(credentials.username));

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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      localStorage.removeItem("wishlist");
    },
    async fetchCart({ commit, state }) {
      if (state.user) {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          commit("setCart", JSON.parse(storedCart));
        } else {
          const response = await fetch(
            `https://fakestoreapi.com/carts/user/${state.user.id}`
          );
          const cart = await response.json();
          commit("setCart", cart);
        }
      }
    },
    async fetchWishlist({ commit, state }) {
      if (state.user) {
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
    addToCart({ commit }, product) {
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
    addToWishlist({ commit }, product) {
      commit("addToWishlist", product);
    },
    removeFromWishlist({ commit }, productId) {
      commit("removeFromWishlist", productId);
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isLoggedIn: (state) => !!state.user,
    cartItemCount: (state) => {
      return state.cart && state.cart.items
        ? state.cart.items.reduce(
            (total, item) => total + (item.quantity || 0),
            0
          )
        : 0;
    },
    cartTotal: (state) => {
      return state.cart && state.cart.items
        ? state.cart.items.reduce(
            (total, item) => total + (item.price || 0) * (item.quantity || 0),
            0
          )
        : 0;
    },
    wishlistItemCount: (state) => state.wishlist.length,
  },
});
