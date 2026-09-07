<script setup>
import TheFooterMobile from './TheFooterMobile.vue'
</script>

<template>
  <TheFooterMobile class="mobile-only-comp" />
  <footer class="footer-wrapper desktop-only-comp">
    <div class="footer-content">
      <div class="footer-links">
        <span class="footer-label">友情链接：</span>
        <a href="http://www.xjhegs.gov.cn/" target="_blank">霍尔果斯市人民政府</a>
        <a href="http://urumqi.customs.gov.cn/" target="_blank">乌鲁木齐海关</a>
        <a href="https://www.horgoseport.com/#/" target="_blank">云港·霍数通</a>
        <a href="https://hegsrcjt.com/" target="_blank">霍尔果斯人才集团</a>
      </div>
      <div class="banner-inner">
        <div class="banner-left">
          <div class="banner-text">主办：霍尔果斯市人民政府办公室 &nbsp;&nbsp; 关于我们 | 版权保护 | 隐私声明 | 联系我们</div>
          <div class="banner-text">服务热线：0999-8795893 &nbsp;&nbsp; 地址：新疆伊犁州霍尔果斯</div>
        </div>
        <span class="banner-text right-text">数字霍尔果斯 · 全域统一综合服务门户</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: 12px 0;
}

.footer-content {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.footer-links a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #fff;
  text-decoration: underline;
}

.footer-label {
  font-weight: bold;
  color: #fff;
}

.banner-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.banner-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.banner-text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.right-text {
  font-size: 14px;
  font-weight: 500;
}

/* 宽屏设备 16:9 居中展示 */
@media (min-aspect-ratio: 21/9) {
  .footer-wrapper {
    width: calc(100vh * 21 / 9);
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
