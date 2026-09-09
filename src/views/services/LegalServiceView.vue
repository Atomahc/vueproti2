<script setup lang="ts">
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX
import { ref, onMounted } from 'vue'
import { http } from '@/api/request'
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'
import yb from '@/assets/other/Group 60.png'
import yb2 from '@/assets/other/Group 61.png'
import yb3 from '@/assets/other/Group 62.png'

// 上半区 驿路法务通 数据
const yiluColumns = ref<any[]>([])

const yiluHeader = ref<any>({})
const intlHeader = ref<any>({})
const intlCards = ref<any[]>([])

const fetchCloudLegal = async () => {
  try {
    const res: any = await http.get('/prod-api/ncmanagement/class/zones-tree', {
      zoneType: 'cloud_legal',
      platform: 'portal',
      userType: ''
    })
    if (res.code === 0 && res.data && res.data.cloud_legal) {
      const list = res.data.cloud_legal

      const yilu = list.find((item: any) => item.name === '霍尔果斯驿路国际法务区')
      if (yilu) {
        yiluHeader.value = yilu
        if (yilu.children && yilu.children.length > 0) {
          yiluColumns.value = yilu.children.map((child: any) => {
            const col: any = {
              name: child.name,
              title: child.name, // Keep both for safety
              sub: child.subtitle,
              url: child.url,
              items: []
            }
            if (child.icon) {
              col.icon = child.icon.startsWith('http') ? child.icon : minioPrefix + '/' + child.icon.replace(/^\/+/, '')
            }
            if (child.bgImage) {
              col.bgImage = child.bgImage.startsWith('http') ? child.bgImage : minioPrefix + '/' + child.bgImage.replace(/^\/+/, '')
            }

            if (child.data) {
              if (child.code === 'lawyer_firm') {
                const arr: any[] = []
                if (child.data.lawFirms && child.data.lawFirms.length > 0) {
                  arr.push(...child.data.lawFirms.map((f: any) => ({ left: f.name, right: f.specialty || '律所' })))
                }
                if (child.data.lawyers && child.data.lawyers.length > 0) {
                  arr.push(...child.data.lawyers.map((l: any) => ({ left: l.name, right: l.title || '律师' })))
                }
                col.items = arr.slice(0, 3)
              } else if (child.code === 'case' && Array.isArray(child.data)) {
                col.items = child.data.slice(0, 3).map((c: any) => ({
                  left: c.title,
                  right: c.caseType || c.updateTime?.split(' ')[0] || ''
                }))
              } else if (child.code === 'news' && Array.isArray(child.data)) {
                col.items = child.data.slice(0, 3).map((n: any) => ({
                  left: n.title || n.name,
                  right: n.publishTime?.split(' ')[0] || n.updateTime?.split(' ')[0] || ''
                }))
              }
            }
            return col
          })
        }
      }

      const intl = list.find((item: any) => item.name === '驿路国际法务区')
      if (intl) {
        intlHeader.value = intl
        intlCards.value = intl.children || []
      }
    }
  } catch (e) {
    console.error('Failed to fetch cloud legal data:', e)
  }
}

const handleNavigate = (url: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const appointmentForm = ref({
  userName: '',
  contact: '',
  serviceType: '',
  lawyerId: '' as number | string,
  lawyerName: '',
  appointDateTime: '',
  appointDate: '',
  appointTime: '',
  description: ''
})

const lawyerList = ref<any[]>([])
const serviceTypeList = ref<any[]>([])

const fetchFormOptions = async () => {
  try {
    const res: any = await http.get('/prod-api/fawu/lawyer/page', { page: 1, limit: 100 })
    if (res.code === 0 && res.data && res.data.list) {
      lawyerList.value = res.data.list
    }
  } catch (err) {
    console.error('Fetch lawyers failed', err)
  }
  
  try {
    const dictRes: any = await http.get('/prod-api/sys/dict/data', { types: 'fawu_service_type' })
    if (dictRes.code === 0 && dictRes.data) {
      serviceTypeList.value = Array.isArray(dictRes.data[0]) ? dictRes.data[0] : dictRes.data
      if (serviceTypeList.value.length > 0) {
        appointmentForm.value.serviceType = serviceTypeList.value[0].dictLabel || serviceTypeList.value[0].dictValue
      }
    }
  } catch (err) {
    console.error('Fetch service types failed', err)
  }
}

const handleLawyerChange = () => {
  const lawyer = lawyerList.value.find(l => String(l.id) === String(appointmentForm.value.lawyerId))
  if (lawyer) {
    appointmentForm.value.lawyerName = lawyer.name
  } else {
    appointmentForm.value.lawyerName = ''
  }
}

const submitAppointment = async () => {
  if (!appointmentForm.value.userName || !appointmentForm.value.contact || !appointmentForm.value.lawyerId) {
    alert('请填写姓名、联系方式并选择预约律师')
    return
  }
  
  const payload = {
    userName: appointmentForm.value.userName,
    contact: appointmentForm.value.contact,
    lawyerId: Number(appointmentForm.value.lawyerId),
    lawyerName: appointmentForm.value.lawyerName,
    serviceType: appointmentForm.value.serviceType,
    appointDate: appointmentForm.value.appointDate,
    appointTime: appointmentForm.value.appointTime,
    description: appointmentForm.value.description
  }
  
  try {
    const res: any = await http.post('/prod-api/fawu/appointment', payload)
    if (res.code === 0 || res.code === '0' || res.status === 'ok') {
      alert('预约提交成功！')
      appointmentForm.value = {
        userName: '', contact: '', serviceType: serviceTypeList.value[0]?.dictValue || '', lawyerId: '', lawyerName: '', appointDateTime: '', appointDate: '', appointTime: '', description: ''
      }
    } else {
      alert('提交失败：' + (res.msg || '未知错误'))
    }
  } catch (err) {
    console.error('Appointment submit error', err)
    alert('提交失败，请重试')
  }
}

onMounted(() => {
  fetchCloudLegal()
  fetchFormOptions()
})
import BannerSideOverlay from '@/components/BannerSideOverlay.vue'
</script>

<template>
  <div class="legal-page-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="cloud" />
      <BannerSideOverlay />
    
        <div class="content-box" style="flex: 1; min-width: 0;">
        <!-- <div
          style="width:100%;height:100%;position: absolute;top:0px;left:0px;background: linear-gradient(180deg,#3544936b, rgb(8, 7, 50));">
        </div>
  
        <div class="legal-block">
          <div class="block-header" style="justify-content: space-between;">
            <div class="header-text">
              <h2>{{ yiluHeader.name || '云上法务 让每一次法律求助都有清晰路径' }}</h2>
              <p>{{ yiluHeader.remark || '基础法律服务 · 普惠便民' }}</p>
            </div>
            <a href="https://sz.xjhegs.gov.cn:3003/fawu" target="_blank" style="color: #fff; font-size: 14px; text-decoration: none; cursor: pointer;">查看更多 &gt;</a>
          </div>
          <div class="middle-flex-row" style="display: flex; justify-content: space-between; align-items: stretch; gap: 24px;">
            <div class="intl-grid">
              <div v-for="(card, i) in intlCards" :key="i" class="intl-card" @click="handleNavigate(card.url)">
                <div class="intl-title-wrap">
                  <h3>{{ card.name }}</h3>
                  <span class="arrow">→</span>
                </div>
                <img
                  :src="card.bgImage ? (card.bgImage.startsWith('http') ? card.bgImage : minioPrefix + card.bgImage) : ''"
                  alt="illustration" class="intl-img" />
                <img class="bgimg" src="@/assets/other/Frame 80(1).png" alt="">
              </div>
            </div>

 
            <div class="appointment-form-card"
              style="flex: 1; background: rgb(255, 255, 255);  padding: 16px 20px;  display: flex; flex-direction: column;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3
                  style="margin: 0; font-size: 16px; color: #0f172a; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                  <span style="width: 4px; height: 14px; background: #3b82f6; "></span> 律师预约
                </h3>
              </div>

              <div class="form-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; flex: 1;">
                <input v-model="appointmentForm.userName" type="text" placeholder="姓名" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; background: rgba(255,255,255,0.9);  font-size: 13px; outline: none; box-sizing: border-box;" />
                <input v-model="appointmentForm.contact" type="text" placeholder="手机号" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; background: rgba(255,255,255,0.9);  font-size: 13px; outline: none; box-sizing: border-box;" />
                
                <select v-model="appointmentForm.lawyerId" @change="handleLawyerChange" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; background: rgba(255,255,255,0.9);  font-size: 13px; outline: none; box-sizing: border-box; color: #475569;">
                  <option value="" disabled>选择律师</option>
                  <option v-for="lawyer in lawyerList" :key="lawyer.id" :value="lawyer.id">{{ lawyer.name }}</option>
                </select>

                <select v-model="appointmentForm.serviceType" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; background: rgba(255,255,255,0.9);  font-size: 13px; outline: none; box-sizing: border-box; color: #475569;">
                  <option v-if="serviceTypeList.length === 0" value="">服务类型...</option>
                  <option v-for="type in serviceTypeList" :key="type.dictValue" :value="type.dictValue">{{ type.dictLabel }}</option>
                </select>
                <input v-model="appointmentForm.appointDate" type="date" title="预约日期" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; background: rgba(255,255,255,0.9);  font-size: 13px; outline: none; box-sizing: border-box; color: #475569;" />
                <select v-model="appointmentForm.appointTime" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; background: rgba(255,255,255,0.9);  font-size: 13px; outline: none; box-sizing: border-box; color: #475569;">
                  <option value="" disabled>选择时间</option>
                  <option value="09:00:00">09:00</option>
                  <option value="09:30:00">09:30</option>
                  <option value="10:00:00">10:00</option>
                  <option value="10:30:00">10:30</option>
                  <option value="11:00:00">11:00</option>
                  <option value="11:30:00">11:30</option>
                  <option value="12:00:00">12:00</option>
                  <option value="14:00:00">14:00</option>
                  <option value="14:30:00">14:30</option>
                  <option value="15:00:00">15:00</option>
                  <option value="15:30:00">15:30</option>
                  <option value="16:00:00">16:00</option>
                  <option value="16:30:00">16:30</option>
                  <option value="17:00:00">17:00</option>
                  <option value="17:30:00">17:30</option>
                  <option value="18:00:00">18:00</option>
                </select>
                
                <textarea v-model="appointmentForm.description" placeholder="简述您遇到的法律问题..." rows="2" style="grid-column: span 3; width: 100%; padding: 10px; border: 1px solid #e2e8f0; background: rgba(255,255,255,0.9);  font-size: 13px; outline: none; box-sizing: border-box; resize: none;"></textarea>
              </div>

              <button @click="submitAppointment"
                style="margin-top: 12px; width: 100%; padding: 10px; background: linear-gradient(90deg, #2563eb, #3b82f6); color: white; border: none;  font-size: 14px; font-weight: 500; cursor: pointer;  transition: transform 0.2s;">
                一键提交预约
              </button>
            </div>
          </div>

        </div>

   
        <div class="legal-block mt-40">

          <div class="yilu-grid">
            <div v-for="(col, idx) in yiluColumns" :key="idx" class="yilu-col-card"
              :style="(col as any).bgImage ? { backgroundImage: `url(${(col as any).bgImage})` } : {}"
              @click="handleNavigate((col as any).url)" style="cursor: pointer;">
              <div class="col-head">
                <div class="col-title-wrap">
                  <h3>{{ col.name }} <span class="arrow">→</span></h3>
                  <p>{{ col.sub }}</p>
                </div>
                <img :src="col.icon" alt="icon" class="col-icon-img" />
              </div>
              <div class="col-list">
                <div v-if="!col.items || col.items.length === 0" class="empty-list">
                  <span style="color: #94a3b8; font-size: 13px;">暂无数据</span>
                </div>
                <div v-for="(item, i) in col.items" :key="i" class="list-item">
                  <span class="dot"></span>
                  <span class="left-text">{{ item.left }}</span>
                  <span class="right-text">{{ item.right }}</span>
                </div>
              </div>
            </div>
          </div>

        </div> -->

         <iframe src="https://sz.xjhegs.gov.cn:3003/fawu?ifram=1" style="width: 
          100%; height: 100%; border: none; height: 648px;"></iframe>

  
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.bgimg {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.legal-page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}

.main-content {
  height: 850px;
  position: relative;
  z-index: 5;
  width: 1280px;
  margin: 0 auto;
  padding: 120px 0% 40px 0px;
  box-sizing: border-box;
}

.content-box {
  min-height: 648px;
  position: relative;
}

.legal-block {
  position: relative;
  z-index: 2;
}

.mt-40 {
  margin-top: 24px;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;

}

.icon-square {
  width: 44px;
  height: 44px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-square svg {
  width: 24px;
  height: 24px;
}

.icon-square.blue {
  background: #3b82f6;
}

.icon-square.cyan {
  background: #06b6d4;
}

.header-text {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-text h2 {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.header-text p {
  font-size: 14px;
  color: #b7d5ff;
  margin: 0;
}

/* 驿路法务通 三列 */
.yilu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.yilu-col-card {
  background: url('@/assets/other/yb.png') no-repeat center center;
  background-size: 100% 100%;
  border: 1px solid #f1f5f9;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.yilu-col-card:hover {
  transform: translateY(-2px);
}

.col-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.col-title-wrap h3 {
  font-size: 17px;
  color: #0f172a;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.col-title-wrap h3 .arrow {
  color: #3b82f6;
  font-weight: bold;
}

.col-title-wrap p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.col-icon-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.empty-list {
  text-align: center;
  padding: 20px 0;
  background: #EDF2FF;
}

.list-item {
  display: flex;
  align-items: center;
  background: #EDF2FF;
  padding: 12px;
}

.list-item:last-child {
  margin-bottom: 0;
}

.list-item .dot {
  width: 4px;
  height: 4px;
  background: #94a3b8;
  border-radius: 50%;
  margin-right: 8px;
}

.list-item .left-text {
  font-size: 13px;
  color: #475569;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.list-item .right-text {
  font-size: 13px;
  color: #64748b;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}

/* 驿路国际法务区 四列 */
.intl-grid {
  width: 600px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.intl-card {
  flex: 1 1 calc(50% - 8px);
  background: #fff;
  padding: 16px;
  box-sizing: border-box;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: 134px;
  cursor: pointer;
  transition: all 0.3s;
}

.intl-card:hover {
  transform: translateY(-2px);
}

.intl-title-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
}

.intl-title-wrap h3 {
  font-size: 15px;
  color: #0c4a6e;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.intl-title-wrap .arrow {
  color: #0284c7;
  font-weight: bold;
}

.intl-img {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 70px;
  height: 70px;
  object-fit: contain;
  z-index: 1;
}
@media screen and (max-width: 768px) {
  .yilu-grid {
    grid-template-columns: 1fr !important;
  }
  .intl-grid {
    width: 100% !important;
    flex-direction: column !important;
  }
  .intl-card {
    flex: 1 1 100% !important;
  }
  .middle-flex-row {
    flex-direction: column !important;
  }
  .form-grid {
    grid-template-columns: 1fr !important;
  }
  .appointment-form-card {
    height: auto !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  .content-box {
    height: auto !important;
    padding: 12px !important;
  }
  .block-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 8px;
  }
  .yilu-col-card{
    box-sizing: border-box;
  }
  .header-text h2{
    font-size: 16px;
  }
}

</style>
