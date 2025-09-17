// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token'))
  const user = ref(JSON.parse(localStorage.getItem('user_info') || 'null'))
  const isAuthenticated = ref(!!token.value)

  function setAuth(authData) {
    token.value = authData.token
    user.value = {
      id: authData.user_id,
      username: authData.username,
      email: authData.email
    }
    isAuthenticated.value = true
    
    // 存储到localStorage
    localStorage.setItem('auth_token', authData.token)
    localStorage.setItem('user_info', JSON.stringify(user.value))
    
    // 设置axios默认头
    axios.defaults.headers.common['Authorization'] = `Token ${authData.token}`
  }

  function getAuth() {
    return {
      token: token.value,
      user: user.value,
    //   isAuthenticated: isAuthenticated.value
    }
  }

  function clearAuth() {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
    
    delete axios.defaults.headers.common['Authorization']
  }

  return { token, user, isAuthenticated, setAuth, clearAuth, getAuth }
})