<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'

const route = useRoute()

// 专区配置数据
const zoneConfigs: Record<string, any> = {
  'port': {
    title: '口岸服务专区',
    bannerColor: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    icon: '🚢',
    categories: [
      { name: '通关服务', services: ['进出口申报', '报关单查询', '舱单传输', '税款缴纳'] },
      { name: '物流运输', services: ['车辆进出场预约', '集装箱查询', '多式联运', '危险品运输'] },
      { name: '检验检疫', services: ['动植物检疫', '卫生监督', '商品检验', '证书查询'] },
      { name: '综合保税', services: ['保税仓储', '加工贸易', '跨境电商', '转口贸易'] }
    ]
  },
  'public': {
    title: '便民服务专区',
    bannerColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: '🏠',
    categories: [
      { name: '生活缴费', services: ['水费缴纳', '电费缴纳', '燃气费', '暖气费'] },
      { name: '交通出行', services: ['违章查询', '乘车码', '路况信息', '停车场查询'] },
      { name: '医疗健康', services: ['预约挂号', '医保查询', '核酸检测', '药店查询'] },
      { name: '社保公积金', services: ['社保查询', '公积金提取', '缴费证明', '账户余额'] }
    ]
  },
  'government': {
    title: '政务服务专区',
    bannerColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '🏛️',
    categories: [
      { name: '市场准入', services: ['企业开办', '营业执照', '变更注销', '刻章预约'] },
      { name: '投资建设', services: ['项目备案', '用地审批', '工程规划', '施工许可'] },
      { name: '税务服务', services: ['发票申领', '纳税申报', '证明打印', '个税服务'] },
      { name: '资质认定', services: ['高新技术企业', '研发中心', '专精特新', '知识产权'] }
    ]
  },
  'employment': {
    title: '就业服务专区',
    bannerColor: 'linear-gradient(135deg, #5eeff9 0%, #48c6ef 100%)',
    icon: '💼',
    categories: [
      { name: '求职招聘', services: ['职位搜索', '简历投递', '招聘会信息', '面试指南'] },
      { name: '技能培训', services: ['课程报名', '职业认定', '技能大赛', '培训补贴'] },
      { name: '创业扶持', services: ['创业指导', '担保贷款', '孵化基地', '项目路演'] },
      { name: '人事人才', services: ['档案托管', '职称评定', '落户办理', '高层次人才'] }
    ]
  },
  'legal': {
    title: '云上法务专区',
    bannerColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '⚖️',
    categories: [
      { name: '法律咨询', services: ['在线律所', '公益律师', 'AI法律助手', '文书模板'] },
      { name: '矛盾调解', services: ['在线调解', '调解员预约', '流程追踪', '调解协议'] },
      { name: '仲裁公证', services: ['在线申办', '公证预约', '进度查询', '结果送达'] },
      { name: '法律援助', services: ['援助申请', '条件审核', '案例展示', '联系方式'] }
    ]
  },
  'foreign': {
    title: '境外人员入境便利化专区',
    bannerColor: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)',
    icon: '🌍',
    categories: [
      { name: '签证服务', services: ['在线预约', '材料指南', '进度查询', '延期申请'] },
      { name: '居留许可', services: ['临时宿登记', '工作许可', '永久居留', '地址变更'] },
      { name: '语言服务', services: ['翻译预约', '多语种导引', '文化沙龙', '生活手册'] },
      { name: '生活指南', services: ['银行开户', '手机卡办理', '租房指引', '旅游推荐'] }
    ]
  }
}

const currentZone = computed(() => {
  const type = route.params.type as string
  return zoneConfigs[type] || zoneConfigs['government']
})

const activeTab = ref<number>(0)
</script>

<template>
  <div class="service-zone-view">
    <TheHeader />

    <!-- Hero Banner -->
    <section class="hero-banner" :style="{ background: currentZone.bannerColor }">
      <div class="container">
        <div class="hero-content">
          <div class="zone-icon">{{ currentZone.icon }}</div>
          <div class="zone-title-group">
            <h1>{{ currentZone.title }}</h1>
            <p>为您提供专业、便捷、高效的一站式综合服务</p>
          </div>
          <div class="zone-search">
            <input type="text" :placeholder="`在${currentZone.title}中搜索...`" />
            <button>搜索</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="container">
      <div class="service-layout">
        <!-- Sidebar Navigation -->
        <aside class="service-sidebar">
          <div 
            v-for="(cat, index) in currentZone.categories" 
            :key="index"
            :class="['sidebar-item', { active: activeTab === index }]"
            @click="activeTab = Number(index)"
          >
            {{ cat.name }}
          </div>
        </aside>

        <!-- Service Content -->
        <div class="service-main">
          <div class="content-header">
            <h2>{{ currentZone.categories[activeTab].name }}</h2>
            <router-link to="#" class="more-link">查看更多 ></router-link>
          </div>
          <div class="service-grid">
            <div 
              v-for="(service, sIndex) in currentZone.categories[activeTab].services" 
              :key="sIndex"
              class="service-card"
            >
              <div class="service-icon-small"></div>
              <span class="service-name">{{ service }}</span>
            </div>
          </div>

          <!-- Quick Guides -->
          <div class="guide-section">
            <h3 class="sub-title">办事指南</h3>
            <div class="guide-list">
              <div class="guide-item" v-for="i in 4" :key="i">
                <span class="guide-dot"></span>
                <p>关于{{ currentZone.title }}中{{ currentZone.categories[activeTab].services[i-1] || '相关业务' }}的办理流程及说明</p>
                <span class="guide-date">2026-05-14</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Recommendations -->
      <section class="recommendations">
        <h2 class="section-title">热门服务</h2>
        <div class="recommend-grid">
          <div class="recommend-card" v-for="i in 4" :key="i">
            <div class="recommend-icon"></div>
            <div class="recommend-info">
              <h4>热门业务名称 {{ i }}</h4>
              <p>该业务的简要描述和办理入口</p>
            </div>
            <button class="go-btn">去办理</button>
          </div>
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.service-zone-view {
  background-color: #f8fafc;
  min-height: 100vh;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

/* Hero Banner */
.hero-banner {
  height: 350px;
  display: flex;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-banner::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: skewX(-20deg) translateX(50%);
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 10;
}

.zone-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.zone-title-group h1 {
  font-size: 40px;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.zone-title-group p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 30px;
}

.zone-search {
  display: flex;
  width: 600px;
  background: white;
  padding: 5px;
  border-radius: 30px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.zone-search input {
  flex: 1;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  outline: none;
  font-size: 16px;
}

.zone-search button {
  background: #0084ff;
  color: white;
  border: none;
  padding: 0 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
}

/* Service Layout */
.service-layout {
  display: flex;
  gap: 30px;
  margin-top: -50px;
  position: relative;
  z-index: 20;
}

.service-sidebar {
  width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  overflow: hidden;
  height: fit-content;
}

.sidebar-item {
  padding: 20px 30px;
  cursor: pointer;
  color: #64748b;
  font-weight: 500;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.sidebar-item:hover {
  background: #f1f5f9;
  color: #0084ff;
}

.sidebar-item.active {
  background: #eff6ff;
  color: #0084ff;
  border-left-color: #0084ff;
}

.service-main {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.content-header h2 {
  font-size: 24px;
  color: #1e293b;
}

.more-link {
  color: #94a3b8;
  font-size: 14px;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 50px;
}

.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 15px;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.service-card:hover {
  border-color: #0084ff;
  box-shadow: 0 4px 15px rgba(0,132,255,0.05);
  transform: translateY(-3px);
}

.service-icon-small {
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 12px;
  margin-bottom: 15px;
}

.service-name {
  font-size: 14px;
  color: #334155;
  text-align: center;
}

/* Guide Section */
.guide-section {
  border-top: 1px solid #f1f5f9;
  padding-top: 40px;
}

.sub-title {
  font-size: 18px;
  margin-bottom: 25px;
  color: #1e293b;
}

.guide-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.guide-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.guide-item:hover {
  background: #f1f5f9;
}

.guide-dot {
  width: 6px;
  height: 6px;
  background: #0084ff;
  border-radius: 50%;
  margin-right: 15px;
}

.guide-item p {
  flex: 1;
  font-size: 14px;
  color: #475569;
}

.guide-date {
  font-size: 12px;
  color: #94a3b8;
}

/* Recommendations */
.recommendations {
  margin: 60px 0;
}

.section-title {
  font-size: 24px;
  margin-bottom: 30px;
  color: #1e293b;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.recommend-card {
  display: flex;
  align-items: center;
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  gap: 20px;
}

.recommend-icon {
  width: 60px;
  height: 60px;
  background: #f1f5f9;
  border-radius: 15px;
}

.recommend-info {
  flex: 1;
}

.recommend-info h4 {
  font-size: 16px;
  margin-bottom: 5px;
  color: #1e293b;
}

.recommend-info p {
  font-size: 13px;
  color: #64748b;
}

.go-btn {
  padding: 8px 20px;
  background: #eff6ff;
  color: #0084ff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.go-btn:hover {
  background: #0084ff;
  color: white;
}
</style>
