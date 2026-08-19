<script setup lang="ts">
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'

import f80 from '@/assets/other/Frame 80@2x.png'
import f80_1 from '@/assets/other/Frame 80@2x(1).png'
import f80_2 from '@/assets/other/Frame 80@2x(2).png'
import f80_3 from '@/assets/other/Frame 80@2x(3).png'

import f81 from '@/assets/other/Frame 81@2x.png'
import f81_1 from '@/assets/other/Frame 81@2x(1).png'
import f81_2 from '@/assets/other/Frame 81@2x(2).png'
import f81_3 from '@/assets/other/Frame 81@2x(3).png'

import f82 from '@/assets/other/Frame 82@2x.png'
import f82_1 from '@/assets/other/Frame 82@2x(1).png'
import f82_2 from '@/assets/other/Frame 82@2x(2).png'
import f82_3 from '@/assets/other/Frame 82@2x(3).png'

import f83 from '@/assets/other/Frame 83@2x.png'
import f83_1 from '@/assets/other/Frame 83@2x(1).png'
import f83_2 from '@/assets/other/Frame 83@2x(2).png'

import dd from '@/assets/other/ddd.png'

import k1 from '@/assets/other/k1.png'
import k2 from '@/assets/other/k2.png'
import k3 from '@/assets/other/k3.png'
import k4 from '@/assets/other/k4.png'
import k5 from '@/assets/other/k5.png'
import k6 from '@/assets/other/k6.png'
// 1. 境外人员便利化服务
const foreignServices = [
  { name: '出入境须知', img: f80 },
  { name: '乐食霍尔果斯', img: f81 },
  { name: '乐游霍尔果斯', img: f82 },
  { name: '乐购霍尔果斯', img: f83 }
]

// 2. 口岸云集 (使用 f81系列 和 f84)
const portCloudItems = [
  { name: '边民互市', img: k1 },
  { name: '品味新疆', img: k2 },
  { name: '跨级递送', img: k3 },
  { name: '中亚专区', img: k4 },
  { name: '源头采集', img: k5 },
  { name: '商贸货代专区', img: k6 }
]

// 3. 霍数通·通关服务
const passServices = [
  { name: '出境重车预约', img: f81_2 },
  { name: '物流服务', img: f82_2 },
  { name: '出境商品车预约', img: f81_2 }
]

// 4. 中哈合作中心智慧服务
const coopServices = [
  { name: '资讯公示', img: f80_3 },
  { name: '审批协同', img: f81_3 },
  { name: '人车通关与商户信息', img: f82_3 },
  { name: '旅游购物', img: f83_2 },
  { name: '企业服务', img: dd } // fallback reusing f82
]
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
          <div class="cross-card yellow-tint-card">
            <div class="card-title-header">
              <div class="title-with-square yellow">
                <img src="@/assets/other/Group 58@2x.png" alt="境外人员便利化服务">
              </div>
              <div>
                <h3>境外人员便利化服务</h3>
                <p class="subtitle">多语种·一站式涉外服务</p>
              </div>
            </div>

            <div class="image-cards-grid grid-4">
              <div v-for="(item, i) in foreignServices" :key="i" class="image-item-box">
                <span class="box-title" style="color: #634F00;">{{ item.name }}</span>
                <div class="img-wrapper">
                  <img :src="item.img" :alt="item.name" />
                  <button class="arrow-btn yellownext">&rarr;</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 口岸云集 (右上) -->
          <div class="cross-card blue-tint-card">
            <div class="card-title-header">
              <div class="title-with-square blue">
                <img src="@/assets/other/Group 58@2x(1).png" alt="">
              </div>
              <div>
                <h3>口岸云集</h3>
                <p class="subtitle">口岸综合数据·实时态势</p>
              </div>
            </div>

            <div class="image-cards-grid grid-5">
              <div v-for="(item, i) in portCloudItems" :key="i" class="image-item-box">
                <span class="box-title" style="color: #001A49;">{{ item.name }}</span>
                <div class="img-wrapper">
                  <img :src="item.img" :alt="item.name" />
                  <button class="arrow-btn bluenext">&rarr;</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. 霍数通·通关服务 (左下) -->
          <div class="cross-card cyan-tint-card">
            <div class="card-title-header">
              <div class="title-with-square cyan">
                  <img src="@/assets/other/Group 58@2x(2).png" alt="">
              </div>
              <div>
                <h3>霍数通·通关服务</h3>
                <p class="subtitle">通关预约·一码通行</p>
              </div>
            </div>

            <div class="image-cards-grid grid-3">
              <div v-for="(item, i) in passServices" :key="i" class="image-item-box">
                <span class="box-title" style="color: #005562;">{{ item.name }}</span>
                <div class="img-wrapper">
                  <img :src="item.img" :alt="item.name" />
                  <button class="arrow-btn lightblue">&rarr;</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 中哈合作中心智慧服务 (右下) -->
          <div class="cross-card purple-tint-card">
            <div class="card-title-header">
              <div class="title-with-square purple">
                <img src="@/assets/other/Group 58@2x(3).png" alt="">
              </div>
              <div>              <h3>中哈合作中心智慧服务</h3>
                <p class="subtitle">跨境购物·旅游·商贸</p>
              </div>
            </div>

            <div class="image-cards-grid grid-5">
              <div v-for="(item, i) in coopServices" :key="i" class="image-item-box">
                <span class="box-title" style="color: #000741;">{{ item.name }}</span>
                <div class="img-wrapper">
                  <img :src="item.img" :alt="item.name" />
                  <button class="arrow-btn purplenext">&rarr;</button>
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
.image-item-box{
  position: relative;
}
.cross-card{

  display: inline-block;
}
.img-wrapper img{
 
}
.box-title{
  position: absolute;
  top: 10px;
  left: 10px;

}
.img-wrapper .arrow-btn {
  position: absolute;
  top: 40px;
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
  width: 562px;
}
.blue-tint-card {
  background: linear-gradient( 180deg, rgba(0,89,255,0.2) 0%, rgba(0,89,255,0.02) 100%), #FFFFFF;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #DDDDDD;
  padding:20px;
  box-sizing: border-box;
  width: 562px;
}

.cyan-tint-card {
  background: linear-gradient( 180deg, rgba(7,183,210,0.2) 0%, rgba(7,183,210,0.02) 100%), #FFFFFF;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #DDDDDD;
  padding:20px;
  box-sizing: border-box;
  width:460px
}

.purple-tint-card {
  background: linear-gradient( 180deg, rgba(49,71,240,0.2) 0%, rgba(49,71,240,0.02) 100%), #FFFFFF;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #DDDDDD;
  padding:20px;
  box-sizing: border-box;
  width:664px
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
  position: relative;
  z-index: 5;
  max-width: 1240px;
  margin: 0 auto;
  padding: 120px 24px 40px 24px;
  width: 100%;
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
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 24px;

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
</style>
