<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { http } from '@/api/request'

defineProps<{
  isInternal?: boolean
}>()

defineEmits(['toggleInternal'])

const isLoggedIn = ref(false)
const userInfo = ref({
  name: '用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
})

onMounted(async () => {
  const token = localStorage.getItem('access_token')
  if (token) {
    isLoggedIn.value = true
    try {
      const res: any = await http.get('/member/auth/user-info')
      const userData = res.data || res

      if (userData) {
        const name = userData.name || userData.username || userData.memberName || userData.realName
        if (name) {
          userInfo.value.name = name
        }
        if (userData.avatar) {
          userInfo.value.avatar = userData.avatar
        }
      }
    } catch (e) {
      console.warn('获取用户信息失败', e)
    }
  }
})

const handleLogout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  isLoggedIn.value = false
}
</script>

<template>
  <header class="header-wrapper">
    <!-- Top Utility Bar -->
    <div class="top-bar">
      <div class="top-bar-inner">
        <div class="top-left">

          <a href="#" class="top-link">移动版</a>
          <span class="divider">|</span>
          <a href="#" class="top-link">政务电话</a>
         
        </div>
        <div class="top-right">
          <span class="date-text">2026年7月25日 星期六</span>
          <span class="divider">|</span>
          <template v-if="isLoggedIn">
            <div class="user-profile user-dropdown">
              <span class="username">{{ userInfo.name }}</span>
              <div class="dropdown-content">
                <router-link to="/certify?type=enterprise">企业认证</router-link>
                <router-link to="/certify?type=gov">机关认证</router-link>
                <a href="#" class="logout-btn" @click.prevent="handleLogout">退出登录</a>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="top-link">登录注册</router-link>
          </template>
          <span class="divider">|</span>
          <div class="dropdown-lang">
            <span>语言切换 ∨</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header Banner Area -->
    <div class="main-header">
      <div class="main-header-inner">
        <div class="brand-section">
      
          <h1 class="portal-title">数字霍尔果斯·向西开放桥头堡</h1>
        </div>

        <div class="search-box">
          <input type="text" placeholder="搜索政府服务、企业信息、便民事项..." class="search-input" />
          <button class="search-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 120px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.top-bar {
  width: 100%;
  height: 36px;
  font-size: 13px;
  color: #4a5568;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.top-bar-inner {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-left, .top-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-link {
  color: #4a5568;
  text-decoration: none;
  transition: color 0.2s;
}

.top-link:hover {
  color: #1890ff;
}

.divider {
  color: #cbd5e1;
  font-size: 12px;
}

.dropdown-lang {
  cursor: pointer;
  color: #4a5568;
}

.dropdown-lang:hover {
  color: #1890ff;
}

.date-text {
  color: #64748b;
}

/* Main Header */
.main-header {
  width: 100%;
  height: 84px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.main-header-inner {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 20px;
  
}

.logo-box {
  display: flex;
  align-items: center;
}

.logo-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-hg {
  font-size: 38px;
  font-weight: 900;
  color: #1e3a8a;
  letter-spacing: -2px;
  line-height: 1;
  font-family: Arial, sans-serif;
  border-bottom: 3px solid #1e3a8a;
}

.logo-sub {
  font-size: 12px;
  font-weight: bold;
  color: #1e3a8a;
  line-height: 1.2;
}

.logo-en {
  font-size: 9px;
  letter-spacing: 1px;
  color: #64748b;
}

.portal-title {
  font-size: 28px;
  font-weight: 800;
  color:#001B50;
  letter-spacing: 1px;
  margin: 0;
}

/* Search Bar */
.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 25px;
  padding: 4px 4px 4px 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  width: 380px;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 13px;
  color: #334155;
  background: transparent;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-btn {
  background: #0066ff;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background: #0052cc;
}

.user-profile {
  position: relative;
  cursor: pointer;
}

.username {
  color: #3b82f6;
  font-weight: 600;
}

.dropdown-content {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  min-width: 120px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.user-dropdown:hover .dropdown-content {
  visibility: visible;
  opacity: 1;
}

.dropdown-content a {
  display: block;
  padding: 8px 12px;
  color: #334155;
  text-decoration: none;
  font-size: 13px;
}

.dropdown-content a:hover {
  background: #f1f5f9;
}
</style>
