import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   config.headers.Authorization = `Bearer ${token}`

//   return config
// })
