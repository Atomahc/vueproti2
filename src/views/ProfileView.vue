<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'

const router = useRouter()
const userInfo = ref<any>({})

const fetchUserInfo = async () => {
  try {
    const res: any = await http.get('/prod-api/member/auth/user-info')
    const userData = res.data || res
    if (userData) {
      userInfo.value = userData
    }
  } catch (e) {
    console.error('获取用户信息失败', e)
  }
}

onMounted(() => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    router.push('/login')
    return
  }
  fetchUserInfo()
})

const handleLogout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  sessionStorage.removeItem('sso_state')
  router.push('/')
  setTimeout(() => {
    window.location.reload()
  }, 100)
}

const navigateTo = (path: string, query?: any) => {
  if (query) {
    router.push({ path, query })
  } else {
    router.push(path)
  }
}
</script>

<template>
  <div class="profile-page">
    <TheHeader />
    
    <main class="main-content">
      <div class="profile-container">
        
        <!-- 左侧菜单 / 侧边栏 -->
        <div class="sidebar">
          <div class="user-card">
            <img :src="userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'" class="avatar" alt="avatar" />
            <h3 class="username">{{ userInfo.nickName || userInfo.name || userInfo.username || userInfo.realName || '用户' }}</h3>
            <p class="phone">{{ userInfo.phone || userInfo.mobile || '暂无手机号' }}</p>
          </div>
          
          <nav class="profile-nav">
            <a href="javascript:void(0)" class="nav-item active">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              我的资料
            </a>
            <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/my-tickets', { tab: 'direct' })">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              诉求工单
            </a>
            <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/my-tickets', { tab: 'snapshot' })">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              我的随手拍
            </a>
            <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/my-fawu', { tab: 'consult' })">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              我的咨询
            </a>
            <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/my-fawu', { tab: 'appointment' })">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              我的预约
            </a>
            <a href="javascript:void(0)" class="nav-item logout" @click="handleLogout">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              退出登陆
            </a>
          </nav>
        </div>

        <!-- 右侧内容区 -->
        <div class="content-area">
          <div class="content-header">
            <h2>我的资料</h2>
          </div>
          
          <div class="info-list">
            <div class="info-item">
              <span class="label">头像</span>
              <div class="value">
                <img :src="userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'" class="info-avatar" alt="avatar" />
              </div>
            </div>
            <div class="info-item">
              <span class="label">用户名</span>
              <span class="value">{{ userInfo.username || userInfo.name || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">姓名/昵称</span>
              <span class="value">{{ userInfo.realName || userInfo.nickName || userInfo.memberName || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">手机号码</span>
              <span class="value">{{ userInfo.phone || userInfo.mobile || '-' }}</span>
            </div>
            <div class="info-item" v-if="userInfo.email">
              <span class="label">电子邮箱</span>
              <span class="value">{{ userInfo.email }}</span>
            </div>
            <div class="info-item" v-if="userInfo.idCard">
              <span class="label">身份证号</span>
              <span class="value">{{ userInfo.idCard.replace(/^(.{4})(.*)(.{4})$/, '$1**********$3') }}</span>
            </div>
          </div>
          
        </div>
        
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

.main-content {
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 140px 20px 40px;
  box-sizing: border-box;
}

.profile-container {
  display: flex;
  gap: 24px;
  min-height: 600px;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f1f5f9;
  margin-bottom: 16px;
}

.username {
  font-size: 20px;
  color: #0f172a;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.phone {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.profile-nav {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: #475569;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.nav-item.active {
  background: #f0fdf4;
  color: #10b981;
  border-left-color: #10b981;
  font-weight: 600;
}

.nav-item.logout {
  margin-top: 10px;
  color: #ef4444;
  border-top: 1px solid #f1f5f9;
}
.nav-item.logout:hover {
  background: #fef2f2;
}

/* 右侧内容区 */
.content-area {
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.content-header {
  margin-bottom: 30px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.content-header h2 {
  margin: 0;
  font-size: 22px;
  color: #0f172a;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item .label {
  width: 120px;
  color: #64748b;
  font-size: 15px;
  flex-shrink: 0;
}

.info-item .value {
  color: #0f172a;
  font-size: 16px;
  font-weight: 500;
  flex: 1;
}

.info-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
  .content-area {
    padding: 20px;
  }
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .info-item .label {
    width: 100%;
  }
}
</style>
