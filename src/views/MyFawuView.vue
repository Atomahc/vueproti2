<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { http } from '@/api/request'
import { useRoute, useRouter } from 'vue-router'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref(route.query.tab === 'appointment' ? 'appointment' : 'consult') // 'consult' | 'appointment'
const list = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const detailVisible = ref(false)
const detailData = ref<any>(null)

watch(() => route.query.tab, (newTab) => {
  if (newTab && (newTab === 'consult' || newTab === 'appointment')) {
    activeTab.value = newTab
    currentPage.value = 1
    fetchList()
  }
})

const fetchList = async () => {
  loading.value = true
  try {
    const endpoint = activeTab.value === 'consult' 
      ? '/prod-api/fawu/consult/session/page' 
      : '/prod-api/fawu/appointment/page'
    const res: any = await http.get(endpoint, {
      page: currentPage.value,
      limit: pageSize.value
    })
    if (res.code === 0 || String(res.code) === '0') {
      list.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleTabSwitch = (tab: string) => {
  activeTab.value = tab
  currentPage.value = 1
  router.replace({ query: { tab } })
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

const openDetail = (item: any) => {
  detailVisible.value = true
  detailData.value = item
}

const closeDetail = () => {
  detailVisible.value = false
  detailData.value = null
}

const getConsultStatusName = (status: number) => {
  switch(status) {
    case 0: return '待接单'
    case 1: return '进行中'
    case 2: return '已结束'
    default: return '未知'
  }
}

const getAppointmentStatusName = (status: number) => {
  switch(status) {
    case 0: return '待确认'
    case 1: return '已确认'
    case 2: return '已完成'
    case 3: return '已拒绝'
    default: return '未知'
  }
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <div class="my-tickets-page">
    <TheHeader />
    <main class="main-content">
      <TheNavBar activeId="" />
      <div class="content-container">
        <h2>法务服务记录</h2>
        
        <div class="tabs-header">
          <button :class="['tab-btn', { active: activeTab === 'consult' }]" @click="handleTabSwitch('consult')">我的咨询</button>
          <button :class="['tab-btn', { active: activeTab === 'appointment' }]" @click="handleTabSwitch('appointment')">我的预约</button>
        </div>

        <div class="ticket-list" v-if="!loading">
          <div v-for="item in list" :key="item.id" class="ticket-card" @click="openDetail(item)">
            <div class="ticket-header">
              <span class="ticket-title">{{ item.title || item.serviceType || '无标题' }}</span>
              <span :class="['status-badge', `status-${item.status}`]">
                {{ activeTab === 'consult' ? getConsultStatusName(item.status) : getAppointmentStatusName(item.status) }}
              </span>
            </div>
            <div class="ticket-body">
              <span class="ticket-type">
                {{ activeTab === 'consult' ? `律师：${item.lawyerName || '暂未接单'}` : `预约律师：${item.lawyerName || '未知'}` }}
              </span>
              <span class="ticket-time">
                {{ activeTab === 'consult' ? `发起时间：${item.createTime}` : `预约时间：${item.appointDate} ${item.appointTime}` }}
              </span>
            </div>
          </div>
          
          <div v-if="list.length === 0" class="empty-state">暂无记录</div>
        </div>
        <div v-else class="loading-state">加载中...</div>

        <div class="pagination" v-if="total > 0 && !loading">
          <button :disabled="currentPage === 1" @click="prevPage">上一页</button>
          <span>{{ currentPage }} / {{ Math.ceil(total / pageSize) }}</span>
          <button :disabled="currentPage * pageSize >= total" @click="nextPage">下一页</button>
        </div>
      </div>
    </main>
    <TheFooter />

    <!-- Detail Modal -->
    <div class="modal-overlay" v-if="detailVisible" @click.self="closeDetail">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeDetail">×</button>
        <div v-if="detailData" class="detail-container">
          <h2 class="detail-title">{{ detailData.title || detailData.serviceType || '详情' }}</h2>
          <div class="detail-meta">
            <span><strong>状态：</strong>
              <span :class="['status-badge', `status-${detailData.status}`]">
                {{ activeTab === 'consult' ? getConsultStatusName(detailData.status) : getAppointmentStatusName(detailData.status) }}
              </span>
            </span>
            <span v-if="activeTab === 'consult'"><strong>律师：</strong>{{ detailData.lawyerName || '暂未接单' }}</span>
            <span v-else><strong>预约律师：</strong>{{ detailData.lawyerName || '未知' }}</span>
            
            <span v-if="activeTab === 'consult'"><strong>发起时间：</strong>{{ detailData.createTime }}</span>
            <span v-else><strong>预约时间：</strong>{{ detailData.appointDate }} {{ detailData.appointTime }}</span>
          </div>
          
          <div class="detail-section">
            <h3>{{ activeTab === 'consult' ? '问题描述' : '服务说明' }}</h3>
            <p>{{ detailData.description || '无详细描述' }}</p>
          </div>

          <div class="detail-section" v-if="detailData.contact">
            <h3>联系方式</h3>
            <p>{{ detailData.contact }}</p>
          </div>

          <div class="detail-section" v-if="activeTab === 'appointment' && detailData.rejectReason">
            <h3>拒绝原因</h3>
            <p>{{ detailData.rejectReason }}</p>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-tickets-page {
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
.content-container {
  background: #fff;
  min-height: 600px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.content-container h2 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #1e293b;
  font-size: 22px;
}
.tabs-header {
  display: flex;
  gap: 30px;
  border-bottom: 2px solid #f0f2f5;
  margin-bottom: 24px;
}
.tab-btn {
  padding: 12px 16px;
  font-size: 16px;
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
.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ticket-card {
  border: 1px solid #e2e8f0;
  padding: 16px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.ticket-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
  transform: translateY(-2px);
}
.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.ticket-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: #f1f5f9;
  color: #64748b;
}
.status-0 { background: #fff7ed; color: #ea580c; }
.status-1 { background: #eff6ff; color: #2563eb; }
.status-2 { background: #f0fdf4; color: #16a34a; }
.status-3 { background: #fef2f2; color: #dc2626; }

.ticket-body {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #64748b;
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
}
.pagination button:hover:not(:disabled) {
  background: #f1f5f9;
}
.pagination button:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

/* Modal */
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
}
.detail-title {
  margin: 0 0 16px 0;
  font-size: 22px;
  color: #1e293b;
}
.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #475569;
}
.detail-meta span {
  display: flex;
  gap: 6px;
  align-items: center;
}
.detail-meta strong {
  color: #1e293b;
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
.detail-section p {
  color: #475569;
  line-height: 1.6;
  font-size: 15px;
  white-space: pre-wrap;
}
</style>
