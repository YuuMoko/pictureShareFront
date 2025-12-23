<template>
  <div class="home-container">
    <header class="header">
      <h1 class="header-title">Photo Plaza</h1>
      <div class="header-actions">
        <router-link to="/" class="btn btn-secondary">Home</router-link>
        <router-link to="/profile" class="btn btn-secondary">Profile</router-link>
        <router-link to="/images" class="btn btn-secondary">My Images</router-link>
        <span class="username">{{ authStore.user?.username || 'User' }}</span>
        <button @click="handleLogout" class="btn btn-secondary">Log out</button>
      </div>
    </header>

    <main class="main-content">
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <div v-if="loading && images.length === 0" class="loading">
        Loading...
      </div>

      <div v-if="images.length === 0 && !loading" class="empty-state">
        <p>No images yet</p>
        <p class="empty-hint">Upload your first photo to start sharing.</p>
      </div>

      <div class="images-grid">
        <div v-for="image in images" :key="image.id" class="image-card">
          <div class="image-wrapper">
            <img :src="image.url" :alt="image.filename" class="image" />
          </div>
          <div class="image-info">
            <p class="image-filename">{{ image.filename }}</p>
            <p class="image-owner">Uploaded by: {{ image.user?.username || image.username || 'Unknown user' }}</p>
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

onMounted(async () => {
  authStore.initAuth()
  await loadImages()
})

const loadImages = async () => {
  loading.value = true
  const result = await imageService.getAllUsersImages()
  loading.value = false
  
  if (result.success) {
    images.value = result.data.images || result.data || []
  } else {
    showMessage(result.message, 'error')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US')
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
.home-container {
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
  gap: 15px;
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

.message.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
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

/* 关键：首页图片网格布局，和 Images.vue 保持一致风格 */
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
  padding-top: 75%; /* 4:3 比例，和 Images.vue 一样 */
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

.image-owner {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #666;
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
  text-decoration: none;
  display: inline-block;
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

  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>


