import api from './api'

export const imageService = {
    // 获取所有图片
    async getImages() {
        try {
            const response = await api.get('/images')
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '获取图片列表失败'
            }
        }
    },

    // 上传图片
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
                message: error.response?.data?.message || '上传失败，请重试'
            }
        }
    },

    // 删除图片
    async deleteImage(imageId) {
        try {
            await api.delete(`/images/${imageId}`)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '删除失败，请重试'
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

    // 获取所有用户的图片（用于feed展示）
    async getAllUsersImages() {
        try {
            const response = await api.get('/images/all')
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '获取图片列表失败'
            }
        }
    },

    // 获取当前用户的图片
    async getMyImages() {
        try {
            const response = await api.get('/images/my')
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '获取我的图片失败'
            }
        }
    }
}

