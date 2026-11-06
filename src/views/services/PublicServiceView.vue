<script setup lang="ts">
const minioPrefix = import.meta.env.VITE_MINIO_PREFIX
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '@/api/request'

const { locale, t } = useI18n()
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import TheNavBar from '../../components/TheNavBar.vue'
import ss1 from '@/assets/other/ss1.png'
import ss2 from '@/assets/other/ss2.png'
import ss3 from '@/assets/other/ss3.png'
import ss4 from '@/assets/other/ss4.png'
import ss5 from '@/assets/other/ss5.png'
import ss6 from '@/assets/other/ss6.png'
const ssBgs = [ss1, ss2, ss3, ss4, ss5, ss6]
// 随手拍表单
const snapshotSubmitting = ref(false)
const imageUploading = ref(false)
const uploadedImages = ref<string[]>([])
const snapshotForm = ref({
  reportType: '',
  content: '',
  imageUrls: '[]',
  longitude: '',
  latitude: '',
  address: '',
  community: '',
  contactName: '',
  contactPhone: ''
})
const router = useRouter()

const formatImageUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }
  const prefix = (minioPrefix || '').replace(/\/+$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${prefix}${path}`
}

const handleNavigate = (item: any) => {
  if (item.name === '文旅服务' || item.id === 22982) {
    router.push('/service/culture')
    return
  }
  if (item.name === '青少年活动中心' || item.id === 22981) {
    router.push('/service/youth-activity')
    return
  }
  if (item.name === '志愿者服务(霍尔果斯云)' || item.id === 22983 || item.linkType === 'qrcode') {
    openModal(item)
    return
  }

  if (item.url) {
    if (item.url.startsWith('http')) {
      window.open(item.url, '_blank')
    } else {
      router.push(item.url)
    }
  }
}
const handleImageUpload = async (e: any) => {
  const files: FileList | null = e.target.files
  if (!files || files.length === 0) return

  const remainingSlots = 9 - uploadedImages.value.length
  if (remainingSlots <= 0) {
    alert(t('services.maxImagesLimit'))
    e.target.value = ''
    return
  }

  const filesToUpload = Array.from(files).slice(0, remainingSlots)
  if (files.length > remainingSlots) {
    alert(t('services.maxImagesLimit'))
  }

  imageUploading.value = true
  try {
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片格式文件上传')
        continue
      }
      const formData = new FormData()
      formData.append('file', file)

      const res: any = await http.post('/prod-api/sys/file/upload', formData)
      if (res.code === 0 || String(res.code) === '0' || res.code === 200 || String(res.code) === '200') {
        const fileUrl = res.data?.url || res.url || (typeof res.data === 'string' ? res.data : '')
        if (fileUrl) {
          uploadedImages.value.push(fileUrl)
        } else {
          alert(res.msg || '上传成功但未获取到文件地址')
        }
      } else {
        alert(res.msg || '图片上传失败')
      }
    }
    snapshotForm.value.imageUrls = JSON.stringify(uploadedImages.value)
  } catch (err: any) {
    alert(err.message || '图片上传异常')
  } finally {
    imageUploading.value = false
    e.target.value = ''
  }
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
  snapshotForm.value.imageUrls = JSON.stringify(uploadedImages.value)
}

const submitSnapshotForm = async () => {
  if (!snapshotForm.value.content || !snapshotForm.value.contactName || !snapshotForm.value.contactPhone || !snapshotForm.value.address) {
    alert(t('services.fillCompleteInfo'))
    return
  }
  if (imageUploading.value) {
    alert('图片正在上传中，请稍候')
    return
  }
  snapshotSubmitting.value = true
  try {
    const res: any = await http.post('/prod-api/portal/complaint/snapshot/create', null, { params: snapshotForm.value })
    if (res.code === 0 || String(res.code) === '0') {
      alert(t('services.submitSuccess'))
      uploadedImages.value = []
      snapshotForm.value = {
        reportType: reportTypes.value[0]?.dictValue || '', content: '', imageUrls: '[]', longitude: '', latitude: '', address: '', community: communities.value[0]?.dictValue || '', contactName: '', contactPhone: ''
      }
    } else {
      alert(t('services.submitFailed') + ': ' + res.msg)
    }
  } catch (e: any) {
    alert(t('services.submitError') + ': ' + (e.message || t('common.unknownError')))
  } finally {
    snapshotSubmitting.value = false
  }
}

const laodaoInfo = ref<any>({})
const laodaoTags = ref<any[]>([])
const hotJobsCount = ref(6)

const zhongyaInfo = ref<any>({})

const communityServices = ref<any[]>([])
const lifeServices = ref<any[]>([])
const bottomCards = ref<any[]>([])

const activeModal = ref<any>(null)

const openModal = (info: any) => {
  activeModal.value = info
}

const closeModal = () => {
  activeModal.value = null
}

const showMapModal = ref(false)
let mapInstance: any = null
let mapMarker: any = null
const tempLocation = ref({ lng: '', lat: '', address: '' })

const openMapModal = () => {
  showMapModal.value = true
  setTimeout(() => {
    initMap()
  }, 200)
}

const closeMapModal = () => {
  if (mapInstance) {
    mapInstance.destroy()
    mapInstance = null
    mapMarker = null
  }
  showMapModal.value = false
}

const initMap = () => {
  if (typeof (window as any).AMap === 'undefined') {
    alert(t('services.mapLoadFailed'))
    return
  }
  const AMap = (window as any).AMap
  
  mapInstance = new AMap.Map('amap-container', {
    zoom: 15,
    resizeEnable: true
  })
  
  mapInstance.on('click', (e: any) => {
    setMapMarker(e.lnglat.getLng(), e.lnglat.getLat())
  })
  
  if (snapshotForm.value.longitude && snapshotForm.value.latitude) {
    setMapMarker(Number(snapshotForm.value.longitude), Number(snapshotForm.value.latitude))
    mapInstance.setCenter([snapshotForm.value.longitude, snapshotForm.value.latitude])
  } else {
    AMap.plugin('AMap.Geolocation', () => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 5000, // reduce timeout to fallback to IP quicker
        buttonPosition: 'RB',
        zoomToAccuracy: true
      })
      mapInstance.addControl(geolocation)
      geolocation.getCurrentPosition((status: string, result: any) => {
        if (status === 'complete') {
          setMapMarker(result.position.lng, result.position.lat)
          mapInstance.setCenter([result.position.lng, result.position.lat])
        } else {
          // Fallback to IP location using CitySearch
          AMap.plugin('AMap.CitySearch', () => {
            const citySearch = new (AMap as any).CitySearch()
            citySearch.getLocalCity((cityStatus: string, cityResult: any) => {
              if (cityStatus === 'complete' && cityResult.info === 'OK') {
                mapInstance.setCity(cityResult.city, () => {
                  // After setting city center, grab the new center and place marker
                  setTimeout(() => {
                    const center = mapInstance.getCenter()
                    setMapMarker(center.lng, center.lat)
                  }, 500)
                })
              }
            })
          })
        }
      })
    })
  }
}

const setMapMarker = (lng: number, lat: number) => {
  const AMap = (window as any).AMap
  if (mapMarker) {
    mapMarker.setMap(null)
  }
  mapMarker = new AMap.Marker({
    position: [lng, lat],
    map: mapInstance
  })
  
  tempLocation.value.lng = String(lng)
  tempLocation.value.lat = String(lat)
  
  AMap.plugin('AMap.Geocoder', () => {
    const geocoder = new AMap.Geocoder()
    geocoder.getAddress([lng, lat], (status: string, result: any) => {
      if (status === 'complete' && result.info === 'OK') {
        tempLocation.value.address = result.regeocode.formattedAddress
      }
    })
  })
}

const confirmLocation = () => {
  if (!tempLocation.value.lng || !tempLocation.value.lat) {
    alert(t('services.selectLocationPrompt'))
    return
  }
  snapshotForm.value.longitude = tempLocation.value.lng
  snapshotForm.value.latitude = tempLocation.value.lat
  if (tempLocation.value.address) {
    snapshotForm.value.address = tempLocation.value.address
  }
  closeMapModal()
}

const fetchConvenience = async () => {
  try {
    const res: any = await http.get('/prod-api/ncmanagement/class/zones-tree', {
      zoneType: 'convenience',
      platform: 'portal',
      userType: '',
      lang: locale.value || 'zh'
    })
    if (res.code === 0 && res.data && res.data.convenience) {
      const list = res.data.convenience
      
      const ld = list[0]
      if (ld) {
        laodaoInfo.value = ld
        laodaoTags.value = ld.children || []
      }
      
      const zy = list[1]
      if (zy) {
        zhongyaInfo.value = zy
      }
      
      const sq = list[2]
      if (sq) {
        communityServices.value = sq.children || []
      }
      
      const sh = list[3]
      if (sh) {
        lifeServices.value = sh.children || []
      }

      bottomCards.value = list.slice(4, 7)
    }
  } catch(e) {
    console.error('Failed to fetch convenience services', e)
  }
}

const laodaoJobs = ref<any[]>([])
const zhongyaJobs = ref<any[]>([])
const reportTypes = ref<any[]>([])
const communities = ref<any[]>([])

const fetchDicts = async () => {
  try {
    const res: any = await http.get('/prod-api/sys/dict/data', { types: 'portal_complaint_report_type,portal_complaint_community' })
    if (res.code === 0 && Array.isArray(res.data) && res.data.length >= 2) {
      reportTypes.value = res.data[0] || []
      communities.value = res.data[1] || []
      if (reportTypes.value.length > 0 && !snapshotForm.value.reportType) {
        snapshotForm.value.reportType = reportTypes.value[0].dictValue
      }
      if (communities.value.length > 0 && !snapshotForm.value.community) {
        snapshotForm.value.community = communities.value[0].dictValue
      }
    }
  } catch (error) {
    console.error('Failed to fetch dicts', error)
  }
}

const fetchJobs = async () => {
  try {
    const resLaodao: any = await http.get('/prod-api/portal/job/page', { page: 1, limit: 2, jobType: 1, lang: locale.value || 'zh' })
    if (resLaodao.code === 0 || String(resLaodao.code) === '0') {
      laodaoJobs.value = resLaodao.data.list || []
    }
    
    const resZhongya: any = await http.get('/prod-api/portal/recruitment/page', { page: 1, limit: 2, workType: 1, lang: locale.value || 'zh' })
    if (resZhongya.code === 0 || String(resZhongya.code) === '0') {
      zhongyaJobs.value = resZhongya.data.list || []
    }
  } catch (e) {
    console.error('Failed to fetch jobs', e)
  }
}

watch(locale, () => {
  fetchConvenience()
  fetchJobs()
})

onMounted(() => {
  fetchDicts()
  fetchConvenience()
  fetchJobs()
})
import BannerSideOverlay from '@/components/BannerSideOverlay.vue'
</script>

<template>
  <div class="public-page-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="life" />
      <BannerSideOverlay />
      <div style="display: flex; gap: 20px; flex: 1; height: 100%;">
        <div class="content-box" style="flex: 1; min-width: 0;">
        <div class="bm-grid">
          <!-- 1. 城市治理 · 随手拍 -->
          <div class="bm-card shoot-card" >
            <div class="card-header green-theme">
              <div class="header-title-box">
                <div class="icon-square green">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                    <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <div>
                  <h2 :title="t('services.cityGovernance')">{{ t('services.cityGovernance') }}</h2>
                  <p class="subtitle" :title="t('services.governanceLoop')">{{ t('services.governanceLoop') }}</p>
                </div>
              </div>
            </div>

            <div class="shoot-body">
              <div class="row-group">
                <div class="col" style="margin-right: 10px;">
                  <label class="form-label">{{ t('services.reportType') }}</label>
                  <select class="shoot-input" v-model="snapshotForm.reportType">
                    <option v-for="item in reportTypes" :key="item.id || item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</option>
                  </select>
                </div>
                <div class="col">
                  <label class="form-label">{{ t('services.community') }}</label>
                  <select class="shoot-input" v-model="snapshotForm.community">
                    <option v-for="item in communities" :key="item.id || item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</option>
                  </select>
                </div>
              </div>

              <label class="form-label" style="margin-top: 10px;">{{ t('services.issueDesc') }}</label>
              <div class="textarea-with-upload">
                <div class="upload-container">
                  <div v-for="(img, index) in uploadedImages" :key="index" class="upload-item">
                    <img :src="formatImageUrl(img)" class="upload-preview" />
                    <button type="button" class="btn-remove-img" @click="removeImage(index)">×</button>
                  </div>
                  <div class="upload-btn" v-if="uploadedImages.length < 9">
                    <span>{{ imageUploading ? '上传中...' : t('services.addImage') }}</span>
                    <input type="file" accept="image/*" multiple :disabled="imageUploading" @change="handleImageUpload" />
                  </div>
                </div>
                <textarea
                  v-model="snapshotForm.content"
                  :placeholder="t('services.descPlaceholder')"
                  class="shoot-textarea-inner"
                ></textarea>
              </div>

              <div class="row-group" style="margin-top: 10px;">
                <div class="col" style="margin-right: 10px;">
                  <label class="form-label">{{ t('services.name') }}</label>
                  <input type="text" class="shoot-input" v-model="snapshotForm.contactName" :placeholder="t('services.name')" />
                </div>
                <div class="col">
                  <label class="form-label">{{ t('services.phone') }}</label>
                  <input type="text" class="shoot-input" v-model="snapshotForm.contactPhone" :placeholder="t('services.phone')" />
                </div>
              </div>
              
              <label class="form-label" style="margin-top: 10px;">{{ t('services.address') }}</label>
              <div style="display: flex; gap: 10px; margin-bottom: 16px;">
                <input type="text" class="shoot-input" v-model="snapshotForm.address" :placeholder="t('services.addressPlaceholder')" style="margin-bottom: 0;" />
                <button type="button" class="btn-location" @click="openMapModal">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ t('services.locate') }}
                </button>
              </div>

              <button class="submit-btn green" @click="submitSnapshotForm" :disabled="snapshotSubmitting || imageUploading">
                {{ snapshotSubmitting ? t('services.submitting') : t('services.uploadNow') }}
              </button>
            </div>
          </div>

       
          
          <!-- 4. 社区便民 -->
          <div class="bm-card blue-tint-card">
            <div class="card-header-flex">
              <h2>{{ t('services.communityConvenience') }}</h2>
              <span class="arrow"><svg t="1787197216878" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6569" width="200" height="200"><path d="M716.617 477.941L355.519 142.045c-14.661-13.091-37.097-12.05-50.488 2.341-13.389 14.392-12.811 36.845 1.306 50.527L639.633 504.95 305.797 828.643a36.097 36.097 0 0 0-9.874 34.718 36.098 36.098 0 0 0 25.137 25.907 36.093 36.093 0 0 0 35.004-8.81l361.099-350.122a36.056 36.056 0 0 0 10.981-26.294 36.052 36.052 0 0 0-11.527-26.063" fill="#333333" p-id="6570"></path></svg></span>
            </div>
            <div class="services-icon-grid">
              <div v-for="(s, i) in communityServices" :key="i" class="icon-item-box" @click="handleNavigate(s)" :title="s.name">
                <div class="svg-icon-blue">
                  <img v-if="s.bgImage && (s.bgImage.includes('/') || s.bgImage.includes('.'))" :src="s.bgImage.startsWith('http') ? s.bgImage : minioPrefix + s.bgImage " style="width: 36px; height: 36px; object-fit: contain; filter: none;" />
                  <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0066ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path :d="s.icon" />
                  </svg>
                </div>
                <span :title="s.name">{{ s.name }}</span>
              </div>
            </div>
          </div>

          <!-- 5. 生活服务 -->
          <div class="bm-card pur-tint-card">
            <div class="card-header-flex">
              <h2>{{ t('services.lifeService') }}</h2>
              <span class="arrow"><svg t="1787197216878" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6569" width="200" height="200"><path d="M716.617 477.941L355.519 142.045c-14.661-13.091-37.097-12.05-50.488 2.341-13.389 14.392-12.811 36.845 1.306 50.527L639.633 504.95 305.797 828.643a36.097 36.097 0 0 0-9.874 34.718 36.098 36.098 0 0 0 25.137 25.907 36.093 36.093 0 0 0 35.004-8.81l361.099-350.122a36.056 36.056 0 0 0 10.981-26.294 36.052 36.052 0 0 0-11.527-26.063" fill="#333333" p-id="6570"></path></svg></span>
            </div>
            <div class="services-icon-grid">
              <div v-for="(s, i) in lifeServices" :key="i" class="icon-item-box" @click="handleNavigate(s)" :title="s.name">
                <div class="svg-icon-blue">
                  <img v-if="s.bgImage && (s.bgImage.includes('/') || s.bgImage.includes('.'))" :src="s.bgImage.startsWith('http') ? s.bgImage : minioPrefix + s.bgImage " style="width: 36px; height: 36px; object-fit: contain; filter: none;" />
                  <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0066ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path :d="s.icon" />
                  </svg>
                </div>
                <span :title="s.name">{{ s.name }}</span>
              </div>
            </div>
          </div>
             <!-- 2. 劳道智工 · 短期工 -->
          <div class="bm-card teal-tint" @click="openModal(laodaoInfo)">
            <div class="card-header-flex">
              <div class="header-title-box">
                <div class="icon-square teal">
                  <img v-if="laodaoInfo.bgImage && (laodaoInfo.bgImage.includes('/') || laodaoInfo.bgImage.includes('.'))" :src="laodaoInfo.bgImage.startsWith('http') ? laodaoInfo.bgImage : minioPrefix + laodaoInfo.bgImage" style="width: 36px; height: 36px; object-fit: contain; " />
                  <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                </div>
                <h2 :title="(laodaoInfo.name ? laodaoInfo.name : t('jobs.laodao')) + ' · ' + t('services.shortTermJob')">{{ laodaoInfo.name ? laodaoInfo.name : t('jobs.laodao') }} · <span>{{ t('services.shortTermJob') }}</span></h2>
              </div>
              <span class="arrow"><svg t="1787197216878" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6569" width="200" height="200"><path d="M716.617 477.941L355.519 142.045c-14.661-13.091-37.097-12.05-50.488 2.341-13.389 14.392-12.811 36.845 1.306 50.527L639.633 504.95 305.797 828.643a36.097 36.097 0 0 0-9.874 34.718 36.098 36.098 0 0 0 25.137 25.907 36.093 36.093 0 0 0 35.004-8.81l361.099-350.122a36.056 36.056 0 0 0 10.981-26.294 36.052 36.052 0 0 0-11.527-26.063" fill="#333333" p-id="6570"></path></svg></span>
            </div>

            <div class="short-job-body">
              <div class="job-list-container">
                <div class="job-item" v-for="(job, idx) in laodaoJobs" :key="idx" @click.stop="router.push({ path: '/service/jobs', query: { tab: 'laodao' } })">
                  <div class="job-item-header">
                    <span class="job-title" :title="job.positionName">{{ job.positionName }}</span>
                    <span class="job-salary" :title="job.salaryShow || (job.salaryMin != null ? `${job.salaryMin}K-${job.salaryMax}K` : t('services.negotiable'))" v-if="job.salaryShow">{{ job.salaryShow }}</span>
                    <span class="job-salary" :title="`${job.salaryMin}K-${job.salaryMax}K`" v-else-if="job.salaryMin != null">{{ job.salaryMin }}K-{{ job.salaryMax }}K</span>
                    <span class="job-salary" :title="t('services.negotiable')" v-else>{{ t('services.negotiable') }}</span>
                  </div>
                  <div class="job-item-tags">
                    <span class="job-tag teal" v-for="(tag, tIdx) in [job.districtName, job.experienceLabel, ...(job.welfareBenefits || [])].filter(Boolean).slice(0, 2)" :key="tIdx" :title="tag">{{ tag }}</span>
                  </div>
                  <div class="job-item-footer">
                    <span class="job-location" :title="job.workAddress || t('services.addressUnknown')">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span class="job-location-text">{{ job.workAddress || t('services.addressUnknown') }}</span>
                    </span>
                    <span class="job-date">{{ (job.publishTimeStr || job.createTimeStr || '').split(' ')[0] }}</span>
                  </div>
                </div>
              </div>
              <div class="hot-job-banner" @click.stop="router.push({ path: '/service/jobs', query: { tab: 'laodao' } })">
                <span>{{ t('services.hotJobs') }} <strong>*{{ hotJobsCount }}</strong></span>
                <a href="javascript:void(0)" class="view-link">{{ t('common.view') }} &rarr;</a>
              </div>
            </div>
          </div>

          <!-- 3. 中亚职通桥 · 长期工 -->
          <div class="bm-card yellow-tint" @click="openModal(zhongyaInfo)">
            <div class="card-header-flex">
              <div class="header-title-box">
                <div class="icon-square orange">
                  <img v-if="zhongyaInfo.bgImage && (zhongyaInfo.bgImage.includes('/') || zhongyaInfo.bgImage.includes('.'))" :src="zhongyaInfo.bgImage.startsWith('http') ? zhongyaInfo.bgImage : minioPrefix + zhongyaInfo.bgImage" style="width: 36px; height: 36px; object-fit: contain;" />
                  <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                  </svg>
                </div>
                <h2 :title="(zhongyaInfo.name ? zhongyaInfo.name.split('·')[0] : t('jobs.zhongya')) + ' · ' + t('services.longTermJob')">{{ zhongyaInfo.name ? zhongyaInfo.name.split('·')[0] : t('jobs.zhongya') }} · <span>{{ t('services.longTermJob') }}</span></h2>
              </div>
              <span class="arrow"><svg t="1787197216878" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6569" width="200" height="200"><path d="M716.617 477.941L355.519 142.045c-14.661-13.091-37.097-12.05-50.488 2.341-13.389 14.392-12.811 36.845 1.306 50.527L639.633 504.95 305.797 828.643a36.097 36.097 0 0 0-9.874 34.718 36.098 36.098 0 0 0 25.137 25.907 36.093 36.093 0 0 0 35.004-8.81l361.099-350.122a36.056 36.056 0 0 0 10.981-26.294 36.052 36.052 0 0 0-11.527-26.063" fill="#333333" p-id="6570"></path></svg></span>
            </div>

            <div class="long-job-body">
              <div class="job-list-container">
                <div class="job-item yellow" v-for="(job, idx) in zhongyaJobs" :key="idx" @click.stop="router.push({ path: '/service/jobs', query: { tab: 'zhongya' } })">
                  <div class="job-item-header">
                    <span class="job-title" :title="job.title">{{ job.title }}</span>
                    <span class="job-salary" :title="job.salaryShow || (job.minSalary != null ? `${job.minSalary}-${job.maxSalary}` : t('services.negotiable'))" v-if="job.salaryShow">{{ job.salaryShow }}</span>
                    <span class="job-salary" :title="`${job.minSalary}-${job.maxSalary}`" v-else-if="job.minSalary != null">{{ job.minSalary }}-{{ job.maxSalary }}</span>
                    <span class="job-salary" :title="t('services.negotiable')" v-else>{{ t('services.negotiable') }}</span>
                  </div>
                  <div class="job-item-tags">
                    <span class="job-tag yellow" v-for="(tag, tIdx) in [job.city, job.experienceLabel, job.educationLabel].filter(Boolean).slice(0, 2)" :key="tIdx" :title="tag">{{ tag }}</span>
                  </div>
                  <div class="job-item-footer">
                    <span class="job-location" :title="job.workLocation || job.city || t('services.addressUnknown')">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span class="job-location-text">{{ job.workLocation || job.city || t('services.addressUnknown') }}</span>
                    </span>
                    <span class="job-date">{{ (job.createDate || '').split(' ')[0] }}</span>
                  </div>
                </div>
              </div>
              <button class="yellow-action-btn" @click.stop="router.push({ path: '/service/jobs', query: { tab: 'zhongya' } })">
                {{ t('services.findTalentJob') }} <span class="sub-link">{{ t('services.jobList') }} &rarr;</span>
              </button>
            </div>
          </div>
          <!-- 底部三列横向入口卡片 -->
            <div v-for="(bc, i) in bottomCards" :style="{ backgroundImage: `url(${ssBgs[i]})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', border: 'none' }" :key="i" class="bm-card footer-small-card" @click="handleNavigate(bc)">
              <div class="small-card-content">
                <div class="card-icon-square" :class="['purple', 'cyan', 'yellow'][i % 3]">
                <img v-if="bc.bgImage && (bc.bgImage.includes('/') || bc.bgImage.includes('.'))" :src="bc.bgImage.startsWith('http') ? bc.bgImage : minioPrefix + bc.bgImage" style="width: 40px; height: 40px; object-fit: contain;" />
                <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <div class="text-info">
                <h3>{{ bc.name.replace('(霍尔果斯云)', '') }} <span class="sub" v-if="bc.name.includes('(霍尔果斯云)')">({{ t('services.khorgosCloud') }})</span> &rarr;</h3>
                <p>{{ bc.remark || t('common.noDesc') }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    
      </div>
    </main>

    <!-- 弹窗 -->
    <div class="modal-overlay" v-if="activeModal" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeModal">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="modal-header">
          <div class="modal-icon-box" :class="{ 'green': activeModal.name?.includes('劳道'), 'yellow': activeModal.name?.includes('中亚') }">
            <img v-if="activeModal.bgImage && (activeModal.bgImage.includes('/') || activeModal.bgImage.includes('.'))" :src="activeModal.bgImage.startsWith('http') ? activeModal.bgImage : minioPrefix + activeModal.bgImage" style="" />
            <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" stroke-width="2">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
          <h2 class="modal-title">{{ activeModal.name ? activeModal.name.split('·')[0] : '' }}{{ t('services.intro') }}</h2>
        </div>
        <p class="modal-desc">{{ activeModal.linkDesc || t('services.noIntro') }}</p>
        <div class="modal-qrcode-section" :class="{ 'green-bg': activeModal.name?.includes('劳道'), 'yellow-bg': activeModal.name?.includes('中亚') }">
          <div class="qrcode-title">{{ t('services.scanQrCode') }}</div>
          <div class="qrcode-wrapper">
            <img v-if="activeModal.qrcode" :src="activeModal.qrcode.startsWith('http') ? activeModal.qrcode : minioPrefix + activeModal.qrcode" alt="QR Code" class="qrcode-img" />
            <!-- Fallback QR code images if no dynamic one -->
          </div>
        </div>
      </div>
    </div>

    <!-- 地图选址弹窗 -->
    <div class="modal-overlay" v-if="showMapModal" @click.self="closeMapModal">
      <div class="modal-content" style="width: 600px; max-width: 90vw;">
        <button class="modal-close-btn" @click="closeMapModal">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="modal-header">
          <h2 class="modal-title">{{ t('services.selectLocation') }}</h2>
        </div>
        <div id="amap-container" style="width: 100%; height: 400px; border-radius: 4px; border: 1px solid #cbd5e1; margin-top: 10px;"></div>
        <div style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
          <span style="flex: 1; align-self: center; font-size: 13px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ tempLocation.address }}</span>
          <button class="action-btn" style="background-color: #94a3b8;" @click="closeMapModal">{{ t('common.cancel') }}</button>
          <button class="action-btn" style="background-color: #10b981;" @click="confirmLocation">{{ t('common.confirm') }}</button>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<style scoped>
.btn-location {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 0 12px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 13px;
  transition: all 0.2s;
}
.btn-location:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.public-page-container {
  width: 100%;
  min-height: calc(100vh / var(--app-zoom, 1));
  position: relative;
  display: flex;
  flex-direction: column;
  color: #1e293b;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  background-color: transparent;
}

.main-content {
  height: 850px;
  position: relative;
  z-index: 5;
  width: 1280px;
  margin: 0 auto;
  padding: 140px 0px 40px 0px;
  box-sizing: border-box;
}

/* 内容卡片外壳 */
.content-box {
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 24px;
    height:600px
}

.bm-grid {
  display: grid;
  grid-template-columns: 340px 1fr 1fr;
  gap: 20px;
}

.bm-card {
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 10px 20px;
  box-sizing: border-box;
}
.footer-small-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  transform: scale(1.05);
  transition: all 0.2s; 
  cursor: pointer;
}
.footer-small-card{
  border:1px solid #eee
}
.shoot-card {
  grid-row: span 2;
  background: #e6f9f0;
  border: 1px solid #a7f3d0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.shoot-card .card-header {
  min-width: 0;
  width: 100%;
}

.shoot-card h2,
.shoot-card .header-title-box h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
  display: block;
}

.header-title-box {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.header-title-box > div:not(.icon-square) {
  min-width: 0;
  flex: 1;
  overflow: hidden;
}

.header-title-box h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
}

.shoot-card p,
.shoot-card .header-title-box p.subtitle,
.header-title-box p.subtitle {
  font-size: 12px;
  color: #059669;
  margin: 2px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
  display: block;
}

.icon-square {
  width: 36px;
  height: 36px;
  overflow:hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-square.green { background: #10b981; }
.icon-square.teal { background: #0d9488; }
.icon-square.orange { background: #f59e0b; }

.shoot-body {
  margin-top: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 13px;
  color: #475569;
  margin-bottom: 12px;
  display: block;
}

.type-tags {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.tag-btn {
  padding: 8px 0;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  font-size: 12px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.tag-btn.active {
  background: #10b981;
  color: #ffffff;
  border-color: #10b981;
}

.textarea-with-upload {
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: stretch;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  padding: 8px;
  transition: border-color 0.2s;
}
.textarea-with-upload:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.shoot-textarea-inner {
  flex: 1;
  min-height: 60px;
  border: none;
  font-size: 13px;
  outline: none;
  resize: none;
  background: transparent;
  margin-bottom: 0;
}

.shoot-textarea:focus,
.shoot-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.shoot-input {
  width: 100%;
  border: 1px solid #cbd5e1;
  padding: 8px 12px;
  box-sizing: border-box;
  font-size: 13px;
  outline: none;
  background: #ffffff;
  transition: border-color 0.2s;
}

.row-group {
  display: flex;
}
.row-group .col {
  flex: 1;
}

/* 上传框样式 */
.upload-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 130px;
  align-content: flex-start;
}
.upload-item {
  position: relative;
  width: 60px;
  height: 60px;
  border: 1px solid #cbd5e1;
  overflow: hidden;
}
.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.btn-remove-img {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-btn {
  position: relative;
  width: 60px;
  height: 60px;
  border: 1px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 10px;
  cursor: pointer;
  background: #f8fafc;
  transition: all 0.2s;
  text-align: center;
  padding: 0 4px;
}
.upload-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}
.upload-btn input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.submit-btn {
  background: #10b981;
  color: #ffffff;
  border: none;
  padding: 12px 0;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin-top: auto;
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 10px;
  min-width: 0;
  gap: 8px;
}

.card-header-flex h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 300px;
}

.card-header-flex h2 span {
  color: #0d9488;
}

.arrow {
  color: #94a3b8;
  font-size: 16px;
  flex-shrink: 0;
}
.arrow svg {
  width: 16px;
  height: 16px;
  stroke: #94a3b8;
}
/* 劳道智工 (Teal) */
.teal-tint {
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s;
}

.teal-tint:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.short-job-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.job-list-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.job-item {
  background: #ffffff;
  border: 1px solid #99f6e4;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
}
.job-item:hover {
  background: #ccfbf1;
}
.job-item.yellow {
  border-color: #fde68a;
}
.job-item.yellow:hover {
  background: #fef3c7;
}

.job-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  min-width: 0;
}

.job-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.job-salary {
  font-size: 12px;
  color: #ef4444;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  max-width: 48%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}

.job-item-tags {
  margin: 6px 0;
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
  overflow: hidden;
  min-width: 0;
}

.job-tag {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50%;
  flex: 0 1 auto;
  display: inline-block;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  box-sizing: border-box;
}

.job-tag.teal {
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
  color: #0d9488;
}

.job-tag.yellow {
  background: #fef3c7;
  border: 1px solid #fde68a;
  color: #d97706;
}

.job-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
  min-width: 0;
}

.job-location {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.job-location svg {
  flex-shrink: 0;
}

.job-location-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.job-date {
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 11px;
}

.job-item-company {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hot-job-banner {
  background: #ccfbf1;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #0d9488;
  margin-top: auto;
  cursor: pointer;
  transition: all 0.2s;
}

.hot-job-banner:hover {
  background: #99f6e4;
}

.hot-job-banner:active {
  transform: scale(0.98);
}

.hot-job-banner strong {
  font-size: 15px;
  margin-left: 4px;
}

.view-link {
  color: #0d9488;
  text-decoration: none;
  font-weight: 500;
}

.view-link:hover {
  text-decoration: underline;
}

/* 中亚职通桥 (Yellow) */
.yellow-tint {
  background: #fffbeb;
  border: 1px solid #fef3c7;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s;
}

.yellow-tint:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.long-job-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.desc-text {
  font-size: 13px;
  color: #b45309;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.yellow-action-btn {
  background: #f59e0b;
  color: #ffffff;
  border: none;
  padding: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  transition: all 0.2s;
}

.yellow-action-btn:hover {
  background: #d97706;
}

.yellow-action-btn:active {
  transform: scale(0.98);
}

.yellow-action-btn .sub-link {
  font-size: 13px;
  font-weight: 400;
  opacity: 0.9;
}

/* 社区便民 & 生活服务 (Blue) */
.blue-tint-card {
  background: linear-gradient( 180deg, rgba(0,140,245,0.1) 0%, rgba(241,242,243,0) 100%), #FFFFFF;
  border: 1px solid #ddd;
  grid-column: span 1;
  height:240px;
}
.pur-tint-card {
  background: linear-gradient( 180deg, rgba(68,106,245,0.1) 0%, rgba(243,243,243,0) 100%), #FFFFFF;
  border: 1px solid #ddd;
  grid-column: span 1;
  height:240px;
}

/* 底部小卡片 */
.footer-small-card {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #ddd;
  grid-column: span 1;
}

.small-card-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon-square {
  width: 40px;
  height: 40px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon-square.purple { background: #8b5cf6; }
.card-icon-square.cyan { background: #06b6d4; }
.card-icon-square.yellow { background: #f59e0b; }

.text-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.text-info p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.text-info h3 .sub {
  font-size: 12px;
  font-weight: 400;
  color: #94a3b8;
  margin-left: 4px;
}
/* 5列 Icon 布局 */
.services-icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr) !important;
  gap: 16px 0px;
  margin-top: 10px;
}

.icon-item-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 4px;
}

.icon-item-box .svg-icon-blue {
  width: 36px;
  height: 36px;
  background: #eff6ff;
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-item-box:hover .svg-icon-blue {
  transform: translateY(-2px);
}

.icon-item-box:hover .svg-icon-blue svg {
  stroke: #ffffff;
}

.icon-item-box span {
  font-size: 12px;
  color: #334155;
  text-align: center;
  width: 100%;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.icon-item-box:hover span {
  color: #0066ff;
  font-weight: 500;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #94a3b8;
  font-size: 18px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh / var(--app-zoom, 1));
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #ffffff;
  border-radius: 12px;
  width: 440px;
  padding: 30px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close-btn:hover {
  color: #0f172a;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.modal-icon-box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-icon-box img {
  width:100%
}

.modal-icon-box.green { background: #10b981; }
.modal-icon-box.yellow { background: #f59e0b; }

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.modal-desc {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 24px 0;
  text-align: justify;
}

.modal-qrcode-section {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.modal-qrcode-section.green-bg {
  background: linear-gradient(180deg, #e6f9f0 0%, #ffffff 100%);
}

.modal-qrcode-section.yellow-bg {
  background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
}

.qrcode-title {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  background: #ffffff;
  padding: 6px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.qrcode-wrapper {
  background: #ffffff;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.qrcode-img {
  width: 140px;
  height: 140px;
  object-fit: contain;
}
@media screen and (max-width: 768px) {
  .shoot-textarea-inner{
    width: 200px;
  }
}
</style>
