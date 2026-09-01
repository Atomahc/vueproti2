<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { http } from '@/api/request'
import TheHeader from '@/components/TheHeader.vue'
import TheNavBar from '../../components/TheNavBar.vue'
import TheFooter from '@/components/TheFooter.vue'

const courses = ref<any[]>([])
const loading = ref(true)

const fetchCourses = async () => {
  try {
    const res: any = await http.get('/api-loca/portal/course/page')
    if (res.code === 0 && res.data && res.data.list) {
      courses.value = res.data.list
    }
  } catch (e) {
    console.error('Failed to fetch courses:', e)
  } finally {
    loading.value = false
  }
}

const activeCourse = ref<any>(null)

const openModal = (course: any) => {
  activeCourse.value = course
}

const closeModal = () => {
  activeCourse.value = null
}

onMounted(() => {
  fetchCourses()
})
</script>

<template>
  <div class="youth-page-container">
    <TheHeader />

    <main class="main-content">
          <!-- 提取出的蓝色半透明主导航栏组件 -->
      <TheNavBar activeId="life" />
     

      <div class="content-box">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="courses.length === 0" class="empty">暂无课程</div>
        <div v-else class="course-grid">
          <div v-for="course in courses" :key="course.id" class="course-card" @click="openModal(course)">
            <div class="course-img-wrapper">
              <img :src="course.picture || course.awardImage" :alt="course.name" />
              <div class="price-tag">¥{{ course.price }}</div>
            </div>
            <div class="course-info">
              <h3 class="course-name">{{ course.name }}</h3>
              <div class="course-meta">
                <span><i class="icon-teacher"></i> {{ course.teacher?.split('（')[0] || course.teacher }}</span>
                <span><i class="icon-time"></i> {{ course.classTime }}</span>
              </div>
              <div class="course-quota">
                <div class="progress-bar">
                  <div class="progress-inner" :style="{ width: ((course.sold / course.totalQuota) * 100) + '%' }"></div>
                </div>
                <div class="quota-text">
                  已报 {{ course.sold }} / 共 {{ course.totalQuota }} 人 (剩余 {{ course.remainingQuota2 }})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 课程详情弹窗 -->
    <div class="modal-overlay" v-if="activeCourse" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeModal">&times;</button>
        <div class="modal-header">
          <h2 class="modal-title">{{ activeCourse.name }}</h2>
        </div>
        <div class="modal-body scrollable">
          <img class="detail-img" :src="activeCourse.picture || activeCourse.awardImage" />
          <div class="detail-meta">
            <p><strong>任课老师：</strong>{{ activeCourse.teacher }}</p>
            <p><strong>上课时间：</strong>{{ activeCourse.classTime }}</p>
            <p><strong>课程价格：</strong>¥{{ activeCourse.price }}</p>
            <p><strong>报名时间：</strong>{{ activeCourse.bmKssj }} 至 {{ activeCourse.bmJssj }}</p>
          </div>
          <div class="detail-section">
            <h3>课程介绍</h3>
            <div class="html-content" v-html="activeCourse.content"></div>
          </div>
          <div class="detail-section">
            <h3>老师介绍</h3>
            <div class="html-content" v-html="activeCourse.teacherContent"></div>
          </div>
          <div class="detail-section">
            <h3>报名须知</h3>
            <div class="html-content" v-html="activeCourse.notice"></div>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<style scoped>
.youth-page-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;

}

.main-content {
  height: 850px;
  position: relative;
  z-index: 5;
  width: 1280px;
  margin: 0 auto;
  padding: 120px 0px 40px 0px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
}

.content-box {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
  height: 600px;
  overflow: scroll;
}

.loading, .empty {
  text-align: center;
  padding: 100px 0;
  color: #64748b;
  font-size: 16px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.course-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: #fff;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.course-img-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
}

.course-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price-tag {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
}

.course-info {
  padding: 16px;
}

.course-name {
  font-size: 16px;
  font-weight: bold;
  color: #0f172a;
  margin: 0 0 12px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
  margin-bottom: 12px;
}

.course-quota {
  margin-top: 12px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-inner {
  height: 100%;
  background: #3b82f6;
  border-radius: 3px;
}

.quota-text {
  font-size: 12px;
  color: #64748b;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  width: 700px;
  max-height: 90vh;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 28px;
  color: #64748b;
  cursor: pointer;
  z-index: 10;
}

.modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #0f172a;
  padding-right: 30px;
}

.modal-body.scrollable {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.detail-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.detail-meta {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.detail-meta p {
  margin: 8px 0;
  font-size: 14px;
  color: #334155;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: bold;
  color: #0f172a;
  margin-bottom: 12px;
  border-left: 4px solid #3b82f6;
  padding-left: 8px;
}

.html-content {
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
}

/* Fix inner img inside html-content */
.html-content :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>
