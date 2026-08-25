<script setup lang="ts">
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'


import { ref, onMounted } from 'vue'
import { http } from '@/api/request'

import sq1 from '@/assets/other/Frame 59.png'
import sq2 from '@/assets/other/Frame 60.png'
import sq3 from '@/assets/other/Frame 62.png'
import sq4 from '@/assets/other/Frame 61.png'
import sq5 from '@/assets/other/Frame 63-1.png'
import sq6 from '@/assets/other/Frame 63-2.png'
const appealsList = ref<any[]>([])

const defaultIcons = [
  'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
  'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
]
const defaultBgs = [sq4, sq3, sq2, sq1, sq5, sq6]
const themes = ['red', 'orange', 'blue', 'cyan', 'green', 'purple']

const fetchPublicOpinion = async () => {
  try {
    const res: any = await http.get('/api-loca/ncmanagement/class/zones-tree', {
      zoneType: 'public_opinion',
      platform: 'portal',
      userType: ''
    })
    if (res.code === 0 && res.data && res.data.public_opinion) {
      appealsList.value = res.data.public_opinion.map((item: any, index: number) => ({
        ...item,
        theme: themes[index % themes.length],
        bg: defaultBgs[index % defaultBgs.length],
        imgIcon: item.bgImage ? (item.icon.startsWith('http') ? item.bgImage : minioPrefix + '/' + item.icon.replace(/^\/+/, '')) : '',
        icon: defaultIcons[index % defaultIcons.length]
      }))
    }
  } catch (e) {
    console.error('Failed to fetch public opinion data:', e)
  }
}

const showModal = ref(false)
const submitting = ref(false)
const formData = ref({
  type: 1,
  title: '',
  content: '',
  attachmentUrls: '[]',
  community: 'none',
  contactName: '',
  contactPhone: '',
  urgency: 1
})

const handleNavigate = (card: any) => {
  if (card.name === '诉求直通车') {
    showModal.value = true
    return
  }
  if (card.url) {
    window.location.href = card.url
  }
}

const submitForm = async () => {
  if (!formData.value.title || !formData.value.content || !formData.value.contactName || !formData.value.contactPhone) {
    alert('请填写完整信息')
    return
  }
  submitting.value = true
  try {
    const res: any = await http.post('/api-loca/portal/complaint/direct/create', null, { params: formData.value })
    if (res.code === 0 || String(res.code) === '0') {
      alert('提交成功')
      showModal.value = false
      formData.value = {
        type: 1,
        title: '',
        content: '',
        attachmentUrls: '[]',
        community: 'none',
        contactName: '',
        contactPhone: '',
        urgency: 1
      }
    } else {
      alert('提交失败: ' + res.msg)
    }
  } catch (e: any) {
    alert('提交出错: ' + (e.message || '未知错误'))
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchPublicOpinion()
})
</script>

<template>
  <div class="appeal-page-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="appeals" />

      <div class="content-box">
        
        <div class="appeals-grid">
          <!-- 所有卡片 -->
          <div v-for="card in appealsList" :key="card.name" class="appeal-card" :class="card.theme" @click="handleNavigate(card)">
            <div class="card-bg" :style="{ backgroundImage: `url(${card.bg})` }"></div>
            <div class="card-content">
              <div class="header-row">
                <div class="icon-sq" :class="'bg-' + card.theme">
                  <img v-if="card.imgIcon" :src="card.imgIcon" style="object-fit: contain; width: 100%; height: 100%;" />
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path :d="card.icon" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="text-group">
                  <h3>{{ card.name }}</h3>
                  <p>{{ card.remark }}</p>
                </div>
              </div>
              <button class="view-btn" :class="'btn-' + card.theme">
                {{ card.name === '诉求直通车' ? '发起工单' : '立即查看' }} →
              </button>
            </div>
          </div>

          <!-- 底部通栏 -->
          <div class="bottom-banner">
            <div class="banner-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="banner-text">
              <strong>诉求办理公示：</strong> 本月共受理诉求 <strong>1,256</strong> 件，办结率 <strong>98.6%</strong> ，平均响应时长 <strong>1.2小时</strong>
            </div>
          </div>

        </div>

      </div>
    </main>

    <!-- 弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>创建诉求直通车工单</h3>
          <button class="close-btn" @click="showModal = false">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm" class="complaint-form">
            <div class="form-group">
              <label>诉求类型</label>
              <select v-model.number="formData.type" required>
                <option value="1">企业诉求</option>
                <option value="2">群众建议</option>
                <option value="3">问题反映</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>标题</label>
              <input type="text" v-model="formData.title" placeholder="请输入标题" required />
            </div>

            <div class="form-group">
              <label>诉求内容</label>
              <textarea v-model="formData.content" rows="4" placeholder="请输入详细内容" required></textarea>
            </div>

            <div class="form-group row-group">
              <div class="col">
                <label>联系人姓名</label>
                <input type="text" v-model="formData.contactName" placeholder="姓名" required />
              </div>
              <div class="col">
                <label>联系电话</label>
                <input type="text" v-model="formData.contactPhone" placeholder="电话" required />
              </div>
            </div>

            <div class="form-group row-group">
              <div class="col">
                <label>所属社区</label>
                <select v-model="formData.community">
                  <option value="none">无社区</option>
                  <option value="cooperation_zone">合作区</option>
                  <option value="kalasu">卡拉苏社区</option>
                  <option value="silu">丝路社区</option>
                  <option value="suolun">索伦社区</option>
                  <option value="yingtarr">英塔尔社区</option>
                  <option value="hongqiao">红桥社区</option>
                </select>
              </div>
              <div class="col">
                <label>紧急程度</label>
                <select v-model.number="formData.urgency">
                  <option value="1">普通</option>
                  <option value="2">紧急</option>
                  <option value="3">特急</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">取消</button>
              <button type="submit" class="btn-submit" :disabled="submitting">
                {{ submitting ? '提交中...' : '提交工单' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<style scoped>
.appeal-page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

.content-box {
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 30px;
}

.appeals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* 卡片基础样式 */
.appeal-card {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: #ffffff;
  overflow: hidden;
  height: 160px;
  display: flex;
}

.appeal-card.span-2 {
  grid-column: span 2;
}

/* 右侧背景图 */
.card-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 60%;
  background-size: cover;
  background-position: right center;
  background-repeat: no-repeat;
  z-index: 1;
  mask-image: linear-gradient(to right, transparent, black 60%);
  -webkit-mask-image: linear-gradient(to right, transparent, black 60%);
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-sq {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-sq svg {
  width: 24px;
  height: 24px;
}

.text-group h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #0f172a;
  font-weight: 700;
}

.text-group p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.view-btn {
  margin-left: 64px; /* Align with text */
  padding: 6px 16px;
  background: transparent;
  border: 1px solid;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  width: max-content;
  transition: all 0.2s;
}

/* 颜色变体 */
.bg-red { background-color: #ef4444; }
.btn-red { color: #ef4444; border-color: #fca5a5; }
.btn-red:hover { background: #fef2f2; }
.appeal-card.red { background: linear-gradient(to right, #fef2f2 0%, #ffffff 50%); border-color: #fca5a5; }

.bg-orange { background-color: #f97316; }
.btn-orange { color: #f97316; border-color: #fdba74; }
.btn-orange:hover { background: #fff7ed; }
.appeal-card.orange { background: linear-gradient(to right, #fff7ed 0%, #ffffff 50%); border-color: #fdba74; }

.bg-blue { background-color: #3b82f6; }
.btn-blue { color: #3b82f6; border-color: #93c5fd; }
.btn-blue:hover { background: #eff6ff; }
.appeal-card.blue { background: linear-gradient(to right, #eff6ff 0%, #ffffff 50%); border-color: #93c5fd; }

.bg-cyan { background-color: #06b6d4; }
.btn-cyan { color: #06b6d4; border-color: #67e8f9; }
.btn-cyan:hover { background: #ecfeff; }
.appeal-card.cyan { background: linear-gradient(to right, #ecfeff 0%, #ffffff 50%); border-color: #67e8f9; }

.bg-green { background-color: #10b981; }
.btn-green { color: #10b981; border-color: #6ee7b7; }
.btn-green:hover { background: #ecfdf5; }
.appeal-card.green { background: linear-gradient(to right, #ecfdf5 0%, #ffffff 30%); border-color: #6ee7b7; }

.bg-purple { background-color: #a855f7; }
.btn-purple { color: #a855f7; border-color: #d8b4fe; }
.btn-purple:hover { background: #faf5ff; }
.appeal-card.purple { background: linear-gradient(to right, #faf5ff 0%, #ffffff 30%); border-color: #d8b4fe; }

/* 底部通栏 */
.bottom-banner {
  grid-column: span 3;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.banner-icon {
  width: 24px;
  height: 24px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-icon svg {
  width: 20px;
  height: 20px;
}

.banner-text {
  font-size: 14px;
  color: #334155;
}

.banner-text strong {
  color: #0f172a;
  font-weight: 700;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  width: 500px;
  max-width: 90vw;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  animation: modalIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 16px 24px;
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
  color: #64748b;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: #ef4444;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.row-group {
  display: flex;
  gap: 16px;
}

.row-group .col {
  flex: 1;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: #475569;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel,
.btn-submit {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-cancel:hover {
  background: #f8fafc;
}

.btn-submit {
  background: #10b981;
  border: 1px solid #10b981;
  color: white;
  font-weight: 500;
}

.btn-submit:hover:not(:disabled) {
  background: #059669;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
