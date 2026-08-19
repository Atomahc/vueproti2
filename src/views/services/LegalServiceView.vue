<script setup lang="ts">
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'
import yb from '@/assets/other/Group 60.png'
import yb2 from '@/assets/other/Group 61.png'
import yb3 from '@/assets/other/Group 62.png'

import yb4 from '@/assets/other/Group 61(1).png'
import yb5 from '@/assets/other/Group 61(2).png'
import yb6 from '@/assets/other/Group 61(3).png'
import yb7 from '@/assets/other/Group 61(4).png'
// 上半区 驿路法务通 数据
const yiluColumns = [
  {
    title: '律师/律所',
    sub: '律师/律所',
    icon: yb,
    items: [
      { left: 'XXX律所', right: '主理律师：张淑娜' },
      { left: 'XXX律所', right: '主理律师：张淑娜' },
      { left: 'XXX律所', right: '主理律师：张淑娜' }
    ]
  },
  {
    title: '案例查询',
    sub: '案例查询',
    icon: yb2,
    items: [
      { left: '最新案例', right: '07/03' },
      { left: '最新案例', right: '07/03' },
      { left: '最新案例', right: '07/03' }
    ]
  },
  {
    title: '法治资讯',
    sub: '法治资讯',
    icon: yb3,
    items: [
      { left: '法治公开课', right: '07/03' },
      { left: '法治公开课', right: '07/03' },
      { left: '法治公开课', right: '07/03' }
    ]
  }
]

// 下半区 驿路国际法务区 数据
const intlCards = [
  { title: '涉外政务服务指南', img: yb4 },
  { title: '涉外知识普及', img: yb5 },
  { title: '国外法律法规说明', img: yb6 },
  { title: '涉外法律在线法律咨询', img: yb7 }
]
</script>

<template>
  <div class="legal-page-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="cloud" />

      <div class="content-box">
        
        <!-- 上方板块：驿路法务通 -->
        <div class="legal-block">
          <div class="block-header">
            <div class="icon-square blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="header-text">
              <h2>驿路法务通</h2>
              <p>基础法律服务 · 普惠便民</p>
            </div>
          </div>
          
          <div class="yilu-grid">
            <div v-for="(col, idx) in yiluColumns" :key="idx" class="yilu-col-card">
              <div class="col-head">
                <div class="col-title-wrap">
                  <h3>{{ col.title }} <span class="arrow">→</span></h3>
                  <p>{{ col.sub }}</p>
                </div>
                <img :src="col.icon" alt="icon" class="col-icon-img" />
              </div>
              <div class="col-list">
                <div v-for="(item, i) in col.items" :key="i" class="list-item">
                  <span class="dot"></span>
                  <span class="left-text">{{ item.left }}</span>
                  <span class="right-text">{{ item.right }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 下方板块：驿路国际法务区 -->
        <div class="legal-block mt-40" style="background:#fff;border:1px solid #ddd">
          <div class="block-header">
            <div class="icon-square cyan">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M3 3h18v18H3z M12 8v8 M8 12h8" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div class="header-text">
              <h2>驿路国际法务区</h2>
              <p>涉外法律服务 · 跨境商事</p>
            </div>
          </div>

          <div class="intl-grid">
            <div v-for="(card, i) in intlCards" :key="i" class="intl-card">
              <div class="intl-title-wrap">
                <h3>{{ card.title }}</h3>
                <span class="arrow">→</span>
              </div>
              <img :src="card.img" alt="illustration" class="intl-img" />
            </div>
          </div>
        </div>

      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.legal-page-container {
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
  padding: 20px;
}

.legal-block {
  background: linear-gradient( 180deg, rgba(108,144,220,0.24) 0%, rgba(156,186,250,0.08) 100%);
  padding: 20px;
}

.mt-40 {
  margin-top: 24px;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #cbd5e1;
}

.icon-square {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-square svg {
  width: 24px;
  height: 24px;
}
.icon-square.blue { background: #3b82f6; }
.icon-square.cyan { background: #06b6d4; }

.header-text h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}
.header-text p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* 驿路法务通 三列 */
.yilu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.yilu-col-card {
  background:url('@/assets/other/yb.png') no-repeat center center;
  background-size: 100% 100%;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  border-radius: 6px;
  padding: 20px;
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

.list-item {
  display: flex;
  align-items: center;
  background: #EDF2FF;
  padding: 10px 12px;
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
}

.list-item .right-text {
  font-size: 13px;
  color: #64748b;
}

/* 驿路国际法务区 四列 */
.intl-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.intl-card {
  background: url('@/assets/other/Frame 80(1).png') no-repeat center center;
  padding: 16px;
  box-sizing: border-box;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: 90px;
  cursor: pointer;
  transition: all 0.3s;
}

.intl-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.06);
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
</style>
