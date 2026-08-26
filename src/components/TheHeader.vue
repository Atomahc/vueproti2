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
      const res: any = await http.get('/api-loca/member/auth/user-info')
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
  <header class="header-wrapper">
    <!-- Top Utility Bar -->
    <div class="top-bar">
      <div class="top-bar-inner">
        <div class="top-left">

          <a href="#" class="top-link" @click.prevent="router.push('/site-group')">站群导航</a>
          <span class="divider">|</span>
          <a href="#" class="top-link">{{ t('header.mobile') }}</a>
          <span class="divider">|</span>
          <a href="#" class="top-link">{{ t('header.govPhone') }}</a>
          <span class="divider">|</span>
          <div class="user-dropdown hover-menu-left">
            <a href="#" class="top-link" @click.prevent>请销假平台</a>
            <div class="dropdown-content left-dropdown">
              <img src="@/assets/other/mmexport1787650392605.jpg" alt="请销假平台" class="hover-qr-code" />
            </div>
          </div>
         
        </div>
        <div class="top-right">
          <span class="date-text">{{ currentDateTime }}</span>
          <span class="divider">|</span>
          <template v-if="isLoggedIn">
            <div class="user-profile user-dropdown">
              <span class="username" @click.stop="toggleDropdown">{{ userInfo.name }}</span>
              <div class="dropdown-content" :class="{ 'show': showDropdown }" @click.stop>
                <router-link to="/certify?type=enterprise">{{ t('header.enterpriseCert') }}</router-link>
                <router-link to="/certify?type=gov">{{ t('header.govCert') }}</router-link>
                <a href="#" class="logout-btn" @click.prevent="handleLogout">{{ t('header.logout') }}</a>
              </div>
            </div>
          </template>
          <template v-else>
            <a href="#" @click.prevent="triggerSSOLogin" class="top-link">{{ t('header.loginRegister') }}</a>
          </template>
          <span class="divider">|</span>
          <div class="dropdown-lang user-dropdown">
            <span @click.stop="toggleLangDropdown">{{ t('header.language') }} ({{ locale.toUpperCase() }})</span>
            <div class="dropdown-content" :class="{ 'show': showLangDropdown }" @click.stop>
              <a href="#" @click.prevent="changeLanguage('zh')">中文</a>
              <a href="#" @click.prevent="changeLanguage('ru')">Русский</a>
              <a href="#" @click.prevent="changeLanguage('kk')">Қазақша</a>
              <a href="#" @click.prevent="changeLanguage('en')">English</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header Banner Area -->
    <div class="main-header">
      <div class="main-header-inner">
        <div class="brand-section">
      
          <h1 class="portal-title">{{ t('header.title') }}</h1>
        </div>

        <div class="search-box">
          <input type="text" :placeholder="t('header.searchPlaceholder')" class="search-input" v-model="searchKeyword" @keyup.enter="handleSearch" />
          <button class="search-btn" @click="handleSearch">
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
  z-index: 100;;
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
  position: relative;
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
  max-width: 1280px;
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
  top: 30px;
  right: -100px;
  background: white;
  min-width: 120px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  z-index: 100;
}

.user-dropdown:hover .dropdown-content,
.dropdown-content.show {
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

.hover-menu-left {
  position: relative;
  display: inline-block;
}

.left-dropdown {
  right: auto;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px;
  min-width: auto;
}

.hover-qr-code {
  display: block;
  width: 140px;
  height: auto;
  border-radius: 4px;
}
</style>
