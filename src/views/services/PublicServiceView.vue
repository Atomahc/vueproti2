<script setup lang="ts">
import { ref } from 'vue'
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'

// 随手拍表单
const activeReportType = ref('占道经营')
const reportTypes = ['占道经营', '车辆违停', '路灯故障', '井盖缺失', '道路不洁', '不文明行为']
const reportInput = ref('')

// 劳道智工 热门职务
const hotJobsCount = ref(6)

// 社区便民 5列2行 10个服务 (蓝色细线图标)
const communityServices = [
  { name: '民政救助', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: '身份户籍', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6' },
  { name: '出境入境', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: '军优服务', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { name: '医疗健康', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { name: '社保医保', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: '教育科技', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.605 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { name: '爱心助残', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { name: '创业就业', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { name: '金色暖阳', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' }
]

// 生活服务 5列2行 10个服务 (精确匹配设计图)
const lifeServices = [
  { name: '交通驾驶', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { name: '学历证书', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { name: '企业信息', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9' },
  { name: '出入境', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
  { name: '被执行人', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { name: '个税查询', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: '学籍信息', icon: 'M12 14l9-5-9-5-9 5 9 5z' },
  { name: '征信查询', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: '招考查询', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16' },
  { name: '法律法规', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
]
</script>

<template>
  <div class="public-page-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="life" />

      <div class="content-box">
        <div class="bm-grid">
          <!-- 1. 城市治理 · 随手拍 -->
          <div class="bm-card shoot-card">
            <div class="card-header green-theme">
              <div class="header-title-box">
                <div class="icon-square green">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                    <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <div>
                  <h2>城市治理 · 随手拍</h2>
                  <p class="subtitle">发现一分派一处置一反馈闭环</p>
                </div>
              </div>
            </div>

            <div class="shoot-body">
              <label class="form-label">上报类型</label>
              <div class="type-tags">
                <button
                  v-for="t in reportTypes"
                  :key="t"
                  :class="['tag-btn', { active: activeReportType === t }]"
                  @click="activeReportType = t"
                >
                  {{ t }}
                </button>
              </div>
              <textarea
                v-model="reportInput"
                placeholder="请输入..."
                class="shoot-textarea"
              ></textarea>
              <button class="submit-btn green">立即上传</button>
            </div>
          </div>

          <!-- 2. 劳道智工 · 短期工 -->
          <div class="bm-card teal-tint">
            <div class="card-header-flex">
              <div class="header-title-box">
                <div class="icon-square teal">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                </div>
                <h2>劳道智工 · <span>短期工</span></h2>
              </div>
              <span class="arrow">&gt;</span>
            </div>

            <div class="short-job-body">
              <div class="job-tags-grid">
                <span class="j-tag">零工市场</span>
                <span class="j-tag">高薪职位</span>
                <span class="j-tag">网络职位</span>
                <span class="j-tag">今日招聘</span>
                <span class="j-tag">附近职位</span>
                <span class="j-tag">同城信息</span>
              </div>
              <div class="hot-job-banner">
                <span>热门职务 <strong>*{{ hotJobsCount }}</strong></span>
                <a href="#" class="view-link">查看 &rarr;</a>
              </div>
            </div>
          </div>

          <!-- 3. 中亚直通桥 · 长期工 -->
          <div class="bm-card yellow-tint">
            <div class="card-header-flex">
              <div class="header-title-box">
                <div class="icon-square orange">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                  </svg>
                </div>
                <h2>中亚直通桥 · <span>长期工</span></h2>
              </div>
              <span class="arrow">&gt;</span>
            </div>

            <div class="long-job-body">
              <p class="desc-text">集成长期岗位，与劳道智工短期工形成短期+长期全覆盖就业服务体系。</p>
              <button class="yellow-action-btn">
                找人才/找工作 <span class="sub-link">职位列表 &rarr;</span>
              </button>
            </div>
          </div>

          <!-- 4. 社区便民 -->
          <div class="bm-card blue-tint-card">
            <div class="card-header-flex">
              <h2>社区便民</h2>
              <span class="arrow">&gt;</span>
            </div>
            <div class="services-icon-grid">
              <div v-for="(s, i) in communityServices" :key="i" class="icon-item-box">
                <div class="svg-icon-blue">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0066ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path :d="s.icon" />
                  </svg>
                </div>
                <span>{{ s.name }}</span>
              </div>
            </div>
          </div>

          <!-- 5. 生活服务 -->
          <div class="bm-card blue-tint-card">
            <div class="card-header-flex">
              <h2>生活服务</h2>
              <span class="arrow">&gt;</span>
            </div>
            <div class="services-icon-grid">
              <div v-for="(s, i) in lifeServices" :key="i" class="icon-item-box">
                <div class="svg-icon-blue">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0066ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path :d="s.icon" />
                  </svg>
                </div>
                <span>{{ s.name }}</span>
              </div>
            </div>
          </div>

          <!-- 底部三列横向入口卡片 -->
          <div class="bm-card footer-small-card">
            <div class="small-card-content">
              <div class="card-icon-square purple">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <div class="text-info">
                <h3>青少年活动中心 &rarr;</h3>
                <p>兴趣课程查询/报名/成果展示</p>
              </div>
            </div>
          </div>

          <div class="bm-card footer-small-card">
            <div class="small-card-content">
              <div class="card-icon-square cyan">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3" />
                </svg>
              </div>
              <div class="text-info">
                <h3>文旅服务 &rarr;</h3>
                <p>兴趣课程查询/报名/成果展示</p>
              </div>
            </div>
          </div>

          <div class="bm-card footer-small-card">
            <div class="small-card-content">
              <div class="card-icon-square yellow">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div class="text-info">
                <h3>志愿者服务<span class="sub">(霍尔果斯云)</span> &rarr;</h3>
                <p>活动报名/积分商城</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.public-page-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #1e293b;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
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

/* 内容卡片外壳 */
.content-box {
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 24px;
}

.bm-grid {
  display: grid;
  grid-template-columns: 340px 1fr 1fr;
  gap: 20px;
}

.bm-card {
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 20px;
  box-sizing: border-box;
}

.shoot-card {
  grid-row: span 2;
  background: #e6f9f0;
  border: 1px solid #a7f3d0;
  display: flex;
  flex-direction: column;
}

.header-title-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title-box h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.header-title-box p.subtitle {
  font-size: 12px;
  color: #059669;
  margin: 2px 0 0 0;
}

.icon-square {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-square.green { background: #10b981; }
.icon-square.teal { background: #0d9488; }
.icon-square.orange { background: #f59e0b; }

.shoot-body {
  margin-top: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 13px;
  color: #475569;
  margin-bottom: 12px;
  display: block;
}

.type-tags {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.tag-btn {
  padding: 8px 0;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 12px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.tag-btn.active {
  background: #10b981;
  color: #ffffff;
  border-color: #10b981;
}

.shoot-textarea {
  width: 100%;
  height: 140px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 12px;
  box-sizing: border-box;
  font-size: 13px;
  outline: none;
  resize: none;
  background: #ffffff;
  margin-bottom: 16px;
}

.submit-btn.green {
  background: #10b981;
  color: #ffffff;
  border: none;
  padding: 12px 0;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin-top: auto;
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header-flex h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.card-header-flex h2 span {
  color: #0d9488;
}

.arrow {
  color: #94a3b8;
  font-size: 16px;
}

/* 劳道智工 (Teal) */
.teal-tint {
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
  display: flex;
  flex-direction: column;
}

.short-job-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.job-tags-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.j-tag {
  background: #ffffff;
  border: 1px solid #99f6e4;
  color: #0d9488;
  padding: 6px 0;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}

.hot-job-banner {
  background: #ccfbf1;
  border-radius: 4px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #0d9488;
  margin-top: auto;
}

.hot-job-banner strong {
  font-size: 15px;
  margin-left: 4px;
}

.view-link {
  color: #0d9488;
  text-decoration: none;
  font-weight: 500;
}

/* 中亚直通桥 (Yellow) */
.yellow-tint {
  background: #fffbeb;
  border: 1px solid #fef3c7;
  display: flex;
  flex-direction: column;
}

.long-job-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.desc-text {
  font-size: 13px;
  color: #b45309;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.yellow-action-btn {
  background: #f59e0b;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.yellow-action-btn .sub-link {
  font-size: 13px;
  font-weight: 400;
  opacity: 0.9;
}

/* 社区便民 & 生活服务 (Blue) */
.blue-tint-card {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  grid-column: span 1;
}

/* 底部小卡片 */
.footer-small-card {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  grid-column: span 1;
}

.small-card-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon-square {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon-square.purple { background: #8b5cf6; }
.card-icon-square.cyan { background: #06b6d4; }
.card-icon-square.yellow { background: #f59e0b; }

.text-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.text-info p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.text-info h3 .sub {
  font-size: 12px;
  font-weight: 400;
  color: #94a3b8;
  margin-left: 4px;
}
/* 5列 Icon 布局 */
.services-icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 10px;
}

.icon-item-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.icon-item-box .svg-icon-blue {
  width: 44px;
  height: 44px;
  background: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-item-box:hover .svg-icon-blue {
  background: #0066ff;
  transform: translateY(-2px);
}

.icon-item-box:hover .svg-icon-blue svg {
  stroke: #ffffff;
}

.icon-item-box span {
  font-size: 13px;
  color: #334155;
}

.icon-item-box:hover span {
  color: #0066ff;
  font-weight: 500;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #94a3b8;
  font-size: 18px;
}
</style>
