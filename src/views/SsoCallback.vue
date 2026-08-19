<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { http } from '@/api/request'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string

  if (!code || !state) {
    alert('缺少授权参数，请重新发起登录')
    router.replace('/login')
    return
  }

  const savedState = sessionStorage.getItem('sso_state')
  if (state !== savedState) {
    alert('状态校验失败，可能存在安全风险，请重新发起登录')
    sessionStorage.removeItem('sso_state')
    router.replace('/login')
    return
  }

  try {
    sessionStorage.removeItem('sso_state')
    // 提交 code 和 state 到后端换取 access_token
    const res: any = await http.post('/member/auth/sso/callback', { code, state })
    
    const token = res.token || res.data?.token || res.access_token || res.data?.access_token
    
    if (token) {
      // 登录成功，保存 Token
      localStorage.setItem('access_token', token)
      
      // 可以短暂延迟让用户看清“登录成功”动画
      setTimeout(() => {
        router.replace('/')
      }, 500)
    } else {
      throw new Error(res.message || res.data?.message || '获取 Token 失败')
    }
  } catch (error: any) {
    console.error('SSO 回调处理失败:', error)
    alert('SSO 登录失败: ' + (error.message || '未知错误'))
    router.replace('/login')
  }
})
</script>

<template>
  <div class="sso-callback-container">
    <div class="background-elements">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
    </div>
    
    <div class="loader-box">
      <div class="spinner"></div>
      <h2>正在登录...</h2>
      <p>请稍候，正在通过统一身份验证</p>
    </div>
  </div>
</template>

<style scoped>
.sso-callback-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0f172a;
  color: #f8fafc;
  font-family: 'Inter', -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
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

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 50px) scale(1.1); }
}

.loader-box {
  position: relative;
  z-index: 1;
  text-align: center;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 60px 80px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: translateY(0);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.spinner {
  width: 56px;
  height: 56px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #38bdf8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

h2 {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

p {
  margin: 0;
  color: #94a3b8;
  font-size: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
