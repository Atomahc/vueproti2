<script setup lang="ts">
import { ref } from 'vue'

const showIframe = ref(false)
const iframeUrl = ref('')

const openIframe = (url: string) => {
  iframeUrl.value = url
  showIframe.value = true
}

const closeIframe = () => {
  showIframe.value = false
  iframeUrl.value = ''
}
</script>

<template>
  <div class="banner-side-overlay">
    <div class="vr-card" @click="openIframe('http://sz.xjhegs.gov.cn:3004')">
      <div class="vr-icon-box">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="2" y="6" width="20" height="12" rx="3"></rect>
          <circle cx="8" cy="12" r="2.5"></circle>
          <circle cx="16" cy="12" r="2.5"></circle>
        </svg>
      </div>
      <div class="vr-text">
        <h3>丝路长卷</h3>
      </div>
    </div>

    <div class="vr-card" @click="openIframe('https://www.720yun.com/t/5avkOl8758e?scene_id=50999361')">
      <div class="vr-icon-box">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="2" y="6" width="20" height="12" rx="3"></rect>
          <circle cx="8" cy="12" r="2.5"></circle>
          <circle cx="16" cy="12" r="2.5"></circle>
        </svg>
      </div>
      <div class="vr-text">
        <h3>VR全景游</h3>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div class="modal-overlay" v-if="showIframe" @click.self="closeIframe">
      <div class="iframe-modal-content">
        <button class="modal-close-btn" @click="closeIframe">×</button>
        <iframe :src="iframeUrl" frameborder="0" width="100%" height="100%"></iframe>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.banner-side-overlay {
  position: absolute;
  right:-60px;
  top: 300px;
  width: 60px;
  display: flex;
  flex-direction: column;
  z-index: 3;
}

.vr-card {
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
}

.vr-card:hover {
  background: rgba(0, 102, 255, 0.466);
}

.vr-icon-box {
  margin-bottom: 8px;
  opacity: 0.9;
}

.vr-text h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.vr-text p {
  font-size: 11px;
  opacity: 0.75;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.iframe-modal-content {
  position: relative;
  width: 90%;
  height: 85vh;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.modal-close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 24px;
  line-height: 36px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.modal-close-btn:hover {
  background: rgba(0,0,0,0.8);
}
</style>
