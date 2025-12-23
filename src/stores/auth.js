import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  // 更健壮地从 localStorage 解析用户信息，避免 JSON.parse('undefined') 报错
  let initialUser = null
  const rawUser = localStorage.getItem('user')
  if (rawUser) {
    try {
      initialUser = JSON.parse(rawUser)
    } catch (e) {
      initialUser = null
      // 旧版本可能存过非法字符串，这里顺便清掉避免后续再报错
      localStorage.removeItem('user')
    }
  }
  const user = ref(initialUser)

  const isAuthenticated = computed(() => !!token.value)

  function setAuth(authToken, userData) {
    token.value = authToken
    user.value = userData
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function clearAuth() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function login(email, password) {
    try {
      const response = await api.post('/user/login', { email, password })
      if (response.data.code == 0) {
        setAuth(response.data.token, response.data);
        return {success: true}
      } else {
        return {
          success: false,
          message: response.data.msg
        }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '登录失败，请检查用户名和密码' 
      }
    }
  }

  async function register(username, password, email) {
    try {
      const response = await api.post('/user/register', { username, password, email })
      setAuth(response.data.token, response.data.user)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '注册失败，请重试' 
      }
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
    }
  }

  function initAuth() {
    // 从localStorage恢复认证状态
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken) {
      token.value = savedToken
    }
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        user.value = null
      }
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    initAuth
  }
})
