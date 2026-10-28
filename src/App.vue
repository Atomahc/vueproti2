<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const showBackButton = computed(() => {
  return route.path !== '/' && !route.path.startsWith('/login')
})

const showAiButton = computed(() => {
  return !route.path.startsWith('/login')
})

const isAiChatOpen = ref(false)
const hasLoadedAiChat = ref(false)

const toggleAiChat = () => {
  hasLoadedAiChat.value = true
  isAiChatOpen.value = !isAiChatOpen.value
}

const closeAiChat = () => {
  isAiChatOpen.value = false
}

watch(showAiButton, (val) => {
  if (!val) {
    isAiChatOpen.value = false
  }
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

  // 禁止 Ctrl/Command + '+' / '-' / '0' 键盘缩放，按 ESC 关闭智能问答
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault()
    }
    if (e.key === 'Escape' && isAiChatOpen.value) {
      closeAiChat()
    }
  }
  document.addEventListener('keydown', handleKeydown)

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
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<template>
  <div class="global-app-container">
    <!-- 全局占满全屏背景图 -->
    <div class="global-bg-wrapper">
      <img src="@/assets/img/indexbg.png" alt="background" class="global-bg-img" />
    </div>
    <div class="app-main-view">
      <RouterView />
    </div>

    <!-- 全局悬浮按钮组 -->
    <div class="global-floating-group">
            <!-- 悬浮返回按钮 -->
      <div v-if="showBackButton" class="global-floating-btn global-back-btn" @click="goBack" :title="t('common.back')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>{{ t('common.back') }}</span>
      </div>



      <!-- 智能问答按钮 -->
      <div
        v-if="showAiButton"
        class="global-floating-btn global-ai-btn"
        :class="{ active: isAiChatOpen }"
        :title="t('common.aiChat')"
        @click="toggleAiChat"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>
        <span>{{ t('common.aiChat') }}</span>
      </div>
    </div>

    <!-- 智能问答右下角弹窗 -->
    <div
      v-if="hasLoadedAiChat && showAiButton"
      v-show="isAiChatOpen"
      class="ai-chat-window"
    >
      <div class="ai-chat-header">
        <div class="ai-chat-header-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai-chat-header-icon">
            <path d="M12 8V4H8"></path>
            <rect width="16" height="12" x="4" y="8" rx="2"></rect>
            <path d="M2 14h2"></path>
            <path d="M20 14h2"></path>
            <path d="M15 13v2"></path>
            <path d="M9 13v2"></path>
          </svg>
          <span>{{ t('common.aiChat') }}</span>
        </div>
        <button type="button" class="ai-chat-close-btn" @click="closeAiChat" :title="t('common.close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="ai-chat-body">
        <iframe
          src="https://sz.xjhegs.gov.cn/ai-chat/4a6ba8f18f3c671e?mode=mobile"
          style="width: 100%; height: 100%;"
          frameborder="0"
          allow="microphone"
          :title="t('common.aiChat')"
        ></iframe>
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

.global-ai-btn.active {
  background: #3b82f6;
  color: #ffffff;
}

.global-ai-btn.active:hover {
  background: #2563eb;
  color: #ffffff;
}

/* 智能问答右下角弹窗 */
.ai-chat-window {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 420px;
  height: 640px;
  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 48px);
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10000;
  border: 1px solid rgba(0, 0, 0, 0.08);
  animation: aiChatFadeIn 0.25s ease-out;
}

@keyframes aiChatFadeIn {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ai-chat-header {
  height: 44px;
  background: #3b82f6;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  user-select: none;
  flex-shrink: 0;
}

.ai-chat-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.ai-chat-header-icon {
  width: 18px;
  height: 18px;
}

.ai-chat-close-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  line-height: 1;
}

.ai-chat-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.ai-chat-close-btn svg {
  width: 18px;
  height: 18px;
}

.ai-chat-body {
  flex: 1;
  width: 100%;
  height: calc(100% - 44px);
  position: relative;
  background: #ffffff;
}

.ai-chat-body iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

@media screen and (max-width: 768px) {
  .global-floating-group {
    right: 20px;
    bottom: 80px;
  }

  .ai-chat-window {
    right: 12px;
    bottom: 12px;
    width: calc(100vw - 24px);
    height: calc(100vh - 24px);
    max-width: none;
    max-height: none;
    border-radius: 10px;
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
