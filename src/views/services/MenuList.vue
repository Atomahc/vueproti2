<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'

const route = useRoute()
const router = useRouter()
const formsList = ref<any[]>([])
const navList = ref<any[]>([])
const loading = ref(true)
const currentId = ref<string>('')

const fetchServiceList = async (id: string) => {
  if (!id) return
  loading.value = true
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
    
    let data = res.data || res;
    if (data && data.forms) {
      formsList.value = Object.values(data.forms)
      navList.value = Object.values(data.navlist || {})
    } else {
      formsList.value = []
      navList.value = []
    }
  } catch (e) {
    console.error('Failed to fetch menu list:', e)
  } finally {
    loading.value = false
  }
}

const handleMenuClick = (item: any) => {
  if (item.id === currentId.value) return;
  currentId.value = item.id;
  router.replace({ query: { ...route.query, id: item.id } });
  fetchServiceList(item.id);
}

const goToForm = (reid: string) => {
  if (!reid) return
  router.push({ path: '/service/dayu-form', query: { id: reid } })
}

onMounted(() => {
  const id = (route.query.id || route.params.id || '') as string;
  currentId.value = id;
  fetchServiceList(id)
})
import BannerSideOverlay from '@/components/BannerSideOverlay.vue'
</script>

<template>
  <div class="menu-list-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="life" />

      <div style="display: flex; gap: 20px; flex: 1; height: 100%;">
        <div class="content-box" style="flex: 1; min-width: 0;">
        <div class="layout-container">
          <!-- 左侧菜单列表 -->
          <div class="sidebar">
            <div class="sidebar-title">服务菜单</div>
            <ul class="nav-menu">
              <li 
                v-for="(nav, index) in navList" 
                :key="index"
                :class="['nav-item', { active: nav.id == currentId }]"
                @click="handleMenuClick(nav)"
              >
                {{ nav.title }}
              </li>
            </ul>
          </div>
          
          <!-- 右侧表单列表 -->
          <div class="main-list">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="formsList.length === 0" class="empty">暂无表单列表</div>
            <div v-else class="list-grid">
              <div v-for="(item, index) in formsList" :key="index" class="list-card" @click="goToForm(item.reid)">
                <div class="card-left">
                  <h3 class="card-title">{{ item.title || '未知表单' }}</h3>
                  <p class="card-desc" v-if="item.par?.business">受理单位：{{ item.par.business }}</p>
                  <p class="card-desc" v-if="item.customtags">{{ item.customtags }}</p>
                </div>
                <div class="card-right" v-if="item.icon">
                  <img :src="item.icon" alt="icon" class="form-icon" />
                </div>
              </div>
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

.content-box {
  background: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: 600px;
  overflow: hidden;
  display: flex;
}

.layout-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 250px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.nav-item {
  padding: 16px 20px;
  font-size: 15px;
  color: #475569;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f1f5f9;
}

.nav-item.active {
  background: #eff6ff;
  color: #3b82f6;
  font-weight: 500;
  border-right: 3px solid #3b82f6;
}

.main-list {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.loading, .empty {
  text-align: center;
  padding: 100px 0;
  color: #64748b;
  font-size: 16px;
}

.list-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.list-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.card-left {
  flex: 1;
  margin-right: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.card-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 4px 0;
  width:350px;
        white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
}

.form-icon {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}
</style>
