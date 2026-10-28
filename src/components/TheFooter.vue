<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TheFooterMobile from './TheFooterMobile.vue'

const { t } = useI18n()
</script>

<template>
  <TheFooterMobile class="mobile-only-comp" />
  <footer class="footer-wrapper desktop-only-comp">
    <div class="footer-content">
      <div class="banner-inner">
        <div class="banner-left">
          <div class="banner-text">{{ t('footer.organizer') }} &nbsp;&nbsp; {{ t('footer.aboutUs') }} | {{ t('footer.copyright') }} | {{ t('footer.privacy') }} | {{ t('footer.contactUs') }}</div>
          <div class="banner-text">{{ t('footer.hotline') }} &nbsp;&nbsp; {{ t('footer.address') }} &nbsp;&nbsp; {{ t('footer.icp') }}</div>
        </div>
        <div class="banner-right">
          <span class="banner-text right-text">{{ t('footer.portalTitle') }}</span>
          <div class="footer-links">
            <span class="footer-label">{{ t('footer.links') }}</span>
            <a href="http://www.xjhegs.gov.cn/" target="_blank">{{ t('footer.govSite') }}</a>
            <a href="http://urumqi.customs.gov.cn/" target="_blank">{{ t('footer.customsSite') }}</a>
            <a href="https://www.horgoseport.com/#/" target="_blank">{{ t('footer.portSite') }}</a>
            <a href="https://hegsrcjt.com/" target="_blank">{{ t('footer.talentSite') }}</a>
          </div>
        </div>
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

.banner-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
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
    width: calc((100vh * 21 / 9) / var(--app-zoom, 1));
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
