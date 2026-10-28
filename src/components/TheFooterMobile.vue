<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="mobile-footer-wrapper">
    <div class="mobile-banner-inner">
      <span class="banner-text">{{ t('footer.organizer') }}</span>
      <span class="banner-text links">{{ t('footer.aboutUs') }} | {{ t('footer.copyright') }} | {{ t('footer.privacy') }} | {{ t('footer.contactUs') }}</span>
      <span class="banner-text brand">{{ t('footer.portalTitle') }}</span>
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
