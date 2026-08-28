<script setup lang="ts">
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX
import { ref, onMounted } from 'vue'
import { http } from '@/api/request'
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'

const foreignServices = ref<any>({ children: [] })
const portCloudItems = ref<any>({ children: [] })
const passServices = ref<any>({ children: [] })
const coopServices = ref<any>({ children: [] })

const fetchCrossBorder = async () => {
  try {
    const res: any = await http.get('/api-loca/ncmanagement/class/zones-tree', {
      zoneType: 'cross_border',
      platform: 'portal',
      userType: ''
    })
    if (res.code === 0 && res.data && res.data.cross_border) {
      const list = res.data.cross_border
      foreignServices.value = list.find((item: any) => item.name === '境外人员便利化专区') || { children: [] }
      portCloudItems.value = list.find((item: any) => item.name === '口岸云集') || { children: [] }
      passServices.value = list.find((item: any) => item.name === '霍数通·通关服务') || { children: [] }
      coopServices.value = list.find((item: any) => item.name === '中哈合作中心智慧服务') || { children: [] }
    }
  } catch (e) {
    console.error('Failed to fetch cross border data:', e)
  }
}

const activeModal = ref<any>(null)

const handleNavigate = (url: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const handleCloudClick = (item: any) => {
  activeModal.value = item
}

const closeModal = () => {
  activeModal.value = null
}

const showIntroModal = () => {
  activeModal.value = {
    name: '口岸云集平台',
    linkDesc: '本平台以可信数字身份为核心底座，覆盖全场景口岸服务，助力提升口岸运营效率、规范市场秩序、带动边民增收、促进产业集聚，实现政府监管精准化、企业服务一体化、群众办事便捷化，为霍尔果斯高质量发展提供数字化支撑。'
  }
}

onMounted(() => {
  fetchCrossBorder()
})
</script>

<template>
  <div class="port-page-container">
    <TheHeader />

    <main class="main-content">
      <!-- 提取的主导航栏组件 -->
      <TheNavBar activeId="cross" />

      <div class="content-box">
        <div class="cross-grid">
          <!-- 1. 境外人员便利化服务 (左上) -->
          <div class="cross-card yellow-tint-card" v-if="foreignServices.id">
            <div class="card-title-header">
              <div class="title-with-square yellow">
                <img :src="foreignServices.icon ? (foreignServices.icon.startsWith('http') ? foreignServices.icon : minioPrefix + foreignServices.icon) : ''" alt="境外人员便利化服务">
              </div>
              <div>
                <h3>{{ foreignServices.name }}</h3>
                <p class="subtitle">{{ foreignServices.remark }}</p>
              </div>
            </div>

            <div class="image-cards-grid grid-4">
              <div v-for="(item, i) in foreignServices.children" :key="i" class="image-item-box" @click="handleNavigate(item.url)">
                <span class="box-title" style="color: #634F00;">{{ item.name }}</span>
                <div class="img-wrapper">
                  <img :src="item.bgImage ? (item.bgImage.startsWith('http') ? item.bgImage : minioPrefix + item.bgImage) : ''" :alt="item.name" />
                  <button class="arrow-btn yellownext" >&rarr;</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. 霍数通·通关服务 (右上) -->
          <div class="cross-card cyan-tint-card" v-if="passServices.id">
            <div class="card-title-header">
              <div class="title-with-square cyan">
                  <img :src="passServices.icon ? (passServices.icon.startsWith('http') ? passServices.icon : minioPrefix + passServices.icon) : ''" alt="">
              </div>
              <div>
                <h3>{{ passServices.name }}</h3>
                <p class="subtitle">{{ passServices.remark }}</p>
              </div>
            </div>

            <div class="image-cards-grid grid-3">
              <div v-for="(item, i) in passServices.children" :key="i" class="image-item-box" @click="handleNavigate(item.url)">
                <span class="box-title" style="color: #005562;">{{ item.name }}</span>
                <div class="img-wrapper">
                  <img :src="item.bgImage ? (item.bgImage.startsWith('http') ? item.bgImage : minioPrefix + item.bgImage) : ''" :alt="item.name" />
                  <button class="arrow-btn lightblue" >&rarr;</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 口岸云集 (左下) -->
          <div class="cross-card blue-tint-card" v-if="portCloudItems.id">
            <div class="card-title-header" style="justify-content: space-between;">
              <div style="display: flex; align-items: center;">
                <div class="title-with-square blue">
                  <img :src="portCloudItems.icon ? (portCloudItems.icon.startsWith('http') ? portCloudItems.icon : minioPrefix + portCloudItems.icon) : ''" alt="">
                </div>
                <div>
                  <h3>{{ portCloudItems.name }}</h3>
                  <p class="subtitle">{{ portCloudItems.remark }}</p>
                </div>
              </div>
              <div style="display: flex; gap: 10px;">
                <button class="action-btn" @click="handleNavigate('https://ca.kouanyun.com/home/index.html')">进入平台</button>
                <button class="action-btn" @click="showIntroModal">平台简介</button>
              </div>
            </div>

            <div class="image-cards-grid grid-5">
              <div v-for="(item, i) in portCloudItems.children" :key="i" class="image-item-box" @click="handleCloudClick(item)">
                <span class="box-title" style="color: #001A49;">{{ item.name }}</span>
                <div class="img-wrapper">
                  <img :src="item.bgImage ? (item.bgImage.startsWith('http') ? item.bgImage : minioPrefix + item.bgImage) : ''" :alt="item.name" />
                  <button class="arrow-btn bluenext" >&rarr;</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 中哈合作中心智慧服务 (右下) -->
          <div class="cross-card purple-tint-card" v-if="coopServices.id">
            <div class="card-title-header">
              <div class="title-with-square purple">
                <img :src="coopServices.icon ? (coopServices.icon.startsWith('http') ? coopServices.icon : minioPrefix + coopServices.icon) : ''" alt="">
              </div>
              <div>              <h3>{{ coopServices.name }}</h3>
                <p class="subtitle">{{ coopServices.remark }}</p>
              </div>
            </div>

            <div class="image-cards-grid grid-5">
              <div v-for="(item, i) in coopServices.children" :key="i" class="image-item-box" @click="handleNavigate(item.url)">
                <span class="box-title" style="color: #000741;">{{ item.name }}</span>
                <div class="img-wrapper">
                  <img :src="item.bgImage ? (item.bgImage.startsWith('http') ? item.bgImage : minioPrefix + item.bgImage) : ''" :alt="item.name" />
                  <button class="arrow-btn purplenext" >&rarr;</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- 简介弹窗 -->
    <div class="modal-overlay" v-if="activeModal" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeModal">&times;</button>
        <div class="modal-header">
          <h2 class="modal-title">{{ activeModal.name }}简介</h2>
        </div>
        <p class="modal-desc">{{ activeModal.linkDesc || '暂无简介' }}</p>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<style scoped>

.grid-4 .image-item-box {
  width: calc(25% - 10px);
}
.image-item-box img {
  width: 100%;
  object-fit: cover;
}

.grid-5 .image-item-box {
  width: calc(33% - 10px);
}

.grid-3 .image-item-box {
  width: calc(33% - 10px);
}


.purple-tint-card .grid-5 .image-item-box {
  width: calc(20% - 10px);
}

.blue-tint-card .img-wrapper .arrow-btn{
  top: 40px;
}
.image-item-box{
  position: relative;
}
.cross-card{

  display: inline-block;
}
.img-wrapper{
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.img-wrapper:hover img{
  transform: scale(1.05);
  transition: transform 0.8s ease;
}
.box-title{
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 111;

}
.img-wrapper .arrow-btn {
  position: absolute;
  top: 60px;
  left: 10px;
  color: white;
  border: none;
  padding: 5px 10px;
}
.yellownext{
  background-color: #DBAF00;
}
.bluenext{
  background-color: #0059FF;
}
.lightblue{
  background-color: #07B7D2;
}
.purplenext{
  background-color: #5835F4;
}
.image-cards-grid{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  justify-content: flex-start;
}
.title-with-square{
  margin-right: 10px;
}
.card-title-header{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
h3 {
  padding:0px;
  margin:0px;
  margin-bottom: 5px;
}
.subtitle{
  font-size: 14px;
  color: #475569;
  padding:0px;
  margin:0px;
}
.yellow-tint-card {
  background: linear-gradient(180deg, rgba(219, 175, 0, 0.2) 0%, rgba(219, 175, 0, 0.02) 100%), #FFFFFF;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #DDDDDD;
  padding:20px;
  box-sizing: border-box;
  width: 606px;
}
.blue-tint-card {
  background: linear-gradient( 180deg, rgba(0,89,255,0.2) 0%, rgba(0,89,255,0.02) 100%), #FFFFFF;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #DDDDDD;
  padding:20px;
  box-sizing: border-box;
  width: 540px;
}

.cyan-tint-card {
  background: linear-gradient( 180deg, rgba(7,183,210,0.2) 0%, rgba(7,183,210,0.02) 100%), #FFFFFF;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #DDDDDD;
  padding:20px;
  box-sizing: border-box;
  width: 606px;
}

.purple-tint-card {
  background: linear-gradient( 180deg, rgba(49,71,240,0.2) 0%, rgba(49,71,240,0.02) 100%), #FFFFFF;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #DDDDDD;
  padding:20px;
  box-sizing: border-box;
  width: 672px;
}

.port-page-container {
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
}

.cat-content {
  flex: 1;
  padding: 40px;
}

.content-block h3 {
  font-size: 20px;
  margin-bottom: 25px;
}

/* 内容卡片外壳 */
.content-box {
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 24px;
    height:600px

}

/* 2x2 网格卡片布局 */
.cross-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.block-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.content-item {
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #475569;
}

.secondary {
  margin-top: 30px;
  border-top: 1px dashed #e2e8f0;
  padding-top: 30px;
}

/* modal styles */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}
.modal-content {
  background: #fff; width: 400px; padding: 24px; border-radius: 8px; position: relative;
}
.modal-close-btn {
  position: absolute; top: 12px; right: 12px;
  background: transparent; border: none; font-size: 24px; cursor: pointer; color: #64748b;
}
.modal-title { font-size: 18px; margin-bottom: 12px; color: #0f172a; font-weight: bold; }
.modal-desc { font-size: 14px; color: #475569; line-height: 1.6; }
.action-btn {
  background-color: #0059FF;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.action-btn:hover {
  background-color: #004ecc;
}

@media screen and (max-width: 768px) {
  .image-cards-grid{
    font-size: 12px !important;
    gap: 12px !important;
  }
  .arrow-btn{
    padding: 5px !important;
    font-size: 8px !important;
    display: none;
  }
  h3{
    font-size: 16px;
  }
  .subtitle{
    font-size: 12px;
  }
  .action-btn{
    font-size: 12px;
    padding:6px 0px;
  }
  .cross-card{
    padding:10px;
  }
}

</style>
