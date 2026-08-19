<script setup lang="ts">
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules'

const modules = [EffectCoverflow, Pagination, Autoplay]

const policyList = [
  {
    title: '自治区党委常委会召开会议',
    date: '2025/04/12 14:32:32',
    desc: '会议认真学习贯彻习近平总书记近期重要讲话重要指示精神，研究贯彻落实举措。会议强调，要深入学习贯彻习近平总书记在中共中央政治局第二十三次集体...',
  },
  {
    title: '自治区党委常委会召开会议',
    date: '2025/04/12 14:32:32',
    desc: '会议认真学习贯彻习近平总书记近期重要讲话重要指示精神，研究贯彻落实举措。会议强调，要深入学习贯彻习近平总书记在中共中央政治局第二十三次集体...',
  },
]

const cultureList = [
  {
    title: '文化非遗名称',
    desc: '文化非遗介绍历史文化非遗介绍历史文化非遗介绍历史文化非遗',
    img: 'https://picsum.photos/800/500?random=21',
  },
  {
    title: '文化非遗名称',
    desc: '文化非遗介绍历史文化非遗介绍历史文化非遗介绍历史文化非遗',
    img: 'https://picsum.photos/800/500?random=22',
  },
  {
    title: '文化非遗名称',
    desc: '文化非遗介绍历史文化非遗介绍历史文化非遗介绍历史文化非遗',
    img: 'https://picsum.photos/800/500?random=23',
  },
  {
    title: '文化非遗名称',
    desc: '文化非遗介绍历史文化非遗介绍历史文化非遗介绍历史文化非遗',
    img: 'https://picsum.photos/800/500?random=24',
  },
  {
    title: '文化非遗名称',
    desc: '文化非遗介绍历史文化非遗介绍历史文化非遗介绍历史文化非遗',
    img: 'https://picsum.photos/800/500?random=25',
  },
]
</script>

<template>
  <div class="into-khorgos-view">
    <TheHeader />

    <!-- Overview Section -->
    <section class="section overview-section">
      <div class="container">
        <div class="overview-content">
          <div class="overview-image">
            <img src="https://picsum.photos/600/400?random=10" alt="霍尔果斯概览" />
          </div>
          <div class="overview-text">
            <h2 class="section-title-left">霍尔果斯概览</h2>
            <p>
              霍尔果斯市。隶属于中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州，地处中国西部边境，与哈萨克斯坦接壤，西东接内陆省市，是321国道、连霍高速公路的终点。距伊犁州府伊宁市90千米，距新疆维吾尔自治区首府乌鲁木齐市670千米，距中亚中心城市哈萨克斯坦首都阿拉木图378千米，对外覆盖半径3000千米以内的区域是中亚地区人口稠密区。经计发、达成和市场中心。截至2024年，霍尔果斯辖5个街道、1个民族乡、2个兵团团场，霍尔果斯市域面积1900.55平方千米。截至2010年来，霍尔果斯市户籍人口65227人。
            </p>
            <div class="come-to-khorgos">COME TO KHORGOS</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cultural Heritage -->
    <section class="section culture-section">
      <div class="container">
        <h2 class="section-title">文化非遗</h2>
        <swiper
          :effect="'coverflow'"
          :grabCursor="true"
          :centeredSlides="true"
          :slidesPerView="'auto'"
          :loop="true"
          :autoplay="{
            delay: 4000,
            disableOnInteraction: false,
          }"
          :coverflowEffect="{
            rotate: 0,
            stretch: 500,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }"
          :pagination="{ clickable: true }"
          :modules="modules"
          class="culture-swiper"
        >
          <swiper-slide v-for="(item, index) in cultureList" :key="index">
            <div class="culture-card">
              <img :src="item.img" alt="文化非遗" />
              <div class="culture-info-overlay">
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </section>

    <!-- Policies & Monitoring -->
    <section class="section policy-section">
      <div class="container">
        <div class="policy-grid">
          <div class="policy-column">
            <h2 class="column-title">优惠政策</h2>
            <div class="policy-item" v-for="(item, index) in policyList" :key="index">
              <h3>{{ item.title }}</h3>
              <span class="date">{{ item.date }}</span>
              <p>{{ item.desc }}</p>
            </div>
          </div>
          <div class="policy-column">
            <h2 class="column-title">营销环境监测</h2>
            <div class="policy-item" v-for="(item, index) in policyList" :key="index">
              <h3>{{ item.title }}</h3>
              <span class="date">{{ item.date }}</span>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Investment Map Placeholder -->
    <section class="section investment-section">
      <div class="container">
        <h2 class="section-title">投资霍尔果斯</h2>
        <div class="map-container">
          <img
            src="https://picsum.photos/1200/500?random=30"
            alt="Map Placeholder"
            class="map-bg"
          />
        </div>
      </div>
    </section>

    <!-- CTA Cards -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-grid">
          <div class="cta-card blue-cta">
            <div class="cta-content">
              <h3>投资指南与成本</h3>
              <router-link to="#" class="cta-link">立即查看 ></router-link>
            </div>
            <img src="https://picsum.photos/400/200?random=40" alt="Investment Guide" />
          </div>
          <div class="cta-card cyan-cta">
            <div class="cta-content">
              <h3>招商项目</h3>
              <router-link to="#" class="cta-link">立即查看 ></router-link>
            </div>
            <img src="https://picsum.photos/400/200?random=41" alt="Investment Projects" />
          </div>
        </div>
      </div>
    </section>

    <TheFooter />
  </div>
</template>

<style scoped>
.into-khorgos-view {
  background-color: #fff;
}

.section {
  padding: 30px 0;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  font-weight: bold;
  color: #333;
}
.overview-section {
  background: url('../assets/img/zbg1.png') no-repeat;
  background-size: 100% 100%;
  height: 1300px;
  width: 100%;
  box-sizing: border-box;
}
.policy-section {
  background: url('../assets/img/zbg2.png') no-repeat;
  background-size: 100% 100%;
}
.investment-section {
  background: url('../assets/img/zbg3.png') no-repeat;
  background-size: 100% 100%;
}

.section-title-left {
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #333;
}

/* Overview */
.overview-content {
  background: #fff;
  border-radius: 16px;
  margin-top: 750px;
  padding: 20px 40px;
  display: flex;
  gap: 50px;
  align-items: center;
}

.overview-image {
  flex: 1;
}

.overview-image img {
  width: 100%;
  border-radius: 8px;
}

.overview-text {
  flex: 1.2;
}

.overview-text p {
  line-height: 1.8;
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
}

.come-to-khorgos {
  font-size: 40px;
  color: #eee;
  font-weight: bold;
  font-family: Arial, sans-serif;
  text-align: right;
  letter-spacing: 2px;
}

/* Culture Swiper */
.culture-swiper {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 60px;
}

.swiper-slide {
  width: 800px;
  height: 500px;
  transition: all 0.3s;
}

.culture-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.culture-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.culture-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.4) 70%,
    transparent 100%
  );
  color: white;
  padding: 40px 30px 25px;
}

.culture-info-overlay h3 {
  font-size: 24px;
  margin-bottom: 12px;
  font-weight: 600;
}

.culture-info-overlay p {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.swiper-slide:not(.swiper-slide-active) {
  opacity: 0.6;
}

:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: #cbd5e1;
  opacity: 1;
  margin: 0 6px !important;
}

:deep(.swiper-pagination-bullet-active) {
  background: #0084ff;
  width: 30px;
  border-radius: 6px;
}

/* Policy Section */
.policy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.column-title {
  font-size: 24px;
  margin-bottom: 30px;
  padding-left: 15px;
  border-left: 4px solid #0084ff;
}

.policy-item {
  background: #f8fbff;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.policy-item h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.policy-item .date {
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 15px;
}

.policy-item p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* Investment Map */
.map-container {
  position: relative;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
}

.map-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-overlay {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 10;
}

.search-bar {
  display: flex;
  background: white;
  padding: 5px;
  border-radius: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.search-bar input {
  flex: 1;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  outline: none;
}

.search-btn {
  background: #0084ff;
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

/* CTA Cards */
.cta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.cta-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 40px;
  border-radius: 12px;
  color: white;
  overflow: hidden;
  height: 180px;
}

.blue-cta {
  background: linear-gradient(135deg, #0084ff 0%, #00c6ff 100%);
}

.cyan-cta {
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
}

.cta-content h3 {
  font-size: 24px;
  margin-bottom: 20px;
}

.cta-link {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  transition: background 0.3s;
}

.cta-link:hover {
  background: rgba(255, 255, 255, 0.3);
}

.cta-card img {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  opacity: 0.9;
}
</style>
