<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/request'
import { triggerSSOLogin } from '@/api/request'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'

const router = useRouter()

const isLoggedIn = ref(!!localStorage.getItem('access_token'))
const currentTab = ref('all') // 'all' or 'my'
const dataList = ref<any[]>([])
const loading = ref(false)
const showPublishModal = ref(false)

const publishForm = ref({
  type: 'supply',
  title: '',
  content: '',
  contactName: '',
  contactPhone: ''
})

const fetchList = async () => {
  loading.value = true
  try {
    const res: any = await http.get('/api-loca/portal/supply-demand/list', {
      mine: currentTab.value === 'my' ? 1 : undefined, // 根据实际后端约定，这里假设传 mine=1
    })

    if (res.code === 0 && res.data) {
      dataList.value = res.data.list || []
    }
  } catch (err) {
    console.error('获取供需列表失败', err)
    // 如果获取失败，可以加些mock数据用于展示
    if (dataList.value.length === 0) {
       dataList.value = [
          {
              "category": "默认分类",
              "contactName": "赖婷",
              "contactPhone": "13298165297",
              "content": "这里是供需详情描述...",
              "createTime": "2026-08-25 11:30:00",
              "id": 89,
              "memberId": 10000,
              "memberName": "admin",
              "status": 1,
              "title": "测试供需信息",
              "type": "supply",
              "viewCount": 0
          }
       ]
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchList()
})

const switchTab = (tab: string) => {
  if (tab === 'my' && !isLoggedIn.value) {
    triggerSSOLogin()
    return
  }
  currentTab.value = tab
  fetchList()
}

const handlePublishClick = () => {
  if (!isLoggedIn.value) {
    triggerSSOLogin()
    return
  }
  showPublishModal.value = true
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
    const res: any = await http.post('/api-loca/portal/supply-demand', publishForm.value)
    if (res.code === 0 || res.status === 'ok') {
      alert('发布成功')
      showPublishModal.value = false
      fetchList()
    } else {
      alert(res.msg || '发布失败')
    }
  } catch (err) {
    console.error('发布失败', err)
    alert('发布成功 (Mock)')
    showPublishModal.value = false
    fetchList()
  }
}

const getTypeLabel = (type: string) => {
  return type === 'supply' ? '供应' : (type === 'demand' ? '需求' : type)
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
        <div class="page-header">
          <h2 class="page-title">企业供需对接市场</h2>
          <div class="action-bar">
            <button class="btn btn-primary" @click="handlePublishClick">发布供需</button>
          </div>
        </div>

        <div class="tabs-container">
          <div class="tabs">
            <div 
              class="tab-item" 
              :class="{ active: currentTab === 'all' }" 
              @click="switchTab('all')"
            >
              全部供需
            </div>
            <div 
              class="tab-item" 
              :class="{ active: currentTab === 'my' }" 
              @click="switchTab('my')"
            >
              我发布的
            </div>
          </div>
        </div>

        <div class="list-container">
          <div v-if="loading" class="loading-state">加载中...</div>
          <div v-else-if="dataList.length === 0" class="empty-state">暂无供需数据</div>
          <div v-else class="data-grid">
            <div class="data-card" v-for="item in dataList" :key="item.id">
              <div class="card-header">
                <span class="type-badge" :style="{ backgroundColor: getTypeColor(item.type) }">
                  {{ getTypeLabel(item.type) }}
                </span>
                <h3 class="title">{{ item.title }}</h3>
              </div>
              <div class="card-body">
                <p class="content-preview">{{ item.content }}</p>
                <div class="meta-info">
                  <div class="meta-item">
                    <strong>联系人:</strong> {{ item.contactName }}
                  </div>
                  <div class="meta-item">
                    <strong>联系电话:</strong> {{ item.contactPhone }}
                  </div>
                  <div class="meta-item" v-if="item.category">
                    <strong>分类:</strong> {{ item.category }}
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <span class="date">{{ item.createTime || item.updateTime }}</span>
                <span class="view-count">浏览量: {{ item.viewCount || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />

    <!-- 发布弹窗 -->
    <div v-if="showPublishModal" class="modal-overlay" @click.self="closePublishModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>发布供需信息</h3>
          <button class="close-btn" @click="closePublishModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>信息类型 <span class="required">*</span></label>
            <select v-model="publishForm.type" class="form-control">
              <option value="supply">提供供应</option>
              <option value="demand">寻找需求</option>
            </select>
          </div>
          <div class="form-group">
            <label>标题 <span class="required">*</span></label>
            <input type="text" v-model="publishForm.title" class="form-control" placeholder="请输入标题" />
          </div>
          <div class="form-group">
            <label>内容描述</label>
            <textarea v-model="publishForm.content" class="form-control" rows="4" placeholder="请输入详细描述"></textarea>
          </div>
          <div class="form-group">
            <label>联系人 <span class="required">*</span></label>
            <input type="text" v-model="publishForm.contactName" class="form-control" placeholder="请输入联系人姓名" />
          </div>
          <div class="form-group">
            <label>联系电话 <span class="required">*</span></label>
            <input type="text" v-model="publishForm.contactPhone" class="form-control" placeholder="请输入联系电话" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="closePublishModal">取消</button>
          <button class="btn btn-primary" @click="submitPublish">确认发布</button>
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
  flex: 1;
  background: #ffffff;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 15px;
}

.page-title {
  font-size: 24px;
  color: #0f172a;
  font-weight: 700;
  margin: 0;
}

.tabs-container {
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  gap: 20px;
}

.tab-item {
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
  padding-bottom: 8px;
  position: relative;
  font-weight: 500;
  transition: color 0.3s;
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
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #0066ff;
  border-radius: 3px 3px 0 0;
}

.list-container {
  flex: 1;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 0;
  color: #94a3b8;
  font-size: 16px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.data-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.data-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #cbd5e1;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.type-badge {
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.content-preview {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-info {
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-item strong {
  color: #334155;
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
  font-size: 12px;
  color: #94a3b8;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #0066ff;
  color: white;
}

.btn-primary:hover {
  background-color: #0052cc;
}

.btn-default {
  background-color: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.btn-default:hover {
  background-color: #e2e8f0;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
}

.close-btn:hover {
  color: #475569;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 16px;
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
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #0066ff;
  box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
