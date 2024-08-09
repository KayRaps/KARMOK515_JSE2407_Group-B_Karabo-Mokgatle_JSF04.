<template>
    <div
      role="status"
      class="bg-white max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
    >
      <div
        class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700"
      >
        <svg
          class="w-10 h-10 text-gray-200 dark:text-gray-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 20"
        >
          <path
            d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"
          />
          <path
            d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"
          />
        </svg>
      </div>
      <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div
        class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
      ></div>
      <div
        class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-10 mb-4"
      ></div>
      <span class="sr-only">Loading...</span>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "CardSkeleton",
  });
  </script>
  
  <style>
  .bg-white {
    background-color: white;
  }
  
  .max-w-sm {
    max-width: 24rem;
  }
  
  .p-4 {
    padding: 1rem;
  }
  
  .border {
    border-width: 1px;
  }
  
  .border-gray-200 {
    border-color: #e5e7eb;
  }
  
  .rounded {
    border-radius: 0.375rem;
  }
  
  .shadow {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  
  .animate-pulse {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .md\:p-6 {
    padding: 1.5rem;
  }
  
  .dark\:border-gray-700 {
    border-color: #374151;
  }
  
  .flex {
    display: flex;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-center {
    justify-content: center;
  }
  
  .h-48 {
    height: 12rem;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  
  .bg-gray-300 {
    background-color: #d1d5db;
  }
  
  .rounded {
    border-radius: 0.375rem;
  }
  
  .dark\:bg-gray-700 {
    background-color: #374151;
  }
  
  .text-gray-200 {
    color: #e5e7eb;
  }
  
  .dark\:text-gray-600 {
    color: #4b5563;
  }
  
  .h-2 {
    height: 0.5rem;
  }
  
  .bg-gray-200 {
    background-color: #e5e7eb;
  }
  
  .rounded-full {
    border-radius: 9999px;
  }
  
  .w-48 {
    width: 12rem;
  }
  
  .w-10 {
    width: 2.5rem;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  </style>
  