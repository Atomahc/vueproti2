<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'

const route = useRoute()
const router = useRouter()

const showBackButton = computed(() => {
  return route.path !== '/' && !route.path.startsWith('/login')
})

const goBack = () => {
  router.back()
}


onMounted(() => {
  // 禁止 Ctrl / Command + 鼠标滚轮缩放
  document.addEventListener('wheel', (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
    }
  }, { passive: false })

  // 禁止 Ctrl/Command + '+' / '-' / '0' 键盘缩放
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault()
    }
  })

  // 禁止移动端手势双指放大
  document.addEventListener('gesturestart', (e: Event) => {
    e.preventDefault()
  })
})
</script>

<template>
  <div class="global-app-container">
    <!-- 全局占满全屏背景图 -->
    <div class="global-bg-wrapper">
      <img src="@/assets/img/indexbg.png" alt="背景图" class="global-bg-img" />
    </div>
    <div class="app-main-view">
      <RouterView />
    </div>

    <!-- 悬浮返回按钮 -->
    <div v-if="showBackButton" class="global-back-btn" @click="goBack" title="返回">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      <span>返回</span>
    </div>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  touch-action: manipulation;
  -webkit-text-size-adjust: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
}

ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

.global-app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

/* 占满全屏的底层背景图 */
.global-bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.global-bg-img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}



.app-main-view {
  position: relative;
  z-index: 0;
  width: 100%;
  min-height: 100vh;
}


.global-back-btn {
  position: fixed;
  right: 40px;
  bottom: 100px;
  width: 50px;
  height: 50px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  color: #3b82f6;
  transition: all 0.3s;
}

.global-back-btn:hover {
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.global-back-btn svg {
  width: 20px;
  height: 20px;
  margin-bottom: 2px;
}

.global-back-btn span {
  font-size: 12px;
  font-weight: 500;
}

/* 宽屏设备 16:9 居中展示，高度占满 */
@media (min-aspect-ratio: 21/9) {
  body{
    background: #000;
  }
  .global-app-container {
    width: calc(100vh * 21 / 9);
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
  }
  .global-bg-img {
    width: 100%;
    height: 100%;
  }
}
</style>
