<script setup lang="ts">
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/request'
import { getSupplyDemandList } from '@/api/supplyDemand'
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

      // 企业服务
      const enterpriseFw = govServices.find((item: any) => item.name === '企业服务')
      if (enterpriseFw && enterpriseFw.children) {
        const map: Record<string, any> = {}
        enterpriseFw.children.forEach((child: any) => {
          map[child.name] = child
        })
        enterpriseFwData.value = map
      }
    }
  } catch (error) {
    console.error('Failed to fetch gov services', error)
  }
}

const enterpriseArticles = ref<any[]>([])

const fetchEnterpriseArticles = async () => {
  try {
    const res: any = await http.get('/api-cas/api/get-articles', {
      owner: 'hgsso',
      categoryIds: '营商环境监测'
    })
    if (res.status === 'ok' && res.data) {
      enterpriseArticles.value = res.data.slice(0, 5).map((item: any) => ({
        id: item.name,
        title: item.displayName || item.title,
        date: item.publishTime ? item.publishTime.substring(5, 10).replace('-', '/') : '07/03',
        originalData: item
      }))
    }
  } catch (error) {
    console.error('Fetch enterprise articles failed', error)
  }
}

const policyMatchArticles = ref<any[]>([])

const fetchPolicyMatchArticles = async () => {
  try {
    const res: any = await http.get('/api-cas/api/get-articles', {
      owner: 'hgsso',
      categoryIds: '政策推送',
      recommend: true
    })
    if (res.status === 'ok' && res.data) {
      policyMatchArticles.value = res.data.slice(0, 3).map((item: any) => ({
        id: item.name,
        title: item.displayName || item.title,
        date: item.publishTime ? item.publishTime.substring(5, 10).replace('-', '/') : '07/03',
        originalData: item
      }))
    }
  } catch (error) {
    console.error('Fetch policy match articles failed', error)
  }
}

const enterpriseFwData = ref<Record<string, any>>({})

const creditSearchKeyword = ref('')
const handleCreditSearch = () => {
  window.open(`https://www.creditxj.gov.cn/qycx/interfaceqycx.do?qymc=${encodeURIComponent(creditSearchKeyword.value)}`, '_blank')
}

const qrModalVisible = ref(false)
const qrModalTitle = ref('')
const currentQrImage = ref('')

const introModalVisible = ref(false)

const handleTagClick = (tag: any) => {
  if (tag.linkType === 'qrcode' && tag.qrcode) {
    qrModalTitle.value = tag.name
    currentQrImage.value = tag.qrcode.startsWith('http') ? tag.qrcode : minioPrefix + tag.qrcode
    qrModalVisible.value = true
  } else if (tag.url) {
    handleLink(tag.url)
  }
}

const handleLink = (url?: string) => {
  if (!url) return
  if (url.startsWith('http')) {
    window.open(url, '_blank')
  } else {
    router.push(url)
  }
}

const goToArticleDetail = (item: any) => {
  if (item.originalData) {
    sessionStorage.setItem('currentArticle', JSON.stringify(item.originalData))
  }
  router.push('/article/' + item.id)
}

const supplyDemandList = ref<any[]>([])

const fetchSupplyDemand = async () => {
  try {
    const res: any = await getSupplyDemandList({ page: 1, limit: 3 })
    if (res.code === 0 && res.data) {
      supplyDemandList.value = res.data.list || []
    }
  } catch (error) {
    console.error('Fetch supply demand failed', error)
  }
}

onMounted(() => {
  fetchGovServices()
  fetchEnterpriseArticles()
  fetchPolicyMatchArticles()
  fetchSupplyDemand()
})
import BannerSideOverlay from '@/components/BannerSideOverlay.vue'
</script>

<template>
  <div class="gov-page-container">
    <TheHeader />

    <main class="main-content">
   
      <!-- 提取出的蓝色半透明主导航栏组件 -->
      <TheNavBar activeId="gov" />
      <BannerSideOverlay />
      <div style="display: flex; gap: 20px; flex: 1; height: 100%;">
        <div class="content-box" style="flex: 1; min-width: 0;">
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
              <div v-for="(item, i) in cat.items" :key="i" class="item-badge" @click="handleLink(item.url)">
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
              <div v-for="(item, i) in cat.items" :key="i" class="item-badge" @click="handleLink(item.url)">
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
              <!-- 政策匹配推荐 -->
            <div class="big-card blue-tint" @click="router.push({ path: '/news', query: { tab: '政策推送' } })" style="cursor: pointer;">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square blue">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2>{{ enterpriseFwData['政策匹配推荐']?.name || '政策匹配推荐' }}</h2>
                </div>
                <span class="view-more" @click.stop="router.push({ path: '/news', query: { tab: '政策推送' } })" style="font-size: 13px; color: #0066ff; cursor: pointer;">更多</span>
              </div>
              


              <ul class="article-list" style="margin-top: 16px; flex: 1;">
                <li v-for="(item, i) in policyMatchArticles" :key="i" @click.stop="goToArticleDetail(item)" style="cursor: pointer;">
                  <span class="art-title">{{ item.title }}</span>
                  <span class="art-date">{{ item.date }}</span>
                </li>
              </ul>

              <div class="match-banner" style="margin-top: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; padding: 10px 16px;">
                <div class="match-info">
                  <span>行业 <strong>跨境电商</strong></span>
                  <span class="gap">|</span>
                  <span>规模 <strong>中型</strong></span>
                </div>
                <a href="#" class="match-link" @click.stop>已匹配5项适配政策 &rarr;</a>
              </div>
            </div>

            <!-- 营商环境监测 -->
            <div class="big-card blue-tint">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square blue">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9" />
                    </svg>
                  </div>
                  <h2>{{ enterpriseFwData['营商环境监测']?.name || '营商环境监测' }}</h2>
                </div>
                <span class="view-more" @click="router.push({ path: '/news', query: { tab: '营商环境监测' } })" style="font-size: 13px; color: #0066ff; cursor: pointer;">更多
                </span>
              </div>
              <p class="card-desc">{{ enterpriseFwData['营商环境监测']?.remark || '改革举措/成效数据/典型案例集中展示' }}</p>
              <ul class="article-list">
                <li v-for="(item, i) in enterpriseArticles" :key="i" @click="goToArticleDetail(item)" style="cursor: pointer;">
                  <span class="art-title">{{ item.title }}</span>
                  <span class="art-date">{{ item.date }}</span>
                </li>
              </ul>
            </div>
          
            
          <!-- 企业供需对接 -->
            <div class="fw-card border-teal" style="cursor: pointer;" @click="router.push('/supply-demand')">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square teal">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3>{{ enterpriseFwData['企业供需对接']?.name || '企业供需对接' }}</h3>
                </div>
                <span class="view-more" @click.stop="router.push('/supply-demand')" style="font-size: 13px; color: #0d9488; cursor: pointer;">更多</span>
              </div>
              <p class="card-desc" style="margin-bottom: 12px;">{{ enterpriseFwData['企业供需对接']?.remark || '供需发布平台，产业链上下游资源互补与协作' }}</p>
              
              <ul class="supply-demand-list" style="list-style: none; padding: 0; margin: 0; flex: 1;">
                <li v-for="(item, i) in supplyDemandList" :key="i" style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: #334155; border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px;">
                  <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span :style="{ color: item.type === 'supply' ? '#10b981' : '#f59e0b', marginRight: '4px', fontWeight: 'bold' }">
                      [{{ item.type === 'supply' ? '供应' : '需求' }}]
                    </span>
                    {{ item.title }}
                  </span>
                  <span style="color: #94a3b8; font-size: 12px; margin-left: 10px;">{{ item.createTime ? item.createTime.substring(5, 10).replace('-', '/') : '' }}</span>
                </li>
              </ul>
            </div>

          
          </div>

    
          <div class="bottom-cards-row">
    <!-- 企业信用查询 -->
            <div class="fw-card border-blue" @click="handleCreditSearch" style="cursor: pointer;">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square blue">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3>{{ enterpriseFwData['企业信用查询']?.name || '企业信用查询' }}</h3>
                </div>
              </div>
              <p class="card-desc">{{ enterpriseFwData['企业信用查询']?.remark || '接入信用中国（霍尔果斯），企业信用信息一站式查询' }}</p>
              <div class="credit-search-group" @click.stop>
                <input v-model="creditSearchKeyword" type="text" placeholder="请输入 法人/企业名称/营业执照" class="credit-search-input-integrated" @keyup.enter="handleCreditSearch" />
                <button class="credit-search-btn" @click.stop="handleCreditSearch">立即搜索</button>
              </div>
            </div>
            <!-- 招商引资服务 -->
            <div class="fw-card border-orange2" @click="handleLink(enterpriseFwData['招商引资服务']?.url)" style="cursor: pointer;">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square yellow">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3>{{ enterpriseFwData['招商引资服务']?.name || '招商引资服务' }}</h3>
                </div>
                <span class="arrow-right"><svg data-v-dac29979="" t="1787197216878" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6569" width="200" height="200"><path data-v-dac29979="" d="M716.617 477.941L355.519 142.045c-14.661-13.091-37.097-12.05-50.488 2.341-13.389 14.392-12.811 36.845 1.306 50.527L639.633 504.95 305.797 828.643a36.097 36.097 0 0 0-9.874 34.718 36.098 36.098 0 0 0 25.137 25.907 36.093 36.093 0 0 0 35.004-8.81l361.099-350.122a36.056 36.056 0 0 0 10.981-26.294 36.052 36.052 0 0 0-11.527-26.063" fill="#333333" p-id="6570"></path></svg></span>
              </div>
              <div class="attract-tags">
                <template v-if="enterpriseFwData['招商引资服务']?.children?.length">
                  <div 
                    class="tag-item" 
                    v-for="tag in enterpriseFwData['招商引资服务'].children" 
                    :key="tag.id"
                    @click.stop="handleTagClick(tag)"
                  >
                    {{ tag.name }}
                  </div>
                </template>
              </div>
            </div>

            

            <!-- 乐享霍尔果斯 -->
            <div class="fw-card border-orange" @click="handleLink(enterpriseFwData['乐享霍尔果斯']?.url)" style="cursor: pointer;">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square orange">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3>{{ enterpriseFwData['乐享霍尔果斯']?.name || '乐享霍尔果斯' }}</h3>
                </div>
                <span class="view-more" @click.stop="introModalVisible = true" style="font-size: 13px; color: #ea580c; cursor: pointer; padding: 4px 10px; border: 1px solid #fdba74; border-radius: 20px; background-color: #fff7ed;">平台介绍</span>
              </div>
              <p class="card-desc">{{ enterpriseFwData['乐享霍尔果斯']?.remark || '商户收款流水/到账语音提醒/资金无感结算' }}</p>
              <div class="placeholder-box" style=" display: flex; flex-direction: column; justify-content: center; gap: 8px;">
                <div style="font-size: 13px; color: #9a3412; display: flex; align-items: center; gap: 6px;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  平台服务热线: 0999-8799992
                </div>
                <div style="font-size: 13px; color: #9a3412; display: flex; align-items: center; gap: 6px;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  地址: 霍尔果斯北京路人才大厦13层
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 平台介绍弹窗 -->
      <div v-if="introModalVisible" class="qr-modal-overlay" @click="introModalVisible = false">
        <div class="qr-modal-content" @click.stop style="max-width: 500px; padding: 24px;">
          <div class="qr-modal-header" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 18px; color: #0f172a;">乐享霍尔果斯平台介绍</h3>
            <button class="close-btn" @click="introModalVisible = false" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b;">&times;</button>
          </div>
          <div class="qr-modal-body" style="font-size: 14px; color: #334155; line-height: 1.6;">
            <p>“乐享霍尔果斯”平台是一个专为本地商户和企业提供的高效资金与数字化管理平台。</p>
            <p>主要功能包含：</p>
            <ul style="padding-left: 20px; margin-top: 8px;">
              <li><strong>商户收款流水：</strong>实时查看并导出交易流水，账单清晰明了。</li>
              <li><strong>到账语音提醒：</strong>支持多端同步的语音播报，防漏单、防错单。</li>
              <li><strong>资金无感结算：</strong>安全便捷的资金结算体系，加速资金周转。</li>
            </ul>
            <p style="margin-top: 12px; font-weight: 500; color: #ea580c;">更多精彩功能，敬请期待！</p>
          </div>
        </div>
      </div>

      <!-- 二维码弹窗 -->
      <div v-if="qrModalVisible" class="qr-modal-overlay" @click="qrModalVisible = false">
        <div class="qr-modal-content" @click.stop>
          <div class="qr-modal-header">
            <h3>{{ qrModalTitle }}</h3>
            <button class="close-btn" @click="qrModalVisible = false">&times;</button>
          </div>
          <div class="qr-modal-body">
            <img :src="currentQrImage" alt="二维码" />
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
  height: 850px;
  position: relative;
  z-index: 5;
  width: 1280px;
  margin: 0 auto;
  padding: 120px 0px 40px 0px;
  box-sizing: border-box;
}

/* 顶部导航栏 */
.nav-bar {
  background: rgba(30, 64, 120, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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
  height:600px
}

/* 二级 Tab */
.sub-tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 4px;
  margin-bottom: 14px;
}

.sub-tabs {
  display: flex;
  gap: 4px;
}

/* 信用查询搜索框样式 */
.credit-search-group {
  display: flex;
  align-items: center;
  margin-top: auto;
  width: 100%;
}

.credit-search-input-integrated {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #0066ff;
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 13px;
  outline: none;
  color: #333;
  width:150px;
  transition: all 0.2s;
}

.credit-search-input-integrated:focus {
  background: #f4f9ff;
}

.credit-search-btn {
  background: #0066ff;
  color: #fff;
  border: 1px solid #0066ff;
  padding: 10px 16px;
  border-radius: 0 4px 4px 0;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.credit-search-btn:hover {
  background: #005ce6;
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
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.big-card {
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 270px;
  transition: all 0.3s ease;
}

.big-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
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

  background: #ffffff89;
  border-radius: 6px;
  padding: 12px 20px;
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 0px 10px;
}

.tag-item {
  width:45%;
  font-size: 14px;
  color: #334155;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  margin-bottom: 10px;
  background: #f9f9f9;
  padding: 5px;
}

.tag-item:hover {
  color: #d97706;
}

/* 底部4列卡片 */
.bottom-cards-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.fw-card {
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 150px;
  height: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.fw-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.border-blue { 
  border: 1px solid #e0f2fe; 
  background:url('@/assets/other/qyxy.jpg') no-repeat;
  background-size: 100%;
}
.border-teal { 
  height:270px;
  padding:24px;
  border: 1px solid #ccfbf1; 
  background: linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%);
}
.border-orange { 
  border: 1px solid #ffedd5; 
  background:url('@/assets/other/ggs.jpg') no-repeat;
  background-size: 100%;
  /* background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%); */
}
.border-orange2 { 
  border: 1px solid #ffedd5; 
  background:url('@/assets/other/zsyz.jpg') no-repeat;
  background-size: 100%;
  /* background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%); */
}
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
  transition: all 0.3s ease;
}

.outline-btn.blue {
  border: 1px solid #0066ff;
  color: #0066ff;
}

.outline-btn.blue:hover {
  background: #0066ff;
  color: #ffffff;
}

.outline-btn.teal {
  border: 1px solid #0d9488;
  color: #0d9488;
}

.outline-btn.teal:hover {
  background: #0d9488;
  color: #ffffff;
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
  transition: color 0.2s;
}

.article-list li:hover {
  color: #0066ff;
}

.view-more:hover {
  text-decoration: underline;
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
  border-radius: 4px;
  margin-top: auto;
}

/* 二维码弹窗样式 */
.qr-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.qr-modal-content {
  background: #fff;
  border-radius: 8px;
  width: 320px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.qr-modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qr-modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.close-btn:hover {
  color: #0f172a;
}

.qr-modal-body {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-modal-body img {
  width: 200px;
  height: 200px;
  object-fit: contain;
  background: #f8fafc;
  border-radius: 4px;
}
@media screen and (max-width: 768px) {
  .top-cards-row,
  .bottom-cards-row {
    grid-template-columns: 1fr !important;
  }
  .grid-container {
    grid-template-columns: 1fr !important;
  }
  .big-card {
    height: auto !important;
    min-height: 200px;
    box-sizing: border-box;
  }
  .fw-card{
    box-sizing: border-box;
    height:auto !important;
  }
  .sub-tab-bar {
    flex-wrap: wrap;
    gap: 10px;
  }
  .sub-tabs {
    flex-wrap: wrap;
  }
  .credit-search-group {
    width: 100% !important;
  }
  .match-banner {
    flex-direction: column;
    text-align: left !important;
    height: auto !important;
    padding: 16px !important;
    align-items: flex-start !important;
  }
  .match-left, .match-center, .match-right {
    width: 100% !important;
    justify-content: left !important;
    margin: 8px 0 !important;
  }
  .sub-tab-btn{
    padding: 8px 26px !important;
    font-size: 14px !important;
  }
}

</style>

