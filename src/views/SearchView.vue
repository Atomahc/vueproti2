<script setup lang="ts">
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'

const route = useRoute()
const router = useRouter()

const keyword = ref(route.query.keyword || '')
const articles = ref<any[]>([])
const features = ref<any[]>([])

const fetchSearch = async () => {
  if (!keyword.value) {
    articles.value = []
    features.value = []
    return
  }
  try {
    const res: any = await http.get('/api-loca/portal/search', {
      keyword: keyword.value,
      platform: '',
      limit: 10,
      lang: 'zh'
    })
    if (res.code === 0 && res.data) {
      articles.value = res.data.articles || []
      features.value = res.data.features || []
    }
  } catch (error) {
    console.error('Search failed', error)
  }
}

onMounted(() => {
  fetchSearch()
})

watch(() => route.query.keyword, (newVal) => {
  keyword.value = newVal || ''
  fetchSearch()
})

const goToArticle = (item: any) => {
  // 模拟文章详情展示所需的数据结构
  const articleData = {
    title: item.title,
    date: item.publishTime,
    content: item.content || `<p style="text-align:center; color:#999; margin-top: 50px;">此文章暂无详细内容。</p>`
  }
  sessionStorage.setItem('currentArticle', JSON.stringify(articleData))
  router.push({
    name: 'article-detail',
    params: { id: item.id || '0' },
    query: { tab: '搜索结果' }
  })
}

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
  <div class="search-page-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="" />

      <div class="search-box-content">
        <div class="results-container">
          <h2>搜索结果：{{ keyword }}</h2>
          
          <div v-if="features.length > 0" class="features-section">
            <h3>相关服务</h3>
            <div class="quick-grid">
              <div v-for="(qs, idx) in features" :key="idx" class="quick-card" @click="handleQuickClick(qs.url, qs.linkType === 'url')">
                <div class="quick-icon-wrapper">
                   <img v-if="qs.icon" :src="qs.icon.startsWith('http') ? qs.icon : `${minioPrefix}${qs.icon}`" alt="icon" style="width: 40px; height: 40px; object-fit: contain;" />
                </div>
                <div class="quick-info">
                  <h4>{{ qs.name }} <span class="arrow-icon">›</span></h4>
                  <p v-if="qs.subtitle">{{ qs.subtitle }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="articles.length > 0" class="articles-section">
            <h3>相关文章</h3>
            <ul class="news-list">
              <li v-for="(item, index) in articles" :key="index" class="news-item" @click="goToArticle(item)">
                <span class="news-dot">•</span>
                <span class="news-item-title">{{ item.title }}</span>
                <span class="news-item-date">{{ item.publishTime }}</span>
              </li>
            </ul>
          </div>
          
          <div v-if="features.length === 0 && articles.length === 0 && keyword" class="no-results">
            暂无搜索结果
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.search-page-container {
  width: 100%;
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
  width: 1280px;
  margin: 0 auto;
  padding: 120px 0px 40px 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.search-box-content {
  padding: 30px;
  background-color: #ffffff;
  height:500px;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
}

.results-container h2 {
  font-size: 22px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
  color: #0f172a;
}

.features-section, .articles-section {
  margin-bottom: 30px;
}

.features-section h3, .articles-section h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #0066ff;
  border-left: 4px solid #0066ff;
  padding-left: 10px;
}

/* 快捷服务 */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
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
  width: 44px;
  height: 44px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
  background-color: #f1f5f9;
  border-radius: 6px;
}

.quick-info h4 {
  margin: 0 0 4px 0;
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

/* 新闻列表 */
.news-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #334155;
  cursor: pointer;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 6px;
  transition: all 0.2s;
  border: 1px solid #f1f5f9;
}

.news-item:hover {
  background: #ffffff;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.news-item:hover .news-item-title {
  color: #0066ff;
}

.news-dot {
  color: #0066ff;
  margin-right: 12px;
  font-size: 18px;
}

.news-item-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.news-item-date {
  color: #94a3b8;
  font-size: 13px;
  margin-left: 16px;
}

.no-results {
  text-align: center;
  color: #94a3b8;
  padding: 60px 0;
  font-size: 16px;
  background: #f8fafc;
  border-radius: 6px;
}
</style>
