<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { http } from '@/api/request'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const loginText = ref('SSO 授权登录')

// 1. 第一步：向后端请求 SSO 授权页面 URL 并跳转
const handleSSOLogin = async () => {
  isLoading.value = true
  loginText.value = '正在跳转...'

  try {
    const res: any = await http.get('/api-loca/member/auth/sso/url?client=portal')
    const ssoUrl = res.url || res.data?.url
    console.log('SSO 登录地址:', ssoUrl)
    if (!ssoUrl) {
      throw new Error('获取 SSO 登录地址失败')
    }

    // 解析出 state 保存到本地，用于回调防篡改校验
    const urlObj = new URL(ssoUrl)
    const state = urlObj.searchParams.get('state')

    if (!state) {
      throw new Error('SSO state 无效')
    }

    sessionStorage.setItem('sso_state', state)
    window.location.href = ssoUrl

  } catch (err: any) {
    alert(err.message || '网络请求错误')
    resetState()
  }
}

const resetState = () => {
  isLoading.value = false
  loginText.value = 'SSO 授权登录'
  router.replace('/login')
}
</script>

<template>
  <div class="login-container">
    <div class="background-elements">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <div class="glow glow-3"></div>
    </div>

    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h1>系统登录</h1>
        <p>统一身份认证平台 (SSO)</p>
      </div>

      <div class="login-content">
        <div class="sso-section">
          <button
            class="sso-btn"
            :class="{ loading: isLoading }"
            @click="handleSSOLogin"
            :disabled="isLoading"
          >
            <span class="btn-text" v-if="!isLoading">{{ loginText }}</span>
            <span class="loader" v-else></span>
          </button>

          <p class="sso-hint">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            企业级安全认证，无需记忆密码
          </p>
        </div>

        <div class="divider">
          <span>其他方式</span>
        </div>

        <form class="regular-login" @submit.prevent>
          <div class="input-group">
            <input type="text" id="username" placeholder=" " required />
            <label for="username">用户名</label>
          </div>
          <div class="input-group">
            <input type="password" id="password" placeholder=" " required />
            <label for="password">密码</label>
          </div>

          <div class="form-actions">
            <label class="remember-me">
              <input type="checkbox" />
              <span>自动登录</span>
            </label>
            <a href="#" class="forgot-pwd">忘记密码？</a>
          </div>

          <button type="submit" class="primary-btn">普通登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f172a;
  position: relative;
  overflow: hidden;
  font-family:
    'Inter',
    -apple-system,
    sans-serif;
}

.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
  animation: float 10s infinite ease-in-out alternate;
}

.glow-1 {
  width: 400px;
  height: 400px;
  background: rgba(56, 189, 248, 0.4);
  top: -100px;
  left: -100px;
}

.glow-2 {
  width: 500px;
  height: 500px;
  background: rgba(129, 140, 248, 0.3);
  bottom: -200px;
  right: -100px;
  animation-delay: -5s;
}

.glow-3 {
  width: 300px;
  height: 300px;
  background: rgba(167, 139, 250, 0.3);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -2s;
}

@keyframes float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(30px, 50px) scale(1.1);
  }
}

.login-box {
  width: 100%;
  max-width: 440px;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 48px;
  z-index: 1;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: translateY(0);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 20px -10px rgba(56, 189, 248, 0.6);
}

.logo svg {
  width: 32px;
  height: 32px;
}

.login-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.5px;
}

.login-header p {
  margin: 8px 0 0;
  color: #94a3b8;
  font-size: 15px;
}

.sso-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.sso-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s ease;
}

.sso-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(79, 70, 229, 0.6);
}

.sso-btn:hover:not(:disabled)::before {
  left: 100%;
}

.sso-btn:active:not(:disabled) {
  transform: translateY(0);
}

.sso-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 13px;
  color: #10b981;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 32px 0;
  color: #64748b;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.divider span {
  padding: 0 16px;
}

.input-group {
  position: relative;
  margin-bottom: 24px;
}

.input-group input {
  width: 100%;
  height: 52px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  color: #f8fafc;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  border-color: #38bdf8;
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
}

.input-group label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 15px;
  pointer-events: none;
  transition: all 0.3s ease;
  background: transparent;
}

/* Floating Label Animation */
.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  top: 0;
  transform: translateY(-50%) scale(0.85);
  left: 12px;
  padding: 0 4px;
  background: #1e293b;
  color: #38bdf8;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #94a3b8;
  font-size: 14px;
}

.remember-me input {
  accent-color: #38bdf8;
  width: 16px;
  height: 16px;
}

.forgot-pwd {
  color: #38bdf8;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-pwd:hover {
  color: #818cf8;
}

.primary-btn {
  width: 100%;
  height: 52px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #f8fafc;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .login-box {
    padding: 32px 24px;
    border-radius: 20px;
    margin: 20px;
  }
}
</style>
