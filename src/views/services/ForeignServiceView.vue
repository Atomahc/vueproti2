<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'

const { t } = useI18n()

const newsList = computed(() => [
  t('foreign.news1'),
  t('foreign.news2'),
  t('foreign.news3'),
  t('foreign.news4')
])

const transportLinks = computed(() => [
  t('foreign.rideHailing'),
  t('foreign.urbanTransit'),
  t('foreign.ticketingGuide'),
  t('foreign.trafficGuide')
])
const squares = computed(() => [
  t('foreign.tourKhorgos'),
  t('foreign.eatKhorgos'),
  t('foreign.shopKhorgos'),
  t('foreign.specialKhorgos')
])
</script>

<template>
  <div class="foreign-page">
    <TheHeader />

    <!-- Welcome Banner -->
    <section class="welcome-banner textured-bg">
      <div class="container banner-content">
        <div class="welcome-msg">
          <h1>{{ t('foreign.welcomeTitle') }}</h1>
          <p>{{ t('foreign.welcomeDesc') }}</p>
        </div>
        <div class="weather-info">
          <div class="temp">24°C</div>
          <div class="city">{{ t('foreign.tempCity') }}</div>
        </div>
      </div>
    </section>

    <main class="container">
      <!-- Top Section: Carousel and Investment -->
      <section class="top-section">
        <div class="carousel-box">
          <div class="placeholder-img textured-bg">
            <span>{{ t('foreign.gallery') }}</span>
          </div>
        </div>
        <div class="invest-box">
          <h3>{{ t('foreign.investment') }}</h3>
          <p>{{ t('foreign.investmentDesc') }}</p>
          <button class="more-btn">{{ t('foreign.learnMore') }}</button>
        </div>
      </section>

      <!-- Middle Section: Policy and Lifestyle -->
      <section class="middle-section">
        <div class="policy-box">
          <h2 class="section-title">{{ t('foreign.policies') }}</h2>
          <ul class="policy-list">
            <li v-for="item in newsList" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="lifestyle-grid">
          <div v-for="sq in squares" :key="sq" class="square-btn">
            {{ sq }}
          </div>
        </div>
      </section>

      <!-- Map and Transport Section -->
      <section class="map-section">
        <aside class="transport-sidebar">
          <div v-for="link in transportLinks" :key="link" class="transport-btn">
            {{ link }}
          </div>
        </aside>
        <div class="map-area">
          <div class="map-search">
            <input type="text" :placeholder="t('foreign.searchLocation')" />
          </div>
          <div class="map-placeholder">
            <span>{{ t('foreign.mapArea') }}</span>
          </div>
        </div>
      </section>

      <!-- Feedback Section -->
      <section class="feedback-section">
        <div class="feedback-left">
          <h3>{{ t('foreign.suggestions') }}</h3>
          <textarea :placeholder="t('foreign.suggestionsPlaceholder')"></textarea>
        </div>
        <div class="feedback-right">
          <div class="contact-info">
            <p><strong>{{ t('foreign.hotline') }}</strong> 0999-XXXXXXX</p>
            <p><strong>{{ t('foreign.contact') }}</strong> khorgos_service@example.com</p>
          </div>
          <button class="submit-btn">{{ t('foreign.submit') }}</button>
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.foreign-page {
  background-color: transparent;
  min-height: calc(100vh / var(--app-zoom, 1));
  color: #1e293b;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.textured-bg {
  background-color: #f0f9ff;
  background-image: radial-gradient(#bae6fd 0.5px, transparent 0.5px);
  background-size: 15px 15px;
}

.welcome-banner {
  padding: 40px 0;
  border-bottom: 1px solid #e0f2fe;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-msg h1 {
  font-size: 36px;
  color: #0369a1;
  margin-bottom: 10px;
}

.welcome-msg p {
  color: #64748b;
  font-size: 18px;
}

.weather-info {
  text-align: right;
  background: white;
  padding: 15px 25px;
  border-radius: 12px;
  border: 1px solid #e0f2fe;
}

.weather-info .temp {
  font-size: 28px;
  font-weight: bold;
  color: #0369a1;
}

.top-section {
  display: flex;
  gap: 30px;
  margin: 40px 0;
}

.carousel-box {
  flex: 7;
  height: 350px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.placeholder-img {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #94a3b8;
}

.invest-box {
  flex: 3;
  background: #0369a1;
  color: white;
  padding: 40px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.invest-box h3 {
  font-size: 24px;
  margin-bottom: 20px;
}

.invest-box h3 small {
  font-size: 14px;
  opacity: 0.8;
}

.invest-box p {
  margin-bottom: 30px;
  font-size: 14px;
  line-height: 1.6;
}

.more-btn {
  padding: 10px 20px;
  background: white;
  color: #0369a1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.middle-section {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.policy-box {
  flex: 1;
  background: white;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.policy-list {
  list-style: disc;
  padding-left: 20px;
}

.policy-list li {
  margin-bottom: 12px;
  color: #475569;
}

.lifestyle-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.square-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.square-btn:hover {
  background: #f0f9ff;
  border-color: #0369a1;
  color: #0369a1;
  transform: translateY(-2px);
}

.map-section {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.transport-sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.transport-btn {
  padding: 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  font-weight: 500;
}

.transport-btn:hover {
  background: #f8fafc;
  color: #0369a1;
}

.map-area {
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: relative;
}

.map-search {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 300px;
  z-index: 10;
}

.map-search input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.map-placeholder {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #94a3b8;
}

.feedback-section {
  display: flex;
  gap: 40px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 60px;
}

.feedback-left {
  flex: 2;
}

.feedback-left h3 {
  margin-bottom: 20px;
}

.feedback-left textarea {
  width: 100%;
  height: 150px;
  padding: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: none;
}

.feedback-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contact-info p {
  margin-bottom: 15px;
  color: #475569;
}

.submit-btn {
  padding: 15px;
  background: #0369a1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>
