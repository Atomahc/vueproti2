<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
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
  <template v-if="route.path === '/'">
  <div class="banner-side-overlay">
    <div class="vr-card" @click="openIframe('https://sz.xjhegs.gov.cn:3004')">
      <div class="vr-icon-box">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="2" y="6" width="20" height="12" rx="3"></rect>
          <circle cx="8" cy="12" r="2.5"></circle>
          <circle cx="16" cy="12" r="2.5"></circle>
        </svg>
      </div>
      <div class="vr-text">
        <h3>丝路长卷</h3>
        <p> 霍尔果斯·数字城市名片</p>
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
        <p>口岸/合作中心/景区</p>
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
</template>

<style scoped>
.banner-side-overlay {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  height:420px;
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 3;
  padding: 8px;
}

.vr-card {
  flex: 1;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(2px);
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
  width: 100%;
  height: 100vh;
  border-radius: 8px;
  overflow: hidden;

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

@media screen and (max-width: 768px) {
  .vr-card{
    padding: 8px !important;
  }
  .vr-icon-box{
    margin-bottom: 0px;
  }
  .vr-text h3{
    margin:0px;
    font-size: 14px !important;
  }
}
</style>
