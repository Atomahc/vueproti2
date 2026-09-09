<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'

const route = useRoute()
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX
const activeTab = ref('zhongya') // 'zhongya' | 'laodao' | 'serviceOrder'

const jobList = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const activeJobId = ref<number | null>(null)
const jobDetail = ref<any>(null)
const modalVisible = ref(false)

const laodaoInfo = ref<any>({})
const zhongyaInfo = ref<any>({})

const fetchConvenience = async () => {
  try {
    const res: any = await http.get('/prod-api/ncmanagement/class/zones-tree', {
      zoneType: 'convenience',
      platform: 'portal',
      userType: ''
    })
    if (res.code === 0 && res.data && res.data.convenience) {
      const list = res.data.convenience
      const ld = list.find((item: any) => item.name === '劳道智工')
      if (ld) laodaoInfo.value = ld
      const zy = list.find((item: any) => item.name?.includes('中亚职通桥'))
      if (zy) zhongyaInfo.value = zy
    }
  } catch(e) {
    console.error('Failed to fetch convenience services', e)
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    if (activeTab.value === 'zhongya') {
      const res: any = await http.get('/prod-api/portal/recruitment/page', {
        page: currentPage.value,
        limit: pageSize.value
      })
      if (res.code === 0 || String(res.code) === '0') {
        jobList.value = res.data.list || []
        total.value = res.data.total || 0
      }
    } else if (activeTab.value === 'laodao') {
      const res: any = await http.get('/prod-api/portal/job/page', {
        page: currentPage.value,
        limit: pageSize.value
      })
      if (res.code === 0 || String(res.code) === '0') {
        jobList.value = res.data.list || []
        total.value = res.data.total || 0
      }
    } else if (activeTab.value === 'serviceOrder') {
      const res: any = await http.get('/prod-api/portal/service-order/page', {
        page: currentPage.value,
        limit: pageSize.value
      })
      if (res.code === 0 || String(res.code) === '0') {
        jobList.value = res.data.list || []
        total.value = res.data.total || 0
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const openJobDetail = async (id: number) => {
  activeJobId.value = id
  modalVisible.value = true
  jobDetail.value = null
  try {
    if (activeTab.value === 'zhongya') {
      const res: any = await http.get(`/prod-api/portal/recruitment/${id}`)
      if (res.code === 0 || String(res.code) === '0') {
        jobDetail.value = res.data
      }
    } else if (activeTab.value === 'laodao') {
      const res: any = await http.get(`/prod-api/portal/job/${id}`)
      if (res.code === 0 || String(res.code) === '0') {
        jobDetail.value = res.data
      }
    } else if (activeTab.value === 'serviceOrder') {
      const res: any = await http.get(`/prod-api/portal/service-order/${id}`)
      if (res.code === 0 || String(res.code) === '0') {
        jobDetail.value = res.data
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const closeModal = () => {
  modalVisible.value = false
  jobDetail.value = null
  activeJobId.value = null
}

const handleTabSwitch = (tab: string) => {
  activeTab.value = tab
  currentPage.value = 1
  fetchList()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchList()
  }
}

const nextPage = () => {
  if (currentPage.value * pageSize.value < total.value) {
    currentPage.value++
    fetchList()
  }
}

onMounted(() => {
  if (route.query.tab === 'laodao' || route.query.tab === 'zhongya' || route.query.tab === 'serviceOrder') {
    activeTab.value = route.query.tab as string
  }
  fetchConvenience()
  fetchList()
})

watch(() => route.query.tab, (newTab) => {
  if (newTab === 'laodao' || newTab === 'zhongya' || newTab === 'serviceOrder') {
    activeTab.value = newTab as string
    currentPage.value = 1
    fetchList()
  }
})

// Utilities
const formatSalary = (job: any) => {
  if (activeTab.value === 'zhongya') {
    if (job.salaryShow) return job.salaryShow
    if (job.minSalary != null && job.maxSalary != null) {
      return `${job.minSalary}-${job.maxSalary}`
    }
    return '面议'
  } else if (activeTab.value === 'laodao') {
    if (job.salaryShow) return job.salaryShow
    if (job.salaryMin != null && job.salaryMax != null) {
      return `${job.salaryMin}-${job.salaryMax}K`
    }
    return '面议'
  } else if (activeTab.value === 'serviceOrder') {
    return job.expectIncomeShow || job.priceShow || '面议'
  }
}

const getJobTitle = (job: any) => {
  if (activeTab.value === 'zhongya') return job.title
  if (activeTab.value === 'laodao') return job.positionName
  if (activeTab.value === 'serviceOrder') return job.serviceName
}
const getCompanyName = (job: any) => {
  if (activeTab.value === 'zhongya') return job.companyName || '未知企业'
  if (activeTab.value === 'laodao') return job.memberName || '未知商户'
  if (activeTab.value === 'serviceOrder') return '限时订单'
}

const getJobTags = (job: any) => {
  const tags: string[] = []
  if (activeTab.value === 'zhongya') {
    if (job.city) tags.push(job.city)
    if (job.workLocation) tags.push(job.workLocation)
    if (job.experienceLabel) tags.push(job.experienceLabel)
    if (job.educationLabel) tags.push(job.educationLabel)
    if (job.workTypeLabel) tags.push(job.workTypeLabel)
    if (job.recruitsNumShow || job.recruitsNum != null) tags.push(job.recruitsNumShow || `招${job.recruitsNum}人`)
  } else if (activeTab.value === 'laodao') {
    if (job.districtName || job.city) tags.push(job.districtName || job.city)
    if (job.experienceLabel) tags.push(job.experienceLabel)
    if (job.educationLabel) tags.push(job.educationLabel)
    if (job.jobTypeLabel) tags.push(job.jobTypeLabel)
    if (job.welfareBenefits && job.welfareBenefits.length) {
      tags.push(...job.welfareBenefits)
    }
    if (job.jobKeywords) {
      tags.push(...job.jobKeywords.split(',').filter(Boolean))
    }
  } else if (activeTab.value === 'serviceOrder') {
    if (job.dateShow) tags.push(job.dateShow)
    if (job.timeShow) tags.push(job.timeShow)
    if (job.hoursShow) tags.push(job.hoursShow)
    if (job.statusLabel) tags.push(job.statusLabel)
  }
  return tags.slice(0, 5)
}
import BannerSideOverlay from '@/components/BannerSideOverlay.vue'
</script>

<template>
  <div class="job-list-page">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="life" />
      <BannerSideOverlay />
      <div class="job-container">
        <!-- Tabs -->
        <div class="tabs-header">
          <button 
            :class="['tab-btn', { active: activeTab === 'zhongya' }]"
            @click="handleTabSwitch('zhongya')"
          >
            中亚职通桥
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'laodao' }]"
            @click="handleTabSwitch('laodao')"
          >
            劳道智工
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'serviceOrder' }]"
            @click="handleTabSwitch('serviceOrder')"
          >
            劳道智工-限时订单
          </button>
        </div>

        <!-- List -->
        <div class="job-list" v-if="!loading">
          <div v-for="job in jobList" :key="job.id || job.jobId || job.ssoId" class="job-card" @click="openJobDetail(job.id || job.jobId || job.ssoId)">
            <div class="job-main">
              <h3 class="job-title">{{ getJobTitle(job) }}</h3>
              <span class="job-salary">{{ formatSalary(job) }}</span>
            </div>
            <div class="job-tags">
              <span class="tag" v-for="(tag, tIdx) in getJobTags(job)" :key="tIdx">{{ tag }}</span>
            </div>
            <div class="job-footer">
              <span class="company-name">
                 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: text-bottom; margin-right: 4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                 {{ job.workAddress  || job.workLocation || '地址不详' }}
              </span>
              <span class="publish-time" v-if="job.createDate || job.publishTimeStr || job.dateShow">{{ (job.createDate || job.publishTimeStr || job.dateShow).split(' ')[0] }}</span>
            </div>
          </div>
          
          <div v-if="jobList.length === 0" class="empty-state">
            暂无职位数据
          </div>
        </div>
        <div v-else class="loading-state">
          加载中...
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="total > 0 && !loading">
          <button :disabled="currentPage === 1" @click="prevPage">上一页</button>
          <span>{{ currentPage }} / {{ Math.ceil(total / pageSize) }}</span>
          <button :disabled="currentPage * pageSize >= total" @click="nextPage">下一页</button>
        </div>
      </div>
    </main>

    <!-- Detail Modal -->
    <div class="modal-overlay" v-if="modalVisible" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeModal">×</button>
        <div v-if="jobDetail" class="job-detail">
          <h2 class="detail-title">{{ getJobTitle(jobDetail) }}</h2>
          <div class="detail-salary">{{ formatSalary(jobDetail) }}</div>
          
          <div class="detail-section" v-if="activeTab !== 'serviceOrder'">
            <h3>职位描述</h3>
            <div class="detail-html" v-html="jobDetail.content || jobDetail.positionDescription || '暂无描述'"></div>
          </div>
          
          <div class="detail-section" v-if="activeTab === 'zhongya'">
            <h3>职位基本信息</h3>
            <p>
              <span v-if="jobDetail.city" style="margin-right: 15px;"><strong>城市:</strong> {{ jobDetail.city }}</span>
              <span v-if="jobDetail.workLocation" style="margin-right: 15px;"><strong>工作地点:</strong> {{ jobDetail.workLocation }}</span>
              <span v-if="jobDetail.experienceLabel" style="margin-right: 15px;"><strong>经验要求:</strong> {{ jobDetail.experienceLabel }}</span>
              <span v-if="jobDetail.educationLabel" style="margin-right: 15px;"><strong>学历要求:</strong> {{ jobDetail.educationLabel }}</span>
              <span v-if="jobDetail.workTypeLabel" style="margin-right: 15px;"><strong>工作类型:</strong> {{ jobDetail.workTypeLabel }}</span>
              <span v-if="jobDetail.recruitsNumShow || jobDetail.recruitsNum != null" style="margin-right: 15px;"><strong>招聘人数:</strong> {{ jobDetail.recruitsNumShow || jobDetail.recruitsNum }}</span>
            </p>
          </div>
          <div class="detail-section" v-if="activeTab === 'zhongya' && jobDetail.benefits">
            <h3>福利待遇</h3>
            <p>{{ jobDetail.benefits }}</p>
          </div>
          <div class="detail-section" v-if="activeTab === 'zhongya' && jobDetail.skills">
            <h3>技能要求</h3>
            <p>{{ jobDetail.skills }}</p>
          </div>
          <div class="detail-section" v-if="activeTab === 'laodao'">
            <h3>职位基本信息</h3>
            <p>
              <span v-if="jobDetail.districtName || jobDetail.city" style="margin-right: 15px;"><strong>区域:</strong> {{ jobDetail.districtName || jobDetail.city }}</span>
              <span v-if="jobDetail.experienceLabel" style="margin-right: 15px;"><strong>经验要求:</strong> {{ jobDetail.experienceLabel }}</span>
              <span v-if="jobDetail.educationLabel" style="margin-right: 15px;"><strong>学历要求:</strong> {{ jobDetail.educationLabel }}</span>
              <span v-if="jobDetail.jobTypeLabel" style="margin-right: 15px;"><strong>工作类型:</strong> {{ jobDetail.jobTypeLabel }}</span>
              <span v-if="jobDetail.companyScaleLabel" style="margin-right: 15px;"><strong>公司规模:</strong> {{ jobDetail.companyScaleLabel }}</span>
              <span v-if="jobDetail.financingStageLabel" style="margin-right: 15px;"><strong>融资阶段:</strong> {{ jobDetail.financingStageLabel }}</span>
            </p>
          </div>
          <div class="detail-section" v-if="activeTab === 'laodao' && jobDetail.welfareBenefits && jobDetail.welfareBenefits.length > 0">
            <h3>福利待遇</h3>
            <p>
              <span v-for="(tag, i) in jobDetail.welfareBenefits" :key="i" style="background: #f1f5f9; padding: 4px 10px; margin-right: 8px; border-radius: 4px; font-size: 13px;">{{ tag }}</span>
            </p>
          </div>
          <div class="detail-section" v-if="activeTab === 'laodao'">
            <h3>职位关键词</h3>
            <p>
              <span v-for="(tag, i) in (jobDetail.jobKeywords || '').split(',').filter(Boolean)" :key="i" style="background: #f1f5f9; padding: 4px 10px; margin-right: 8px; border-radius: 4px; font-size: 13px;">{{ tag }}</span>
              <span v-if="!jobDetail.jobKeywords">无</span>
            </p>
          </div>
          <div class="detail-section" v-if="activeTab === 'laodao'">
            <h3>工作地址</h3>
            <p>{{ jobDetail.workAddress || '地址不详' }}</p>
          </div>
          <div class="detail-section" v-if="activeTab === 'laodao'">
            <h3>联系信息</h3>
            <p>
              <span v-if="jobDetail.contactName" style="margin-right: 15px;"><strong>联系人:</strong> {{ jobDetail.contactName }}</span>
            </p>
          </div>
          <div class="detail-section" v-if="activeTab === 'laodao'">
            <h3>发布时间</h3>
            <p>{{ jobDetail.publishTimeStr || jobDetail.createTimeStr || '不详' }}</p>
          </div>

          <div class="detail-section" v-if="activeTab === 'serviceOrder'">
            <h3>订单基本信息</h3>
            <p>
              <span v-if="jobDetail.serviceDate" style="margin-right: 15px;"><strong>服务日期:</strong> {{ jobDetail.serviceDate }}</span>
              <span v-if="jobDetail.startTimeShow" style="margin-right: 15px;"><strong>时间段:</strong> {{ jobDetail.startTimeShow }} - {{ jobDetail.endTimeShow }}</span>
              <span v-if="jobDetail.serviceHours != null" style="margin-right: 15px;"><strong>服务时长:</strong> {{ jobDetail.serviceHours }}小时</span>
              <span v-if="jobDetail.statusLabel || jobDetail.status != null" style="margin-right: 15px;"><strong>状态:</strong> {{ jobDetail.statusLabel || jobDetail.status }}</span>
            </p>
          </div>
          <div class="detail-section" v-if="activeTab === 'serviceOrder'">
            <h3>服务需求</h3>
            <p>{{ jobDetail.serviceDemand || '暂无描述' }}</p>
          </div>
          <div class="detail-section" v-if="activeTab === 'serviceOrder'">
            <h3>用工地址</h3>
            <p>{{ jobDetail.workAddress || '地址不详' }}</p>
          </div>
          
          <div class="detail-qrcode-wrapper">
            <div class="qrcode-content">
              <div class="qrcode-hint">温馨提示：本平台仅提供信息展示，招聘咨询请扫描下方二维码，跳转小程序完成操作。</div>
              <img v-if="(activeTab === 'laodao' || activeTab === 'serviceOrder') && laodaoInfo.qrcode" :src="laodaoInfo.qrcode.startsWith('http') ? laodaoInfo.qrcode : minioPrefix + laodaoInfo.qrcode" alt="劳道智工" class="qrcode-img" />
              <img v-if="activeTab === 'zhongya' && zhongyaInfo.qrcode" :src="zhongyaInfo.qrcode.startsWith('http') ? zhongyaInfo.qrcode : minioPrefix + zhongyaInfo.qrcode" alt="中亚职通桥" class="qrcode-img" />
            </div>
          </div>
          
        </div>
        <div v-else class="loading-state">
          加载中...
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<style scoped>
.job-list-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  width: 1280px;
  margin: 0 auto;
  padding: 120px 0 40px 0;
}
.job-container {
  background: #fff;
  height:600px;
  padding: 24px;

}
.tabs-header {
  display: flex;
  gap: 30px;
  border-bottom: 2px solid #f0f2f5;
  margin-bottom: 24px;
}
.tab-btn {
  padding: 12px 16px;
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  position: relative;
  transition: all 0.3s ease;
  font-weight: 500;
}
.tab-btn:hover {
  color: #3b82f6;
}
.tab-btn.active {
  color: #3b82f6;
  font-weight: bold;
}
.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #3b82f6;
  border-radius: 3px 3px 0 0;
}

.job-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  height: 450px;
  overflow-y: auto;
}
.job-card {
  width: calc(50% - 8px);
  height:180px;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.job-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}
.job-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}
.job-title {
  margin: 0;
  font-size: 18px;
  color: #1e293b;
  font-weight: 600;
}
.job-salary {
  color: #f97316;
  font-weight: bold;
  font-size: 18px;
}
.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.job-tags .tag {
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}
.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #94a3b8;
  font-size: 14px;
  padding-top: 16px;
  border-top: 1px dashed #e2e8f0;
}
.company-name {
  color: #475569;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}
.pagination button {
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  background: #fff;
  cursor: pointer;
  border-radius: 6px;
  color: #475569;
  font-weight: 500;
  transition: all 0.2s;
}
.pagination button:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
}
.pagination button:disabled {
  background: #f8fafc;
  color: #cbd5e1;
  cursor: not-allowed;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 60px;
  color: #94a3b8;
  font-size: 16px;
  grid-column: 1 / -1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  width: 700px;
  max-width: 90%;
  max-height: 85vh;
  border-radius: 12px;
  padding: 32px;
  position: relative;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 28px;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s;
}
.modal-close-btn:hover {
  color: #1e293b;
}
.detail-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: #1e293b;
  font-weight: 700;
}
.detail-salary {
  color: #f97316;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
}
.detail-section {
  margin-bottom: 24px;
}
.detail-section h3 {
  font-size: 16px;
  color: #1e293b;
  margin-bottom: 12px;
  border-left: 4px solid #3b82f6;
  padding-left: 10px;
}
.detail-section p, .detail-html {
  color: #475569;
  line-height: 1.7;
  font-size: 15px;
}
.detail-qrcode-wrapper {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px dashed #e2e8f0;
}
.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 280px;
  text-align: center;
}
.qrcode-hint {
  font-size: 13px;
  color: #ef4444;
  margin-bottom: 12px;
  line-height: 1.5;
}
.qrcode-img {
  width: 140px;
  height: 140px;
  object-fit: contain;
  border: 1px solid #e2e8f0;
  padding: 4px;
  border-radius: 4px;
}
</style>
