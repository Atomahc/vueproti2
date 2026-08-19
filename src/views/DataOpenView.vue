<script setup lang="ts">
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'
</script>

<template>
  <div class="data-open-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="data" />

      <div class="data-open-body">
        <!-- 统计数据查阅 -->
        <section class="data-section">
          <div class="section-header">
            <div class="header-icon orange-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M7 7h10M7 11h10M7 15h6" />
              </svg>
            </div>
            <div class="header-text">
              <h2>统计数据查阅</h2>
              <p>统计公报/年鉴/调查数据</p>
            </div>
          </div>

          <div class="cards-grid">
            <div class="data-card orange-card">
              <div class="card-info">
                <h3>统计公报</h3>
                <p>年度/季度</p>
              </div>
              <div class="card-img-placeholder">
                 <img src="@/assets/other/gg1.png" alt="统计公报" />
              </div>
            </div>
            <div class="data-card orange-card">
              <div class="card-info">
                <h3>统计年鉴</h3>
                <p>历年汇编</p>
              </div>
              <div class="card-img-placeholder">
                 <img src="@/assets/other/gg2.png" alt="统计年鉴" />
              </div>
            </div>
            <div class="data-card orange-card">
              <div class="card-info">
                <h3>调查数据</h3>
                <p>专项调查</p>
              </div>
              <div class="card-img-placeholder">
                 <img src="@/assets/other/gg3.png" alt="调查数据" />
              </div>
            </div>
          </div>
        </section>

        <!-- 数据可视化看板 -->
        <section class="data-section">
          <div class="section-header">
            <div class="header-icon green-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18" />
                <path d="M18 9l-5 5-4-4-5 5" />
              </svg>
            </div>
            <div class="header-text">
              <h2>数据可视化看板</h2>
              <p>经济运行 · 口岸贸易 · 人口</p>
            </div>
          </div>

          <div class="cards-grid">
            <div class="data-card green-card">
              <div class="card-info">
                <h3>GDP增速</h3>
                <div class="number">8.2<span>%</span></div>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: 82%;"></div>
              </div>
              <div class="card-bg-sketch"></div>
            </div>
            <div class="data-card green-card">
              <div class="card-info">
                <h3>口岸过货量</h3>
                <div class="number">3,856<span>万吨</span></div>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: 65%;"></div>
              </div>
              <div class="card-bg-sketch"></div>
            </div>
            <div class="data-card green-card">
              <div class="card-info">
                <h3>GDP增速</h3>
                <div class="number">8.2<span>%</span></div>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: 82%;"></div>
              </div>
              <div class="card-bg-sketch"></div>
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
  position: relative;
  z-index: 5;
  max-width: 1240px;
  margin: 0 auto;
  padding: 120px 24px 40px 24px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.data-open-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background:#fff;
}

.data-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #ddd;
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
  height: 140px;
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
  border: 1px solid #fde68a;
  box-shadow: inset 0 0 20px rgba(245, 158, 11, 0.05);
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
  height: 106px;
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

</style>
