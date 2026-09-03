import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// 修复 hash 模式下 SSO 回调参数丢失的问题
if (window.location.pathname.endsWith('/login/sso-callback')) {
  const search = window.location.search
  const basePath = window.location.pathname.replace(/\/login\/sso-callback$/, '')
  window.history.replaceState(null, '', `${basePath}/#/login/sso-callback${search}`)
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/supply-demand',
      name: 'supply-demand',
      component: () => import('../views/SupplyDemandView.vue'),
    },

    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/article/:id',
      name: 'article-detail',
      component: () => import('../views/ArticleDetail.vue'),
    },
    {
      path: '/news',
      name: 'news-list',
      component: () => import('../views/NewsListView.vue'),
    },
    {
      path: '/data-open',
      name: 'data-open',
      component: () => import('../views/DataOpenView.vue'),
    },
    {
      path: '/into',
      name: 'into-khorgos',
      component: () => import('../views/IntoKhorgosView.vue'),
    },
    {
      path: '/service/port',
      name: 'service-port',
      component: () => import('../views/services/PortServiceView.vue'),
    },
    {
      path: '/service/public',
      name: 'service-public',
      component: () => import('../views/services/PublicServiceView.vue'),
    },
    {
      path: '/service/jobs',
      name: 'service-jobs',
      component: () => import('../views/services/JobListView.vue'),
    },
    {
      path: '/service/government',
      name: 'service-government',
      component: () => import('../views/services/GovServiceView.vue'),
    },
    {
      path: '/service/employment',
      name: 'service-employment',
      component: () => import('../views/services/EmploymentServiceView.vue'),
    },
    {
      path: '/service/legal',
      name: 'service-legal',
      component: () => import('../views/services/LegalServiceView.vue'),
    },
    {
      path: '/service/foreign',
      name: 'service-foreign',
      component: () => import('../views/services/ForeignServiceView.vue'),
    },
    {
      path: '/menulist',
      name: 'menu-list',
      component: () => import('../views/services/MenuList.vue'),
    },
    {
      path: '/service/culture',
      name: 'service-culture',
      component: () => import('../views/services/CultureServiceView.vue'),
    },
    {
      path: '/service/youth-activity',
      name: 'service-youth-activity',
      component: () => import('../views/services/YouthActivityView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/login/sso-callback',
      name: 'sso-callback',
      component: () => import('../views/SsoCallback.vue'),
    },
    {
      path: '/certify',
      name: 'certify',
      component: () => import('../views/CertifyView.vue'),
    },
    {
      path: '/site-group',
      name: 'site-group',
      component: () => import('../views/SiteGroupView.vue'),
    },
    {
      path: '/service/dayu-form',
      name: 'service-dayu-form',
      component: () => import('../views/services/DayuFormView.vue'),
    },
  ],
})

export default router
