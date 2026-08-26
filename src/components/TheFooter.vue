<template>
  <footer class="footer-wrapper">
    <div class="banner-inner">
      <span class="banner-text">主办：霍尔果斯市人民政府办公室     关于我们  |  版权保护  |  隐私声明  |  联系我们</span>
      <span class="banner-text">数字霍尔果斯 · 全域统一综合服务门户</span>
    </div>
  </footer>
</template>

<style scoped>
.footer-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 40px;
  background: rgba(30, 41, 59, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 100;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.banner-inner {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.banner-text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}
</style>
