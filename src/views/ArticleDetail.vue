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
  // 1. 优先从 sessionStorage 读取，实现直接渲染，避免白屏等待
  const cached = sessionStorage.getItem('currentArticle')
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      articleData.value = {
        title: parsed.title || parsed.displayName,
        date: parsed.fullDate || parsed.date || parsed.publishTime || '未知',
        content: parsed.content || '<p style="text-align:center; color:#999; margin-top: 50px;">此文章暂无内容。</p>'
      }
    } catch (e) {
      console.error('解析缓存文章数据失败', e)
    }
  }

  const nameId = route.params.id as string
  if (!nameId) return

  // 2. 根据 id 使用新接口获取完整最新渲染数据
  try {
    const json = await http.get(`/api-loca/portal/article/${nameId}`)
    if (json.code === 0 && json.data) {
      const data = json.data
      let dateStr = data.publishTime || 'N/A'
      // 日期格式化，保留 "2026-07-23" 部分
      if (dateStr.includes(' ')) {
        dateStr = dateStr.split(' ')[0]
      }
      articleData.value = {
        title: data.title,
        date: dateStr,
        content: data.content || '<p style="text-align:center; color:#999; margin-top: 50px;">此文章暂无内容。</p>'
      }
      return // 新接口获取成功，直接返回，不再执行旧接口逻辑
    }
  } catch (error) {
    console.warn('请求新接口 http://192.168.2.11:8080/portal/article 失败或跨域，尝试原有接口', error)
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
  padding: 120px 0px 80px;
}

.article-container {
  background: #ffffff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  padding: 24px 60px;
  height:600px;
  overflow: auto;
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
  display: block;
  margin: 20px auto;
}

.content-html :deep(video) {
  width: 100%;
  border-radius: 8px;
  display: block;
  margin: 20px auto;
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
    height:100%;
    box-sizing: border-box;
  }
  .article-page{
    display: block;
    height: 100vh;
  }
  .article-header .title {
    font-size: 24px;
  }
  .article-main{
    padding-top: 0px;
    height:calc(100vh - 70px);
    padding-bottom:0px;
    background-color: #ffffff;
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
