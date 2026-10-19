<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '@/api/request'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheNavBar from '@/components/TheNavBar.vue'

const route = useRoute()
const router = useRouter()
const formsList = ref<any[]>([])
const navList = ref<any[]>([])
const loading = ref(true)
const errorMessage = ref('')
const currentId = ref<string>('')

// 兼容从多种位置提取 id (Vue Router query/params, 微信浏览器可能存在的 window.location.search, 以及 hash 内部的 query)
const getParamId = (): string => {
  if (route.query.id) return String(route.query.id).trim()
  if (route.query.serviceid) return String(route.query.serviceid).trim()
  if (route.params.id) return String(route.params.id).trim()

  if (typeof window !== 'undefined' && window.location.search) {
    const searchParams = new URLSearchParams(window.location.search)
    const sid = searchParams.get('id') || searchParams.get('serviceid')
    if (sid) return sid.trim()
  }

  if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('?')) {
    const hashQuery = window.location.hash.split('?')[1]
    const hashParams = new URLSearchParams(hashQuery)
    const hid = hashParams.get('id') || hashParams.get('serviceid')
    if (hid) return hid.trim()
  }

  return ''
}

const fetchServiceList = async (id?: string) => {
  loading.value = true
  errorMessage.value = ''
  try {
    const params: Record<string, any> = {
      i: 23,
      c: 'entry',
      op: 'menulist',
      do: 'index',
      m: 'dayu_form',
      view: 'service',
      navid: 1,
      isapi: 'true'
    }

    if (id) {
      params.serviceid = id
    }

    const res: any = await http.get(`/api-dayu/app/index.php`, params, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    const data = res?.data || res

    if (data) {
      formsList.value = data.forms ? Object.values(data.forms) : []
      navList.value = data.navlist ? Object.values(data.navlist) : []

      // 若当前没有选中项，或选中项不在列表中，默认选中第一个
      if (navList.value.length > 0) {
        const found = navList.value.some(item => String(item.id) === String(currentId.value))
        if (!currentId.value || !found) {
          const firstId = String(navList.value[0].id)
          currentId.value = firstId
          // 如果最初没有传 id 且第一次返回的 formsList 为空，则根据第一个分类重新拉取表单
          if (!id && formsList.value.length === 0) {
            await fetchServiceList(firstId)
            return
          }
        }
      }
    } else {
      formsList.value = []
      navList.value = []
    }
  } catch (e: any) {
    console.error('Failed to fetch menu list:', e)
    errorMessage.value = e?.message || '加载服务列表失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleMenuClick = (item: any) => {
  const targetId = String(item.id)
  if (targetId === currentId.value) return
  currentId.value = targetId
  router.replace({ query: { ...route.query, id: targetId } })
  fetchServiceList(targetId)
}

const goToForm = (reid: string) => {
  if (!reid) return
  router.push({ path: '/service/dayu-form', query: { id: reid } })
}

watch(
  () => route.query.id,
  (newId) => {
    const targetId = (newId as string) || getParamId()
    if (targetId && targetId !== currentId.value) {
      currentId.value = targetId
      fetchServiceList(targetId)
    }
  }
)

onMounted(() => {
  const initialId = getParamId()
  currentId.value = initialId
  fetchServiceList(initialId)
})
</script>

<template>
  <div class="menu-list-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="life" />

      <div class="content-wrapper">
        <div class="content-box">
          <div class="layout-container">
            <!-- 菜单分类列表 (桌面端左侧边栏，移动端/微信端顶部横向滑动分类栏) -->
            <div class="sidebar">
              <div class="sidebar-title">
                <span>服务菜单</span>
                <span v-if="navList.length > 0" class="sidebar-count">（{{ navList.length }}）</span>
              </div>
              <ul class="nav-menu">
                <li
                  v-for="(nav, index) in navList"
                  :key="index"
                  :class="['nav-item', { active: String(nav.id) === String(currentId) }]"
                  @click="handleMenuClick(nav)"
                >
                  {{ nav.title }}
                </li>
              </ul>
            </div>

            <!-- 右侧表单列表 -->
            <div class="main-list">
              <div v-if="loading" class="loading">
                <div class="loading-spinner"></div>
                <span>加载中...</span>
              </div>
              <div v-else-if="errorMessage" class="empty error-box">
                <p>{{ errorMessage }}</p>
                <button class="retry-btn" @click="fetchServiceList(currentId)">重新加载</button>
              </div>
              <div v-else-if="formsList.length === 0" class="empty">
                <p>暂无相关表单</p>
              </div>
              <div v-else class="list-grid">
                <div
                  v-for="(item, index) in formsList"
                  :key="index"
                  class="list-card"
                  @click="goToForm(item.reid)"
                >
                  <div class="card-left">
                    <h3 class="card-title">{{ item.title || '未知表单' }}</h3>
                    <p class="card-desc" v-if="item.par?.business">
                      <span class="label">受理单位：</span>{{ item.par.business }}
                    </p>
                    <p class="card-desc tag" v-if="item.customtags">{{ item.customtags }}</p>
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
  width: 100%;
  min-height: calc(100vh / var(--app-zoom, 1));
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
  padding: 140px 0px 40px 0px;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  flex: 1;
  height: 100%;
  width: 100%;
}

.content-box {
  background: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: 648px;
  overflow: hidden;
  display: flex;
  flex: 1;
  min-width: 0;
  border-radius: 6px;
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
  flex-shrink: 0;
}

.sidebar-title {
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
}

.sidebar-count {
  font-size: 14px;
  font-weight: normal;
  color: #94a3b8;
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
  min-width: 0;
}

.loading, .empty {
  text-align: center;
  padding: 80px 0;
  color: #64748b;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-box p {
  color: #ef4444;
  margin: 0;
}

.retry-btn {
  padding: 8px 20px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #2563eb;
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
 
  margin-right: 16px;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #0f172a;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 4px 0;
  max-width: 350px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc.tag {
  color: #2563eb;
  background: #eff6ff;
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 4px;
}

.form-icon {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

/* 微信浏览器及移动设备专属响应式适配 */
@media screen and (max-width: 768px) {
  .menu-list-container {
    min-height: 100vh !important;
  }

  .main-content {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    padding: 12px !important;
    box-sizing: border-box !important;
    margin: 0 !important;
  }

  .content-wrapper {
    width: 100% !important;
    height: auto !important;
    display: block !important;
  }

  .content-box {
    width: 100% !important;
    height: auto !important;
    min-height: 400px;
    overflow: visible !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    padding: 0 !important;
  }

  .layout-container {
    flex-direction: column !important;
    width: 100% !important;
    height: auto !important;
  }

  .sidebar {
    width: 100% !important;
    border-right: none !important;
    border-bottom: 1px solid #e2e8f0;
    background: #ffffff;
    border-radius: 8px 8px 0 0;
  }

  .sidebar-title {
    padding: 10px 14px 4px 14px;
    font-size: 14px;
    border-bottom: none;
    color: #475569;
  }

  .nav-menu {
    display: flex !important;
    flex-direction: row !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    -webkit-overflow-scrolling: touch;
    padding: 6px 12px 12px 12px !important;
    gap: 8px;
    flex: none !important;
    scrollbar-width: none;
  }

  .nav-menu::-webkit-scrollbar {
    display: none;
  }

  .nav-item {
    flex: 0 0 auto !important;
    padding: 6px 14px !important;
    font-size: 13px !important;
    border-radius: 20px !important;
    border: 1px solid #e2e8f0 !important;
    border-bottom: 1px solid #e2e8f0 !important;
    border-right: 1px solid #e2e8f0 !important;
    background: #f8fafc;
    color: #475569;
  }

  .nav-item.active {
    background: #eff6ff !important;
    color: #3b82f6 !important;
    border-color: #3b82f6 !important;
    font-weight: 600;
  }

  .main-list {
    width: 100% !important;
    padding: 12px !important;
    box-sizing: border-box !important;
    overflow: visible !important;
    height: auto !important;
  }

  .list-grid {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
    width: 100% !important;
  }

  .list-card {
    padding: 14px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .card-left {
    min-width: 0 !important;
    margin-right: 12px !important;
  }

  .card-title {
    font-size: 15px !important;
    white-space: normal !important;
    line-height: 1.4;
    margin-bottom: 6px !important;
  }

  .card-desc {
    max-width: 100% !important;
    width: 100% !important;
    white-space: normal !important;
    font-size: 12px !important;
    line-height: 1.4;
  }

  .form-icon {
    width: 90px !important;
    height: 50px !important;
  }
}
</style>
