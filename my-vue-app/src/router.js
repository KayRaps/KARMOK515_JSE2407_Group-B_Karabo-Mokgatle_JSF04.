// router.js
import { createRouter, createWebHistory } from 'vue-router';
import { store } from './store.js'

// Import components
import Home from './views/Home.vue';
import ProductList from './components/ProductList.vue';
import ProductDetails from './components/ProductDetails.vue';
import Cart from './components/Cart.vue';
import Wishlist from './components/Wishlist.vue';
import Login from './components/Login.vue';
import ComparisonList from './components/ComparisonList.vue';

const routes = [
  { 
    path: "/", 
    name: 'Home',
    component: Home 
  },
  { 
    path: "/products", 
    name: 'ProductList',
    component: ProductList 
  },
  { 
    path: "/product/:id", 
    name: 'ProductDetails',
    component: ProductDetails 
  },
  { 
    path: '/cart', 
    name: 'Cart',
    component: Cart, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/wishlist', 
    name: 'Wishlist',
    component: Wishlist, 
    meta: { requiresAuth: true } 
  },
  { 
    path: "/login", 
    name: 'Login',
    component: Login 
  },
  { 
    path: '/compare', 
    name: 'Compare',
    component: ComparisonList 
  },
  {
    path: '/comparison',
    name: 'Comparison',
    component: () => import('./views/ComparisonView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;