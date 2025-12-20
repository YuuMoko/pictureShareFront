<template>
  <div class="home-container">
    <header class="header">
      <h1 class="header-title">用户列表</h1>
      <div class="header-actions">
        <span class="username">{{ authStore.user?.username || '用户' }}</span>
        <router-link to="/profile" class="btn btn-profile">个人中心</router-link>
        <router-link to="/images" class="btn btn-secondary">我的图片</router-link>
        <button @click="handleLogout" class="btn btn-secondary">退出登录</button>
      </div>
    </header>

    <main class="main-content">
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <div v-if="loading && users.length === 0" class="loading">
        加载中...
      </div>

      <div v-if="users.length === 0 && !loading" class="empty-state">
        <p>暂无用户</p>
      </div>

      <div class="users-grid">
        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-avatar">
            <span class="avatar-text">{{ user.username?.charAt(0).toUpperCase() || 'U' }}</span>
          </div>
          <div class="user-info">
            <h3 class="user-name">{{ user.username }}</h3>
            <p class="user-email">{{ user.email }}</p>
            <p class="user-id">ID: {{ user.id }}</p>
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
import { userService } from '@/services/userService'

const router = useRouter()
const authStore = useAuthStore()

const users = ref([])
const loading = ref(false)
const message = ref('')
const messageType = ref('')

onMounted(async () => {
  authStore.initAuth()
  await loadUsers()
})

const loadUsers = async () => {
  loading.value = true
  const result = await userService.getAllUsers()
  loading.value = false
  
  if (result.success) {
    users.value = result.data.users || result.data || []
    if (users.value.length === 0) {
      showMessage('暂无用户数据', 'info')
    }
  } else {
    showMessage(result.message, 'error')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
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

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-text {
  color: white;
  font-size: 32px;
  font-weight: 600;
}

.user-info {
  width: 100%;
}

.user-name {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.user-email {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.user-id {
  margin: 0;
  color: #999;
  font-size: 12px;
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

.btn-profile {
  background: #667eea;
  color: white;
}

.btn-profile:hover {
  background: #5568d3;
  transform: translateY(-1px);
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

  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
}
</style>

