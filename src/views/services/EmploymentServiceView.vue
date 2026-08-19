<script setup lang="ts">
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'


import sq1 from '@/assets/other/Frame 59.png'
import sq2 from '@/assets/other/Frame 60.png'
import sq3 from '@/assets/other/Frame 62.png'
import sq4 from '@/assets/other/Frame 61.png'
import sq5 from '@/assets/other/Frame 63.png'
// 上排3个卡片
const topCards = [
  {
    theme: 'red',
    title: '人民网留言',
    sub: '领导留言板',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    bg: sq4
  },
  {
    theme: 'orange',
    title: '网上信访',
    sub: '信访事项提交',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    bg: sq3
  },
  {
    theme: 'blue',
    title: '市长信箱',
    sub: '直接写信给市长',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    bg: sq2
  }
]

// 中排2个卡片
const middleCards = [
  {
    theme: 'cyan',
    title: '12345热线',
    sub: '政务服务便民热线',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    bg: sq1,
    span: 1
  },
  {
    theme: 'green',
    title: '诉求直通车',
    sub: '快速提交直达部门',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    bg: sq5,
    span: 2
  }
]
</script>

<template>
  <div class="appeal-page-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="appeals" />

      <div class="content-box">
        
        <div class="appeals-grid">
          <!-- 上排3个卡片 -->
          <div v-for="card in topCards" :key="card.title" class="appeal-card" :class="card.theme">
            <div class="card-bg" :style="{ backgroundImage: `url(${card.bg})` }"></div>
            <div class="card-content">
              <div class="header-row">
                <div class="icon-sq" :class="'bg-' + card.theme">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path :d="card.icon" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="text-group">
                  <h3>{{ card.title }}</h3>
                  <p>{{ card.sub }}</p>
                </div>
              </div>
              <button class="view-btn" :class="'btn-' + card.theme">立即查看 →</button>
            </div>
          </div>

          <!-- 中排2个卡片 -->
          <div v-for="card in middleCards" :key="card.title" 
               class="appeal-card" 
               :class="[card.theme, card.span === 2 ? 'span-2' : '']">
            <div class="card-bg" :style="{ backgroundImage: `url(${card.bg})` }"></div>
            <div class="card-content">
              <div class="header-row">
                <div class="icon-sq" :class="'bg-' + card.theme">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path :d="card.icon" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="text-group">
                  <h3>{{ card.title }}</h3>
                  <p>{{ card.sub }}</p>
                </div>
              </div>
              <button class="view-btn" :class="'btn-' + card.theme">立即查看 →</button>
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
  max-width: 1240px;
  margin: 0 auto;
  padding: 120px 24px 40px 24px;
  width: 100%;
  box-sizing: border-box;
}

.content-box {
  background: #ffffff;
  border-radius: 4px;
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
</style>
