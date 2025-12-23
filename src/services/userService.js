import api from '@/api'

export const userService = {
  // Get all users
  async getAllUsers() {
    try {
      const response = await api.get('/user/all')
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load user list'
      }
    }
  },

  // Update user info (username/password)
  async updateUser(userId, updates) {
    try {
      const response = await api.put(`/user/${userId}`, updates)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user info'
      }
    }
  },

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await api.get('/user/me')
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load user info'
      }
    }
  }
}


