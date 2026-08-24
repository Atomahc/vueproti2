<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'

const route = useRoute()
const router = useRouter()
const isInternal = ref(false)

const articleData = ref<{ title: string; date: string; content: string } | null>(null)

// 根据路由参数加载文章数据
const fetchArticle = async () => {
  const nameId = route.params.id as string
  const fullId = nameId.includes('/') ? nameId : `hgsso/${nameId}`
  
  try {
    const res: any = await http.get('/api-cas/api/get-article', { id: fullId })
    if (res.status === 'ok' && res.data) {
      const data = res.data
      const dateObj = new Date(data.publishTime || data.createdTime)
      const dateStr = dateObj.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
      
      articleData.value = {
        title: data.displayName || data.title,
        date: dateStr,
        content: data.content || '<p style="text-align:center; color:#999; margin-top: 50px;">此文章暂无内容。</p>'
      }
    } else {
      throw new Error('未找到内容')
    }
  } catch (error) {
    console.error('Failed to fetch article', error)
    articleData.value = {
      title: '文章未找到或已删除',
      date: 'N/A',
      content: '<p style="text-align:center; color:#999; margin-top: 50px;">抱歉，未能找到您请求的文章内容。</p>'
    }
  }
}

onMounted(() => {
  fetchArticle()
  window.scrollTo(0, 0)
})

watch(() => route.params.id, () => {
  fetchArticle()
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="article-page">
    <TheHeader :isInternal="isInternal" @toggleInternal="isInternal = !isInternal" />

    <main class="article-main" v-if="articleData">
      <TheNavBar activeId="" />

      <article class="article-container">
        <header class="article-header">
          <h1 class="title">{{ articleData.title }}</h1>
          <div class="meta-info">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              发布时间：{{ articleData.date }}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              来源：霍尔果斯发布
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              阅读：1,204
            </span>
          </div>
        </header>

        <div class="article-body">
 
          <div class="content-html" v-html="articleData.content"></div>
        </div>

        <footer class="article-footer">
          <div class="share-actions">
            <span>分享至：</span>
            <button class="share-btn wechat" title="分享到微信">微信</button>
            <button class="share-btn weibo" title="分享到微博">微博</button>
          </div>
          <div class="nav-links">
            <button class="nav-btn" @click="router.back()">返回上一页</button>
          </div>
        </footer>
      </article>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.article-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}

.article-main {
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 150px 20px 80px;
}

.article-container {
  background: #ffffff;
  border-radius: 16px;
  
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  padding: 60px;
  height:500px;
  overflow: auto;
  margin-top: 20px;
}

/* 文章头部 */
.article-header {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 30px;
  margin-bottom: 40px;
  text-align: center;
}

.article-header .title {
  font-size: 32px;
  color: #0f172a;
  line-height: 1.4;
  margin: 0 0 20px 0;
  font-weight: 700;
}

.meta-info {
  display: flex;
  justify-content: center;
  gap: 30px;
  color: #64748b;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 文章正文 */
.article-body {
  font-size: 17px;
  color: #334155;
  line-height: 1.8;
}

.cover-image {
  margin: 0 -60px 40px;
  height: 400px;
  overflow: hidden;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.cover-image:hover img {
  transform: scale(1.02);
}

.content-html {
  text-align: justify;
}

.content-html :deep(p) {
  margin-bottom: 24px;
}

.content-html :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 20px 0;
}

/* 文章尾部 */
.article-footer {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.share-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  font-size: 14px;
}

.share-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.share-btn.wechat {
  background-color: #10b981;
}

.share-btn.wechat:hover {
  background-color: #059669;
}

.share-btn.weibo {
  background-color: #ef4444;
}

.share-btn.weibo:hover {
  background-color: #dc2626;
}

.nav-btn {
  background-color: #f1f5f9;
  color: #475569;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-btn:hover {
  background-color: #e2e8f0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .article-container {
    padding: 30px 20px;
  }
  
  .article-header .title {
    font-size: 24px;
  }
  
  .meta-info {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  
  .cover-image {
    margin: 0 -20px 30px;
    height: 250px;
  }
  
  .article-footer {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
