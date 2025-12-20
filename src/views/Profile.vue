<template>
  <div class="profile-container">
    <header class="header">
      <h1 class="header-title">个人中心</h1>
      <div class="header-actions">
        <router-link to="/" class="btn btn-secondary">返回首页</router-link>
        <router-link to="/images" class="btn btn-secondary">我的图片</router-link>
        <button @click="handleLogout" class="btn btn-secondary">退出登录</button>
      </div>
    </header>

    <main class="main-content">
      <div class="profile-card">
        <h2 class="card-title">修改个人信息</h2>
        
        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>

        <form @submit.prevent="handleUpdate" class="form">
          <div class="form-group">
            <label>用户名</label>
            <input
              v-model="username"
              type="text"
              placeholder="请输入新用户名"
              required
              class="input"
            />
          </div>

          <div class="form-group">
            <label>当前密码</label>
            <input
              v-model="currentPassword"
              type="password"
              placeholder="请输入当前密码（修改密码时必填）"
              class="input"
            />
          </div>

          <div class="form-group">
            <label>新密码</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="请输入新密码（留空则不修改）"
              :minlength="newPassword ? 6 : 0"
              class="input"
            />
            <small class="form-hint">留空则不修改密码，至少6位</small>
          </div>

          <div class="form-group">
            <label>确认新密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              :minlength="confirmPassword ? 6 : 0"
              class="input"
            />
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="loading" class="btn btn-primary">
              {{ loading ? '保存中...' : '保存修改' }}
            </button>
            <button type="button" @click="handleReset" class="btn btn-secondary">
              重置
            </button>
          </div>
        </form>

        <div class="user-info-section">
          <h3 class="info-title">当前信息</h3>
          <div class="info-item">
            <span class="info-label">用户名：</span>
            <span class="info-value">{{ authStore.user?.username || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">邮箱：</span>
            <span class="info-value">{{ authStore.user?.email || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">用户ID：</span>
            <span class="info-value">{{ authStore.user?.id || '-' }}</span>
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

const username = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')

onMounted(() => {
  authStore.initAuth()
  // 初始化表单，使用当前用户名
  username.value = authStore.user?.username || ''
})

const handleUpdate = async () => {
  message.value = ''
  
  // 验证新密码
  if (newPassword.value) {
    if (newPassword.value.length < 6) {
      showMessage('新密码长度至少为6位', 'error')
      return
    }
    
    if (newPassword.value !== confirmPassword.value) {
      showMessage('两次输入的新密码不一致', 'error')
      return
    }
    
    if (!currentPassword.value) {
      showMessage('修改密码需要输入当前密码', 'error')
      return
    }
  }

  loading.value = true

  try {
    const updates = {
      username: username.value
    }

    // 如果输入了新密码，则添加密码相关字段
    if (newPassword.value) {
      updates.currentPassword = currentPassword.value
      updates.newPassword = newPassword.value
    }

    const result = await userService.updateUser(authStore.user?.id, updates)
    
    loading.value = false

    if (result.success) {
      // 更新本地存储的用户信息
      if (result.data.user) {
        authStore.setAuth(authStore.token, result.data.user)
      }
      showMessage('修改成功', 'success')
      // 清空密码相关字段
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    } else {
      showMessage(result.message, 'error')
    }
  } catch (error) {
    loading.value = false
    showMessage('修改失败，请重试', 'error')
  }
}

const handleReset = () => {
  username.value = authStore.user?.username || ''
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  message.value = ''
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
.profile-container {
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

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.card-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
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

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.form-hint {
  color: #999;
  font-size: 12px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.user-info-section {
  border-top: 2px solid #f0f0f0;
  padding-top: 30px;
  margin-top: 30px;
}

.info-title {
  color: #333;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.info-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-weight: 500;
  min-width: 100px;
}

.info-value {
  color: #333;
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

  .profile-card {
    padding: 30px 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>


