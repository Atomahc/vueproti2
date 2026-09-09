<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { http, triggerSSOLogin } from '@/api/request'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

defineProps<{
  isInternal?: boolean
}>()

defineEmits(['toggleInternal'])

const router = useRouter()
const searchKeyword = ref('')
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/search', query: { keyword: searchKeyword.value } })
  }
}

const isLoggedIn = ref(false)
const showDropdown = ref(false)
const showMobileMenu = ref(false)

import { computed } from 'vue'

const navTabs = computed(() => [
  { id: 'home', name: t('nav.home'), path: '/' },
  { id: 'gov', name: t('nav.gov'), path: '/service/government' },
  { id: 'life', name: t('nav.life'), path: '/service/public' },
  { id: 'cross', name: t('nav.cross'), path: '/service/port' },
  { id: 'cloud', name: t('nav.cloud'), path: '/service/legal' },
  { id: 'data', name: t('nav.data'), path: '/data-open' },
  { id: 'appeals', name: t('nav.appeals'), path: '/service/employment' }
])

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const userInfo = ref({
  name: '用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
})

const currentDateTime = ref('')
let timer: any = null

const updateDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const day = days[now.getDay()]
  
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  
  currentDateTime.value = `${year}年${month}月${date}日 ${day} ${h}:${m}:${s}`
}

onMounted(async () => {
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)

  const token = localStorage.getItem('access_token')
  if (token) {
    isLoggedIn.value = true
    try {
      const res: any = await http.get('/prod-api/member/auth/user-info')
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


const { t, locale } = useI18n()

const showLangDropdown = ref(false)
const toggleLangDropdown = () => {
  showLangDropdown.value = !showLangDropdown.value
}
const changeLanguage = (lang: string) => {
  locale.value = lang
  showLangDropdown.value = false
}

// close event listener updates
const closeDropdown = () => {
  showDropdown.value = false
  showLangDropdown.value = false
}


onMounted(() => {
  window.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown)
  if (timer) clearInterval(timer)
})

const handleLogout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  sessionStorage.removeItem('sso_state')
  isLoggedIn.value = false
  showDropdown.value = false
  window.location.reload()
}
</script>

<template>
  <header class="mobile-header-wrapper">
    <div class="mobile-header-inner">
      <div class="mobile-brand">
        <!-- Hamburger Menu Icon -->
        <svg @click="showMobileMenu = true" class="hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <h1 class="mobile-title">{{ t('header.title') }}</h1>
      </div>
      
      <div class="mobile-actions">
        <!-- Login/User -->
        <template v-if="isLoggedIn">
          <div class="mobile-user" @click="toggleDropdown">
            <img :src="userInfo.avatar" alt="avatar" class="mobile-avatar" />
          </div>
        </template>
        <template v-else>
          <a href="#" @click.prevent="triggerSSOLogin" class="mobile-login-btn">{{ t('header.loginRegister') }}</a>
        </template>
      </div>
    </div>
    
    <!-- Dropdown for mobile user -->
    <div v-if="showDropdown && isLoggedIn" class="mobile-dropdown-menu">
      <div class="mobile-user-name">{{ userInfo.name }}</div>
      <router-link to="/certify?type=enterprise" class="mobile-menu-item">{{ t('header.enterpriseCert') }}</router-link>
      <router-link to="/certify?type=gov" class="mobile-menu-item">{{ t('header.govCert') }}</router-link>
      <a href="#" class="mobile-menu-item logout" @click.prevent="handleLogout">{{ t('header.logout') }}</a>
    </div>

    <!-- Mobile Side Drawer -->
    <div class="mobile-drawer-overlay" v-if="showMobileMenu" @click="showMobileMenu = false"></div>
    <div class="mobile-drawer" :class="{ 'drawer-open': showMobileMenu }">
      <div class="drawer-header">
        <h2 class="drawer-title">导航菜单</h2>
        <svg @click="showMobileMenu = false" class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
      <div class="drawer-content">
        <div class="drawer-section">
          <h3 class="section-title">服务大厅</h3>
          <router-link v-for="item in navTabs" :key="item.id" :to="item.path" class="drawer-nav-item" @click="showMobileMenu = false">
            {{ item.name }}
          </router-link>
        </div>
        <div class="drawer-section">
          <h3 class="section-title">语言切换</h3>
          <div class="lang-options">
            <span :class="{active: locale === 'zh'}" @click="changeLanguage('zh'); showMobileMenu=false">中文</span>
            <span :class="{active: locale === 'ru'}" @click="changeLanguage('ru'); showMobileMenu=false">Русский</span>
            <span :class="{active: locale === 'kk'}" @click="changeLanguage('kk'); showMobileMenu=false">Қазақша</span>
            <span :class="{active: locale === 'en'}" @click="changeLanguage('en'); showMobileMenu=false">English</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.mobile-header-wrapper {
  position: sticky;
  top: 0;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  z-index: 999;
}

.mobile-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  height: 50px;
}

.mobile-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.mobile-login-btn {
  font-size: 14px;
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
}

.mobile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.mobile-dropdown-menu {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-user-name {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}

.mobile-menu-item {
  font-size: 14px;
  color: #475569;
  text-decoration: none;
}

.mobile-menu-item.logout {
  color: #ef4444;
}
</style>

<style scoped>
.mobile-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.hamburger-icon {
  width: 24px;
  height: 24px;
  color: #1e293b;
  cursor: pointer;
}
.mobile-drawer-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}
.mobile-drawer {
  position: fixed;
  top: 0; left: -300px;
  width: 280px;
  height: 100vh;
  background: #fff;
  z-index: 1001;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
}
.drawer-open {
  left: 0;
}
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}
.drawer-title {
  font-size: 18px;
  margin: 0;
  color: #0f172a;
}
.close-icon {
  width: 24px;
  height: 24px;
  color: #64748b;
  cursor: pointer;
}
.drawer-content {
  padding: 16px;
  overflow-y: auto;
}
.section-title {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 12px;
  margin-top: 20px;
}
.drawer-section:first-child .section-title {
  margin-top: 0;
}
.drawer-nav-item {
  display: block;
  padding: 12px 0;
  color: #334155;
  text-decoration: none;
  font-size: 16px;
  border-bottom: 1px solid #f1f5f9;
}
.lang-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.lang-options span {
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 4px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
}
.lang-options span.active {
  background: #3b82f6;
  color: #fff;
}
</style>
