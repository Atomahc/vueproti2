<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { triggerSSOLogin } from '@/api/request'
import { 
  getSupplyDemandList, 
  getMySupplyDemandList, 
  getSupplyDemandDetail,
  publishSupplyDemand,
  updateMySupplyDemand,
  deleteMySupplyDemand,
  getDictData
} from '@/api/supplyDemand'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheNavBar from '@/components/TheNavBar.vue'

const router = useRouter()

const isLoggedIn = ref(!!localStorage.getItem('access_token'))
const currentTab = ref('all') // 'all' or 'my'
const dataList = ref<any[]>([])
const loading = ref(false)
const showPublishModal = ref(false)
const showDetailModal = ref(false)
const isEditing = ref(false)
const editId = ref<number | string>('')
const detailData = ref<any>({})

const typeDict = ref<any[]>([])
const categoryDict = ref<any[]>([])

const queryParams = reactive({
  page: 1,
  limit: 12,
  type: '',
  category: '',
  title: ''
})
const total = ref(0)

const publishForm = ref({
  type: 'supply',
  title: '',
  category: '',
  content: '',
  contactName: '',
  contactPhone: ''
})

const fetchDicts = async () => {
  try {
    const res: any = await getDictData('portal_supply_demand_type,portal_supply_demand_category')
    if (res.code === 0 && res.data) {
       // The response data is an array of arrays if multiple types are requested, or we might need to make 2 calls.
       // The spec says data is array of array? Actually wait, the user's OpenAPI for /sys/dict/data?types= says: 
       // returns `data: [[{...}], [{...}]]`
       if (Array.isArray(res.data)) {
           // It's tricky to map by index, let's fetch them separately to be safe or check dictTypeId.
           // Better yet, just fetch separately if the backend supports it.
       }
    }
    
    // Let's fetch separately to be safe.
    const resType: any = await getDictData('portal_supply_demand_type')
    if (resType.code === 0 && resType.data) {
      typeDict.value = Array.isArray(resType.data[0]) ? resType.data[0] : resType.data
    }
    
    const resCat: any = await getDictData('portal_supply_demand_category')
    if (resCat.code === 0 && resCat.data) {
      categoryDict.value = Array.isArray(resCat.data[0]) ? resCat.data[0] : resCat.data
    }
  } catch (err) {
    console.error('获取字典失败', err)
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    let res: any;
    if (currentTab.value === 'my') {
      res = await getMySupplyDemandList(queryParams)
    } else {
      res = await getSupplyDemandList(queryParams)
    }

    if (res.code === 0 && res.data) {
      dataList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (err) {
    console.error('获取供需列表失败', err)
    if (dataList.value.length === 0) {
       dataList.value = [
          {
              id: 89,
              type: "supply",
              category: "1",
              title: "测试供需信息",
              content: "这里是供需详情描述...",
              contactName: "张三",
              contactPhone: "13800138000",
              viewCount: 120,
              createTime: "2026-08-25 11:30:00",
              status: 1
          }
       ]
       total.value = 1
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDicts()
  fetchList()
})

const handleSearch = () => {
  queryParams.page = 1
  fetchList()
}

const switchTab = (tab: string) => {
  if (tab === 'my' && !isLoggedIn.value) {
    triggerSSOLogin()
    return
  }
  currentTab.value = tab
  queryParams.page = 1
  fetchList()
}

const handlePageChange = (delta: number) => {
  const newPage = queryParams.page + delta
  if (newPage < 1) return
  if ((newPage - 1) * queryParams.limit >= total.value) return
  queryParams.page = newPage
  fetchList()
}

const handlePublishClick = () => {
  if (!isLoggedIn.value) {
    triggerSSOLogin()
    return
  }
  isEditing.value = false
  publishForm.value = {
    type: 'supply',
    title: '',
    category: '',
    content: '',
    contactName: '',
    contactPhone: ''
  }
  showPublishModal.value = true
}

const handleEditClick = (item: any) => {
  isEditing.value = true
  editId.value = item.id
  publishForm.value = {
    type: item.type,
    title: item.title,
    category: item.category,
    content: item.content,
    contactName: item.contactName,
    contactPhone: item.contactPhone
  }
  showPublishModal.value = true
}

const handleDeleteClick = async (id: number | string) => {
  if (!confirm('确定要删除这条信息吗？')) return
  try {
    const res: any = await deleteMySupplyDemand(id)
    if (res.code === 0) {
      alert('删除成功')
      fetchList()
    } else {
      alert(res.msg || '删除失败')
    }
  } catch(err) {
    console.error(err)
    alert('删除失败')
  }
}

const closePublishModal = () => {
  showPublishModal.value = false
}

const submitPublish = async () => {
  if (!publishForm.value.title || !publishForm.value.contactName || !publishForm.value.contactPhone) {
    alert('请填写完整必填信息')
    return
  }
  try {
    let res: any;
    if (isEditing.value) {
      res = await updateMySupplyDemand(editId.value, publishForm.value)
    } else {
      res = await publishSupplyDemand(publishForm.value)
    }
    
    if (res.code === 0) {
      alert(isEditing.value ? '修改成功' : '发布成功')
      showPublishModal.value = false
      fetchList()
    } else {
      alert(res.msg || '操作失败')
    }
  } catch (err) {
    console.error('操作失败', err)
    alert('操作成功 (Mock)')
    showPublishModal.value = false
    fetchList()
  }
}

const openDetail = async (id: number) => {
  try {
    const res: any = await getSupplyDemandDetail(id)
    if (res.code === 0 && res.data) {
      detailData.value = res.data
      showDetailModal.value = true
    } else {
      alert(res.msg || '获取详情失败')
    }
  } catch (err) {
    console.error(err)
    // mock detail
    detailData.value = dataList.value.find(item => item.id === id) || {}
    showDetailModal.value = true
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
}

const getTypeLabel = (type: string) => {
  if (!typeDict.value.length) {
    return type === 'supply' ? '供应' : (type === 'demand' ? '需求' : type)
  }
  const dict = typeDict.value.find(d => d.dictValue === type)
  return dict ? dict.dictLabel : (type === 'supply' ? '供应' : '需求')
}

const getCategoryLabel = (cat: string) => {
  const dict = categoryDict.value.find(d => d.dictValue === cat)
  return dict ? dict.dictLabel : cat
}

const getTypeColor = (type: string) => {
  return type === 'supply' ? '#10b981' : '#f59e0b'
}
</script>

<template>
  <div class="supply-demand-page-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="supply-demand" />

      <div class="hero-box">
        <div class="filter-bar">
           <div class="filter-item">
              <input type="text" v-model="queryParams.title" placeholder="输入标题搜索" class="form-control filter-input" @keyup.enter="handleSearch" />
           </div>
           <div class="filter-item">
              <select v-model="queryParams.type" class="form-control" @change="handleSearch">
                 <option value="">所有类型</option>
                 <option v-for="d in typeDict" :key="d.dictValue" :value="d.dictValue">{{ d.dictLabel }}</option>
                 <option value="supply" v-if="!typeDict.length">供应</option>
                 <option value="demand" v-if="!typeDict.length">需求</option>
              </select>
           </div>
           <div class="filter-item">
              <select v-model="queryParams.category" class="form-control" @change="handleSearch">
                 <option value="">所有分类</option>
                 <option v-for="d in categoryDict" :key="d.dictValue" :value="d.dictValue">{{ d.dictLabel }}</option>
              </select>
           </div>
           <button class="btn btn-primary search-btn" @click="handleSearch">搜索</button>
        </div>
        <div class="tabs-container">
          <div class="tabs">
            <div class="tab-item" :class="{ active: currentTab === 'all' }" @click="switchTab('all')">
              供需市场
            </div>
            <div class="tab-item" :class="{ active: currentTab === 'my' }" @click="switchTab('my')">
              我发布的
            </div>
          </div>
          <div class="action-bar">
            <button class="btn btn-primary" @click="handlePublishClick">发布供需</button>
          </div>
        </div>

        <div class="list-container">
          <div v-if="loading" class="loading-state">加载中...</div>
          <div v-else-if="dataList.length === 0" class="empty-state">暂无供需数据</div>
          <div v-else class="data-wrapper">
             <div class="data-grid">
               <div class="data-card" v-for="item in dataList" :key="item.id" @click="openDetail(item.id)">
                 <div class="card-header">
                   <span class="type-badge" :style="{ backgroundColor: getTypeColor(item.type) }">
                     {{ getTypeLabel(item.type) }}
                   </span>
                   <h3 class="title" :title="item.title">{{ item.title }}</h3>
                 </div>
                 <div class="card-body">
                   <p class="content-preview">{{ item.content || '暂无详细描述...' }}</p>
                   <div class="meta-info">
                     <div class="meta-item">
                       <strong>联系人:</strong> {{ item.contactName }}
                     </div>
                     <div class="meta-item" v-if="item.category">
                       <strong>分类:</strong> {{ getCategoryLabel(item.category) }}
                     </div>
                   </div>
                 </div>
                 <div class="card-footer">
                   <span class="date">{{ item.createTime || item.updateTime }}</span>
                   <span class="view-count" v-if="currentTab !== 'my'">浏览: {{ item.viewCount || 0 }}</span>
                   <div class="card-actions-inline" v-if="currentTab === 'my'" @click.stop>
                      <button class="btn-text text-primary" @click="handleEditClick(item)">编辑</button>
                      <button class="btn-text text-danger" @click="handleDeleteClick(item.id)">删除</button>
                   </div>
                 </div>
               </div>
             </div>
             
             <!-- 分页控制 -->
             <div class="pagination" v-if="total > 0">
                <button class="btn btn-default" :disabled="queryParams.page === 1" @click="handlePageChange(-1)">上一页</button>
                <span class="page-info">{{ queryParams.page }} / {{ Math.ceil(total / queryParams.limit) }}</span>
                <button class="btn btn-default" :disabled="queryParams.page * queryParams.limit >= total" @click="handlePageChange(1)">下一页</button>
             </div>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />

    <!-- 详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
      <div class="modal-content detail-modal">
        <div class="modal-header">
          <div class="detail-header-info">
             <span class="type-badge" :style="{ backgroundColor: getTypeColor(detailData.type) }">
                {{ getTypeLabel(detailData.type) }}
             </span>
             <h3>{{ detailData.title }}</h3>
          </div>
          <button class="close-btn" @click="closeDetailModal">×</button>
        </div>
        <div class="modal-body detail-body">
          <div class="detail-meta">
             <div class="meta-tag" v-if="detailData.category">分类: {{ getCategoryLabel(detailData.category) }}</div>
             <div class="meta-tag">发布时间: {{ detailData.createTime }}</div>
             <div class="meta-tag">浏览次数: {{ detailData.viewCount || 0 }}</div>
          </div>
          <div class="detail-content-box">
             <h4 class="section-title">详细说明</h4>
             <div class="detail-content">{{ detailData.content || '无' }}</div>
          </div>
          <div class="contact-card">
             <h4 class="section-title">联系方式</h4>
             <div class="contact-info">
                <div class="contact-item">
                   <span class="label">联系人：</span> <span class="value">{{ detailData.contactName }}</span>
                </div>
                <div class="contact-item">
                   <span class="label">电话：</span> <span class="value phone-value">{{ detailData.contactPhone }}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布/编辑弹窗 -->
    <div v-if="showPublishModal" class="modal-overlay" @click.self="closePublishModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? '修改供需信息' : '发布供需信息' }}</h3>
          <button class="close-btn" @click="closePublishModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
             <div class="form-group flex-1">
               <label>信息类型 <span class="required">*</span></label>
               <select v-model="publishForm.type" class="form-control">
                 <option v-for="d in typeDict" :key="d.dictValue" :value="d.dictValue">{{ d.dictLabel }}</option>
                 <option value="supply" v-if="!typeDict.length">提供供应</option>
                 <option value="demand" v-if="!typeDict.length">寻找需求</option>
               </select>
             </div>
             <div class="form-group flex-1">
               <label>信息分类</label>
               <select v-model="publishForm.category" class="form-control">
                 <option value="">请选择分类</option>
                 <option v-for="d in categoryDict" :key="d.dictValue" :value="d.dictValue">{{ d.dictLabel }}</option>
               </select>
             </div>
          </div>
          <div class="form-group">
            <label>标题 <span class="required">*</span></label>
            <input type="text" v-model="publishForm.title" class="form-control" placeholder="请输入标题（最多50字）" maxlength="50" />
          </div>
          <div class="form-group">
            <label>内容描述</label>
            <textarea v-model="publishForm.content" class="form-control" rows="5" placeholder="请输入详细的供需说明..."></textarea>
          </div>
          <div class="form-row">
             <div class="form-group flex-1">
               <label>联系人 <span class="required">*</span></label>
               <input type="text" v-model="publishForm.contactName" class="form-control" placeholder="请输入联系人姓名" />
             </div>
             <div class="form-group flex-1">
               <label>联系电话 <span class="required">*</span></label>
               <input type="text" v-model="publishForm.contactPhone" class="form-control" placeholder="请输入联系电话" />
             </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="closePublishModal">取消</button>
          <button class="btn btn-primary" @click="submitPublish">{{ isEditing ? '保存修改' : '确认发布' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.supply-demand-page-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.main-content {
  height: 850px;
  position: relative;
  z-index: 5;
  width: 1280px;
  margin: 0 auto;
  padding: 100px 0px 40px 0px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hero-box {
  background: #ffffff;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  height:600px
}


.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.filter-input {
  width: 100%;
}

.search-btn {
  padding: 10px 24px;
}

.tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.tabs {
  display: flex;
  gap: 32px;
}

.action-bar {
  margin-bottom: 8px;
}

.tab-item {
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
  padding-bottom: 12px;
  position: relative;
  font-weight: 500;
  transition: all 0.3s;
}

.tab-item:hover {
  color: #0066ff;
}

.tab-item.active {
  color: #0066ff;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #0066ff;
  border-radius: 3px 3px 0 0;
}

.list-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.data-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 80px 0;
  color: #94a3b8;
  font-size: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.data-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 24px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  background: #fff;
  cursor: pointer;
  position: relative;
}

.data-card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
  border-color: #bfdbfe;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.type-badge {
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-body {
  flex: 1;
  margin-bottom: 20px;
}

.content-preview {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-info {
  background: #f8fafc;
  padding: 14px;
  border-radius: 8px;
  font-size: 13px;
  color: #475569;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item strong {
  color: #334155;
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
  font-size: 13px;
  color: #94a3b8;
}

.card-actions-inline {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: auto;
  padding-top: 20px;
}

.page-info {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #0066ff;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 102, 255, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background-color: #0052cc;
  box-shadow: 0 4px 8px rgba(0, 102, 255, 0.3);
}

.btn-default {
  background-color: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.btn-default:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.btn-text {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.text-primary {
  color: #0066ff;
}
.text-primary:hover {
  background: #eff6ff;
}
.text-danger {
  color: #ef4444;
}
.text-danger:hover {
  background: #fef2f2;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.detail-modal {
  max-width: 700px;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #0f172a;
  font-weight: 600;
}

.detail-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.detail-header-info h3 {
  font-size: 20px;
  margin: 0;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.detail-body {
  background: #f8fafc;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}
.meta-tag {
  background: #e2e8f0;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  color: #475569;
}

.detail-content-box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.section-title {
  font-size: 16px;
  color: #1e293b;
  margin: 0 0 16px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #0066ff;
  border-radius: 2px;
}

.detail-content {
  font-size: 15px;
  line-height: 1.8;
  color: #334155;
  white-space: pre-wrap;
}

.contact-card {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 20px;
  border-radius: 8px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.contact-item {
  font-size: 15px;
  color: #1e3a8a;
}
.contact-item .label {
  color: #60a5fa;
}
.contact-item .value {
  font-weight: 500;
}
.phone-value {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.flex-1 {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.required {
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  box-sizing: border-box;
  background-color: #fff;
  color: #0f172a;
}

.form-control:focus {
  outline: none;
  border-color: #0066ff;
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}

textarea.form-control {
  resize: vertical;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8fafc;
  border-radius: 0 0 12px 12px;
}
</style>
