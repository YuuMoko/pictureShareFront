<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="title">Sign Up</h1>
      <form @submit.prevent="handleRegister" class="form">
        <div class="form-group">
          <label>Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter username"
            required
            class="input"
          />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter email"
            required
            class="input"
          />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter password (min 6 chars)"
            required
            minlength="6"
            class="input"
          />
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            required
            class="input"
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Signing up...' : 'Sign Up' }}
        </button>
        <div class="link-text">
          Already have an account?
          <router-link to="/login" class="link">Sign in</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }
  
  loading.value = true
  
  const result = await authStore.register(username.value, password.value, email.value)
  
  loading.value = false
  
  if (result.success) {
    router.push('/images')
  } else {
    errorMessage.value = result.message
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  padding: 10px;
  background: #fee;
  border-radius: 6px;
}

.link-text {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}
</style>

