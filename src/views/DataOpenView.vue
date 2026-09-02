<script setup lang="ts">
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'
import DataBoard from '../components/DataBoard.vue'

import gg1 from '@/assets/other/gg1.png'
import gg2 from '@/assets/other/gg2.png'
import gg3 from '@/assets/other/gg3.png'
import gg4 from '@/assets/other/gg4.png'

const router = useRouter()


const statSection = ref<any>({ children: [] })
const visSection = ref<any>({ children: [] })

const statCardsBackup = [
  { name: '统计公报', remark: '年度/季度', bg: gg1 },
  { name: '统计年鉴', remark: '历年汇编', bg: gg2 },
  { name: '调查数据', remark: '专项调查', bg: gg3 }
]

const visCardsBackup: any[] = [
  { name: 'GDP累计同比增速', number: '5.4', unit: '%', progress: 82 },
  { name: '口岸过货量', number: '3,856', unit: '万吨', progress: 65 },
  { name: '规上工业增加值增速', number: '5.28', unit: '%', progress: 82 }
]

const dashboardMenu = ref([
  { id: 'gdp', label: '地区生产总值', iconPath: 'M3 12h4v8H3zm7-6h4v14h-4zm7 4h4v10h-4z' },
  { id: 'primary', label: '第一产业', iconPath: 'M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z' },
  { id: 'secondary', label: '第二产业', iconPath: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z' },
  { id: 'tertiary', label: '第三产业', iconPath: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' }
])
const activeMenu = ref('gdp')
const activeSubIndex = ref(0)

const dashboardData: Record<string, { title: string; options: { label: string; items: any[] }[] }> = {
  gdp: {
    title: '地区生产总值',
    options: [
      {
        label: '地区生产总值',
        items: [
          { indicator: '一、地区生产总值', unit: '亿元', current: '122.02', previous: '116', growth: '5.4' },
          { indicator: '第一产业', unit: '亿元', current: '6.71', previous: '6.18', growth: '6.4' },
          { indicator: '第二产业', unit: '亿元', current: '24.95', previous: '21.94', growth: '10.4' },
          { indicator: '第三产业', unit: '亿元', current: '90.35', previous: '87.88', growth: '4.1' }
        ]
      }
    ]
  },
  primary: {
    title: '第一产业',
    options: [
      {
        label: '农林牧渔业',
        items: [
          { indicator: '二、农林牧渔业总产值', unit: '亿元', current: '4.21', previous: '3.55', growth: '15.8' }
        ]
      }
    ]
  },
  secondary: {
    title: '第二产业',
    options: [
      { label: '规模以上工业总产值', items: [{ indicator: '三、规模以上工业总产值', unit: '亿元', current: '140.53', previous: '99.62', growth: '41.1' }] },
      { label: '规模以上工业增加值', items: [{ indicator: '四、规模以上工业增加值', unit: '亿元', current: '27.61', previous: '20.59', growth: '20.1' }] },
      { label: '固定资产投资额', items: [{ indicator: '五、固定资产投资额', unit: '亿元', current: '19.68', previous: '24.59', growth: '-20' }] },
      { label: '建筑业总产值', items: [{ indicator: '六、建筑业总产值', unit: '亿元', current: '8.23', previous: '14', growth: '-41.2' }] }
    ]
  },
  tertiary: {
    title: '第三产业',
    options: [
      { label: '营利性服务业营业收入', items: [
          { indicator: '七、营利性服务业营业收入(1-5月)', unit: '亿元', current: '54.54', previous: '54.38', growth: '0.3' },
          { indicator: '#信息传输、软件和信息技术服务业', unit: '亿元', current: '27.25', previous: '29.93', growth: '-9' },
          { indicator: '租赁和商务服务业', unit: '亿元', current: '15.21', previous: '15.9', growth: '-4.3' },
          { indicator: '科学研究和技术服务业', unit: '亿元', current: '7.34', previous: '6.58', growth: '11.7' },
          { indicator: '文化、体育和娱乐业', unit: '亿元', current: '4.73', previous: '1.97', growth: '140.3' }
      ] },
      { label: '交通运输、仓储和邮政业', items: [
          { indicator: '八、交通运输、仓储和邮政业', unit: '亿元', current: '3.05', previous: '3.06', growth: '-0.3' },
          { indicator: '#多式联运和运输代理业', unit: '亿元', current: '2.62', previous: '2.16', growth: '21' },
          { indicator: '装卸搬运和仓储业', unit: '亿元', current: '0.12', previous: '0.11', growth: '8' }
      ] },
      { label: '社会消费品零售总额', items: [
          { indicator: '九、社会消费品零售总额', unit: '亿元', current: '2.61', previous: '2.88', growth: '-9.4' },
          { indicator: '#限额以上单位消费品零售额', unit: '亿元', current: '2.01', previous: '2.02', growth: '-5.6' }
      ] },
      { label: '限额以上批发业', items: [{ indicator: '十、限额以上批发业销售额', unit: '亿元', current: '134.51', previous: '161.63', growth: '-16.8' }] },
      { label: '限额以上零售业', items: [{ indicator: '十一、限额以上零售业销售额', unit: '亿元', current: '1.04', previous: '1.74', growth: '-40.1' }] },
      { label: '限额以上住宿业', items: [{ indicator: '十二、限额以上住宿业营业额', unit: '万元', current: '2491', previous: '2522', growth: '-1.2' }] },
      { label: '限额以上餐饮业', items: [{ indicator: '十三、限额以上餐饮业营业额', unit: '万元', current: '4038', previous: '3069', growth: '31.5' }] },
      { label: '房地产销售面积', items: [{ indicator: '十四、房地产销售面积', unit: '万平方米', current: '9.81', previous: '6.8', growth: '44.1' }] },
      { label: '房地产销售额', items: [{ indicator: '十五、房地产销售额', unit: '亿元', current: '5.31', previous: '3.39', growth: '56.8' }] },
      { label: '一般公共预算收入', items: [{ indicator: '十六、一般公共预算收入', unit: '亿元', current: '18.78', previous: '17.69', growth: '6.1' }] },
      { label: '外贸进出口', items: [
          { indicator: '十七、外贸进出口总额预计数(申报数)', unit: '亿元', current: '689.44', previous: '678.3', growth: '1.6' },
          { indicator: '外贸进出口总额预计数(结关数)', unit: '亿元', current: '631.81', previous: '678.3', growth: '-6.9' }
      ] },
      { label: '金融存款贷款', items: [
          { indicator: '十八、5月末金融存款余额(含兵团)', unit: '亿元', current: '148.33', previous: '135.93', growth: '9.1' },
          { indicator: '5月末金融贷款余额(含兵团)', unit: '亿元', current: '134.34', previous: '86.02', growth: '56.2' }
      ] }
    ]
  }
}

const handleMenuClick = (menuId: string) => {
  activeMenu.value = menuId
  activeSubIndex.value = 0
}

const fetchDataOpen = async () => {
  try {
    const res: any = await http.get('/api-loca/ncmanagement/class/zones-tree', {
      zoneType: 'data_open',
      platform: 'portal',
      userType: ''
    })
    if (res.code === 0 && res.data && res.data.data_open) {
      const list = res.data.data_open
      
      const stat = list.find((item: any) => item.name === '统计数据查阅')
      if (stat) {
        statSection.value = stat
      }

      const vis = list.find((item: any) => item.name === '数据可视化看板')
      if (vis) {
        visSection.value = vis
      }
    }
  } catch (e) {
    console.error('Failed to fetch data open:', e)
  }
}

const handleNavigate = (url: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const handleStatCardClick = (card: any) => {
  router.push({
    name: 'news-list',
    query: { tab: card.name }
  })
}

onMounted(() => {
  fetchDataOpen()
})
</script>

<template>
  <div class="data-open-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="data" />

      <div class="data-open-body">
        
        <!-- 口岸贸易与城市治理数据看板 -->
        <DataBoard />

        <!-- 数据可视化看板 (Excel 数据) -->
        <!-- <section class="data-section">
          <div class="section-header">
            <div class="header-icon green-icon">
              <img v-if="visSection.icon" :src="visSection.icon.startsWith('http') ? visSection.icon : minioPrefix + '/' + visSection.icon.replace(/^\/+/, '')" style="object-fit: contain;" alt="" />
              <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18" />
                <path d="M18 9l-5 5-4-4-5 5" />
              </svg>
            </div>
            <div class="header-text">
              <h2>{{ visSection.name || '数据可视化看板' }}</h2>
              <p>{{ visSection.subtitle || '经济运行 · 口岸贸易 · 人口' }}</p>
            </div>
          </div>

          <div class="dashboard-layout">
            <aside class="dashboard-sidebar">
              <ul>
                <li v-for="menu in dashboardMenu" :key="menu.id" :class="{ active: activeMenu === menu.id }" @click="handleMenuClick(menu.id)">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path :d="menu.iconPath" />
                  </svg>
                  <span>{{ menu.label }}</span>
                </li>
              </ul>
            </aside>
            <div class="dashboard-content">
              <div class="dashboard-content-header" style="margin-bottom: 10px;">
                 <div style="display: flex; align-items: center; gap: 16px;">
                   <h3 style="margin: 0; font-size: 18px; color: #1e293b;">霍尔果斯市2026年1-6月主要经济指标</h3>
                   <select v-if="activeMenu !== 'gdp' && dashboardData[activeMenu]" v-model="activeSubIndex" style="padding: 2px 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px; outline: none; cursor: pointer; background: #fff; min-width: 150px;">
                     <option v-for="(opt, idx) in dashboardData[activeMenu].options" :key="idx" :value="idx">{{ opt.label }}</option>
                   </select>
                 </div>
                 <span style="font-size: 13px; color: #64748b;">数据来源: 统计局</span>
              </div>
              <div v-if="dashboardData[activeMenu] && dashboardData[activeMenu].options[activeSubIndex]" class="dashboard-table-container">
                <table class="dashboard-table">
                  <thead>
                    <tr>
                      <th style="text-align: left;">指标</th>
                      <th style="width: 80px;">单位</th>
                      <th style="width: 100px;">1—6月</th>
                      <th style="width: 100px;">同期数</th>
                      <th style="width: 100px;">增速(%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in dashboardData[activeMenu].options[activeSubIndex].items" :key="idx">
                      <td style="text-align: left; font-weight: 500;">
                        <span :style="{ marginLeft: (row.indicator.startsWith('#') || (!row.indicator.includes('、') && activeMenu !== 'gdp')) ? '20px' : '0', color: (row.indicator.startsWith('#') || (!row.indicator.includes('、') && activeMenu !== 'gdp')) ? '#64748b' : '#334155' }">
                          {{ row.indicator }}
                        </span>
                      </td>
                      <td>{{ row.unit }}</td>
                      <td>{{ row.current }}</td>
                      <td>{{ row.previous }}</td>
                      <td>
                        <span :class="{'text-green': parseFloat(row.growth) > 0, 'text-red': parseFloat(row.growth) < 0}">
                          <span v-if="parseFloat(row.growth) > 0">↑</span>
                          <span v-else-if="parseFloat(row.growth) < 0">↓</span>
                          {{ row.growth }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="dashboard-empty">
                 该类目暂无数据展示
              </div>
            </div>
          </div>
        </section> -->
        <!-- 统计数据查阅 -->
        <section class="data-section">
          <!-- <div class="section-header">
            <div class="header-icon orange-icon">
              <img v-if="statSection.icon" :src="statSection.icon.startsWith('http') ? statSection.icon : minioPrefix + '/' + statSection.icon.replace(/^\/+/, '')" style="object-fit: contain;" alt="" />
              <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M7 7h10M7 11h10M7 15h6" />
              </svg>
            </div>
            <div class="header-text">
              <h2>{{ statSection.name || '统计数据查阅' }}</h2>
              <p>{{ statSection.subtitle || '统计公报/年鉴/调查数据' }}</p>
            </div>
          </div> -->

          <div class="cards-grid">
            <div v-for="(card, i) in (statSection.children.length > 0 ? statSection.children : statCardsBackup)" :key="i" class="data-card orange-card clickable-card" @click="handleStatCardClick(card)">
              <div class="card-info">
                <h3>{{ card.name }}</h3>
                <p>{{ card.remark }}</p>
              </div>
              <div class="card-img-placeholder">
                 <img :src="card.bannerImage ? (card.bannerImage.startsWith('http') ? card.bannerImage : minioPrefix + '/' + card.bannerImage.replace(/^\/+/, '')) : card.bg" :alt="card.name" />
              </div>
            </div>
          </div>
        </section>


      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.data-open-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  box-sizing: border-box;
}

.main-content {
  height: 850px;
  position: relative;
  z-index: 5;
  max-width: 1280px;
  margin: 0 auto;
  padding: 120px 0px 40px 0px;
  width: 100%;
  box-sizing: border-box;
 
}

.data-open-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background:#fff;
  min-height: 600px;
}

.data-section {

}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 24px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.orange-icon {
  background: #f59e0b;
}

.green-icon {
  background: #10b981;
}

.header-text h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #1e293b;
  font-weight: 700;
}

.header-text p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.data-card {
  border-radius: 8px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-info {
  position: relative;
  z-index: 2;
}

.card-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.card-info p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

/* Orange Cards Style */
.orange-card {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #e2e8f0;

}

.card-img-placeholder {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.8;
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
  -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 80%);
}

.card-img-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: multiply;
  opacity: 0.6;
}

/* Green Cards Style */
.green-card {
  background: url('@/assets/other/gg4.png') no-repeat center;
  background-size: cover;
  border: 1px solid #bbf7d0;
  padding: 14px;
  height: 220px;
  box-sizing: border-box;
}

.green-card .card-info h3 {
  color: #3f6212;
  font-size: 16px;
}

.green-card .number {
  font-size: 22px;
  font-weight: 800;
  color: #15803d;
  margin-top: 5px;
}

.green-card .number span {
  font-size: 16px;
  font-weight: 500;
  margin-left: 4px;
}

.progress-bar-container {
  width: 100%;
  height: 6px;
  background: rgba(21, 128, 61, 0.1);
  border-radius: 3px;
  position: relative;
  z-index: 2;
}

.progress-bar {
  height: 100%;
  background: #10b981;
  border-radius: 3px;
}

.card-bg-sketch {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 150px;
  height: 60px;
  background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><path d="M10 40 V20 L15 15 L20 20 V40 M25 40 V10 L30 5 L35 10 V40 M40 40 V25 L45 20 L50 25 V40 M60 40 V15 L65 10 L70 15 V40" fill="none" stroke="%2310b981" stroke-width="1" opacity="0.2"/></svg>') no-repeat bottom right;
  background-size: contain;
  z-index: 1;
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.clickable-card:hover {
  transform: translateY(-2px);
}

/* Dashboard Layout */
.dashboard-layout {
  display: flex;
  gap: 30px;
  margin-top: 10px;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  height:320px;
}

.dashboard-sidebar {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
}

.dashboard-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dashboard-sidebar li {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s;
}

.dashboard-sidebar li:hover {
  background: #f8fafc;
  color: #0066ff;
}

.dashboard-sidebar li.active {
  background: #eff6ff;
  color: #0066ff;
  font-weight: 600;
  border-left: 3px solid #0066ff;
}

.dashboard-content {
  flex: 1;
  padding:10px 24px;
  background: #ffffff;
}

.dashboard-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-table-container {
  overflow-x: auto;
  height: 248px;
  overflow-y: scroll;
}

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.dashboard-table th {
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  padding: 12px 16px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.dashboard-table td {
  padding: 12px 16px;
  text-align: center;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.dashboard-table tbody tr:hover {
  background: #f8fafc;
}

.text-green { color: #10b981; }
.text-red { color: #ef4444; }

.dashboard-empty {
  padding: 60px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  background: #f8fafc;
  border-radius: 6px;
}
</style>
