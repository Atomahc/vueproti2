<script setup lang="ts">
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'

// 二级 Tab 切换: 'personal' | 'enterprise_bs' | 'enterprise_fw'
const activeSubTab = ref<'personal' | 'enterprise_bs' | 'enterprise_fw'>('personal')

const router = useRouter()

// 1. 个人办事 数据
const personalCategories = ref<any[]>([])

// 2. 企业办事 数据
const enterpriseBsCategories = ref<any[]>([])

// Fallback colors for categories since API doesn't provide them
const defaultColors = ['#00c4cc', '#1890ff', '#2f54eb', '#52c41a', '#fa8c16', '#fa541c']
const defaultBgColors = ['#e6fcfc', '#e6f7ff', '#f0f5ff', '#f6ffed', '#fff7e6', '#fff2e8']

const fetchGovServices = async () => {
  try {
    const res: any = await http.get('/api-loca/ncmanagement/class/zones-tree', {
      zoneType: 'gov_service',
      platform: 'portal',
      userType: ''
    })
    
    if (res.code === 0 && res.data && res.data.gov_service) {
      const govServices = res.data.gov_service
      
      // 个人办事
      const personalData = govServices.find((item: any) => item.name === '个人办事' || item.name?.includes('个人'))
      if (personalData && personalData.children) {
        personalCategories.value = personalData.children.map((cat: any, index: number) => ({
          title: cat.name,
          color: defaultColors[index % defaultColors.length],
          bgColor: defaultBgColors[index % defaultBgColors.length],
          icon: cat.icon,
          items: (cat.children || []).map((item: any) => ({
            name: item.name,
            icon: item.bgImage,
            url: item.url
          }))
        }))
      }
      
      // 企业办事
      const enterpriseData = govServices.find((item: any) => item.name === '企业办事' || item.name?.includes('企业办'))
      if (enterpriseData && enterpriseData.children) {
        enterpriseBsCategories.value = enterpriseData.children.map((cat: any, index: number) => ({
          title: cat.name,
          color: defaultColors[index % defaultColors.length],
          bgColor: defaultBgColors[index % defaultBgColors.length],
          icon: cat.icon,
          items: (cat.children || []).map((item: any) => ({
            name: item.name,
            icon: item.bgImage,
            url: item.url
          }))
        }))
      }
    }
  } catch (error) {
    console.error('Failed to fetch gov services', error)
  }
}

onMounted(() => {
  fetchGovServices()
})

// 3. 企业服务 数据 (根据 2-3-政企服务.png)
const enterpriseArticles = [
  { title: '文章标题文章标题文章...', date: '07/03' },
  { title: '文章标题文章标题文章...', date: '07/03' }
]
</script>

<template>
  <div class="gov-page-container">
    <TheHeader />

    <main class="main-content">
      <!-- 提取出的蓝色半透明主导航栏组件 -->
      <TheNavBar activeId="gov" />

      <div class="content-box">
        <!-- 二级 Tab 切换菜单: 个人办事 | 企业办事 | 企业服务 -->
        <div class="sub-tab-bar">
          <div class="sub-tabs">
            <button
              :class="['sub-tab-btn', { active: activeSubTab === 'personal' }]"
              @click="activeSubTab = 'personal'"
            >
              个人办事
            </button>
            <button
              :class="['sub-tab-btn', { active: activeSubTab === 'enterprise_bs' }]"
              @click="activeSubTab = 'enterprise_bs'"
            >
              企业办事
            </button>
            <button
              :class="['sub-tab-btn', { active: activeSubTab === 'enterprise_fw' }]"
              @click="activeSubTab = 'enterprise_fw'"
            >
              企业服务
            </button>
          </div>
          <a href="#" class="more-link">更多 &gt;</a>
        </div>

        <!-- 页面视图 1: 个人办事 -->
        <div v-if="activeSubTab === 'personal'" class="grid-container border-grid">
          <div v-for="(cat, idx) in personalCategories" :key="idx" class="service-card">
            <div class="card-header" :style="{ backgroundColor: cat.bgColor, color: cat.color }">
              <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3>{{ cat.titleDisplay || cat.title }}</h3>
            </div>
            <div class="card-items">
              <div v-for="(item, i) in cat.items" :key="i" class="item-badge">
                <div class="icon-box" :style="{ backgroundColor: cat.color }">
                  <img v-if="item.icon && (item.icon.includes('/') || item.icon.includes('.'))" :src="item.icon.startsWith('http') ? item.icon : minioPrefix + item.icon" style="width: 40px; height: 40px; object-fit: contain;" />
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path :d="item.icon" />
                  </svg>
                </div>
                <span class="item-name">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 页面视图 2: 企业办事 -->
        <div v-else-if="activeSubTab === 'enterprise_bs'" class="grid-container border-grid">
          <div v-for="(cat, idx) in enterpriseBsCategories" :key="idx" class="service-card">
            <div class="card-header" :style="{ backgroundColor: cat.bgColor, color: cat.color }">
              <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9" />
              </svg>
              <h3>{{ cat.title }}</h3>
            </div>
            <div class="card-items">
              <div v-for="(item, i) in cat.items" :key="i" class="item-badge">
                <div class="icon-box" :style="{ backgroundColor: cat.color }">
                  <img v-if="item.icon && (item.icon.includes('/') || item.icon.includes('.'))" :src="item.icon.startsWith('http') ? item.icon : minioPrefix + item.icon" style="width: 40px; height: 40px; object-fit: contain; " />
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path :d="item.icon" />
                  </svg>
                </div>
                <span class="item-name">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 页面视图 3: 企业服务 -->
        <div v-else-if="activeSubTab === 'enterprise_fw'" class="enterprise-fw-container">
          <!-- 顶部两张大卡片 -->
          <div class="top-cards-row">
            <!-- 企业画像与政策匹配 -->
            <div class="big-card blue-tint">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square blue">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2>企业画像与政策匹配</h2>
                </div>
                <span class="arrow-right">
                  <svg data-v-dac29979="" t="1787197216878" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6569" width="200" height="200"><path data-v-dac29979="" d="M716.617 477.941L355.519 142.045c-14.661-13.091-37.097-12.05-50.488 2.341-13.389 14.392-12.811 36.845 1.306 50.527L639.633 504.95 305.797 828.643a36.097 36.097 0 0 0-9.874 34.718 36.098 36.098 0 0 0 25.137 25.907 36.093 36.093 0 0 0 35.004-8.81l361.099-350.122a36.056 36.056 0 0 0 10.981-26.294 36.052 36.052 0 0 0-11.527-26.063" fill="#333333" p-id="6570"></path></svg>
                </span>
              </div>
              <div class="match-banner">
                <div class="match-info">
                  <span>行业 <strong>跨境电商</strong></span>
                  <span class="gap">|</span>
                  <span>规模 <strong>中型</strong></span>
                </div>
                <a href="#" class="match-link">已匹配5项适配政策 &rarr;</a>
              </div>
            </div>

            <!-- 招商引资服务 -->
            <div class="big-card yellow-tint">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square yellow">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h2>招商引资服务</h2>
                </div>
                <span class="arrow-right"><svg data-v-dac29979="" t="1787197216878" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6569" width="200" height="200"><path data-v-dac29979="" d="M716.617 477.941L355.519 142.045c-14.661-13.091-37.097-12.05-50.488 2.341-13.389 14.392-12.811 36.845 1.306 50.527L639.633 504.95 305.797 828.643a36.097 36.097 0 0 0-9.874 34.718 36.098 36.098 0 0 0 25.137 25.907 36.093 36.093 0 0 0 35.004-8.81l361.099-350.122a36.056 36.056 0 0 0 10.981-26.294 36.052 36.052 0 0 0-11.527-26.063" fill="#333333" p-id="6570"></path></svg></span>
              </div>
              <div class="attract-tags">
                <span class="tag-item">重点产业</span>
                <span class="tag-item">招商项目库</span>
                <span class="tag-item">厂房/楼宇</span>
                <span class="tag-item">招商资讯</span>
              </div>
            </div>
          </div>

          <!-- 底部4列卡片 -->
          <div class="bottom-cards-row">
            <!-- 企业信用查询 -->
            <div class="fw-card border-blue">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square blue">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3>企业信用查询</h3>
                </div>
              </div>
              <p class="card-desc">接入信用中国（霍尔果斯），企业信用信息一站式查询</p>
              <div class="action-btn-row">
                <button class="outline-btn blue">立即跳转 &rarr;</button>
              </div>
            </div>

            <!-- 营商环境监测 -->
            <div class="fw-card border-blue">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square blue">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9" />
                    </svg>
                  </div>
                  <h3>营商环境监测</h3>
                </div>
              </div>
              <p class="card-desc">改革举措/成效数据/典型案例集中展示</p>
              <ul class="article-list">
                <li v-for="(item, i) in enterpriseArticles" :key="i">
                  <span class="art-title">{{ item.title }}</span>
                  <span class="art-date">{{ item.date }}</span>
                </li>
              </ul>
            </div>

            <!-- 企业供需对接 -->
            <div class="fw-card border-teal">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square teal">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3>企业供需对接</h3>
                </div>
              </div>
              <p class="card-desc">供需发布平台，产业链上下游资源互补与协作</p>
              <div class="action-btn-row">
                <button class="outline-btn teal" @click="router.push('/supply-demand')">立即跳转 &rarr;</button>
              </div>
            </div>

            <!-- 乐享霍尔果斯 -->
            <div class="fw-card border-orange">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square orange">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3>乐享霍尔果斯</h3>
                </div>
              </div>
              <p class="card-desc">商户收款流水/到账语音提醒/资金无感结算</p>
              <div class="placeholder-box"></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.gov-page-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #1e293b;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  background-color: transparent;
}

.main-content {
  position: relative;
  z-index: 5;
  max-width: 1280px;
  margin: 0 auto;
  padding: 120px 24px 40px 24px;
  width: 100%;
  box-sizing: border-box;
}

/* 顶部导航栏 */
.nav-bar {
  background: rgba(30, 64, 120, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  margin-top: 10px;
  overflow: hidden;
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

/* 内容卡片外壳 */
.content-box {
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 24px;
}

/* 二级 Tab */
.sub-tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 4px;
  margin-bottom: 24px;
}

.sub-tabs {
  display: flex;
  gap: 4px;
}

.sub-tab-btn {
  padding: 10px 32px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #475569;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.sub-tab-btn.active {
  background: #0066ff;
  color: #ffffff;
}

.more-link {
  color: #94a3b8;
  font-size: 14px;
  text-decoration: none;
  padding-right: 16px;
}

.more-link:hover {
  color: #0066ff;
}

/* 个人办事 & 企业办事 3列x2行 Grid 布局 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.service-card {
  border-radius: 6px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-weight: 700;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.header-icon {
  width: 20px;
  height: 20px;
}

.card-items {
  padding: 20px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
}

.item-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 76px;
  cursor: pointer;
}

.item-badge:hover .item-name {
  color: #0066ff;
}

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box svg {
  width: 22px;
  height: 22px;
}

.item-name {
  font-size: 12px;
  color: #334155;
  text-align: center;
  line-height: 1.3;
  word-break: break-all;
}

/* 企业服务 (2-3-政企服务) 特有样式 */
.enterprise-fw-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.top-cards-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.big-card {
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
}

.blue-tint {
  background: #e6f4ff;
  border: 1px solid #bae0ff;
}

.yellow-tint {
  background: #fefbe8;
  border: 1px solid #fef08a;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon-square {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon-square.blue { background: #0066ff; }
.card-icon-square.yellow { background: #d97706; }
.card-icon-square.teal { background: #0d9488; }
.card-icon-square.orange { background: #ea580c; }

.title-with-icon h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.title-with-icon h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.arrow-right {
  font-size: 18px;
  color: #64748b;
}
.arrow-right .icon{
  width: 16px;
  height: 16px ;
}
.match-banner {
  background: #ffffff;
  border-radius: 6px;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.match-info {
  font-size: 14px;
  color: #64748b;
}

.match-info strong {
  color: #0f172a;
}

.gap {
  margin: 0 12px;
  color: #cbd5e1;
}

.match-link {
  color: #0066ff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.attract-tags {
  display: flex;
  background: #ffffff;
  border-radius: 6px;
  padding: 12px 20px;
  justify-content: space-around;
  margin-top: 16px;
}

.tag-item {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
  cursor: pointer;
}

.tag-item:hover {
  color: #d97706;
}

/* 底部4列卡片 */
.bottom-cards-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.fw-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 220px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.border-blue { border: 1px solid #e0f2fe; }
.border-teal { border: 1px solid #ccfbf1; }
.border-orange { border: 1px solid #ffedd5; }

.card-desc {
  font-size: 13px;
  color: #64748b;
  margin: 12px 0 20px 0;
  line-height: 1.5;
}

.action-btn-row {
  margin-top: auto;
}

.outline-btn {
  background: transparent;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.outline-btn.blue {
  border: 1px solid #0066ff;
  color: #0066ff;
}

.outline-btn.teal {
  border: 1px solid #0d9488;
  color: #0d9488;
}

.article-list {
  list-style: none;
  padding: 0;
  margin: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-list li {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #475569;
}

.art-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
}

.art-date {
  color: #94a3b8;
}

.placeholder-box {
  width: 100%;
  height: 80px;
  background: #f8fafc;
  border-radius: 4px;
  margin-top: auto;
}
</style>

