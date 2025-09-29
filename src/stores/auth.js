// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
// import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
    // 状态定义
    const token = ref(localStorage.getItem('token') || '')
    const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))
    const isAuthenticated = ref(!!token.value)

    // 保存用户信息到本地存储和状态
    const saveUserInfo = (userData, authToken = null) => {
        if (authToken) {
            token.value = authToken
            localStorage.setItem('token', authToken)
            // 设置 axios 默认授权头
            // axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
        }
        
        userInfo.value = userData
        localStorage.setItem('userInfo', JSON.stringify(userData))
        isAuthenticated.value = true
    }

    // 清除用户信息（退出登录）
    const clearUserInfo = () => {
        token.value = ''
        userInfo.value = null
        isAuthenticated.value = false
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        // delete axios.defaults.headers.common['Authorization']
    }

    // 更新用户信息（部分更新）
    const updateUserInfo = (newData) => {
        if (userInfo.value) {
            userInfo.value = { ...userInfo.value, ...newData }
            localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        }
    }

    // 获取用户信息
    const getUserInfo = () => {
        return userInfo.value
    }

    // 检查是否已登录
    const checkAuth = () => {
        return isAuthenticated.value
    }

    // // 初始化时设置 axios 授权头
    // if (token.value) {
    //     axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    // }

    return {
        // 状态
        token,
        userInfo,
        isAuthenticated,
        
        // 方法
        saveUserInfo,
        clearUserInfo,
        updateUserInfo,
        getUserInfo,
        checkAuth
    }
})