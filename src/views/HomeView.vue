<script setup lang="ts">
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'

const router = useRouter()

// 新闻选项卡
const newsTab = ref('城市形象')
const newsTabs = ['城市形象', '重大活动', '图文宣传']

const newsList = ref<any[]>([])

const fetchNews = async (category: string) => {
  try {
    const res: any = await http.get('/api-cas/api/get-articles', {
      categoryIds: category,
      owner: 'hgsso'
    })
    if (res.status === 'ok' && res.data) {
      newsList.value = res.data.slice(0, 10).map((item: any) => {
        const dateObj = new Date(item.publishTime || item.createdTime)
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        return {
          title: item.displayName,
          date: `${month}/${day}`,
          name: item.name,
          fullDate: (item.publishTime || item.createdTime).split('T')[0],
          content: item.content,
          articleType: item.articleType,
          externalUrl: item.externalUrl
        }
      })
    }
  } catch (error) {
    console.error('Failed to fetch news', error)
  }
}

const goToArticle = (item: any) => {
  if (item.articleType === 'external_link' && item.externalUrl) {
    window.open(item.externalUrl, '_blank')
    return
  }

  sessionStorage.setItem('currentArticle', JSON.stringify(item))
  router.push({
    name: 'article-detail',
    params: { id: item.name || '0' },
    query: { tab: newsTab.value }
  })
}

watch(newsTab, (newTab) => {
  fetchNews(newTab)
})

const quickServices = ref<any[]>([])

const swiperModules = [Pagination, Autoplay]
const bannerList = ref<any[]>([])
onMounted(async () => {
  fetchNews(newsTab.value)
  try {
    const res: any = await http.get('/api-loca/ncmanagement/class/zones-tree', {
      zoneType: 'home',
      platform: 'portal',
      userType: ''
    })
    if (res.code === 0 && res.data && res.data.home) {
      const defaultColors = ['#ff0033', '#0066cc', '#e6a23c', '#7c3aed']
      const defaultDesc = ['个人/法人一站办理', '全生命周期服务', '通关·合作中心', '12345·直通车']
      quickServices.value = res.data.home.map((item: any, index: number) => ({
        title: item.name,
        desc: item.remark || defaultDesc[index % defaultDesc.length],
        iconBg: defaultColors[index % defaultColors.length],
        icon: item.bgImage ? (item.bgImage.startsWith('http') ? item.bgImage : `${minioPrefix}${item.bgImage}`) : '',
        path: item.url,
        isExternal: item.linkType === 'url' || item.url?.startsWith('http')
      }))
    }
  } catch (error) {
    console.error('Failed to fetch quick services', error)
  }

  try {
    const res: any = await http.get('/api-loca/portal/section/page', {
      page: 1,
      limit: 10,
      sectionType: 'banner',
      t: Date.now()
    })
    if (res.code === 0 && res.data && res.data.list) {
      bannerList.value = res.data.list.map((item: any) => ({
        ...item,
        coverImage: item.coverImage ? (item.coverImage.startsWith('http') ? item.coverImage : `${minioPrefix}${item.coverImage}`) : ''
      }))
    }
  } catch (error) {
    console.error('Failed to fetch banners', error)
  }
})

const handleQuickClick = (path: string, isExternal?: boolean) => {
  if (!path) return
  if (isExternal || path.startsWith('http')) {
    window.open(path, '_blank')
  } else {
    router.push(path)
  }
}
</script>

<template>
  <div class="home-page-container">
    <!-- 拆分的Header组件 -->
    <TheHeader />

    <!-- 主体内容区域 -->
    <main class="main-content">
      <!-- 提取出的蓝色半透明主导航栏组件 -->
      <TheNavBar activeId="home" />


      <div class="hero-box">
                <!-- 中间核心布局区：左侧Banner + 右侧3D入口/新闻列表 -->
      <div class="hero-section">
        <!-- Banner 轮播区域 -->
        <div class="banner-card">
          <div class="banner-media">
            <swiper
              v-if="bannerList.length > 0"
              :modules="swiperModules"
              :pagination="{ clickable: true }"
              :autoplay="{ delay: 5000, disableOnInteraction: false }"
              :loop="true"
              class="banner-swiper"
            >
              <swiper-slide v-for="item in bannerList" :key="item.id">
                <img :src="item.coverImage || '@/assets/img/indexbg.png'" alt="Banner" class="banner-img" />
    
              </swiper-slide>
            </swiper>
            
            <!-- Banner右侧两个竖向3D入口模块 -->
            <div class="banner-side-overlay">
              <div class="vr-card" @click="handleQuickClick('https://www.720yun.com/t/5avkOl8758e?scene_id=50999361', true)">
                <div class="vr-icon-box">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="2" y="6" width="20" height="12" rx="3"></rect>
                    <circle cx="8" cy="12" r="2.5"></circle>
                    <circle cx="16" cy="12" r="2.5"></circle>
                  </svg>
                </div>
                <div class="vr-text">
                  <h3>丝路长卷</h3>
                  <p>数字城市名片 · 3D</p>
                </div>
              </div>

              <div class="vr-card" @click="handleQuickClick('https://www.720yun.com/t/5avkOl8758e?scene_id=50999361', true)">
                <div class="vr-icon-box">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="2" y="6" width="20" height="12" rx="3"></rect>
                    <circle cx="8" cy="12" r="2.5"></circle>
                    <circle cx="16" cy="12" r="2.5"></circle>
                  </svg>
                </div>
                <div class="vr-text">
                  <h3>VR全景游</h3>
                  <p>口岸/合作中心/景区</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- 右侧新闻资讯板块 -->
        <div class="news-card">
          <div class="news-header">
            <div class="news-tabs">
              <span
                v-for="t in newsTabs"
                :key="t"
                :class="['news-tab-item', { active: newsTab === t }]"
                @click="newsTab = t"
              >
                {{ t }}
              </span>
            </div>
          </div>

          <ul class="news-list">
            <li v-for="(item, index) in newsList" :key="index" class="news-item" @click="goToArticle(item)">
              <span class="news-dot">•</span>
              <span class="news-item-title">{{ item.title }}</span>
              <span class="news-item-date">{{ item.date }}</span>
            </li>
          </ul>

          <div class="news-more">
            <a href="javascript:void(0)" @click="router.push({ path: '/news', query: { tab: newsTab } })">查看更多 &gt;</a>
          </div>
        </div>
      </div>

      <!-- 底部快捷服务区 -->
      <div class="quick-services-section">
        <div class="quick-banner-title">
          <span>快捷</span>
          <span>服务</span>
        </div>
        <div class="quick-grid">
          <div v-for="(qs, idx) in quickServices" :key="idx" class="quick-card" @click="handleQuickClick(qs.path, qs.isExternal)">
            <div class="quick-icon-wrapper" :style="{ backgroundColor: qs.iconBg }">
              <img v-if="qs.icon" :src="qs.icon" alt="icon" style="width: 40px; height: 40px; object-fit: contain;" />
            </div>
            <div class="quick-info">
              <h4>{{ qs.title }} <span class="arrow-icon">›</span></h4>
              <p>{{ qs.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      </div>

    </main>

    <!-- 拆分的Footer组件 -->
    <TheFooter />
  </div>
</template>

<style scoped>
.home-page-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #1e293b;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}

.main-content {
  height: 850px;
  position: relative;
  z-index: 5;
  max-width: 1280px;
  margin: 0 auto;
  padding: 120px 0px 40px 0px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
 
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

.hero-box{
  padding: 24px;
  background-color: #ffffff;
  height:600px

}
/* 核心Hero区域 */
.hero-section {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  min-height: 0;
}

/* Banner轮播卡片 */
.banner-card {
  flex: 1;
  background: #ffffff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
}

.banner-media {
  width: 100%;
  height: 100%;
  position: relative;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 2;
  color: #c8161d;
  text-shadow: 0 2px 4px rgba(255,255,255,0.8);
}

.banner-title {
  font-size: 26px;
  font-weight: 900;
  line-height: 1.35;
  margin: 0 0 12px 0;
  color: #b91c1c;
  letter-spacing: 0.5px;
}

.banner-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: #451a03;
  margin: 0;
  letter-spacing: 2px;
}

/* Banner右侧浮动VR卡片 */
.banner-side-overlay {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 3;
  padding:8px;
}

.vr-card {
  flex: 1;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
}

.vr-card:hover {
  background: rgba(0, 102, 255, 0.466);
}

.vr-icon-box {
  margin-bottom: 8px;
  opacity: 0.9;
}

.vr-text h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.vr-text p {
  font-size: 11px;
  opacity: 0.75;
  margin: 0;
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: #ffffff;
  width: 20px;
  border-radius: 4px;
}

/* 新闻卡片区 */
.news-card {
  width: 320px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-radius: 4px;
  padding: 16px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 3px;
  margin-bottom: 12px;
}

.news-tab-item {
  flex: 1;
  text-align: center;
  padding: 6px 0;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  border-radius: 3px;
  font-weight: 500;
  transition: all 0.2s;
}

.news-tab-item.active {
  background: #0066ff;
  color: #ffffff;
  font-weight: 600;
}

.news-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height:375px;
}

.news-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
}

.news-item:hover .news-item-title {
  color: #0066ff;
}

.news-dot {
  color: #94a3b8;
  margin-right: 6px;
  font-size: 16px;
}

.news-item-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-item-date {
  color: #94a3b8;
  font-size: 12px;
  margin-left: 10px;
}

.news-more {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.news-more a {
  color: #64748b;
  font-size: 12px;
  text-decoration: none;
}

.news-more a:hover {
  color: #0066ff;
}

/* 快捷服务 */
.quick-services-section {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.quick-banner-title {
  background: #0066ff;
  color: #ffffff;
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1.3;
}

.quick-grid {
  flex:1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 16px 20px;
  gap: 16px;
  box-sizing: border-box;
  height: 100px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #f1f5f9;
}

.quick-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  background: #ffffff;
}

.quick-icon-wrapper {
  width: 40px;
  height: 40px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
}

.quick-info h4 {
  margin: 0 0 2px 0;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow-icon {
  font-size: 14px;
  color: #94a3b8;
}

.quick-info p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}
@media screen and (max-width: 768px) {
  .hero-section {
    flex-wrap: wrap !important;
  }
  .hero-box {
    height: auto !important;
    padding: 12px !important;
  }
  .banner-card {
    width: 100% !important;
    height: 200px !important;
    min-height: 200px !important;
  }
  .banner-swiper {
    height: 200px !important;
  }
  .news-card {
    width: 100% !important;
    box-sizing: border-box !important;
  }
  .quick-services-section {
    flex-wrap: wrap !important;
    flex-direction: column !important;
    height: auto !important;
  }
  .quick-banner-title {
    width: 100% !important;
    flex-direction: row !important;
    padding: 10px 0 !important;
  }
  .quick-banner-title span {
    margin: 0 4px;
  }
  .quick-grid {
    width: 100% !important;
    grid-template-columns: repeat(1, 1fr) !important;
    height: auto !important;
  }
  .vr-card{
    padding: 8px !important;
  }
  .vr-icon-box{
    margin-bottom: 0px;
  }
  .vr-text h3{
    margin:0px;
    font-size: 14px !important;
  }
}

</style>
