<template>
  <div class="images-container">
    <header class="header">
      <h1 class="header-title">图片分享平台</h1>
      <div class="header-actions">
        <span class="username">{{ authStore.user?.username || '用户' }}</span>
        <button @click="handleLogout" class="btn btn-secondary">退出登录</button>
      </div>
    </header>

    <main class="main-content">
      <div class="upload-section">
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            @change="handleFileSelect"
            class="file-input"
          />
          <div class="upload-content">
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p class="upload-text">点击或拖拽图片到此处上传</p>
            <p class="upload-hint">支持多张图片同时上传</p>
          </div>
        </div>
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ uploadProgress }}%</span>
        </div>
      </div>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <div v-if="loading && images.length === 0" class="loading">
        加载中...
      </div>

      <div v-if="images.length === 0 && !loading" class="empty-state">
        <p>还没有上传任何图片</p>
        <p class="empty-hint">上传你的第一张图片开始分享吧！</p>
      </div>

      <div class="images-grid">
        <div v-for="image in images" :key="image.id" class="image-card">
          <div class="image-wrapper">
            <img :src="image.url" :alt="image.filename" class="image" />
            <div class="image-overlay">
              <button @click="downloadImage(image)" class="icon-btn" title="下载">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button @click="deleteImage(image.id)" class="icon-btn delete-btn" title="删除">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="image-info">
            <p class="image-filename">{{ image.filename }}</p>
            <p class="image-date">{{ formatDate(image.createdAt) }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { imageService } from '@/services/imageService'

const router = useRouter()
const authStore = useAuthStore()

const images = ref([])
const loading = ref(false)
const message = ref('')
const messageType = ref('')
const fileInput = ref(null)
const uploadProgress = ref(0)

onMounted(async () => {
  authStore.initAuth()
  await loadImages()
})

const loadImages = async () => {
  loading.value = true
  const result = await imageService.getImages()
  loading.value = false
  
  if (result.success) {
    images.value = result.data.images || []
  } else {
    showMessage(result.message, 'error')
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)
  await uploadFiles(files)
  event.target.value = '' // 重置input
}

const handleDrop = async (event) => {
  const files = Array.from(event.dataTransfer.files).filter(file => 
    file.type.startsWith('image/')
  )
  if (files.length > 0) {
    await uploadFiles(files)
  }
}

const uploadFiles = async (files) => {
  if (files.length === 0) return
  
  uploadProgress.value = 10
  showMessage('', '')
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const progress = 10 + (i / files.length) * 80
    uploadProgress.value = Math.round(progress)
    
    const result = await imageService.uploadImage(file)
    
    if (result.success) {
      images.value.unshift(result.data.image)
      showMessage(`成功上传 ${i + 1}/${files.length} 张图片`, 'success')
    } else {
      showMessage(`上传失败: ${result.message}`, 'error')
    }
  }
  
  uploadProgress.value = 100
  setTimeout(() => {
    uploadProgress.value = 0
  }, 1000)
}

const deleteImage = async (imageId) => {
  if (!confirm('确定要删除这张图片吗？')) return
  
  const result = await imageService.deleteImage(imageId)
  
  if (result.success) {
    images.value = images.value.filter(img => img.id !== imageId)
    showMessage('删除成功', 'success')
  } else {
    showMessage(result.message, 'error')
  }
}

const downloadImage = (image) => {
  imageService.downloadImage(image.url, image.filename)
  showMessage('开始下载', 'success')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const showMessage = (msg, type) => {
  message.value = msg
  messageType.value = type
  if (msg) {
    setTimeout(() => {
      message.value = ''
    }, 3000)
  }
}
</script>

<style scoped>
.images-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-title {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.username {
  color: #666;
  font-weight: 500;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.upload-section {
  margin-bottom: 30px;
}

.upload-area {
  background: white;
  border: 3px dashed #667eea;
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #764ba2;
  background: #f8f9ff;
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  width: 64px;
  height: 64px;
  color: #667eea;
  margin-bottom: 10px;
}

.upload-text {
  font-size: 18px;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.upload-hint {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.upload-progress {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 15px;
  border-radius: 8px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s;
}

.progress-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  min-width: 50px;
}

.message {
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.loading {
  text-align: center;
  padding: 60px;
  color: white;
  font-size: 18px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  color: #666;
}

.empty-state p {
  margin: 10px 0;
  font-size: 16px;
}

.empty-hint {
  color: #999;
  font-size: 14px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.image-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 比例 */
  overflow: hidden;
  background: #f5f5f5;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-btn:hover {
  background: white;
  transform: scale(1.1);
}

.icon-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  color: #333;
}

.delete-btn:hover svg {
  color: #e74c3c;
}

.image-info {
  padding: 15px;
}

.image-filename {
  margin: 0 0 5px 0;
  font-weight: 500;
  color: #333;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-date {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
    flex-direction: column;
    gap: 15px;
  }

  .header-title {
    font-size: 20px;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .upload-area {
    padding: 40px 15px;
  }
}
</style>

