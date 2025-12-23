import api from './api'

export const imageService = {
    // Get current user's images
    async getImages() {
        try {
            const response = await api.get('/images')
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to load images'
            }
        }
    },

    // Upload image
    async uploadImage(file) {
        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await api.post('/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    return percentCompleted
                }
            })
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Upload failed, please try again'
            }
        }
    },

    // Delete image
    async deleteImage(imageId) {
        try {
            await api.delete(`/images/${imageId}`)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Delete failed, please try again'
            }
        }
    },

    // 下载图片
    downloadImage(imageUrl, filename) {
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = filename || 'image.jpg'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    },

    // Get all users' images (for feed)
    async getAllUsersImages() {
        try {
            const response = await api.get('/images/all')
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to load images'
            }
        }
    },

    // Get current user's images
    async getMyImages() {
        try {
            const response = await api.get('/images/my')
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to load your images'
            }
        }
    }
}

