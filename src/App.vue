<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, computed } from 'vue'

const route = useRoute()
const router = useRouter()

const showBackButton = computed(() => {
  return route.path !== '/' && !route.path.startsWith('/login')
})

const showAiButton = computed(() => {
  return !route.path.startsWith('/login')
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

  // 动态缩放页面以确保 main-content 完整展示
  const adjustScale = () => {
    // 移除旧版直接作用在 body 上的缩放（如果有）
    document.body.style.zoom = ''

    if (window.innerWidth <= 768) {
      document.documentElement.style.setProperty('--app-zoom', '1')
      return
    }
    
    const designWidth = 1920
    const designHeight = 1080
    const scaleX = window.innerWidth / designWidth
    const scaleY = window.innerHeight / designHeight
    
    let scale = Math.min(scaleX, scaleY)
    
    // 增加 10% 的缩放比例
    scale = scale * 1.1
    
    document.documentElement.style.setProperty('--app-zoom', scale.toString())
  }

  adjustScale()
  window.addEventListener('resize', adjustScale)
  
  onUnmounted(() => {
    window.removeEventListener('resize', adjustScale)
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

    <!-- 全局悬浮按钮组 -->
    <div class="global-floating-group">
      <!-- 智能问答按钮 -->
      <a
        v-if="showAiButton"
        href="https://sz.xjhegs.gov.cn/ai-chat/4a6ba8f18f3c671e/"
        target="_blank"
        rel="noopener noreferrer"
        class="global-floating-btn global-ai-btn"
        title="智能问答"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>
        <span>智能问答</span>
      </a>

      <!-- 悬浮返回按钮 -->
      <div v-if="showBackButton" class="global-floating-btn global-back-btn" @click="goBack" title="返回">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>返回</span>
      </div>
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

/* 隐藏所有滚动条，但保留滚动功能 */
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
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
}



.app-main-view {
  position: relative;
  z-index: 0;
  width: 100%;
  min-height: calc(100vh / var(--app-zoom, 1));
  zoom: var(--app-zoom, 1);
}


.global-floating-group {
  position: fixed;
  right: 40px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 9999;
  zoom: var(--app-zoom, 1);
}

.global-floating-btn {
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
  color: #3b82f6;
  transition: all 0.3s;
  text-decoration: none;
  box-sizing: border-box;
}

.global-floating-btn:hover {
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.global-floating-btn svg {
  width: 20px;
  height: 20px;
  margin-bottom: 2px;
}

.global-back-btn span {
  font-size: 12px;
  font-weight: 500;
}

.global-ai-btn span {
  font-size: 10.5px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
}

@media screen and (max-width: 768px) {
  .global-floating-group {
    right: 20px;
    bottom: 80px;
  }
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
