<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
const showIframe = ref(false)
const iframeUrl = ref('')
const currentVrId = ref('')
const iframeRef = ref<HTMLIFrameElement | null>(null)
const isClosingModal = ref(false)
const isCollapsed = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const vrList = computed(() => [
  {
    id: 'silu',
    title: t('home.siluScroll'),
    desc: t('home.siluScrollDesc'),
    url: 'https://sz.xjhegs.gov.cn:3004',
    iconType: 'scroll'
  },
  {
    id: 'vr-tour',
    title: t('home.vrTour'),
    desc: t('home.vrTourDesc'),
    url: 'https://www.720yun.com/t/5avkOl8758e?scene_id=50999361',
    iconType: 'vr'
  },
  {
    id: 'xj-image',
    title: t('home.xjImage'),
    desc: t('home.xjImageDesc'),
    url: 'https://www.720yun.com/vr/e96jtOkaty0',
    iconType: 'pavilion'
  },
  {
    id: '10th-anniv',
    title: t('home.tenthAnniv'),
    desc: t('home.tenthAnnivDesc'),
    url: 'https://www.720yun.com/vr/188j55kktv9',
    iconType: 'exhibition'
  },
  {
    id: 'points-hall',
    title: t('home.pointsHall'),
    desc: t('home.pointsHallDesc'),
    url: 'https://www.720yun.com/vr/843j50yfzO4',
    iconType: 'hall'
  }
])

const SILU_AUTO_OPEN_KEY = 'silu_modal_auto_opened'

// 首次加载自动弹出丝路长卷逻辑
const checkAndAutoOpenSilu = () => {
  if (route.path !== '/') return
  try {
    const forceOpen = route.query.silu === '1' || route.query.openSilu === '1'
    const hasAutoOpened = sessionStorage.getItem(SILU_AUTO_OPEN_KEY)
    if (forceOpen || !hasAutoOpened) {
      sessionStorage.setItem(SILU_AUTO_OPEN_KEY, '1')
      const siluItem = vrList.value.find((item) => item.id === 'silu')
      if (siluItem) {
        openIframe(siluItem)
      }
    }
  } catch (e) {
    const siluItem = vrList.value.find((item) => item.id === 'silu')
    if (siluItem) {
      openIframe(siluItem)
    }
  }
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  try {
    localStorage.setItem('banner_side_overlay_collapsed', isCollapsed.value ? '1' : '0')
  } catch (e) {}
}

// 统一弹窗销毁与状态重置方法
const destroyAndResetModal = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  showIframe.value = false
  iframeUrl.value = ''
  currentVrId.value = ''
  isClosingModal.value = false
}

// 监听来自 iframe 内部发出的“关闭动效已全部结束”消息通知
const handleWindowMessage = (event: MessageEvent) => {
  const data = event.data
  if (
    data === 'siluCloseFinished' ||
    data?.action === 'siluCloseFinished' ||
    data?.type === 'SILU_CLOSE_FINISHED'
  ) {
    if (isClosingModal.value && currentVrId.value === 'silu') {
      destroyAndResetModal()
    }
  }
}

onMounted(() => {
  window.addEventListener('message', handleWindowMessage)
  try {
    const saved = localStorage.getItem('banner_side_overlay_collapsed')
    if (saved === '1' || saved === 'true') {
      isCollapsed.value = true
    }
  } catch (e) {}

  // 页面首次加载直接弹出丝路长卷弹框
  checkAndAutoOpenSilu()
})

// 监听路由切换，确保返回首页时若尚未弹出则能正确触发
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/') {
      checkAndAutoOpenSilu()
    }
  }
)

onUnmounted(() => {
  window.removeEventListener('message', handleWindowMessage)
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
})

const openIframe = (item: (typeof vrList.value)[0]) => {
  currentVrId.value = item.id
  isClosingModal.value = false
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  let url = item.url
  if (item.id === 'silu') {
    url += (url.includes('?') ? '&' : '?') + 'hideClose=1'
  }
  iframeUrl.value = url
  showIframe.value = true
}

const handleIframeLoad = () => {
  if (currentVrId.value === 'silu') {
    try {
      const doc = iframeRef.value?.contentDocument || iframeRef.value?.contentWindow?.document
      if (doc) {
        const btn = doc.querySelector('.page-close-btn') as HTMLElement
        if (btn) {
          btn.style.display = 'none'
        }
      }
    } catch (e) {
      // 跨域时由 iframe 内部环境自动检测隐藏
    }
  }
}

const closeIframe = () => {
  if (isClosingModal.value) return

  // 点击丝路长卷关闭时：模拟点击 page-close-btn，待关闭动效结束后销毁并重置弹窗
  if (currentVrId.value === 'silu') {
    isClosingModal.value = true

    // 1. 通过 postMessage 通知 iframe 内触发收起与关闭画卷动画
    try {
      iframeRef.value?.contentWindow?.postMessage(
        { action: 'triggerPageClose', type: 'CLOSE_SILU' },
        '*'
      )
    } catch (e) {
      console.warn('postMessage error:', e)
    }

    // 2. 尝试直接点击 iframe 内按钮及监听动画结束事件（同源备用）
    try {
      const doc = iframeRef.value?.contentDocument || iframeRef.value?.contentWindow?.document
      const btn = doc?.querySelector('.page-close-btn') as HTMLElement
      if (btn) {
        btn.click()
      }
      const scrollBody = doc?.querySelector('.scroll-body') as HTMLElement
      if (scrollBody) {
        scrollBody.addEventListener(
          'animationend',
          (e: AnimationEvent) => {
            if (e.animationName === 'scrollBodyRotateAndDisappear') {
              destroyAndResetModal()
            }
          },
          { once: true }
        )
      }
    } catch (e) {
      // 跨域由 postMessage 处理
    }

    // 3. 兜底保护：根据画卷完整动效时长（1.1s收起 + 1.6s旋转缩放 = 2.7s），在动效结束后（2800ms）执行弹窗销毁与重置
    closeTimer = setTimeout(() => {
      destroyAndResetModal()
    }, 2800)
  } else {
    // 其它 VR 展馆立即关闭销毁重置
    destroyAndResetModal()
  }
}

</script>

<template>
  <template v-if="route.path === '/'">
    <div class="banner-side-overlay" :class="{ 'is-collapsed': isCollapsed }">
      <!-- 卡片列表包裹容器 -->
      <div class="vr-cards-wrapper">
        <div 
          v-for="item in vrList" 
          :key="item.id" 
          :class="['vr-card', 'card-' + item.id]" 
          :title="item.title + ' - ' + item.desc"
          @click="openIframe(item)"
        >
          <div class="vr-icon-box">
            <!-- 丝路长卷画卷图标 -->
            <svg v-if="item.iconType === 'scroll'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              <path d="M8 7h8M8 11h8M8 15h5"></path>
            </svg>
            <!-- VR全景眼镜图标 -->
            <svg v-else-if="item.iconType === 'vr'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="2" y="6" width="20" height="12" rx="3"></rect>
              <circle cx="8" cy="12" r="2.5"></circle>
              <circle cx="16" cy="12" r="2.5"></circle>
            </svg>
            <!-- 新疆形象展示平台/展厅图标 -->
            <svg v-else-if="item.iconType === 'pavilion'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 21h18M4 18h16M6 18v-7M10 18v-7M14 18v-7M18 18v-7M2 7l10-4 10 4v2H2V7z"></path>
            </svg>
            <!-- 建市十周年成果展/成果勋章图标 -->
            <svg v-else-if="item.iconType === 'exhibition'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path>
              <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path>
              <path d="M4 3h16v7a8 8 0 0 1-16 0V3z"></path>
              <path d="M12 17v4M8 21h8"></path>
            </svg>
            <!-- 积分馆/五角星展馆图标 -->
            <svg v-else-if="item.iconType === 'hall'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="vr-text">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <!-- 右侧收起/展开按钮 -->
      <div 
        class="side-collapse-btn" 
        @click.stop="toggleCollapse" 
        :title="isCollapsed ? t('vr.expandTitle') : t('vr.collapseTitle')"
      >
        <svg 
          class="collapse-icon"
          viewBox="0 0 24 24" 
          width="13" 
          height="13" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <polyline v-if="!isCollapsed" points="15 18 9 12 15 6"></polyline>
          <polyline v-else points="9 18 15 12 9 6"></polyline>
        </svg>
        <span class="collapse-text">{{ isCollapsed ? t('vr.expand') : t('vr.collapse') }}</span>
      </div>
    </div>

    <Teleport to="body">
      <div 
        class="modal-overlay" 
        v-if="showIframe" 
        :class="{ 'is-closing': isClosingModal }"
        @click.self="closeIframe"
      >
        <div class="iframe-modal-content">
          <button 
            class="modal-close-btn" 
            :class="{ 'is-closing': isClosingModal }"
            @click="closeIframe" 
            :title="t('vr.close')"
            :disabled="isClosingModal"
          >×</button>
          <iframe 
            ref="iframeRef"
            :src="iframeUrl" 
            frameborder="0" 
            width="100%" 
            height="100%" 
            allow="fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking"
            @load="handleIframeLoad"
          ></iframe>
        </div>
      </div>
    </Teleport>
  </template>
</template>

<style scoped>
.banner-side-overlay {
  position: absolute;
  left: 100%;
  top: 195px;
  width: 140px;
  height: 479px;
  z-index: 10;
  box-sizing: border-box;
  transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.vr-cards-wrapper {
  width: 140px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: left center;
}

.banner-side-overlay.is-collapsed {
  width: 0;
}

.banner-side-overlay.is-collapsed .vr-cards-wrapper {
  width: 0;
  opacity: 0;
  transform: translateX(-16px) scale(0.95);
  pointer-events: none;
  overflow: hidden;
}

.banner-side-overlay.is-collapsed .side-collapse-btn {
  border-left: 1px solid #dbeafe;
  border-radius: 4px 8px 8px 4px;
}

/* 右侧收起/展开按钮 */
.side-collapse-btn {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: #ffffff;
  color: #0066ff;
  border: 1px solid #dbeafe;
  border-left: none;
  border-radius: 0 8px 8px 0;
  box-shadow: 3px 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  user-select: none;
  z-index: 20;
  transition: all 0.25s ease;
}

.side-collapse-btn:hover {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
  box-shadow: 4px 3px 12px rgba(59, 130, 246, 0.25);
  width: 24px;
}

.collapse-icon {
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.collapse-text {
  writing-mode: vertical-rl;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  line-height: 1;
}

.vr-card {
  flex: 1;
  min-height: 0;
  color: #ffffff !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.28s ease;
  box-sizing: border-box;
  user-select: none;

}

.vr-card:hover {

}

/* 1. 丝路长卷：温暖金琥珀渐变 */
.card-silu {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}
.card-silu:hover {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45);
}

/* 2. VR全景游：科技天蓝渐变 */
.card-vr-tour {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
}
.card-vr-tour:hover {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  box-shadow: 0 6px 18px rgba(2, 132, 199, 0.45);
}

/* 3. 新疆形象展示平台：翡翠生机绿渐变 */
.card-xj-image {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}
.card-xj-image:hover {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 6px 18px rgba(5, 150, 105, 0.45);
}

/* 4. 建市十周年成果展：华彩玫瑰红渐变 */
.card-10th-anniv {
  background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
}
.card-10th-anniv:hover {
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
  box-shadow: 0 6px 18px rgba(225, 29, 72, 0.45);
}

/* 5. 霍尔果斯积分馆：尊享典雅紫渐变 */
.card-points-hall {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
}
.card-points-hall:hover {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.45);
}

.vr-icon-box {
  margin-bottom: 4px;
  color: #ffffff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.28s;
}

.vr-card:hover .vr-icon-box {
  transform: scale(1.12);
}

.vr-text {
  width: 100%;
}

.vr-text h3 {
  font-size: 13.5px;
  font-weight: 700;
  margin: 0 0 3px 0;
  color: #ffffff !important;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.vr-text p {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9) !important;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.vr-card:hover .vr-text p {
  color: #ffffff !important;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.iframe-modal-content {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 24px;
  line-height: 38px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
}

.modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.85);
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.08);
}

.modal-close-btn.is-closing {
  opacity: 0.5;
  cursor: wait;
  pointer-events: none;
}

@media screen and (max-width: 768px) {
  .banner-side-overlay {
    position: static;
    left: auto;
    top: auto;
    width: 100% !important;
    height: auto;
    display: block;
    margin-top: 16px;
    padding: 0 16px;
  }
  .vr-cards-wrapper {
    width: 100% !important;
    height: auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    opacity: 1 !important;
    transform: none !important;
    pointer-events: auto !important;
    overflow: visible;
  }
  .side-collapse-btn {
    display: none !important;
  }
  .vr-card {
    height: 72px;
    padding: 10px 8px;
  }
  .vr-icon-box {
    margin-bottom: 2px;
  }
  .vr-icon-box svg {
    width: 20px;
    height: 20px;
  }
  .vr-text h3 {
    font-size: 12px;
  }
  .vr-text p {
    font-size: 10px;
  }
}
</style>
