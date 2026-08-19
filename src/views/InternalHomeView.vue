<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import TheFooter from '../components/TheFooter.vue'

const statChartRef = ref<HTMLElement | null>(null)
const activeMenu = ref('业务办理')

onMounted(() => {
  if (statChartRef.value) {
    const myChart = echarts.init(statChartRef.value)
    const option = {
      title: { text: '业务办理趋势', left: 'center', textStyle: { color: '#333', fontSize: 16 } },
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], axisLine: { lineStyle: { color: '#ccc' } } },
      yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { type: 'dashed' } } },
      series: [{ 
        data: [150, 230, 224, 218, 135, 147, 260], 
        type: 'line', 
        smooth: true, 
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#0084ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,132,255,0.3)' },
            { offset: 1, color: 'rgba(0,132,255,0)' }
          ])
        }
      }]
    }
    myChart.setOption(option)
    window.addEventListener('resize', () => myChart.resize())
  }
})

const pendingTasks = ref([
  { id: 1, title: '关于口岸贸易结算的审批申请', date: '2026-06-08', status: '待审批' },
  { id: 2, title: '霍尔果斯市大数据中心年度报告', date: '2026-06-07', status: '待阅读' },
  { id: 3, title: '系统安全漏洞补丁更新通知', date: '2026-06-06', status: '紧急' },
])

const menuItems = [
  { name: '业务办理', icon: '📊' },
  { name: '待办任务', icon: '📝' },
  { name: '数据模型', icon: '🧬' },
  { name: '用户管理', icon: '👥' },
  { name: '系统设置', icon: '⚙️' },
]
</script>

<template>
  <div class="internal-container">
    <header class="internal-header">
      <div class="logo">
        <span class="logo-title">霍尔果斯市全域综合统一服务门户 (对内功能)</span>
      </div>
      <div class="header-right">
        <router-link to="/">返回首页</router-link>
        <span class="user-info">管理员 Admin</span>
      </div>
    </header>
    
    <main class="main-content">
      <aside class="sidebar">
        <div 
          v-for="item in menuItems" 
          :key="item.name"
          :class="['sidebar-item', { active: activeMenu === item.name }]"
          @click="activeMenu = item.name"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="name">{{ item.name }}</span>
        </div>
      </aside>

      <section class="dashboard">
        <div class="welcome-banner">
          <div class="banner-text">
            <h2>欢迎回来，管理员</h2>
            <p>今天是 2026年6月9日，星期二。您有 3 条待办任务需要处理。</p>
          </div>
          <div class="banner-img">
            <img src="../assets/img/jimeng-2026-04-26-6263.png" alt="welcome" />
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-info">
              <h3>总办理量</h3>
              <div class="value">1,284</div>
            </div>
            <div class="stat-chart">
               <div class="mini-bar" style="height: 40%; background: #0084ff;"></div>
               <div class="mini-bar" style="height: 60%; background: #0084ff;"></div>
               <div class="mini-bar" style="height: 80%; background: #0084ff;"></div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <h3>平均效率</h3>
              <div class="value">2.4h</div>
            </div>
            <div class="trend down">-5.2%</div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <h3>在线用户</h3>
              <div class="value">42</div>
            </div>
            <div class="trend">稳定运行中</div>
          </div>
        </div>

        <div class="bottom-sections">
          <div class="chart-section">
            <div ref="statChartRef" class="chart-dom"></div>
          </div>
          <div class="tasks-section">
            <div class="section-header">
              <h3>最近待办</h3>
              <a href="#" class="more">查看全部 ></a>
            </div>
            <ul class="task-list">
              <li v-for="task in pendingTasks" :key="task.id">
                <div class="task-info">
                   <span class="task-title">{{ task.title }}</span>
                   <span class="task-date">{{ task.date }}</span>
                </div>
                <span :class="['task-status', task.status]">{{ task.status }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.internal-container {
  background: #f0f5fa url('../assets/img/zbg1.png') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.internal-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 15px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.internal-header .logo-title {
  font-size: 20px;
  font-weight: bold;
  color: #0084ff;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  gap: 25px;
  align-items: center;
}

.header-right a {
  color: #666;
  font-size: 14px;
  text-decoration: none;
  transition: 0.3s;
}

.header-right a:hover {
  color: #0084ff;
}

.user-info {
  background: linear-gradient(90deg, #e6f7ff 0%, #bae7ff 100%);
  color: #0050b3;
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.main-content {
  display: flex;
  flex: 1;
  max-width: 1400px;
  margin: 20px auto;
  width: calc(100% - 40px);
  gap: 20px;
}

.sidebar {
  width: 220px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 16px;
  padding: 20px 0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}

.sidebar-item {
  padding: 15px 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #555;
  margin: 0 10px 5px;
  border-radius: 10px;
}

.sidebar-item:hover {
  background: rgba(0, 132, 255, 0.05);
  color: #0084ff;
}

.sidebar-item.active {
  background: #0084ff;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 132, 255, 0.2);
}

.dashboard {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-banner {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  color: white;
  padding: 35px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 25px rgba(24, 144, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  right: -50px;
  top: -50px;
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
}

.banner-text h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.banner-text p {
  opacity: 0.8;
  font-size: 16px;
}

.banner-img img {
  height: 100px;
  filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2));
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.stat-info h3 {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.stat-info .value {
  font-size: 30px;
  font-weight: bold;
  color: #333;
}

.stat-chart {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 40px;
}

.mini-bar {
  width: 6px;
  border-radius: 3px;
}

.trend {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  background: #f5f5f5;
  color: #666;
}

.trend.up { color: #52c41a; background: #f6ffed; }
.trend.down { color: #f5222d; background: #fff1f0; }

.bottom-sections {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 20px;
}

.chart-section, .tasks-section {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}

.chart-dom {
  width: 100%;
  height: 380px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h3 {
  font-size: 18px;
  color: #333;
  position: relative;
  padding-left: 15px;
}

.section-header h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: #0084ff;
  border-radius: 2px;
}

.more {
  color: #999;
  font-size: 13px;
  text-decoration: none;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-list li {
  padding: 15px;
  background: #f8fbff;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;
}

.task-list li:hover {
  background: #f0f7ff;
  transform: translateX(5px);
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.task-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.task-date {
  font-size: 12px;
  color: #999;
}

.task-status {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
}

.task-status.待审批 { background: #fff7e6; color: #fa8c16; }
.task-status.待阅读 { background: #e6f7ff; color: #1890ff; }
.task-status.紧急 { background: #fff1f0; color: #f5222d; }
</style>
