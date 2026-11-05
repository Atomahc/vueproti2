<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '@/api/request'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/effect-fade'
import { Autoplay, EffectFade } from 'swiper/modules'

const minioPrefix = import.meta.env.VITE_MINIO_PREFIX || 'https://sz.xjhegs.gov.cn'
const router = useRouter()
const route = useRoute()
const { locale, t } = useI18n()

// ================= 搜索相关 =================
const searchKeyword = ref('')
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/search', query: { keyword: searchKeyword.value } })
  }
}

// ================= Banner 轮播 =================
const swiperModules = [Autoplay, EffectFade]
const bannerList = ref<any[]>([])
const currentBannerIndex = ref(0)
const swiperRef = ref<any>(null)

const onSwiperInit = (swiper: any) => {
  swiperRef.value = swiper
  currentBannerIndex.value = swiper.realIndex || 0
}

const onSlideChange = (swiper: any) => {
  currentBannerIndex.value = swiper.realIndex || 0
}

const prevBanner = () => {
  if (swiperRef.value) {
    swiperRef.value.slidePrev()
  }
}

const nextBanner = () => {
  if (swiperRef.value) {
    swiperRef.value.slideNext()
  }
}

const goToBannerSlide = (index: number) => {
  if (swiperRef.value) {
    swiperRef.value.slideToLoop(index)
  }
}

const defaultBanners = computed(() => [
  {
    id: 'b1',
    title: t('home.defaultBanner1Title'),
    subtitle: t('home.defaultBanner1Sub'),
    coverImage: ''
  },
  {
    id: 'b2',
    title: t('home.defaultBanner2Title'),
    subtitle: t('home.defaultBanner2Sub'),
    coverImage: ''
  },
  {
    id: 'b3',
    title: t('home.defaultBanner3Title'),
    subtitle: t('home.defaultBanner3Sub'),
    coverImage: ''
  },
  {
    id: 'b4',
    title: t('home.defaultBanner4Title'),
    subtitle: t('home.defaultBanner4Sub'),
    coverImage: ''
  }
])

const fetchBanners = async () => {
  try {
    const res: any = await http.get('/prod-api/portal/section/page', {
      page: 1,
      limit: 10,
      sectionType: 'banner',
      t: Date.now()
    })
    if (res.code === 0 && res.data && res.data.list && res.data.list.length > 0) {
      bannerList.value = res.data.list.map((item: any) => ({
        ...item,
        coverImage: item.coverImage ? (item.coverImage.startsWith('http') ? item.coverImage : `${minioPrefix}${item.coverImage}`) : ''
      }))
    } else {
      bannerList.value = defaultBanners.value
    }
  } catch (error) {
    console.error('Failed to fetch banners', error)
    bannerList.value = defaultBanners.value
  }
}

// ================= 新闻资讯数据 =================
interface NewsArticle {
  id: string
  title: string
  date: string
  summary?: string
  fullDate?: string
  originalData?: any
}

const policyNewsList = ref<NewsArticle[]>([])
const yaowenNewsList = ref<NewsArticle[]>([])
const noticeNewsList = ref<NewsArticle[]>([])
const cityImageNewsList = ref<NewsArticle[]>([])

const defaultPolicyNews = computed<NewsArticle[]>(() => [
  { id: 'p1', title: t('home.defaultPolicy1'), date: '07/06' },
  { id: 'p2', title: t('home.defaultPolicy2'), date: '07/06' }
])

const defaultYaowenNews = computed<NewsArticle[]>(() => [
  {
    id: 'yw1',
    title: t('home.defaultHeadlineTitle'),
    date: '07/06',
    summary: t('home.defaultHeadlineSummary')
  },
  { id: 'yw2', title: t('home.defaultNotice2'), date: '07/06' },
  { id: 'yw3', title: t('home.defaultNotice1'), date: '07/06' },
  { id: 'yw4', title: t('home.defaultNotice3'), date: '07/06' },
  { id: 'yw5', title: t('home.defaultNotice2'), date: '07/06' }
])

const defaultNoticeNews = computed<NewsArticle[]>(() => [
  { id: 'nc1', title: t('home.defaultNotice1'), date: '07/06' },
  { id: 'nc2', title: t('home.defaultNotice2'), date: '07/06' },
  { id: 'nc3', title: t('home.defaultNotice3'), date: '07/06' },
  { id: 'nc4', title: t('home.defaultNotice1'), date: '07/06' },
  { id: 'nc5', title: t('home.defaultNotice2'), date: '07/06' },
  { id: 'nc6', title: t('home.defaultNotice3'), date: '07/06' }
])

// 格式化日期为 MM/DD
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '07/06'
  const dateObj = new Date(dateStr)
  if (isNaN(dateObj.getTime())) {
    const parts = (dateStr.split('T')[0] || '').split('-')
    if (parts.length >= 3) {
      return `${parts[1]}/${parts[2]}`
    }
    return '07/06'
  }
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${month}/${day}`
}

// 获取宣传展示 (图文宣传)
const fetchPolicyNews = async () => {
  try {
    const res: any = await http.get('/api-cas/api/get-articles', {
      owner: 'hgsso',
      categoryIds: '图文宣传',
      pageSize: 5,
      language: locale.value || 'zh'
    })
    const list = (res.status === 'ok' && res.data && res.data.length > 0) ? res.data : []
    if (list.length > 0) {
      policyNewsList.value = list.slice(0, 2).map((item: any) => ({
        id: item.name || String(item.id),
        title: item.displayName || item.title,
        date: formatDate(item.publishTime || item.createdTime),
        summary: item.summary || '',
        originalData: item
      }))
    } else {
      policyNewsList.value = defaultPolicyNews.value
    }
  } catch (e) {
    policyNewsList.value = defaultPolicyNews.value
  }
}

// 获取重大活动 (首条作为核心头条，其余作为列表)
const fetchYaowenNews = async () => {
  try {
    const res: any = await http.get('/api-cas/api/get-articles', {
      owner: 'hgsso',
      categoryIds: '重大活动',
      pageSize: 10,
      language: locale.value || 'zh'
    })
    const list = (res.status === 'ok' && res.data && res.data.length > 0) ? res.data : []
    if (list.length > 0) {
      yaowenNewsList.value = list.slice(0, 5).map((item: any) => ({
        id: item.name || String(item.id),
        title: item.displayName || item.title,
        date: formatDate(item.publishTime || item.createdTime),
        summary: item.summary || (item.content ? item.content.replace(/<[^>]+>/g, '').slice(0, 60) + '...' : t('home.defaultHeadlineSummary')),
        originalData: item
      }))
    } else {
      yaowenNewsList.value = defaultYaowenNews.value
    }
  } catch (e) {
    yaowenNewsList.value = defaultYaowenNews.value
  }
}

// 要闻头条
const featuredYaowen = computed(() => {
  return yaowenNewsList.value.length > 0 ? yaowenNewsList.value[0] : null
})

// 要闻其余4条
const otherYaowenList = computed(() => {
  return yaowenNewsList.value.slice(1, 5)
})

// 获取通知公告 (6条列表)
const fetchNoticeNews = async () => {
  try {
    const res: any = await http.get('/api-cas/api/get-articles', {
      owner: 'hgsso',
      categoryIds: '通知公告',
      pageSize: 10,
      language: locale.value || 'zh'
    })
    const list = (res.status === 'ok' && res.data && res.data.length > 0) ? res.data : []
    if (list.length > 0) {
      noticeNewsList.value = list.slice(0, 6).map((item: any) => ({
        id: item.name || String(item.id),
        title: item.displayName || item.title,
        date: formatDate(item.publishTime || item.createdTime),
        summary: item.summary || '',
        originalData: item
      }))
    } else {
      noticeNewsList.value = defaultNoticeNews.value
    }
  } catch (e) {
    noticeNewsList.value = defaultNoticeNews.value
  }
}

// 获取城市形象 (6条列表)
const fetchCityImageNews = async () => {
  try {
    const res: any = await http.get('/api-cas/api/get-articles', {
      owner: 'hgsso',
      categoryIds: '城市形象',
      pageSize: 10,
      language: locale.value || 'zh'
    })
    const list = (res.status === 'ok' && res.data && res.data.length > 0) ? res.data : []
    if (list.length > 0) {
      cityImageNewsList.value = list.slice(0, 6).map((item: any) => ({
        id: item.name || String(item.id),
        title: item.displayName || item.title,
        date: formatDate(item.publishTime || item.createdTime),
        summary: item.summary || '',
        originalData: item
      }))
    } else {
      cityImageNewsList.value = defaultNoticeNews.value
    }
  } catch (e) {
    cityImageNewsList.value = defaultNoticeNews.value
  }
}

// 跳转文章详情
const goToArticle = (item: any) => {
  const original = item.originalData || item
  if (original.articleType === 'external_link' && original.externalUrl) {
    window.open(original.externalUrl, '_blank')
    return
  }
  sessionStorage.setItem('currentArticle', JSON.stringify(original))
  router.push({
    name: 'article-detail',
    params: { id: item.id || original.name || '0' }
  })
}

// 跳转资讯分类列表
const goToNewsCategory = (categoryName: string) => {
  router.push({ path: '/news', query: { tab: categoryName } })
}

const siluvr = {
    id: 'silu',
    title: t('home.siluScroll'),
    desc: t('home.siluScrollDesc'),
    url: 'https://sz.xjhegs.gov.cn:3004',
    color: '#2979ff',
    iconType: 'scroll'
  }
// ================= 右侧 5 大 VR/3D 入口及全屏弹窗 =================
const vrList = computed(() => [
  {
    id: 'points-hall',
    title: t('home.pointsHall'),
    desc: t('home.pointsHallDesc'),
    url: 'https://www.720yun.com/vr/843j50yfzO4',
    color: '#ff4d28',
    iconType: 'hall'
  },
  {
    id: 'vr-tour',
    title: t('home.vrTour'),
    desc: t('home.vrTourDesc'),
    url: 'https://www.720yun.com/t/5avkOl8758e?scene_id=50999361',
    color: '#00c5c8',
    iconType: 'vr'
  },

  {
    id: '10th-anniv',
    title: t('home.tenthAnniv'),
    desc: t('home.tenthAnnivDesc'),
    url: 'https://www.720yun.com/vr/188j55kktv9',
    color: '#fa8c16',
    iconType: 'exhibition'
  },
  {
    id: 'xj-image',
    title: t('home.xjImage'),
    desc: t('home.xjImageDesc'),
    url: 'https://www.720yun.com/vr/e96jtOkaty0',
    color: '#389e0d',
    iconType: 'pavilion',
    isExternal: true
  }
])

const showIframe = ref(false)
const iframeUrl = ref('')
const currentVrId = ref('')
const iframeRef = ref<HTMLIFrameElement | null>(null)
const isClosingModal = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

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

const openIframe = (item: any) => {
  if (item.id === 'xj-image' || item.isExternal) {
    window.open(item.url, '_blank')
    return
  }
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
    } catch (e) {}
  }
}

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

const closeIframe = () => {
  if (isClosingModal.value) return

  if (currentVrId.value === 'silu') {
    isClosingModal.value = true
    try {
      iframeRef.value?.contentWindow?.postMessage(
        { action: 'triggerPageClose', type: 'CLOSE_SILU' },
        '*'
      )
    } catch (e) {}

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
    } catch (e) {}

    closeTimer = setTimeout(() => {
      destroyAndResetModal()
    }, 2800)
  } else {
    destroyAndResetModal()
  }
}

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

// ================= 底部 快捷服务 =================
interface QuickItem {
  title: string
  desc: string
  iconBg: string
  path: string
  isExternal?: boolean
  icon?: string
  type: 'gov' | 'corp' | 'port' | 'appeal'
}

const defaultQuickList = computed<QuickItem[]>(() => [
  {
    title: t('home.govAffairs'),
    desc: t('home.govAffairsDesc'),
    iconBg: '#d32f2f',
    path: '/service/government',
    type: 'gov'
  },
  {
    title: t('home.corpService'),
    desc: t('home.corpServiceDesc'),
    iconBg: '#0b5796',
    path: '/service/government',
    type: 'corp'
  },
  {
    title: t('home.crossBorder'),
    desc: t('home.crossBorderDesc'),
    iconBg: '#d97706',
    path: '/service/port',
    type: 'port'
  },
  {
    title: t('home.publicAppeals'),
    desc: t('home.publicAppealsDesc'),
    iconBg: '#7c3aed',
    path: '/service/employment',
    type: 'appeal'
  }
])

const quickServices = ref<QuickItem[]>([])

const displayQuickServices = computed(() => {
  if (quickServices.value.length >= 4) {
    return quickServices.value.slice(0, 4)
  }
  return defaultQuickList.value
})

const fetchQuickServices = async () => {
  try {
    const res: any = await http.get('/prod-api/ncmanagement/class/zones-tree', {
      zoneType: 'home',
      platform: 'portal',
      userType: '',
      lang: locale.value || 'zh'
    })
    if (res.code === 0 && res.data && res.data.home && res.data.home.length > 0) {
      const colors = ['#d32f2f', '#0b5796', '#d97706', '#7c3aed']
      const types: ('gov' | 'corp' | 'port' | 'appeal')[] = ['gov', 'corp', 'port', 'appeal']
      const descs = [
        t('home.govAffairsDesc'),
        t('home.corpServiceDesc'),
        t('home.crossBorderDesc'),
        t('home.publicAppealsDesc')
      ]
      quickServices.value = res.data.home.map((item: any, index: number) => ({
        title: item.name,
        desc: item.remark || descs[index % descs.length],
        iconBg: colors[index % colors.length],
        type: types[index % types.length],
        icon: item.bgImage ? (item.bgImage.startsWith('http') ? item.bgImage : `${minioPrefix}${item.bgImage}`) : '',
        path: item.url || defaultQuickList.value[index % defaultQuickList.value.length]?.path || '',
        isExternal: item.linkType === 'url' || item.url?.startsWith('http')
      }))
    } else {
      quickServices.value = defaultQuickList.value
    }
  } catch (error) {
    quickServices.value = defaultQuickList.value
  }
}

const handleQuickClick = (path: string, isExternal?: boolean) => {
  if (!path) return
  if (isExternal || path.startsWith('http')) {
    window.open(path, '_blank')
  } else {
    router.push(path)
  }
}

watch(locale, () => {
  fetchBanners()
  fetchPolicyNews()
  fetchYaowenNews()
  fetchNoticeNews()
  fetchCityImageNews()
  fetchQuickServices()
})

onMounted(() => {
  window.addEventListener('message', handleWindowMessage)
  fetchBanners()
  fetchPolicyNews()
  fetchYaowenNews()
  fetchNoticeNews()
  fetchCityImageNews()
  fetchQuickServices()
  checkAndAutoOpenSilu()
})

onUnmounted(() => {
  window.removeEventListener('message', handleWindowMessage)
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
})
</script>

<template>
  <div class="home-page-container">
    <!-- 顶部Header组件 -->
    <TheHeader />

    <!-- 主体区域 -->
    <main class="main-content">
      <!-- 蓝色主导航栏 (与设计图一致，6项简洁文字) -->
      <TheNavBar activeId="home"  />

      <!-- 主体核心白底卡片 -->
      <div class="hero-box">
        <!-- hero-section 上方：通知公告栏 -->
        <div class="hero-notice-bar">
          <div class="notice-bar-badge" @click="goToNewsCategory('通知公告')" :title="t('news.noticeAnnounce')">
            <svg class="notice-horn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <span class="notice-badge-text">{{ t('home.notice') }}</span>
          </div>
          <div class="notice-bar-divider"></div>
          <div class="notice-bar-content">
            <swiper
              v-if="noticeNewsList.length > 0"
              :modules="[Autoplay]"
              direction="vertical"
              :autoplay="{ delay: 3500, disableOnInteraction: false }"
              :loop="noticeNewsList.length > 1"
              class="notice-swiper"
            >
              <swiper-slide v-for="item in noticeNewsList" :key="item.id">
                <div class="notice-slide-item" @click="goToArticle(item)">
                  <span class="notice-item-tag">{{ t('home.notice') }}</span>
                  <span class="notice-item-title" :title="item.title">{{ item.title }}</span>
                  <span class="notice-item-date">{{ item.date }}</span>
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <div class="notice-bar-more" @click="goToNewsCategory('通知公告')" :title="t('home.more')">
            <span>{{ t('home.more') }}</span>
            <svg class="notice-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        <!-- 核心 Hero 上半部分：布局 (左:Banner+宣传展示, 中:要闻+5大VR/3D入口+公告) -->
        <div class="hero-section">
          <!-- 第1列：左侧 (Banner 轮播 + 宣传展示) -->
          <div class="col-left">
            <!-- 轮播图区域 -->
            <div class="banner-card">
              <swiper
                v-if="bannerList.length > 0"
                :modules="swiperModules"
                effect="fade"
                :fadeEffect="{ crossFade: true }"
                :autoplay="{ delay: 5000, disableOnInteraction: false }"
                :loop="true"
                class="banner-swiper"
                @swiper="onSwiperInit"
                @slideChange="onSlideChange"
              >
                <swiper-slide v-for="(item, idx) in bannerList" :key="item.id || idx">
                  <div class="banner-slide-content">
                    <img 
                      :src="item.coverImage || '@/assets/img/indexbg.png'" 
                      alt="Banner" 
                      class="banner-img"
                    />
                    <!-- 标题浮层 -->
                    <div class="banner-title-overlay">
                      <div class="banner-title-text">{{ item.title }}</div>
                      <div v-if="item.subtitle" class="banner-sub-text">{{ item.subtitle }}</div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>

              <!-- 自定义轮播控制栏 (左侧切换箭头 + 右侧指示点) -->
              <div class="banner-controls-bar">
                <div class="banner-nav-arrows">
                  <button class="nav-arrow-btn" @click.stop="prevBanner" :title="t('home.prev')">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button class="nav-arrow-btn" @click.stop="nextBanner" :title="t('home.next')">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
                <div class="banner-dots-wrapper">
                  <span
                    v-for="(_, dIdx) in bannerList.slice(0, 4)"
                    :key="dIdx"
                    :class="['banner-dot', { active: currentBannerIndex === dIdx }]"
                    @click.stop="goToBannerSlide(dIdx)"
                  ></span>
                </div>
              </div>
            </div>

            <!-- 移动端专属搜索框 (移动端显示) -->
            <div class="mobile-only-comp mobile-search-row">
              <input
                type="text"
                :placeholder="t('header.searchPlaceholder')"
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
                class="mobile-search-input"
              />
              <button @click="handleSearch" class="mobile-search-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>

            <!-- 宣传展示栏 -->
            <div class="policy-section">
              <div class="policy-badge" @click="goToNewsCategory('图文宣传')" :title="t('news.policyInterpret')">
                <span>{{ t('home.policyTagPolicy') }}</span>
                <span>{{ t('home.policyTagRead') }}</span>
              </div>
              <div class="policy-list">
                <div
                  v-for="item in policyNewsList"
                  :key="item.id"
                  class="policy-item"
                  @click="goToArticle(item)"
                >
                  <span class="news-dot">•</span>
                  <span class="policy-title" :title="item.title">{{ item.title }}</span>
                  <span class="policy-date">{{ item.date }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 第2列：中间 (要闻 + VR/3D入口 + 通知公告) -->
          <div class="col-middle">
            <!-- 子列 1: 要闻 -->
            <div class="sub-col yaowen-col">
              <div class="news-tab-badge yaowen-badge" @click="goToNewsCategory('重大活动')">
                {{ t('news.majorEvents') }}
              </div>
              <div class="yaowen-featured" v-if="featuredYaowen" @click="goToArticle(featuredYaowen)">
                <h3 class="featured-title" :title="featuredYaowen.title">{{ featuredYaowen.title }}</h3>
                <p class="featured-summary">{{ featuredYaowen.summary }}</p>
              </div>
              <ul class="sub-news-list">
                <li
                  v-for="item in otherYaowenList"
                  :key="item.id"
                  class="sub-news-item"
                  @click="goToArticle(item)"
                >
                  <span class="news-dot">•</span>
                  <span class="news-item-title" :title="item.title">{{ item.title }}</span>
                  <span class="news-item-date">{{ item.date }}</span>
                </li>
              </ul>
              <div class="col-more-btn" @click="goToNewsCategory('重大活动')">
                {{ t('home.more') }}
              </div>
            </div>

            <!-- 中间放置：5 大 VR/3D 入口 (丝路长卷 + 一行2个VR卡片) -->
            <div class="col-right">
              <div class="silubox" @click="openIframe(siluvr)" :title="siluvr.title + ' - ' + siluvr.desc">
                <div class="juanzhou">
                    <img src="@/assets/img/ddnb1.png" alt="卷轴">
                </div>
                <div>
           
                </div>
              </div>
              <div class="vr-grid">
                <template v-for="item in vrList" :key="item.id">
                  <!-- 新疆形象展示平台: 使用 a 链接在站外打开 -->
                  <a
                    v-if="item.id === 'xj-image' || item.isExternal"
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="vr-card-item"
                    :title="item.title + ' - ' + item.desc"
                  >
                    <div class="vr-icon-box" :style="{ backgroundColor: item.color }">
                      <!-- 新疆形象展示平台: 三层菱形平台/中华文化馆 -->
                      <svg v-if="item.iconType === 'pavilion'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5"/>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                      </svg>
                    </div>
                    <div class="vr-text-box">
                      <div class="vr-title">{{ item.title }}</div>
                      <div class="vr-desc">{{ item.desc }}</div>
                    </div>
                  </a>

                  <!-- 其它项目: 原有全屏模态弹窗打开 -->
                  <div
                    v-else
                    class="vr-card-item"
                    @click="openIframe(item)"
                    :title="item.title + ' - ' + item.desc"
                  >
                    <div class="vr-icon-box" :style="{ backgroundColor: item.color }">
                      <!-- 积分馆: 五角星 -->
                      <svg v-if="item.iconType === 'hall'" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M12 2.5l2.8 6.5 7 .6-5.3 4.7 1.6 6.9-6.1-3.6-6.1 3.6 1.6-6.9-5.3-4.7 7-.6z"/>
                      </svg>
                      <!-- VR全景游: VR全景眼镜/相机 -->
                      <svg v-else-if="item.iconType === 'vr'" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M21 7H3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h4.5l1.5-2h6l1.5 2H21c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-14 7c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm10 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                      </svg>
                      <!-- 丝路长卷: 画卷/折叠地图 -->
                      <svg v-else-if="item.iconType === 'scroll'" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 14H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                      </svg>
                      <!-- 建市十周年成果: 奖杯 -->
                      <svg v-else-if="item.iconType === 'exhibition'" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.82 2.68 3.32 3.16V19H8v2h8v-2h-2.71v-2.9c1.5-.48 2.69-1.66 3.32-3.16 2.47-.31 4.39-2.39 4.39-4.94V7c0-1.1-.9-2-2-2zm-14 3V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                      </svg>
                      <!-- 新疆形象展示平台: 三层菱形平台/中华文化馆 -->
                      <svg v-else-if="item.iconType === 'pavilion'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5"/>
                      </svg>
                    </div>
                    <div class="vr-text-box">
                      <div class="vr-title">{{ item.title }}</div>
                      <div class="vr-desc">{{ item.desc }}</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- 子列 2: 城市形象 -->
            <div class="sub-col notice-col">
              <div class="news-tab-badge notice-badge" @click="goToNewsCategory('城市形象')">
                {{ t('news.cityImage') }}
              </div>
              <ul class="sub-news-list notice-list">
                <li
                  v-for="item in cityImageNewsList"
                  :key="item.id"
                  class="sub-news-item"
                  @click="goToArticle(item)"
                >
                  <span class="news-dot">•</span>
                  <span class="news-item-title" :title="item.title">{{ item.title }}</span>
                  <span class="news-item-date">{{ item.date }}</span>
                </li>
              </ul>
              <div class="col-more-btn" @click="goToNewsCategory('城市形象')">
                {{ t('home.more') }}
              </div>
            </div>
          </div>
        </div>

        <!-- 核心 Hero 下半部分：快捷服务 -->
        <div class="quick-services-section">
          <!-- 蓝色快捷服务标块 -->
          <div class="quick-banner-title">
            <svg class="paper-plane-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            <div class="quick-title-text">
              <span>{{ t('home.quickServiceWord1') }}</span>
              <span>{{ t('home.quickServiceWord2') }}</span>
            </div>
          </div>

          <!-- 4 大卡片栅格 -->
          <div class="quick-grid">
            <div
              v-for="(qs, idx) in displayQuickServices"
              :key="idx"
              class="quick-card"
              @click="handleQuickClick(qs.path, qs.isExternal)"
            >
              <!-- 图标容器 -->
              <div class="quick-icon-wrapper" :style="{ backgroundColor: qs.iconBg }">
                <img v-if="qs.icon" :src="qs.icon" alt="icon" class="quick-api-img" />
                <!-- 预设矢量图标 -->
                <svg v-else-if="qs.type === 'gov'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <svg v-else-if="qs.type === 'corp'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
                <svg v-else-if="qs.type === 'port'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                <svg v-else-if="qs.type === 'appeal'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                </svg>
              </div>

              <!-- 标题与说明 -->
              <div class="quick-info">
                <h4>
                  <span class="quick-title-text-main">{{ qs.title }}</span>
                  <span :class="['quick-arrow-circle', 'arrow-' + qs.type]">›</span>
                </h4>
                <p>{{ qs.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- VR 全景 / 3D 全屏模态弹窗 -->
    <Teleport to="body">
      <div 
        class="vr-modal-overlay" 
        v-if="showIframe" 
        :class="{ 'is-closing': isClosingModal }"
        @click.self="closeIframe"
      >
        <div class="vr-modal-body">
          <button 
            class="vr-close-btn" 
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

    <!-- 底部Footer组件 -->
    <TheFooter />
  </div>
</template>

<style scoped>
.home-page-container {
  width: 100%;
  min-height: calc(100vh / var(--app-zoom, 1));
  position: relative;
  display: flex;
  flex-direction: column;
  color: #1e293b;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  box-sizing: border-box;
}

.main-content {
  position: relative;
  z-index: 5;
  max-width: 1280px;
  min-height: 850px;
  height: auto;
  margin: 0 auto;
  padding: 140px 0 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.juanzhou{
  width:100%;
  box-sizing: border-box;
}
.silubox{
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer
}
.juanzhou img{
  width:100%
}
/* 核心白色内容卡片 */
.hero-box {
  background-color: #f5f5f5;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 600px;
  height: auto;
}

/* ================== hero-section 上方：通知公告栏 ================== */
.hero-notice-bar {
  height: 70px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
  gap: 12px;
  flex-shrink: 0;
}

.notice-bar-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;
}

.notice-horn-icon {
  width: 18px;
  height: 18px;
  color: #0066ff;
}

.notice-badge-text {
  font-size: 16px;
  font-weight: 700;
  color: #1b4b8a;
  white-space: nowrap;
}

.notice-bar-divider {
  width: 1px;
  height: 16px;
  background: #cbd5e1;
  flex-shrink: 0;
}

.notice-bar-content {
  flex: 1;
  height: 42px;
  overflow: hidden;
  min-width: 0;
}

.notice-swiper {
  width: 100%;
  height: 42px;
}

.notice-swiper :deep(.swiper-slide) {
  height: 42px !important;
  display: flex;
  align-items: center;
}

.notice-slide-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  text-decoration: none;
}

.notice-item-tag {
  background: #eff6ff;
  color: #0066ff;
  font-size: 14px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 3px;
  flex-shrink: 0;
  white-space: nowrap;
}

.notice-item-title {
  flex: 1;
  font-size: 16px;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}

.notice-slide-item:hover .notice-item-title {
  color: #0066ff;
}

.notice-item-date {
  font-size: 13px;
  color: #94a3b8;
  margin-left: 12px;
  flex-shrink: 0;
}

.notice-bar-more {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;
  transition: color 0.15s;
}

.notice-bar-more:hover {
  color: #0066ff;
}

.notice-arrow-icon {
  width: 14px;
  height: 14px;
}

/* 上半部分三列布局 */
.hero-section {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

/* ================== 第1列：左侧 (31%) ================== */
.col-left {
  flex: 0 0 320px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.banner-card {
  width: 100%;
  height: 240px;
  position: relative;
  overflow: hidden;
  background: #f1f5f9;
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

.banner-slide-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.banner-title-overlay {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  z-index: 2;
  color: #b91c1c;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.9);
}

.banner-title-text {
  font-size: 15px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: 0.5px;
}

.banner-sub-text {
  font-size: 11px;
  font-weight: 600;
  color: #991b1b;
  margin-top: 3px;
  letter-spacing: 1.5px;
}

/* 轮播底控控制胶囊 */
.banner-controls-bar {
  position: absolute;
  bottom: 12px;
  right: 2%;
  display: flex;
  gap: 10px;
  z-index: 10;
  pointer-events: auto;
}

.banner-nav-arrows {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  padding: 3px 8px;
  gap: 6px;
}

.nav-arrow-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  transition: transform 0.15s;
}

.nav-arrow-btn:hover {
  transform: scale(1.15);
}

.banner-dots-wrapper {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  padding: 5px 10px;
  gap: 6px;
}

.banner-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s;
}

.banner-dot.active {
  background: #ffffff;
  transform: scale(1.2);
}

/* 移动端搜索框 */
.mobile-search-row {
  display: none;
}

/* 宣传展示 */
.policy-section {
  display: flex;
  gap: 12px;
  align-items: stretch;
  background: #ffffff;
  height: 100px;

}

.policy-badge {
  width: 70px;
  background: #00b578;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.policy-badge:hover {
  background: #009d66;
}

.policy-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding:20px;
}

.policy-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #334155;
  cursor: pointer;
  transition: color 0.15s;
  white-space: nowrap;
}

.policy-item:hover .policy-title {
  color: #00b578;
}

.policy-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.policy-date {
  color: #94a3b8;
  font-size: 14px;
  margin-left: 8px;
  flex-shrink: 0;
}

/* ================== 第2列：中间 (要闻 + 通知公告) ================== */
.col-middle {
  flex: 1;
  display: flex;
  gap: 16px;
  min-width: 0;
}

.sub-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.news-tab-badge {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  margin-bottom: 8px;
}

.yaowen-badge {
  background: #00b578;
  color: #ffffff;
}

.notice-badge {
  background: #e5e5e5;
  color: #334155;
}

/* 要闻头条大卡片 */
.yaowen-featured {
  text-align: center;
  padding-bottom: 20px;
  cursor: pointer;
  margin-bottom: 4px;
  min-width: 0;
}

.featured-title {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}

.yaowen-featured:hover .featured-title {
  color: #00b578;
}

.featured-summary {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
}

/* 列表条目 */
.sub-news-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.sub-news-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #334155;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s;
}

.sub-news-item:hover .news-item-title {
  color: #00b578;
}

.notice-col .sub-news-item:hover .news-item-title {
  color: #0066ff;
}

.news-dot {
  color: #cbd5e1;
  margin-right: 6px;
  font-size: 14px;
}

.news-item-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-item-date {
  color: #94a3b8;
  font-size: 14px;
  margin-left: 8px;
  flex-shrink: 0;
}

.col-more-btn {
  margin-top: auto;
  padding: 10px;
  height: 30px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.col-more-btn:hover {
  background: #f1f5f9;
  color: #0066ff;
}

/* ================== 中间：5 大 VR/3D 入口 (丝路长卷 + 2x2卡片) ================== */
.col-right {
  flex: 0 0 340px;
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vr-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.vr-card-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: url('@/assets/img/ddnbs1.jpg') no-repeat center center;
  background-size: 100% 100%;
  padding: 16px 8px;
  box-sizing: border-box;
  min-width: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  text-decoration: none;
  color: inherit;
}
.vr-card-item:nth-child(2 of .vr-card-item) {
  background: url('@/assets/img/ddnbs2.jpg') no-repeat center center;
  background-size: 100% 100%;

}
.vr-card-item:nth-child(3 of .vr-card-item) {
  background: url('@/assets/img/ddnbs3.jpg') no-repeat center center;
  background-size: 100% 100%;

}
.vr-card-item:nth-child(4 of .vr-card-item) {
  background: url('@/assets/img/ddnbs4.jpg') no-repeat center center;
  background-size: 100% 100%;

}

.vr-card-item:hover {
  transform: translateX(2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  filter: brightness(1.02);
}

.vr-icon-box {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.vr-card-item:hover .vr-icon-box {
  transform: scale(1.06);
}

.vr-text-box {
  flex: 1;
  min-width: 0;
}

.vr-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vr-desc {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ================== 下半部分：快捷服务 ================== */
.quick-services-section {
  display: flex;
  align-items: stretch;
  gap: 12px;
  margin-top: 4px;
  background:#fff;
  height:128px;

}

.quick-banner-title {
  background: #0066ff;
  color: #ffffff;
  width: 160px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px;
  box-sizing: border-box;
}

.paper-plane-icon {
  width: 24px;
  height: 24px;
  transform: rotate(-35deg);
  flex-shrink: 0;
}

.quick-title-text {
  display: flex;
  flex-direction: column;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1.25;
}

.quick-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);

}

.quick-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #f1f5f9;
}

.quick-card:hover {
  transform: translateY(-2px);
  background: #ffffff;

}

.quick-icon-wrapper {

  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
}

.quick-api-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.quick-info {
  flex: 1;
  min-width: 0;
  max-width: 170px;
}

.quick-info h4 {
  margin: 0 0 2px 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.quick-title-text-main {

}

.quick-arrow-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
}

.arrow-gov {
  background: rgba(211, 47, 47, 0.14);
  color: #d32f2f;
}

.arrow-corp {
  background: rgba(11, 87, 150, 0.14);
  color: #0b5796;
}

.arrow-port {
  background: rgba(217, 119, 6, 0.14);
  color: #d97706;
}

.arrow-appeal {
  background: rgba(124, 58, 237, 0.14);
  color: #7c3aed;
}

.quick-info p {
  margin: 0;
  font-size: 16px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* ================== 全屏 VR 弹窗 ================== */
.vr-modal-overlay {
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

.vr-modal-body {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.vr-close-btn {
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

.vr-close-btn:hover {
  background: rgba(239, 68, 68, 0.85);
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.08);
}

.vr-close-btn.is-closing {
  opacity: 0.5;
  cursor: wait;
  pointer-events: none;
}

/* ================== 移动端响应式处理 ================== */
@media screen and (max-width: 1024px) {
  .hero-section {
    flex-wrap: wrap;
  }
  .col-left, .col-middle {
    flex: 1 1 100%;
    width: 100%;
  }
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .main-content {
    padding: 110px 12px 30px 12px;
  }
  .hero-box {
    padding: 14px;
  }
  .hero-notice-bar {
    height: 38px;
    padding: 0 10px;
    gap: 8px;
  }
  .notice-swiper {
    height: 38px;
  }
  .notice-swiper :deep(.swiper-slide) {
    height: 38px !important;
  }
  .notice-item-tag {
    display: none;
  }
  .notice-item-date {
    display: none;
  }
  .hero-section {
    flex-direction: column;
    gap: 16px;
  }
  .col-left {
    width: 100%;
  }
  .banner-card {
    height: 180px;
  }
  .mobile-search-row {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 20px;
    padding: 6px 14px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  .mobile-search-input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 13px;
    color: #334155;
    background: transparent;
  }
  .mobile-search-btn {
    background: none;
    border: none;
    color: #0066ff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .col-middle {
    flex-direction: column;
    gap: 14px;
  }
  .col-right {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .quick-services-section {
    flex-direction: column;
    height:auto
  }
  .quick-banner-title {
    width: 100%;
    height: 40px;
    flex-direction: row;
    padding: 8px 0;
  }
  .quick-title-text {
    flex-direction: row;
    gap: 6px;
  }
  .quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>