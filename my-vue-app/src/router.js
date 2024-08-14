// router.js
import { createRouter, createWebHistory } from 'vue-router';
import ProductList from './components/ProductList.vue';
import ProductDetails from './components/ProductDetails.vue';
import Cart from './components/Cart.vue';
import Wishlist from './components/Wishlist.vue';
import Login from './components/Login.vue';
import store from './store';

const routes = [
  { path: "/", component: ProductList },
  { path: "/product/:id", component: ProductDetails },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/wishlist', component: Wishlist, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
  {
    path: "/wishlist",
    component: () => import("./components/Wishlist.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/cart",
    component: () => import("./components/Cart.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn && !store.getters.isAuthenticated) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
