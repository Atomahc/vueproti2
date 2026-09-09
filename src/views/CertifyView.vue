<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '@/api/request'

const route = useRoute()
const router = useRouter()
const currentTab = ref('enterprise')
const isSubmitting = ref(false)

onMounted(() => {
  if (route.query.type === 'gov') {
    currentTab.value = 'gov'
  }
})

watch(() => route.query.type, (newType) => {
  if (newType === 'gov' || newType === 'enterprise') {
    currentTab.value = newType
  }
})

const changeTab = (tab: string) => {
  currentTab.value = tab
  clearErrors()
  router.replace({ query: { ...route.query, type: tab } })
}

// 错误信息管理
const errors = reactive<Record<string, string>>({})
const clearErrors = () => {
  Object.keys(errors).forEach(key => delete errors[key])
}

// 常用校验正则
const rules = {
  // 18位统一社会信用代码
  creditCode: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
  // 手机号码
  phone: /^1[3-9]\d{9}$/,
  // 身份证号
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
}

// ================= 企业认证 =================
const enterpriseForm = reactive({
  enterpriseName: '',
  creditCode: '',
  legalPersonName: '',
  contactPhone: '',
  address: '',
  businessScope: ''
})

const validateEnterprise = () => {
  clearErrors()
  let isValid = true

  if (!enterpriseForm.enterpriseName.trim()) {
    errors.enterpriseName = '请输入企业名称'
    isValid = false
  }

  if (!enterpriseForm.creditCode.trim()) {
    errors.creditCode = '请输入统一社会信用代码'
    isValid = false
  } else if (!rules.creditCode.test(enterpriseForm.creditCode)) {
    errors.creditCode = '请输入有效的18位信用代码'
    isValid = false
  }

  if (!enterpriseForm.legalPersonName.trim()) {
    errors.legalPersonName = '请输入法定代表人姓名'
    isValid = false
  }

  if (enterpriseForm.contactPhone.trim() && !rules.phone.test(enterpriseForm.contactPhone)) {
    errors.contactPhone = '请输入有效的手机号码'
    isValid = false
  }

  return isValid
}

const submitEnterprise = async () => {
  if (!validateEnterprise()) return

  isSubmitting.value = true
  try {
    await http.post('/prod-api/portal/enterprise-certify/apply', {
      ...enterpriseForm,
      id: 0,
      memberId: 0,
      memberName: "API Placeholder",
      status: 0
    })
    alert('企业认证申请提交成功！')
    Object.keys(enterpriseForm).forEach(key => (enterpriseForm as any)[key] = '')
  } catch (err: any) {
    alert('提交失败: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

// ================= 机关机构认证 =================
const govForm = reactive({
  realName: '',
  idCard: '',
  department: '',
  position: '',
  contactPhone: ''
})

const validateGov = () => {
  clearErrors()
  let isValid = true

  if (!govForm.realName.trim()) {
    errors.realName = '请输入真实姓名'
    isValid = false
  }

  if (!govForm.idCard.trim()) {
    errors.idCard = '请输入身份证号'
    isValid = false
  } else if (!rules.idCard.test(govForm.idCard)) {
    errors.idCard = '请输入有效的身份证号'
    isValid = false
  }

  if (!govForm.department.trim()) {
    errors.department = '请输入所属部门'
    isValid = false
  }

  if (govForm.contactPhone.trim() && !rules.phone.test(govForm.contactPhone)) {
    errors.contactPhone = '请输入有效的手机号码'
    isValid = false
  }

  return isValid
}

const submitGov = async () => {
  if (!validateGov()) return

  isSubmitting.value = true
  try {
    await http.post('/prod-api/portal/gov-certify/apply', {
      ...govForm,
      id: 0,
      memberId: 0,
      memberName: "API Placeholder",
      departmentId: 0,
      status: 0
    })
    alert('机关认证申请提交成功！')
    Object.keys(govForm).forEach(key => (govForm as any)[key] = '')
  } catch (err: any) {
    alert('提交失败: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="certify-page">
    <div class="certify-header">
      <h1>实名认证服务中心</h1>
      <p>为您提供专业、安全、高效的身份核验服务</p>
    </div>

    <div class="certify-container">
      <div class="tabs">
        <button 
          class="tab-item" 
          :class="{ active: currentTab === 'enterprise' }" 
          @click="changeTab('enterprise')"
        >
          <div class="tab-icon">🏢</div>
          <div class="tab-text">
            <h3>企业认证</h3>
            <span>适用于企业、个体工商户</span>
          </div>
        </button>
        <button 
          class="tab-item" 
          :class="{ active: currentTab === 'gov' }" 
          @click="changeTab('gov')"
        >
          <div class="tab-icon">🏛️</div>
          <div class="tab-text">
            <h3>机关认证</h3>
            <span>适用于政府机关、事业单位</span>
          </div>
        </button>
      </div>

      <div class="form-wrapper">
        <!-- 企业认证表单 -->
        <transition name="fade" mode="out-in">
          <form v-if="currentTab === 'enterprise'" @submit.prevent="submitEnterprise" class="certify-form" key="enterprise">
            <h2 class="form-title">填写企业主体信息</h2>
            
            <div class="form-grid">
              <div class="input-group" :class="{ 'has-error': errors.enterpriseName }">
                <label>企业名称 <span class="required">*</span></label>
                <input v-model="enterpriseForm.enterpriseName" type="text" placeholder="请输入与营业执照一致的名称" @input="errors.enterpriseName = ''" />
                <span v-if="errors.enterpriseName" class="error-msg">{{ errors.enterpriseName }}</span>
              </div>
              
              <div class="input-group" :class="{ 'has-error': errors.creditCode }">
                <label>统一社会信用代码 <span class="required">*</span></label>
                <input v-model="enterpriseForm.creditCode" type="text" placeholder="18位信用代码" @input="errors.creditCode = ''" />
                <span v-if="errors.creditCode" class="error-msg">{{ errors.creditCode }}</span>
              </div>

              <div class="input-group" :class="{ 'has-error': errors.legalPersonName }">
                <label>法定代表人姓名 <span class="required">*</span></label>
                <input v-model="enterpriseForm.legalPersonName" type="text" placeholder="请输入法定代表人姓名" @input="errors.legalPersonName = ''" />
                <span v-if="errors.legalPersonName" class="error-msg">{{ errors.legalPersonName }}</span>
              </div>

              <div class="input-group" :class="{ 'has-error': errors.contactPhone }">
                <label>联系电话</label>
                <input v-model="enterpriseForm.contactPhone" type="tel" placeholder="请输入经办人手机号码" @input="errors.contactPhone = ''" />
                <span v-if="errors.contactPhone" class="error-msg">{{ errors.contactPhone }}</span>
              </div>

              <div class="input-group full-width">
                <label>企业注册地址</label>
                <input v-model="enterpriseForm.address" type="text" placeholder="请输入详细的企业注册地址" />
              </div>

              <div class="input-group full-width">
                <label>经营范围</label>
                <textarea v-model="enterpriseForm.businessScope" placeholder="请简要描述您的经营范围" rows="3"></textarea>
              </div>
            </div>

            <div class="submit-action">
              <button type="submit" class="primary-btn" :disabled="isSubmitting">
                <span v-if="!isSubmitting">提交企业认证申请</span>
                <span v-else>提交中...</span>
              </button>
            </div>
          </form>

          <!-- 机关认证表单 -->
          <form v-else-if="currentTab === 'gov'" @submit.prevent="submitGov" class="certify-form" key="gov">
            <h2 class="form-title">填写机关机构信息</h2>
            
            <div class="form-grid">
              <div class="input-group" :class="{ 'has-error': errors.realName }">
                <label>真实姓名 <span class="required">*</span></label>
                <input v-model="govForm.realName" type="text" placeholder="请输入申请人真实姓名" @input="errors.realName = ''" />
                <span v-if="errors.realName" class="error-msg">{{ errors.realName }}</span>
              </div>
              
              <div class="input-group" :class="{ 'has-error': errors.idCard }">
                <label>身份证号 <span class="required">*</span></label>
                <input v-model="govForm.idCard" type="text" placeholder="请输入18位身份证号" @input="errors.idCard = ''" />
                <span v-if="errors.idCard" class="error-msg">{{ errors.idCard }}</span>
              </div>

              <div class="input-group" :class="{ 'has-error': errors.department }">
                <label>所属部门 <span class="required">*</span></label>
                <input v-model="govForm.department" type="text" placeholder="请输入您所在的部门名称" @input="errors.department = ''" />
                <span v-if="errors.department" class="error-msg">{{ errors.department }}</span>
              </div>

              <div class="input-group">
                <label>职务名称</label>
                <input v-model="govForm.position" type="text" placeholder="请输入您的职务" />
              </div>

              <div class="input-group full-width" :class="{ 'has-error': errors.contactPhone }">
                <label>联系电话</label>
                <input v-model="govForm.contactPhone" type="tel" placeholder="请输入手机号码" @input="errors.contactPhone = ''" />
                <span v-if="errors.contactPhone" class="error-msg">{{ errors.contactPhone }}</span>
              </div>
            </div>

            <div class="submit-action">
              <button type="submit" class="primary-btn" :disabled="isSubmitting">
                <span v-if="!isSubmitting">提交机关认证申请</span>
                <span v-else>提交中...</span>
              </button>
            </div>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.certify-page {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-bottom: 60px;
}

.certify-header {
  background: linear-gradient(135deg, #0284c7 0%, #3b82f6 100%);
  color: white;
  padding: 80px 20px 60px;
  text-align: center;
}

.certify-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.certify-header p {
  margin-top: 12px;
  font-size: 16px;
  opacity: 0.9;
}

.certify-container {
  max-width: 900px;
  margin: -40px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.tab-item {
  flex: 1;
  background: white;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-align: left;
}

.tab-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.tab-item.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.tab-icon {
  font-size: 40px;
}

.tab-text h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #1e293b;
}

.tab-text span {
  font-size: 13px;
  color: #64748b;
}

.form-wrapper {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  padding: 40px;
}

.form-title {
  margin: 0 0 30px 0;
  font-size: 20px;
  color: #0f172a;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-group label {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

.input-group input,
.input-group textarea {
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #1e293b;
  transition: all 0.2s;
  background-color: #f8fafc;
  outline: none;
}

.input-group textarea {
  resize: vertical;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: #3b82f6;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 错误反馈样式 */
.has-error input {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
}

.has-error input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.error-msg {
  color: #ef4444;
  font-size: 13px;
  margin-top: 6px;
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.submit-action {
  margin-top: 40px;
  text-align: right;
}

.primary-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.primary-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.primary-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* 渐变动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .tabs {
    flex-direction: column;
  }
}
</style>
