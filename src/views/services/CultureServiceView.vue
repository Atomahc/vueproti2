<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'

const router = useRouter()
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX || ''

const cultureTags = ref<any[]>([])
const pageTitle = ref('文旅服务')

const fetchConvenience = async () => {
  try {
    const res: any = await http.get('/api-loca/ncmanagement/class/zones-tree', {
      zoneType: 'convenience',
      platform: 'portal',
      userType: ''
    })
    if (res.code === 0 && res.data && res.data.convenience) {
      const list = res.data.convenience
      const cultureNode = list.find((item: any) => item.name === '文旅服务')
      if (cultureNode) {
        pageTitle.value = cultureNode.name
        cultureTags.value = cultureNode.children || []
      }
    }
  } catch (e) {
    console.error('Failed to fetch convenience services for culture', e)
  }
}

onMounted(() => {
  fetchConvenience()
})

const handleItemClick = (item: any) => {
  if (item.linkType === 'url' && item.url) {
    window.open(item.url, '_blank')
  } else if (item.linkType === 'qrcode' && item.qrcode) {
    // Could add modal logic here if needed
  }
}
</script>

<template>
  <div class="culture-page-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="life" />

      <div class="content-box">
        <div class="page-header">
          <h2 class="page-title">{{ pageTitle }}</h2>
        </div>

        <div class="tags-grid">
          <div 
            v-for="tag in cultureTags" 
            :key="tag.id" 
            class="culture-card" 
            @click="handleItemClick(tag)"
          >
            <div class="card-icon-square cyan">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div class="text-info">
              <h3>{{ tag.name }}</h3>
              <span class="sub-link" v-if="tag.url">立即前往 &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.culture-page-container {
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
  height: 850px;
  position: relative;
  z-index: 5;
  width: 1280px;
  margin: 0 auto;
  padding: 120px 0px 40px 0px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-box {
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 24px;
  height: 600px;
}

.page-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #06b6d4;
  padding-bottom: 15px;
  display: inline-block;
}

.page-title {
  font-size: 22px;
  color: #06b6d4;
  font-weight: 700;
  margin: 0;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
}

.culture-card {
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.culture-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #06b6d4;
}

.card-icon-square {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon-square.cyan { background: #06b6d4; }

.text-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.text-info .sub-link {
  font-size: 13px;
  color: #06b6d4;
}
</style>
