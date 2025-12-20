import api from '@/api'

export const userService = {
  // 获取所有用户
  async getAllUsers() {
    try {
      const response = await api.get('/user/all')
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '获取用户列表失败'
      }
    }
  },

  // 更新用户信息（用户名、密码）
  async updateUser(userId, updates) {
    try {
      const response = await api.put(`/user/${userId}`, updates)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '更新用户信息失败'
      }
    }
  },

  // 获取当前用户信息
  async getCurrentUser() {
    try {
      const response = await api.get('/user/me')
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '获取用户信息失败'
      }
    }
  }
}


