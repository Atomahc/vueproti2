<script setup lang="ts">
import { ref, computed } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'

// 分类数据
const categories = ['全部新闻', '政务动态', '经济发展', '社会民生', '文化旅游', '通知公告']
const activeCategory = ref('全部新闻')

// 置顶/精选新闻
const featuredNews = [
  {
    id: 101,
    title: '霍尔果斯市全力打造丝绸之路经济带核心区重要支点',
    desc: '近年来，霍尔果斯市紧紧围绕“丝路支点、数联亚欧、口岸新城、智慧枢纽”的发展定位，不断提升对外开放水平。',
    image: 'https://picsum.photos/800/450?random=1',
    date: '2026-05-12'
  },
  {
    id: 102,
    title: '重大项目集中开工，助力口岸经济高质量发展',
    desc: '本次集中开工项目涵盖了基础设施、产业发展、民生改善等多个领域，总投资额超过百亿元。',
    image: 'https://picsum.photos/800/450?random=2',
    date: '2026-05-10'
  }
]

// 普通新闻列表数据 (假数据)
const allNews = ref(Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `霍尔果斯市第${i + 1}次新闻发布会成功举行，重点关注${['民生', '经济', '旅游', '建设'][i % 4]}领域`,
  desc: '这是新闻的简短描述文字，用于展示在列表页中，让用户快速了解新闻的核心内容。文字通常控制在两行以内。',
  category: categories[1 + (i % (categories.length - 1))],
  date: `2026-05-${(30 - (i % 30)).toString().padStart(2, '0')}`,
  image: `https://picsum.photos/300/200?random=${i + 10}`
})))

// 分页逻辑
const currentPage = ref(1)
const pageSize = 8

const filteredNews = computed(() => {
  if (activeCategory.value === '全部新闻') return allNews.value
  return allNews.value.filter(news => news.category === activeCategory.value)
})

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredNews.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredNews.value.length / pageSize))

const handleCategoryChange = (cat: string) => {
  activeCategory.value = cat
  currentPage.value = 1
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 600, behavior: 'smooth' })
}
</script>

<template>
  <div class="news-list-view">
    <TheHeader />
    
    <main class="container">
      <!-- 置顶新闻区域 -->
      <section class="featured-section">
        <div class="featured-grid">
          <div 
            v-for="news in featuredNews" 
            :key="news.id" 
            class="featured-item"
            @click="$router.push(`/article/${news.id}`)"
          >
            <img :src="news.image" :alt="news.title">
            <div class="featured-overlay">
              <span class="tag">推荐</span>
              <h2 class="featured-title">{{ news.title }}</h2>
              <p class="featured-desc">{{ news.desc }}</p>
              <span class="featured-date">{{ news.date }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 分类切换器 -->
      <section class="category-tabs">
        <div 
          v-for="cat in categories" 
          :key="cat"
          :class="['tab-item', { active: activeCategory === cat }]"
          @click="handleCategoryChange(cat)"
        >
          {{ cat }}
        </div>
      </section>

      <!-- 新闻列表 -->
      <section class="news-list-section">
        <div v-if="paginatedNews.length > 0" class="news-list">
          <div 
            v-for="news in paginatedNews" 
            :key="news.id" 
            class="news-card"
            @click="$router.push(`/article/${news.id}`)"
          >
            <div class="news-image">
              <img :src="news.image" :alt="news.title">
              <span class="news-category">{{ news.category }}</span>
            </div>
            <div class="news-info">
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-desc">{{ news.desc }}</p>
              <div class="news-meta">
                <span class="news-date">{{ news.date }}</span>
                <span class="read-more">查看详情 ></span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          暂无相关新闻
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
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.news-list-view {
  background-color: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0;
}

/* Featured Section */
.featured-section {
  margin-bottom: 50px;
}

.featured-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.featured-item {
  position: relative;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.featured-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.featured-item:hover img {
  transform: scale(1.05);
}

.featured-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
}

.tag {
  background: #ff4757;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 15px;
  display: inline-block;
}

.featured-title {
  font-size: 24px;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.featured-desc {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-date {
  font-size: 12px;
  opacity: 0.6;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 40px;
  background: white;
  padding: 10px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.tab-item {
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  color: #64748b;
  font-weight: 500;
  transition: all 0.3s;
}

.tab-item:hover {
  color: #0084ff;
}

.tab-item.active {
  background: #0084ff;
  color: white;
  box-shadow: 0 4px 10px rgba(0,132,255,0.3);
}

/* News List */
.news-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.news-card {
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  transition: all 0.3s;
  cursor: pointer;
  height: 200px;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.news-image {
  width: 260px;
  position: relative;
  flex-shrink: 0;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-category {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(255, 255, 255, 0.9);
  color: #0084ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}

.news-info {
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 18px;
  color: #1e293b;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.news-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.news-date {
  color: #94a3b8;
}

.read-more {
  color: #0084ff;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 100px 0;
  color: #94a3b8;
  font-size: 18px;
}

/* Pagination */
.pagination {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.page-btn {
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #0084ff;
  color: #0084ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-num {
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s;
}

.page-num:hover {
  border-color: #0084ff;
  color: #0084ff;
}

.page-num.active {
  background: #0084ff;
  border-color: #0084ff;
  color: white;
  box-shadow: 0 4px 10px rgba(0,132,255,0.2);
}
</style>
