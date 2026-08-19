<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => {
  // 禁止 Ctrl / Command + 鼠标滚轮缩放
  document.addEventListener('wheel', (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
    }
  }, { passive: false })

  // 禁止 Ctrl/Command + '+' / '-' / '0' 键盘缩放
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault()
    }
  })

  // 禁止移动端手势双指放大
  document.addEventListener('gesturestart', (e: Event) => {
    e.preventDefault()
  })
})
</script>

<template>
  <div class="global-app-container">
    <!-- 全局占满全屏背景图 -->
    <div class="global-bg-wrapper">
      <img src="@/assets/img/indexbg.png" alt="背景图" class="global-bg-img" />
    </div>
    <div class="app-main-view">
      <RouterView />
    </div>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  touch-action: manipulation;
  -webkit-text-size-adjust: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
}

ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

.global-app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

/* 占满全屏的底层背景图 */
.global-bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.global-bg-img {
  width: 100vw;
  height: 100vh;
}



.app-main-view {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
}
</style>
