<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useI18n } from 'vue-i18n'

const props = defineProps<{
  activeId?: string
}>()

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// 顶部主导航菜单数据结构
const navTabs = computed(() => [
  { id: 'home', name: t('nav.home'), path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'gov', name: t('nav.gov'), path: '/service/government', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9' },
  { id: 'life', name: t('nav.life'), path: '/service/public', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { id: 'cross', name: t('nav.cross'), path: '/service/port', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'cloud', name: t('nav.cloud'), path: '/service/legal', icon: 'M3 6l9-4 9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-5.45-9-12V6z' },
  { id: 'data', name: t('nav.data'), path: '/data-open', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'appeals', name: t('nav.appeals'), path: '/service/employment', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' }
])

// 计算当前高亮 Nav ID
const currentActiveId = computed(() => {
  if (props.activeId) return props.activeId
  const path = route.path
  if (path === '/') return 'home'
  if (path.includes('/service/government')) return 'gov'
  if (path.includes('/service/public')) return 'life'
  if (path.includes('/service/port')) return 'cross'
  if (path.includes('/service/legal')) return 'cloud'
  if (path.includes('/data-open')) return 'data'
  if (path.includes('/service/employment')) return 'appeals'
  return 'home'
})

const handleNavClick = (item: any) => {
  if (item.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <!-- 蓝色半透明主导航栏 -->
  <nav class="nav-bar">
    <ul class="nav-list">
      <li
        v-for="item in navTabs"
        :key="item.id"
        :class="['nav-item', { active: currentActiveId === item.id }]"
        @click="handleNavClick(item)"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path :d="item.icon" />
        </svg>
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-bar {
  background: rgba(30, 64, 120, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  flex-shrink: 0;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 12px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-item:last-child {
  border-right: none;
}

.nav-item.active, .nav-item:hover {
  background: #0066ff;
  color: #ffffff;
  font-weight: 600;
}

.nav-icon {
  width: 18px;
  height: 18px;
}
</style>
