<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'

const route = useRoute()
const serviceList = ref<any[]>([])
const loading = ref(true)

const fetchServiceList = async () => {
  const id = route.query.id || route.params.id || ''
  
  if (!id) {
    console.warn('No ID provided')
    loading.value = false
    return
  }

  try {
    const res: any = await http.get(`/api-dayu/app/index.php`, {
      i: 23,
      c: 'entry',
      op: 'menulist',
      do: 'index',
      m: 'dayu_form',
      view: 'service',
      serviceid: id,
      navid: 1,
      isapi: 'true'
    })
    
    // Depending on the API response structure, we might need to adjust this.
    if (res && res.code === 0 && res.data) {
      serviceList.value = res.data
    } else if (Array.isArray(res)) {
      serviceList.value = res
    } else {
      // Fallback
      serviceList.value = res.data || res.list || []
    }
  } catch (e) {
    console.error('Failed to fetch menu list:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServiceList()
})
</script>

<template>
  <div class="menu-list-container">
    <TheHeader />

    <main class="main-content">
           <!-- 提取的主导航栏组件 -->
      <TheNavBar activeId="life" />

      <div class="content-box">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="serviceList.length === 0" class="empty">暂无服务列表</div>
        <div v-else class="list-grid">
          <!-- Render generic list as structure is unknown -->
          <div v-for="(item, index) in serviceList" :key="index" class="list-card">
            <h3 class="card-title">{{ item.name || item.title || '未知服务' }}</h3>
            <div class="card-meta">
              <span v-if="item.createTime || item.date">{{ item.createTime || item.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.menu-list-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.main-content {
  height: 850px;
  position: relative;
  z-index: 5;
  width: 1280px;
  margin: 0 auto;
  padding: 120px 0px 40px 0px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
}

.content-box {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
  height: 600px;
  overflow-y: true;
}

.loading, .empty {
  text-align: center;
  padding: 100px 0;
  color: #64748b;
  font-size: 16px;
}

.list-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.list-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  height:90px;
  box-sizing: border-box;
}

.list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #0f172a;
  margin: 0 ;
}


.card-meta {
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  justify-content: flex-end;
}
</style>
