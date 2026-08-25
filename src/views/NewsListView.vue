<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'

const router = useRouter()
const route = useRoute()

const activeCategory = ref((route.query.tab as string) || '')
const loading = ref(false)

// 所有新闻
const allNews = ref<any[]>([])

// 获取新闻列表
const fetchArticles = async () => {
  loading.value = true
  try {
    const params: any = {
      owner: 'hgsso'
    }
    if (activeCategory.value && activeCategory.value !== '全部') {
      params.categoryIds = activeCategory.value
    }
    const res: any = await http.get('/api-cas/api/get-articles', params)
    if (res.status === 'ok' && res.data) {
      allNews.value = res.data.map((item: any) => ({
        id: item.name, 
        title: item.displayName || item.title,
        date: item.publishTime ? item.publishTime.split('T')[0] : (item.createdTime ? item.createdTime.split('T')[0] : ''),
        originalData: item
      }))
    } else {
      allNews.value = []
    }
  } catch (error) {
    console.error('获取文章列表失败', error)
    allNews.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticles()
})

// 分页逻辑
const currentPage = ref(1)
const pageSize = 15 // 常规列表可以多展示一些

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return allNews.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(allNews.value.length / pageSize))

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 300, behavior: 'smooth' })
}

const goToDetail = (news: any) => {
  sessionStorage.setItem('currentArticle', JSON.stringify(news.originalData || news))
  router.push({
    name: 'article-detail',
    params: { id: news.id || '0' }
  })
}
</script>

<template>
  <div class="news-page-container">
    <TheHeader />
    
    <main class="main-content">
      <TheNavBar activeId="news" />

      <div class="hero-box">
        <!-- 页面标题 -->
        <div class="page-header">
          <h2 class="page-title">{{ activeCategory && activeCategory !== '全部' ? activeCategory : '新闻资讯' }}</h2>
        </div>

        <!-- 新闻常规列表 -->
        <section class="news-list-section">
          <div v-if="loading" class="loading-state">
            数据加载中...
          </div>
          <div v-else-if="paginatedNews.length > 0" class="news-list-container">
            <ul class="simple-news-list">
              <li 
                v-for="news in paginatedNews" 
                :key="news.id" 
                class="news-item"
                @click="goToDetail(news)"
              >
                <div class="news-item-left">
                  <span class="news-dot"></span>
                  <span class="news-title" :title="news.title">{{ news.title }}</span>
                </div>
                <span class="news-date">{{ news.date }}</span>
              </li>
            </ul>
          </div>
          <div v-else class="no-data">
            暂无相关内容
          </div>

          <!-- 分页器 -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              class="page-btn" 
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              上一页
            </button>
            
            <div class="page-numbers">
              <button 
                v-for="p in totalPages" 
                :key="p"
                :class="['page-num', { active: currentPage === p }]"
                @click="goToPage(p)"
                v-show="p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2"
              >
                {{ p }}
              </button>
            </div>

            <button 
              class="page-btn" 
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              下一页
            </button>
          </div>
        </section>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
/* 主体布局 */
.news-page-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  box-sizing: border-box;
}

.main-content {
  position: relative;
  z-index: 5;
  max-width: 1280px;
  margin: 0 auto;
  padding: 120px 24px 40px 24px;
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.hero-box {
  background: #ffffff;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

/* 页面标题 */
.page-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #0066ff;
  padding-bottom: 15px;
  display: inline-block;
}

.page-title {
  font-size: 22px;
  color: #0066ff;
  font-weight: 700;
  margin: 0;
}

/* 新闻列表区 */
.loading-state, .no-data {
  text-align: center;
  padding: 80px 0;
  color: #94a3b8;
  font-size: 16px;
}

.news-list-container {
  height: 350px;
}

.simple-news-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 10px;
  border-bottom: 1px dashed #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.news-item:hover {
  background-color: #f8fafc;
}

.news-item:hover .news-title {
  color: #0066ff;
}

.news-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  padding-right: 20px;
}

.news-dot {
  width: 4px;
  height: 4px;
  background-color: #94a3b8;
  border-radius: 50%;
  flex-shrink: 0;
}

.news-item:hover .news-dot {
  background-color: #0066ff;
}

.news-title {
  font-size: 16px;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.news-date {
  color: #94a3b8;
  font-size: 14px;
  flex-shrink: 0;
}

/* Pagination */
.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #64748b;
  font-size: 14px;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #0066ff;
  color: #0066ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-num {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #64748b;
  font-size: 14px;
  transition: all 0.2s;
}

.page-num:hover {
  border-color: #0066ff;
  color: #0066ff;
}

.page-num.active {
  background: #0066ff;
  border-color: #0066ff;
  color: white;
}
</style>
