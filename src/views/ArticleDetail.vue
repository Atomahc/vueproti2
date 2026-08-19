<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'

const route = useRoute()
const router = useRouter()
const isInternal = ref(false)

// 模拟的后端数据源
const displayNewsItems: Record<string, { title: string; date: string; content: string }[]> = {
  政务动态: [
    { 
      title: '霍尔果斯市召开政务公开工作推进会', 
      date: '2026-06-01',
      content: '<p>为了进一步提升政务公开水平，打造阳光透明的政府形象，今日我市隆重召开了政务公开工作推进会。会议强调了利用数字门户统一分发政务信息的重要性...</p><p>各级部门要切实抓好“一网通办”、“一网统管”工作的深化落实，确保广大市民与企业能够及时、准确地获取相关信息，实现数据多跑路，群众少跑腿。</p>'
    },
    { title: '市委领导调研重点项目建设情况', date: '2026-05-28', content: '<p>市委主要领导带队深入一线重点项目工地，实地察看了工程进度、质量控制及安全生产等情况...</p>' },
    { title: '我市多措并举优化营商环境', date: '2026-05-25', content: '<p>为吸引更多优质企业落户，我市出台了一系列优化营商环境的硬核措施...</p>' },
    { title: '政务服务中心推出“午间不打烊”服务', date: '2026-05-22', content: '<p>为了方便上班族办理业务，政务大厅自本周起实行“午间不打烊”制度，确保全天候服务...</p>' },
    { title: '市财政局加强预算管理提高资金使用效益', date: '2026-05-20', content: '<p>市财政局召开专门会议，部署下一步预算资金的分配与审计监管工作...</p>' },
  ],
  公示公告: [
    { title: '关于拟表彰全市先进集体和先进个人的公示', date: '2026-06-05', content: '<p>根据相关评选规定，现将拟表彰的先进集体和先进个人名单予以公示，公示期为5个工作日...</p>' },
    { title: '2026年市直事业单位招聘工作人员公告', date: '2026-06-02', content: '<p>为满足市直属事业单位用人需求，现面向社会公开招聘优秀人才...</p>' },
    { title: '关于部分道路实行临时交通管制的公告', date: '2026-05-30', content: '<p>因城市管网升级改造施工，自明日起将对人民路北段实行部分封闭的临时交通管制...</p>' },
    { title: '市自然资源局国有建设用地使用权出让公告', date: '2026-05-27', content: '<p>经批准，市自然资源局决定以挂牌方式出让三宗国有建设用地使用权...</p>' },
    { title: '关于开展全民健身活动的通知', date: '2026-05-24', content: '<p>为倡导健康生活方式，我市将于下月初在市体育馆举办全民健身启动仪式...</p>' },
  ],
}

const articleData = ref<{ title: string; date: string; content: string } | null>(null)

// 根据路由参数加载文章数据
const fetchArticle = () => {
  const id = parseInt(route.params.id as string)
  const tab = (route.query.tab as string) || '政务动态'
  
  if (displayNewsItems[tab] && displayNewsItems[tab][id]) {
    articleData.value = displayNewsItems[tab][id]
  } else {
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
      <!-- 面包屑导航 -->
      <nav class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span class="separator">/</span>
        <span class="current">{{ route.query.tab || '资讯' }}</span>
        <span class="separator">/</span>
        <span class="current-title">正文</span>
      </nav>

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
          <div class="cover-image">
            <img src="../assets/img/1178770891944486913.jpg" alt="文章配图" />
          </div>
          
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
  background-color: #f8fafc;
}

.article-main {
  flex: 1;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

/* 面包屑导航 */
.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 30px;
}

.breadcrumb a {
  color: #0084ff;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb .separator {
  margin: 0 10px;
  color: #cbd5e1;
}

.breadcrumb .current {
  color: #475569;
}

.breadcrumb .current-title {
  color: #94a3b8;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 文章容器 */
.article-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  padding: 60px;
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
