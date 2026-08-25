<script setup lang="ts">
import { ref } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'

// 模拟的友情链接数据，站群导航
const siteGroups = ref([
  {
    category: '政府机构',
    links: [
      { name: '中国政府网', url: 'https://www.gov.cn' },
      { name: '新疆维吾尔自治区人民政府', url: 'http://www.xinjiang.gov.cn' },
      { name: '伊犁哈萨克自治州人民政府', url: 'http://www.xjyl.gov.cn' },
      { name: '霍尔果斯市人民政府', url: 'http://www.xjhegs.gov.cn' }
    ]
  },
  {
    category: '新闻媒体',
    links: [
      { name: '新华网', url: 'http://www.xinhuanet.com' },
      { name: '人民网', url: 'http://www.people.com.cn' },
      { name: '天山网', url: 'https://www.ts.cn' }
    ]
  },
  {
    category: '公共服务',
    links: [
      { name: '国家政务服务平台', url: 'http://gjzwfw.www.gov.cn' },
      { name: '新疆政务服务网', url: 'https://zwfw.xinjiang.gov.cn' },
      { name: '信用中国', url: 'https://www.creditchina.gov.cn' }
    ]
  }
])

const openLink = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="site-group-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="" />

      <div class="hero-box">
        <div class="page-header">
          <h2 class="page-title">站群导航</h2>
        </div>

        <div class="links-section">
          <div v-for="(group, index) in siteGroups" :key="index" class="link-group">
            <h3 class="group-title">{{ group.category }}</h3>
            <div class="links-grid">
              <div 
                v-for="(link, i) in group.links" 
                :key="i" 
                class="link-card"
                @click="openLink(link.url)"
              >
                {{ link.name }}
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
.site-group-container {
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.hero-box {
  background: #ffffff;
  padding: 40px;
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.page-header {
  margin-bottom: 40px;
  border-bottom: 2px solid #0066ff;
  padding-bottom: 15px;
  display: inline-block;
  align-self: flex-start;
}

.page-title {
  font-size: 24px;
  color: #0066ff;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
}

.links-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.link-group {
  background: #f8fafc;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.group-title {
  font-size: 18px;
  color: #1e293b;
  font-weight: 600;
  margin: 0 0 20px 0;
  padding-left: 12px;
  border-left: 4px solid #0066ff;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.link-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 12px 16px;
  color: #334155;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-card:hover {
  background: #0066ff;
  color: #ffffff;
  border-color: #0066ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.2);
}
</style>
