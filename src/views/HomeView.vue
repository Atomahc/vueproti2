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
const { locale } = useI18n()

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
      bannerList.value = defaultBanners
    }
  } catch (error) {
    console.error('Failed to fetch banners', error)
    bannerList.value = defaultBanners
  }
}

const defaultBanners = [
  {
    id: 'b1',
    title: '2026佛山-伊犁非遗醒狮及武术展演交流活动走进霍尔果斯',
    subtitle: '非遗传承·耀武大典',
    coverImage: ''
  },
  {
    id: 'b2',
    title: '霍尔果斯：颜值UP 美丽墙绘入画来',
    subtitle: '宜居宜业·和美口岸',
    coverImage: ''
  },
  {
    id: 'b3',
    title: '桃李不言 匠心致远',
    subtitle: '弘扬工匠精神 汇聚发展合力',
    coverImage: ''
  },
  {
    id: 'b4',
    title: '中国·霍尔果斯 向西开放桥头堡建设',
    subtitle: '高水平对外开放高质量发展',
    coverImage: ''
  }
]

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

// 格式化日期为 MM/DD
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '07/06'
  const dateObj = new Date(dateStr)
  if (isNaN(dateObj.getTime())) {
    const parts = dateStr.split('T')[0].split('-')
    if (parts.length >= 3) {
      return `${parts[1]}/${parts[2]}`
    }
    return '07/06'
  }
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${month}/${day}`
}

// 获取政策解读
const fetchPolicyNews = async () => {
  try {
    const res: any = await http.get('/api-cas/api/get-articles', {
      owner: 'hgsso',
      categoryIds: '政策解读',
      pageSize: 5
    })
    let list = (res.status === 'ok' && res.data && res.data.length > 0) ? res.data : []
    if (list.length === 0) {
      const fallbackRes: any = await http.get('/api-cas/api/get-articles', {
        owner: 'hgsso',
        categoryIds: '政策推送',
        pageSize: 5
      })
      list = (fallbackRes.status === 'ok' && fallbackRes.data) ? fallbackRes.data : []
    }
    if (list.length > 0) {
      policyNewsList.value = list.slice(0, 2).map((item: any) => ({
        id: item.name || String(item.id),
        title: item.displayName || item.title,
        date: formatDate(item.publishTime || item.createdTime),
        summary: item.summary || '',
        originalData: item
      }))
    } else {
      policyNewsList.value = [
        { id: 'p1', title: '霍尔果斯口岸单日通关量创历史新高', date: '07/06' },
        { id: 'p2', title: '霍尔果斯口岸单日通关量创历史新高', date: '07/06' }
      ]
    }
  } catch (e) {
    policyNewsList.value = [
      { id: 'p1', title: '霍尔果斯口岸单日通关量创历史新高', date: '07/06' },
      { id: 'p2', title: '霍尔果斯口岸单日通关量创历史新高', date: '07/06' }
    ]
  }
}

// 获取要闻 (首条作为核心头条，其余作为列表)
const fetchYaowenNews = async () => {
  try {
    const res: any = await http.get('/api-cas/api/get-articles', {
      owner: 'hgsso',
      categoryIds: '新闻资讯',
      pageSize: 10
    })
    let list = (res.status === 'ok' && res.data && res.data.length > 0) ? res.data : []
    if (list.length < 5) {
      const fallbackRes: any = await http.get('/api-cas/api/get-articles', {
        owner: 'hgsso',
        categoryIds: '重大活动',
        pageSize: 10
      })
      if (fallbackRes.status === 'ok' && fallbackRes.data) {
        list = [...list, ...fallbackRes.data]
      }
    }
    if (list.length > 0) {
      yaowenNewsList.value = list.slice(0, 5).map((item: any) => ({
        id: item.name || String(item.id),
        title: item.displayName || item.title,
        date: formatDate(item.publishTime || item.createdTime),
        summary: item.summary || (item.content ? item.content.replace(/<[^>]+>/g, '').slice(0, 60) + '...' : '霍尔果斯口岸单日通关量创新高 霍尔果斯口岸单日通关量创新高霍尔果斯...'),
        originalData: item
      }))
    } else {
      yaowenNewsList.value = [
        {
          id: 'yw1',
          title: '霍尔果斯口岸\n单日通关量创新高',
          date: '07/06',
          summary: '霍尔果斯口岸单日通关量创新高 霍尔果斯口岸单日通关量创新高霍尔果...'
        },
        { id: 'yw2', title: '数字链计划一期建设成果发布', date: '07/06' },
        { id: 'yw3', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' },
        { id: 'yw4', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' },
        { id: 'yw5', title: '数字链计划一期建设成果发布', date: '07/06' }
      ]
    }
  } catch (e) {
    yaowenNewsList.value = [
      {
        id: 'yw1',
        title: '霍尔果斯口岸\n单日通关量创新高',
        date: '07/06',
        summary: '霍尔果斯口岸单日通关量创新高 霍尔果斯口岸单日通关量创新高霍尔果...'
      },
      { id: 'yw2', title: '数字链计划一期建设成果发布', date: '07/06' },
      { id: 'yw3', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' },
      { id: 'yw4', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' },
      { id: 'yw5', title: '数字链计划一期建设成果发布', date: '07/06' }
    ]
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
      pageSize: 10
    })
    let list = (res.status === 'ok' && res.data && res.data.length > 0) ? res.data : []
    if (list.length < 6) {
      const fallbackRes: any = await http.get('/api-cas/api/get-articles', {
        owner: 'hgsso',
        categoryIds: '城市形象',
        pageSize: 10
      })
      if (fallbackRes.status === 'ok' && fallbackRes.data) {
        list = [...list, ...fallbackRes.data]
      }
    }
    if (list.length > 0) {
      noticeNewsList.value = list.slice(0, 6).map((item: any) => ({
        id: item.name || String(item.id),
        title: item.displayName || item.title,
        date: formatDate(item.publishTime || item.createdTime),
        summary: item.summary || '',
        originalData: item
      }))
    } else {
      noticeNewsList.value = [
        { id: 'nc1', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' },
        { id: 'nc2', title: '数字链计划一期建设成果发布', date: '07/06' },
        { id: 'nc3', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' },
        { id: 'nc4', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' },
        { id: 'nc5', title: '数字链计划一期建设成果发布', date: '07/06' },
        { id: 'nc6', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' }
      ]
    }
  } catch (e) {
    noticeNewsList.value = [
      { id: 'nc1', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' },
      { id: 'nc2', title: '数字链计划一期建设成果发布', date: '07/06' },
      { id: 'nc3', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' },
      { id: 'nc4', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' },
      { id: 'nc5', title: '数字链计划一期建设成果发布', date: '07/06' },
      { id: 'nc6', title: '霍尔果斯口岸单日通关量创新高', date: '07/06' }
    ]
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

// ================= 右侧 5 大 VR/3D 入口及全屏弹窗 =================
const vrList = [
  {
    id: 'points-hall',
    title: '霍尔果斯积分馆',
    desc: '720°全景数字展馆',
    url: 'https://www.720yun.com/vr/843j50yfzO4',
    color: '#ff4d28',
    iconType: 'hall'
  },
  {
    id: 'vr-tour',
    title: 'VR全景游',
    desc: '口岸/合作中心/景区',
    url: 'https://www.720yun.com/t/5avkOl8758e?scene_id=50999361',
    color: '#00c5c8',
    iconType: 'vr'
  },
  {
    id: 'silu',
    title: '丝路长卷',
    desc: '霍尔果斯·数字城市名片',
    url: 'https://sz.xjhegs.gov.cn:3004',
    color: '#2979ff',
    iconType: 'scroll'
  },
  {
    id: '10th-anniv',
    title: '建市十周年成果',
    desc: '非凡十年·风鹏正举',
    url: 'https://www.720yun.com/vr/188j55kktv9',
    color: '#fa8c16',
    iconType: 'exhibition'
  },
  {
    id: 'xj-image',
    title: '新疆形象展示平台',
    desc: '中华文化体验馆',
    url: 'https://www.720yun.com/vr/e96jtOkaty0',
    color: '#389e0d',
    iconType: 'pavilion'
  }
]

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
      const siluItem = vrList.find((item) => item.id === 'silu')
      if (siluItem) {
        openIframe(siluItem)
      }
    }
  } catch (e) {
    const siluItem = vrList.find((item) => item.id === 'silu')
    if (siluItem) {
      openIframe(siluItem)
    }
  }
}

const openIframe = (item: typeof vrList[0]) => {
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

const defaultQuickList: QuickItem[] = [
  {
    title: '政务办事',
    desc: '个人/法人一站办理',
    iconBg: '#d32f2f',
    path: '/service/government',
    type: 'gov'
  },
  {
    title: '企业服务',
    desc: '全生命周期服务',
    iconBg: '#0b5796',
    path: '/service/government',
    type: 'corp'
  },
  {
    title: '跨境口岸',
    desc: '通关·合作中心',
    iconBg: '#d97706',
    path: '/service/port',
    type: 'port'
  },
  {
    title: '民意诉求',
    desc: '12345·直通车',
    iconBg: '#7c3aed',
    path: '/service/employment',
    type: 'appeal'
  }
]

const quickServices = ref<QuickItem[]>([])

const displayQuickServices = computed(() => {
  if (quickServices.value.length >= 4) {
    return quickServices.value.slice(0, 4)
  }
  return defaultQuickList
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
      const descs = ['个人/法人一站办理', '全生命周期服务', '通关·合作中心', '12345·直通车']
      quickServices.value = res.data.home.map((item: any, index: number) => ({
        title: item.name,
        desc: item.remark || descs[index % descs.length],
        iconBg: colors[index % colors.length],
        type: types[index % types.length],
        icon: item.bgImage ? (item.bgImage.startsWith('http') ? item.bgImage : `${minioPrefix}${item.bgImage}`) : '',
        path: item.url || defaultQuickList[index % defaultQuickList.length].path,
        isExternal: item.linkType === 'url' || item.url?.startsWith('http')
      }))
    } else {
      quickServices.value = defaultQuickList
    }
  } catch (error) {
    quickServices.value = defaultQuickList
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
  fetchQuickServices()
})

onMounted(() => {
  window.addEventListener('message', handleWindowMessage)
  fetchBanners()
  fetchPolicyNews()
  fetchYaowenNews()
  fetchNoticeNews()
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
      <TheNavBar activeId="home" :hide-icons="true" :tabs="['home', 'gov', 'life', 'cross', 'cloud', 'appeals']" />

      <!-- 主体核心白底卡片 -->
      <div class="hero-box">
        <!-- 核心 Hero 上半部分：三列布局 (左:Banner+政策解读, 中:要闻+公告, 右:5大VR/3D入口) -->
        <div class="hero-section">
          <!-- 第1列：左侧 (Banner 轮播 + 政策解读) -->
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
                  <button class="nav-arrow-btn" @click.stop="prevBanner" title="上一张">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button class="nav-arrow-btn" @click.stop="nextBanner" title="下一张">
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
                placeholder="搜索政府服务、企业信息、便民事项..."
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

            <!-- 政策解读栏 -->
            <div class="policy-section">
              <div class="policy-badge" @click="goToNewsCategory('政策解读')" title="政策解读">
                <span>政策</span>
                <span>解读</span>
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

          <!-- 第2列：中间 (要闻 + 通知公告 双子列并排) -->
          <div class="col-middle">
            <!-- 子列 1: 要闻 -->
            <div class="sub-col yaowen-col">
              <div class="news-tab-badge yaowen-badge" @click="goToNewsCategory('新闻资讯')">
                要闻
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
              <div class="col-more-btn" @click="goToNewsCategory('新闻资讯')">
                查看更多 ›
              </div>
            </div>

            <!-- 子列 2: 通知公告 -->
            <div class="sub-col notice-col">
              <div class="news-tab-badge notice-badge" @click="goToNewsCategory('通知公告')">
                通知公告
              </div>
              <ul class="sub-news-list notice-list">
                <li
                  v-for="item in noticeNewsList"
                  :key="item.id"
                  class="sub-news-item"
                  @click="goToArticle(item)"
                >
                  <span class="news-dot">•</span>
                  <span class="news-item-title" :title="item.title">{{ item.title }}</span>
                  <span class="news-item-date">{{ item.date }}</span>
                </li>
              </ul>
              <div class="col-more-btn" @click="goToNewsCategory('通知公告')">
                查看更多 ›
              </div>
            </div>
          </div>

          <!-- 第3列：右侧 (5 大 VR/3D 入口垂直排布) -->
          <div class="col-right">
            <div
              v-for="item in vrList"
              :key="item.id"
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
              <span>快捷</span>
              <span>服务</span>
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
            title="关闭"
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
  height:850px;
  margin: 0 auto;
  padding: 140px 0 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 核心白色内容卡片 */
.hero-box {
  background-color: #f5f5f5;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  height:600px
}

/* 上半部分三列布局 */
.hero-section {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

/* ================== 第1列：左侧 (31%) ================== */
.col-left {
  flex: 0 0 500px;
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.banner-card {
  width: 100%;
  height: 340px;
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

/* 政策解读 */
.policy-section {
  display: flex;
  gap: 12px;
  align-items: stretch;
  background: #ffffff;
  height: 100px;

}

.policy-badge {
  width: 110px;
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
  padding-bottom:20px;
  cursor: pointer;
  margin-bottom: 4px;
}

.featured-title {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  color: #0f172a;
  line-height: 1.35;
  white-space: pre-line;
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

/* ================== 第3列：右侧 5 大 VR/3D 入口 (24%) ================== */
.col-right {
  flex: 0 0 190px;
  width: 190px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

.vr-card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  padding: 20px 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
}

.vr-card-item:hover {
  background: #f8fafc;
  transform: translateX(2px);
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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
  font-size: 11px;
  color: #94a3b8;
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
  gap: 12px;
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
  border-color: #cbd5e1;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
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
  white-space: nowrap;
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
  .col-left, .col-middle, .col-right {
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .quick-services-section {
    flex-direction: column;
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