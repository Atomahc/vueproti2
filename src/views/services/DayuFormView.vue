<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request, { http } from '@/api/request'
import TheHeader from '@/components/TheHeader.vue'
import TheNavBar from '@/components/TheNavBar.vue'
import TheFooter from '@/components/TheFooter.vue'

const route = useRoute()
const router = useRouter()
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX

const formId = route.query.id as string
const activity = ref<any>({})
const par = ref<any>({})
const fields = ref<any[]>([])
const formData = ref<any>({})
const pluralFiles = ref<File[]>([])
const loading = ref(true)

const decodeHtml = (html: string) => {
  if (!html) return ''
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

const communityList = ref<any[]>([])

const fetchForm = async () => {
  try {
    const res: any = await http.get(`/api-dayu/app/index.php`, {
      i: 23,
      c: 'entry',
      do: 'dayu_form',
      m: 'dayu_form',
      id: formId,
      isapi: 1
    })
    
    // res should be the json from our isapi=1 block
    if (res && res.activity) {
      activity.value = res.activity
      if (activity.value.content) {
        activity.value.content = decodeHtml(activity.value.content)
      }
      if (activity.value.description) {
        activity.value.description = decodeHtml(activity.value.description)
      }
      
      par.value = res.par
      fields.value = res.fields || []
      
      // Community data
      communityList.value = [
        { id: 26, name: '丝路社区' },
        { id: 23, name: '卡拉苏社区' },
        { id: 27, name: '索伦社区' },
        { id: 57, name: '红桥社区' },
        { id: 55, name: '英塔尔社区' },
        { id: 25, name: '霍尔果斯智慧在线' }
      ]
      
      // Initialize form data
      fields.value.forEach(f => {
        if (f.type === 'checkbox') {
          formData.value['field_' + f.refid] = []
        } else {
          formData.value['field_' + f.refid] = ''
        }
      })
      formData.value['member'] = ''
      formData.value['mobile'] = ''
      formData.value['communityId'] = ''
    } else {
      alert('表单加载失败')
    }
  } catch (error) {
    console.error('Fetch form error:', error)
  } finally {
    loading.value = false
  }
}

const handleFileUpload = (refid: string, e: any) => {
  const file = e.target.files[0]
  if (file) {
    formData.value['field_' + refid] = file
  }
}

const handlePluralUpload = (e: any) => {
  pluralFiles.value = Array.from(e.target.files)
}

const submitForm = async () => {
  // basic validation
  if (!formData.value.communityId) {
    alert('请选择社区')
    return
  }
  if (!formData.value.member) {
    alert('请填写姓名')
    return
  }
  if (!formData.value.mobile) {
    alert('请填写手机号')
    return
  }
  
  // Validate community user
  try {
    const searchParams = new URLSearchParams()
    searchParams.append('mobile', formData.value.mobile)
    searchParams.append('communityId', formData.value.communityId)
    searchParams.append('isapi', '1')

    const validRes: any = await http.post(`/api-dayu/app/index.php`, searchParams, {
      params: {
        i: formData.value.communityId,
        c: 'entry',
        do: 'CheckCommunityUser',
        m: 'dayu_form',
        isapi: 1
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    
    if (validRes.status === 0 || String(validRes.status) === '0') {
      alert(validRes.msg || '当前社区下未找到人员信息 请先在微信平台注册智慧社区')
      return
    }
  } catch (error) {
    console.error('Validation error:', error)
    alert('验证人员信息异常')
    return
  }

  const postData = new FormData()
  postData.append('submit', '1')
  postData.append('isapi', '1')
  postData.append('member', formData.value.member)
  postData.append('mobile', formData.value.mobile)
  postData.append('communityId', formData.value.communityId)
  
  Object.keys(formData.value).forEach(key => {
    if (key.startsWith('field_')) {
      const val = formData.value[key]
      if (Array.isArray(val)) {
        val.forEach(v => postData.append(key + '[]', v))
      } else {
        postData.append(key, val)
      }
    }
  })

  if (pluralFiles.value.length > 0) {
    pluralFiles.value.forEach(file => {
      postData.append('thumb[]', file)
    })
  }

  try {
    const res: any = await http.post('/api-dayu/app/index.php', postData, {
      params: {
        i: formData.value.communityId,
        c: 'entry',
        do: 'dayu_form',
        m: 'dayu_form',
        id: formId
      }
    })
    
    if (res && res.status === 1) {
      alert(res.info || '提交成功')
      router.back()
    } else {
      alert(res.message || '提交失败')
    }
  } catch (error) {
    console.error('Submit error:', error)
    alert('提交异常')
  }
}

onMounted(() => {
  if (formId) {
    fetchForm()
  } else {
    alert('缺少表单ID')
  }
})
</script>

<template>
  <div class="form-page">
    <TheHeader />
    
    <main class="main-content">
      <TheNavBar activeId="life" />
      
      <div class="form-container" v-if="!loading">
        <div class="form-header">
  
          <div class="form-desc" v-if="activity.description" v-html="activity.description"></div>
          
          <div class="form-details" v-if="par.business || par.address || par.tel || activity.customtags || activity.content || (par.template_files && par.template_files.length)">
            <div class="detail-item" v-if="par.business">
              <strong>受理单位：</strong><span>{{ par.business }}</span>
            </div>
            
            <div class="detail-item" v-if="par.address">
              <strong>办理地址：</strong><span>{{ par.address }}</span>
            </div>
            
            <div class="detail-item" v-if="par.tel">
              <strong>联系电话：</strong><span>{{ par.tel }}</span>
            </div>

            <div class="detail-item" v-if="activity.customtags">
              <strong>办理时限：</strong><span>{{ activity.customtags }}</span>
            </div>

            <div class="detail-item" v-if="par.template_files && par.template_files.length">
              <strong>附件下载：</strong>
              <ul class="file-list">
                <li v-for="(fileUrl, fidx) in par.template_files" :key="fidx">
                  <a :href="fileUrl" target="_blank" class="download-link">下载附件 {{ fidx + 1 }}</a>
                </li>
              </ul>
            </div>
            
            <div class="detail-item" v-if="activity.content">
              <strong>办理详情：</strong>
              <div class="rich-content" v-html="activity.content"></div>
            </div>
          </div>
        </div>
        
        <div class="form-body">
          <h2 style="margin-top:0px">{{ activity.title }}</h2>
          <div class="form-group">
            <label class="required">所属社区</label>
            <select v-model="formData.communityId" class="form-input">
              <option value="">请选择社区</option>
              <option v-for="com in communityList" :key="com.id" :value="com.id">{{ com.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="required">姓名</label>
            <input type="text" v-model="formData.member" placeholder="请输入您的姓名" class="form-input" />
          </div>
          <div class="form-group">
            <label class="required">手机</label>
            <input type="text" v-model="formData.mobile" placeholder="请输入您的手机号" class="form-input" />
          </div>
          
          <div v-for="field in fields" :key="field.refid" class="form-group">
            <label :class="{ required: field.essential == 1 }">{{ field.title }}</label>
            
            <template v-if="field.type === 'text'">
              <input type="text" v-model="formData['field_' + field.refid]" :placeholder="field.description || '请输入'" class="form-input" />
            </template>
            
            <template v-else-if="field.type === 'textarea'">
              <textarea v-model="formData['field_' + field.refid]" :placeholder="field.description || '请输入'" class="form-textarea"></textarea>
            </template>
            
            <template v-else-if="field.type === 'radio'">
              <div class="radio-group">
                <label v-for="(opt, idx) in (Array.isArray(field.options) ? field.options : (field.options || field.value || '').split(','))" :key="idx" class="radio-label">
                  <input type="radio" :value="opt" v-model="formData['field_' + field.refid]" /> {{ opt }}
                </label>
              </div>
            </template>
            
            <template v-else-if="field.type === 'select'">
              <select v-model="formData['field_' + field.refid]" class="form-input">
                <option value="">请选择</option>
                <option v-for="(opt, idx) in (Array.isArray(field.options) ? field.options : (field.options || field.value || '').split(','))" :key="idx" :value="opt">{{ opt }}</option>
              </select>
            </template>
            
            <template v-else-if="field.type === 'checkbox'">
              <div class="checkbox-group">
                <label v-for="(opt, idx) in (Array.isArray(field.options) ? field.options : (field.options || field.value || '').split(','))" :key="idx" class="checkbox-label">
                  <input type="checkbox" :value="opt" v-model="formData['field_' + field.refid]" /> {{ opt }}
                </label>
              </div>
            </template>
            
            <template v-else-if="field.type === 'calendar' || field.type === 'range'">
              <input type="date" v-model="formData['field_' + field.refid]" class="form-input" />
            </template>

            <template v-else-if="field.type === 'datetime'">
              <input type="datetime-local" v-model="formData['field_' + field.refid]" class="form-input" />
            </template>

            <template v-else-if="field.type === 'image' || field.type === 'file' || field.type === 'photograph'">
              <input type="file" @change="handleFileUpload(field.refid, $event)" class="form-input" />
            </template>
            
            <template v-else>
              <input type="text" v-model="formData['field_' + field.refid]" :placeholder="'暂不支持的字段类型: ' + field.type" class="form-input" />
            </template>
          </div>
          
          <div class="form-group" v-if="activity.plural == 1">
            <label>{{ activity.pluraltit || '上传图片' }}</label>
            <input type="file" multiple @change="handlePluralUpload" class="form-input" />
          </div>

          <button class="submit-btn" @click="submitForm">{{ par.submitname || '提交' }}</button>
        </div>
      </div>
      <div v-else class="loading">加载中...</div>
    </main>
    
    <TheFooter />
  </div>
</template>

<style scoped>
.form-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

}

.main-content {
  flex: 1;
  width: 1280px;
  height: 850px;
  margin: 0 auto;
  padding: 120px 0 40px 0;
}

.form-container {
  display: flex;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  height: 600px;
  padding:24px 0px;
  margin: 0 auto;
}

.form-header {
  flex: 1;
  padding: 24px;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}

.form-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.form-cover {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}

.form-header h2 {
  font-size: 24px;
  color: #1e293b;
  margin-bottom: 8px;
  text-align: left;
}

.form-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
  text-align: left;
}

.form-details {
  background: #f8fafc;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.detail-item {
  margin-bottom: 12px;
  font-size: 14px;
}
.detail-item:last-child {
  margin-bottom: 0;
}
.detail-item strong {
  color: #334155;
  margin-right: 8px;
}
.detail-item span {
  color: #64748b;
}

.rich-content {
  margin-top: 8px;
  color: #475569;
  line-height: 1.6;
}
.rich-content :deep(img) {
  max-width: 100%;
  border-radius: 4px;
  margin: 8px 0;
}

.file-list {
  display:inline-block;
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
}
.file-list li {
  margin-bottom: 6px;
}
.download-link {
  color: #3b82f6;
  text-decoration: none;
}
.download-link:hover {
  text-decoration: underline;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #334155;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group label.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 4px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
  border-color: #3b82f6;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.radio-group, .checkbox-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.radio-label, .checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: normal !important;
  color: #475569 !important;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 24px;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #2563eb;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
}
</style>
