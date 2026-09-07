<template>
  <footer class="mobile-footer-wrapper">
    <div class="mobile-banner-inner">
      <span class="banner-text">主办：霍尔果斯市人民政府办公室</span>
      <span class="banner-text links">关于我们 | 版权保护 | 隐私声明 | 联系我们</span>
      <span class="banner-text brand">数字霍尔果斯 · 全域统一综合服务门户</span>
    </div>
  </footer>
</template>

<style scoped>
.mobile-footer-wrapper {
  width: 100%;
  padding: 20px 16px 20px 16px;
  background: rgba(30, 41, 59, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  box-sizing: border-box;
  text-align: center;
}

.mobile-banner-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.banner-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.banner-text.links {
  font-size: 11px;
}

.banner-text.brand {
  color: rgba(255, 255, 255, 0.9);
  font-weight: bold;
  margin-top: 4px;
}
</style>
