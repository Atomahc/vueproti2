<script setup lang="ts">
import { ref } from 'vue'
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'

// 二级 Tab 切换: 'personal' | 'enterprise_bs' | 'enterprise_fw'
const activeSubTab = ref<'personal' | 'enterprise_bs' | 'enterprise_fw'>('personal')

// 1. 个人办事 数据
const personalCategories = [
  {
    title: '社保',
    color: '#00c4cc',
    bgColor: '#e6fcfc',
    items: [
      { name: '社保服务', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
      { name: '社保查询', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { name: '养老保险', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z' },
      { name: '医保缴费', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { name: '失业保险', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.605 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
      { name: '工伤认定', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
    ]
  },
  {
    title: '健康医保',
    color: '#1890ff',
    bgColor: '#e6f7ff',
    items: [
      { name: '医保查询', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: '异地就医', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9' },
      { name: '门诊报销', icon: 'M12 4v16m8-8H4' },
      { name: '慢病申请', icon: 'M9 12h6m-3-3v6m-9 1V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
      { name: '健康档案', icon: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z' }
    ]
  },
  {
    title: '不动产',
    color: '#2f54eb',
    bgColor: '#f0f5ff',
    items: [
      { name: '产权查询', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9' },
      { name: '过户办理', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
      { name: '抵押登记', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
      { name: '不动产证', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { name: '档案查询', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' }
    ]
  },
  {
    title: '不动产2',
    titleDisplay: '不动产',
    color: '#52c41a',
    bgColor: '#f6ffed',
    items: [
      { name: '公租房申请', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { name: '住房公积金', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { name: '房产证明', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: '物业备案', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { name: '装修许可', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
    ]
  },
  {
    title: '婚育服务',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    items: [
      { name: '婚姻登记', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
      { name: '生育登记', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      { name: '出生证明', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: '计生服务', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13C10.832 19.877 8 16.924 8 13V8.5h8V13c0 3.924-2.832 6.877-4 8z' },
      { name: '儿童保健', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    ]
  },
  {
    title: '退休服务',
    color: '#fa541c',
    bgColor: '#fff2e8',
    items: [
      { name: '退休审批', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { name: '养老金测算', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
      { name: '老年优待', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
      { name: '退休证', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6' },
      { name: '养老机构', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9' }
    ]
  }
]

// 2. 企业办事 数据
const enterpriseBsCategories = [
  {
    title: '企业变更',
    color: '#00c4cc',
    bgColor: '#e6fcfc',
    items: [
      { name: '股权出质变更登记', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
      { name: '企业变更登记(备案)', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9' },
      { name: '社会团体变更登记', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
      { name: '单位(项目)基本信息变更', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: '民办非企业单位变更登记', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
    ]
  },
  {
    title: '优待抚恤',
    color: '#2f54eb',
    bgColor: '#f0f5ff',
    items: [
      { name: '法律援助补贴发放', icon: 'M3 6l9-4 9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-5.45-9-12V6z' },
      { name: '就业见习补贴申领', icon: 'M21 132000' },
      { name: '稳岗返还(稳岗补贴)申领', icon: 'M21 132000' },
      { name: '一次性工伤医疗补助金申请', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      { name: '高校毕业生社保补贴申领', icon: 'M12 14l9-5-9-5-9 5 9 5z' }
    ]
  },
  {
    title: '企业注销',
    color: '#1890ff',
    bgColor: '#e6f7ff',
    items: [
      { name: '参保单位注销', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: '社会团体注销登记', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857' },
      { name: '民办非企业单位注销登记', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z' },
      { name: '企业注销登记单位注销', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16' }
    ]
  },
  {
    title: '小微企业',
    color: '#52c41a',
    bgColor: '#f6ffed',
    items: [
      { name: '企业社会保险登记', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999' },
      { name: '企业设立登记', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11' },
      { name: '企业变更登记(备案)', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
      { name: '企业注销登记', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' }
    ]
  },
  {
    title: '社会团体/社会组织',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    items: [
      { name: '企业社会保险登记', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5' },
      { name: '社会团体成立登记', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5' },
      { name: '社会团体变更登记', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11' },
      { name: '社会团体注销登记', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2' },
      { name: '社会团体修改章程核准', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11' }
    ]
  },
  {
    title: '个体工商户',
    color: '#fa541c',
    bgColor: '#fff2e8',
    items: [
      { name: '单位变更登记', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5' },
      { name: '单位注销登记', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2' },
      { name: '单位成立登记', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5' },
      { name: '单位修改章程核准', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11' },
      { name: '户外招牌设施登记备案', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16' }
    ]
  }
]

// 3. 企业服务 数据 (根据 2-3-政企服务.png)
const enterpriseArticles = [
  { title: '文章标题文章标题文章...', date: '07/03' },
  { title: '文章标题文章标题文章...', date: '07/03' }
]
</script>

<template>
  <div class="gov-page-container">
    <TheHeader />

    <main class="main-content">
      <!-- 提取出的蓝色半透明主导航栏组件 -->
      <TheNavBar activeId="gov" />

      <div class="content-box">
        <!-- 二级 Tab 切换菜单: 个人办事 | 企业办事 | 企业服务 -->
        <div class="sub-tab-bar">
          <div class="sub-tabs">
            <button
              :class="['sub-tab-btn', { active: activeSubTab === 'personal' }]"
              @click="activeSubTab = 'personal'"
            >
              个人办事
            </button>
            <button
              :class="['sub-tab-btn', { active: activeSubTab === 'enterprise_bs' }]"
              @click="activeSubTab = 'enterprise_bs'"
            >
              企业办事
            </button>
            <button
              :class="['sub-tab-btn', { active: activeSubTab === 'enterprise_fw' }]"
              @click="activeSubTab = 'enterprise_fw'"
            >
              企业服务
            </button>
          </div>
          <a href="#" class="more-link">更多 &gt;</a>
        </div>

        <!-- 页面视图 1: 个人办事 -->
        <div v-if="activeSubTab === 'personal'" class="grid-container border-grid">
          <div v-for="(cat, idx) in personalCategories" :key="idx" class="service-card">
            <div class="card-header" :style="{ backgroundColor: cat.bgColor, color: cat.color }">
              <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3>{{ cat.titleDisplay || cat.title }}</h3>
            </div>
            <div class="card-items">
              <div v-for="(item, i) in cat.items" :key="i" class="item-badge">
                <div class="icon-box" :style="{ backgroundColor: cat.color }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path :d="item.icon" />
                  </svg>
                </div>
                <span class="item-name">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 页面视图 2: 企业办事 -->
        <div v-else-if="activeSubTab === 'enterprise_bs'" class="grid-container border-grid">
          <div v-for="(cat, idx) in enterpriseBsCategories" :key="idx" class="service-card">
            <div class="card-header" :style="{ backgroundColor: cat.bgColor, color: cat.color }">
              <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9" />
              </svg>
              <h3>{{ cat.title }}</h3>
            </div>
            <div class="card-items">
              <div v-for="(item, i) in cat.items" :key="i" class="item-badge">
                <div class="icon-box" :style="{ backgroundColor: cat.color }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path :d="item.icon" />
                  </svg>
                </div>
                <span class="item-name">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 页面视图 3: 企业服务 -->
        <div v-else-if="activeSubTab === 'enterprise_fw'" class="enterprise-fw-container">
          <!-- 顶部两张大卡片 -->
          <div class="top-cards-row">
            <!-- 企业画像与政策匹配 -->
            <div class="big-card blue-tint">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square blue">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2>企业画像与政策匹配</h2>
                </div>
                <span class="arrow-right">&gt;</span>
              </div>
              <div class="match-banner">
                <div class="match-info">
                  <span>行业 <strong>跨境电商</strong></span>
                  <span class="gap">|</span>
                  <span>规模 <strong>中型</strong></span>
                </div>
                <a href="#" class="match-link">已匹配5项适配政策 &rarr;</a>
              </div>
            </div>

            <!-- 招商引资服务 -->
            <div class="big-card yellow-tint">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square yellow">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h2>招商引资服务</h2>
                </div>
                <span class="arrow-right">&gt;</span>
              </div>
              <div class="attract-tags">
                <span class="tag-item">重点产业</span>
                <span class="tag-item">招商项目库</span>
                <span class="tag-item">厂房/楼宇</span>
                <span class="tag-item">招商资讯</span>
              </div>
            </div>
          </div>

          <!-- 底部4列卡片 -->
          <div class="bottom-cards-row">
            <!-- 企业信用查询 -->
            <div class="fw-card border-blue">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square blue">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3>企业信用查询</h3>
                </div>
              </div>
              <p class="card-desc">接入信用中国（霍尔果斯），企业信用信息一站式查询</p>
              <div class="action-btn-row">
                <button class="outline-btn blue">立即跳转 &rarr;</button>
              </div>
            </div>

            <!-- 营商环境监测 -->
            <div class="fw-card border-blue">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square blue">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9" />
                    </svg>
                  </div>
                  <h3>营商环境监测</h3>
                </div>
              </div>
              <p class="card-desc">改革举措/成效数据/典型案例集中展示</p>
              <ul class="article-list">
                <li v-for="(item, i) in enterpriseArticles" :key="i">
                  <span class="art-title">{{ item.title }}</span>
                  <span class="art-date">{{ item.date }}</span>
                </li>
              </ul>
            </div>

            <!-- 企业供需对接 -->
            <div class="fw-card border-teal">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square teal">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3>企业供需对接</h3>
                </div>
              </div>
              <p class="card-desc">供需发布平台，产业链上下游资源互补与协作</p>
              <div class="action-btn-row">
                <button class="outline-btn teal">立即跳转 &rarr;</button>
              </div>
            </div>

            <!-- 乐享霍尔果斯 -->
            <div class="fw-card border-orange">
              <div class="card-title-row">
                <div class="title-with-icon">
                  <div class="card-icon-square orange">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3>乐享霍尔果斯</h3>
                </div>
              </div>
              <p class="card-desc">商户收款流水/到账语音提醒/资金无感结算</p>
              <div class="placeholder-box"></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.gov-page-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #1e293b;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  background-color: transparent;
}

.main-content {
  position: relative;
  z-index: 5;
  max-width: 1240px;
  margin: 0 auto;
  padding: 120px 24px 40px 24px;
  width: 100%;
  box-sizing: border-box;
}

/* 顶部导航栏 */
.nav-bar {
  background: rgba(30, 64, 120, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  margin-top: 10px;
  overflow: hidden;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 12px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-item:last-child {
  border-right: none;
}

.nav-item.active, .nav-item:hover {
  background: #0066ff;
  color: #ffffff;
  font-weight: 600;
}

.nav-icon {
  width: 18px;
  height: 18px;
}

/* 内容卡片外壳 */
.content-box {
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 24px;
}

/* 二级 Tab */
.sub-tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 4px;
  margin-bottom: 24px;
}

.sub-tabs {
  display: flex;
  gap: 4px;
}

.sub-tab-btn {
  padding: 10px 32px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #475569;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.sub-tab-btn.active {
  background: #0066ff;
  color: #ffffff;
}

.more-link {
  color: #94a3b8;
  font-size: 14px;
  text-decoration: none;
  padding-right: 16px;
}

.more-link:hover {
  color: #0066ff;
}

/* 个人办事 & 企业办事 3列x2行 Grid 布局 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.service-card {
  border-radius: 6px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-weight: 700;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.header-icon {
  width: 20px;
  height: 20px;
}

.card-items {
  padding: 20px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
}

.item-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 76px;
  cursor: pointer;
}

.item-badge:hover .item-name {
  color: #0066ff;
}

.icon-box {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box svg {
  width: 22px;
  height: 22px;
}

.item-name {
  font-size: 12px;
  color: #334155;
  text-align: center;
  line-height: 1.3;
  word-break: break-all;
}

/* 企业服务 (2-3-政企服务) 特有样式 */
.enterprise-fw-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.top-cards-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.big-card {
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
}

.blue-tint {
  background: #e6f4ff;
  border: 1px solid #bae0ff;
}

.yellow-tint {
  background: #fefbe8;
  border: 1px solid #fef08a;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon-square {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon-square.blue { background: #0066ff; }
.card-icon-square.yellow { background: #d97706; }
.card-icon-square.teal { background: #0d9488; }
.card-icon-square.orange { background: #ea580c; }

.title-with-icon h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.title-with-icon h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.arrow-right {
  font-size: 18px;
  color: #64748b;
}

.match-banner {
  background: #ffffff;
  border-radius: 6px;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.match-info {
  font-size: 14px;
  color: #64748b;
}

.match-info strong {
  color: #0f172a;
}

.gap {
  margin: 0 12px;
  color: #cbd5e1;
}

.match-link {
  color: #0066ff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.attract-tags {
  display: flex;
  background: #ffffff;
  border-radius: 6px;
  padding: 12px 20px;
  justify-content: space-around;
  margin-top: 16px;
}

.tag-item {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
  cursor: pointer;
}

.tag-item:hover {
  color: #d97706;
}

/* 底部4列卡片 */
.bottom-cards-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.fw-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 220px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.border-blue { border: 1px solid #e0f2fe; }
.border-teal { border: 1px solid #ccfbf1; }
.border-orange { border: 1px solid #ffedd5; }

.card-desc {
  font-size: 13px;
  color: #64748b;
  margin: 12px 0 20px 0;
  line-height: 1.5;
}

.action-btn-row {
  margin-top: auto;
}

.outline-btn {
  background: transparent;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.outline-btn.blue {
  border: 1px solid #0066ff;
  color: #0066ff;
}

.outline-btn.teal {
  border: 1px solid #0d9488;
  color: #0d9488;
}

.article-list {
  list-style: none;
  padding: 0;
  margin: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-list li {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #475569;
}

.art-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
}

.art-date {
  color: #94a3b8;
}

.placeholder-box {
  width: 100%;
  height: 80px;
  background: #f8fafc;
  border-radius: 4px;
  margin-top: auto;
}
</style>

