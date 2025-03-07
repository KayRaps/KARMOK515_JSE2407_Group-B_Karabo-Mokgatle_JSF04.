<template>
  <header class="sticky top-0 z-50 p-0">
    <nav class="bg-blue-300">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- Logo and Site Name -->
        <router-link to="/">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="../assets/online-shop.png" class="h-8" alt="SwiftCart Logo" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">SwiftCart</span>
          </div>
        </router-link>

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="toggleNavbar"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-dropdown"
          :aria-expanded="showNavbar"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <!-- Navbar Links -->
        <div
          :class="['w-full md:block md:w-auto', { hidden: !showNavbar }]"
          id="navbar-dropdown"
        >
          <ul class="flex flex-col top-10 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-500 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <!-- Home Link -->
            <li>
              <router-link
                to="/"
                class="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              >
                Home
              </router-link>
            </li>

            <!-- Products Link -->
            <li>
              <router-link
                to="/products"
                class="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              >
                Products
              </router-link>
            </li>

            <!-- Wishlist Link -->
            <li>
              <router-link
                to="/wishlist"
                class="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              >
                Wishlist ({{ wishlistItemCount }})
              </router-link>
            </li>

            <!-- Cart Link (with badge) -->
            <li class="relative hidden md:block lg:block">
              <div class="absolute left-3 top-0">
                <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">{{ cartItemCount }}</p>
              </div>
              <router-link to="/cart" class="text-white hover:bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6 stroke-white cursor-pointer"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </router-link>
            </li>

            <!-- Mobile Cart Link -->
            <li class="lg:hidden md:hidden">
              <router-link
                to="/cart"
                class="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              >
                Cart ({{ cartItemCount }})
              </router-link>
            </li>

            <!-- Compare Link -->
            <li>
              <router-link
                to="/compare"
                class="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              >
                Compare ({{ comparisonCount }})
              </router-link>
            </li>

            <!-- Login/Logout Link -->
            <li>
              <router-link
                v-if="!isLoggedIn"
                to="/login"
                class="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              >
                Login
              </router-link>
              <a
                v-else
                href="#"
                @click.prevent="logout"
                class="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <ThemeToggle />
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ThemeToggle from './ThemeToggle.vue';

const store = useStore();
const router = useRouter();
const showNavbar = ref(false);

const toggleNavbar = () => {
  showNavbar.value = !showNavbar.value;
};

const isLoggedIn = computed(() => store.getters.isLoggedIn);

const logout = () => {
  store.dispatch("logout");
  router.push("/login");
};

const cartItemCount = computed(() => store.getters.cartItemCount);
const wishlistItemCount = computed(() => store.getters.wishlistItemCount);
const comparisonCount = computed(() => store.getters.comparisonList.length);
</script>
