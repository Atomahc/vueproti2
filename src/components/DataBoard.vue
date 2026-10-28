<script setup lang="ts">
import { ref, onMounted, watch, nextTick, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import EconomicOperation from './EconomicOperation.vue'

const { t, locale } = useI18n()

const activeTab = ref('economy') // 'trade' or 'governance' or 'economy'

const tradeChartRef = ref<HTMLElement | null>(null)
const govBarChartRef = ref<HTMLElement | null>(null)
const govPieChartRef = ref<HTMLElement | null>(null)

let tradeChart: any = null
let govBarChart: any = null
let govPieChart: any = null

const initTradeChart = () => {
  if (!tradeChartRef.value) return
  if (!tradeChart) tradeChart = echarts.init(tradeChartRef.value)
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { show: true, right: '4%', top: 0 },
    grid: { left: '3%', right: '4%', bottom: '3%', top:'18%', containLabel: true },
    xAxis: { type: 'category', data: [t('dataOpen.heavyTruck'), t('dataOpen.commercialCar')] },
    yAxis: { type: 'value' },
    series: [
      { 
        name: t('dataOpen.clearanceCount'), 
        type: 'bar', 
        barWidth: 30, 
        data: [38928, 22731], 
        itemStyle: { color: '#2563eb' },
        label: { show: true, position: 'top', color: '#2563eb', formatter: (params: any) => params.value.toLocaleString() }
      },
      { 
        name: t('dataOpen.appointmentCount'), 
        type: 'bar', 
        barWidth: 30, 
        data: [38928, 22731], 
        itemStyle: { color: '#93c5fd' },
        label: { show: true, position: 'top', color: '#93c5fd', formatter: (params: any) => params.value.toLocaleString() }
      }
    ]
  }
  tradeChart.setOption(option)
}

const initGovCharts = () => {
  if (!govBarChartRef.value || !govPieChartRef.value) return
  if (!govBarChart) govBarChart = echarts.init(govBarChartRef.value)
  if (!govPieChart) govPieChart = echarts.init(govPieChartRef.value)
  
  const barOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '10%', bottom: '3%',  top:'3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: [t('dataOpen.cityEnv'), t('dataOpen.undergroundPipes'), t('dataOpen.trafficFacilities'), t('dataOpen.publicFacilities'), t('dataOpen.landscaping')] },
    series: [
      {
        type: 'bar',
        barWidth: 20,
        data: [5698, 6632, 4463, 4435, 4125],
        itemStyle: { color: '#06b6d4' },
        label: { show: true, position: 'right' }
      }
    ]
  }
  govBarChart.setOption(barOption)

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 0, top: 'middle' },
    series: [
      {
        name: t('dataOpen.assetCategory'),
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: true, formatter: '{d}%' },
        data: [
          { value: 6632, name: t('dataOpen.undergroundPipes'), itemStyle: { color: '#00709a' } },
          { value: 5698, name: t('dataOpen.cityEnv'), itemStyle: { color: '#00a3d3' } },
          { value: 4463, name: t('dataOpen.trafficFacilities'), itemStyle: { color: '#14c5e3' } },
          { value: 4435, name: t('dataOpen.publicFacilities'), itemStyle: { color: '#56ddf3' } },
          { value: 4125, name: t('dataOpen.landscaping'), itemStyle: { color: '#a0efff' } }
        ]
      }
    ]
  }
  govPieChart.setOption(pieOption)
}

watch(locale, () => {
  if (activeTab.value === 'trade') initTradeChart()
  if (activeTab.value === 'governance') initGovCharts()
})

const switchTab = (tab: string) => {
  activeTab.value = tab
  nextTick(() => {
    if (tab === 'trade') {
      initTradeChart()
      if (tradeChart) tradeChart.resize()
    }
    if (tab === 'governance') {
      initGovCharts()
      if (govBarChart) govBarChart.resize()
      if (govPieChart) govPieChart.resize()
    }
  })
}

onMounted(() => {
  initTradeChart()
  
  window.addEventListener('resize', () => {
    if (tradeChart) tradeChart.resize()
    if (govBarChart) govBarChart.resize()
    if (govPieChart) govPieChart.resize()
  })
})
</script>
<template>
  <div class="data-board">
    <div class="board-header">
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 'economy' }" @click="switchTab('economy')">
          <div class="tab-indicator"></div>{{ t('dataOpen.economyRun') }}
        </div>
        <div class="tab" :class="{ active: activeTab === 'trade' }" @click="switchTab('trade')">
          <div class="tab-indicator"></div>{{ t('dataOpen.portTradeData') }}
        </div>
        <div class="tab" :class="{ active: activeTab === 'governance' }" @click="switchTab('governance')">
          <div class="tab-indicator"></div>{{ t('dataOpen.cityGovernanceData') }}
        </div>
      
      </div>
    </div>
    
    <div class="board-content">
      <!-- Trade Tab -->
      <div v-show="activeTab === 'trade'" class="tab-panel">
        <div class="cards-grid-4">
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.railFreightTotal') }}</div>
             <div class="card-value"><span class="num text-blue">67,873</span>{{ t('dataOpen.tenThousandTons') }}</div>
          </div>
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.railTrains') }}</div>
             <div class="card-value"><span class="num text-blue">873</span>{{ t('dataOpen.trainUnit') }}</div>
          </div>
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.railTransshipment') }}</div>
             <div class="card-value"><span class="num text-blue">873</span>{{ t('dataOpen.yiYuan') }}</div>
          </div>
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.vehicleClearance') }}</div>
             <div class="card-value"><span class="num text-blue">1,873</span>{{ t('dataOpen.vehicleUnit') }}</div>
          </div>
        </div>
        <div class="cards-grid-4" style="margin-top: 15px;">
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.heavyTruckClearance') }}</div>
             <div class="card-value"><span class="num text-blue">38,928</span>{{ t('dataOpen.vehicleUnit') }}</div>
          </div>
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.commercialCarClearance') }}</div>
             <div class="card-value"><span class="num text-blue">22,731</span>{{ t('dataOpen.vehicleUnit') }}</div>
          </div>
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.heavyTruckAppoint') }}</div>
             <div class="card-value"><span class="num text-blue">38,928</span>{{ t('dataOpen.vehicleUnit') }}</div>
          </div>
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.commercialCarAppoint') }}</div>
             <div class="card-value"><span class="num text-blue">22,731</span>{{ t('dataOpen.vehicleUnit') }}</div>
          </div>
        </div>
        
        <div class="chart-container" style="margin-top: 10px;">
           <div class="chart-title">{{ t('dataOpen.truckCompare') }}</div>
           <div ref="tradeChartRef" style="height: 150px; width: 100%;"></div>
        </div>
      </div>
      
      <!-- Governance Tab -->
      <div v-show="activeTab === 'governance'" class="tab-panel">
        <div class="cards-grid-3">
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.monthlyNewCases') }}</div>
             <div class="card-value"><span class="num text-cyan">352</span>{{ t('dataOpen.caseUnit') }}</div>
          </div>
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.assetPartsTotal') }}</div>
             <div class="card-value"><span class="num text-cyan">25,353</span>{{ t('dataOpen.itemUnit') }}</div>
          </div>
          <div class="data-card">
             <div class="card-label">{{ t('dataOpen.facilityCategories') }}</div>
             <div class="card-value"><span class="num text-cyan">5</span>{{ t('dataOpen.categoryUnit') }}</div>
          </div>
        </div>
        
        <div class="gov-charts-grid" style="margin-top: 20px; display: flex; gap: 20px;">
           <div class="chart-container" style="flex: 1;">
              <div class="chart-title">{{ t('dataOpen.cityAssetDist') }}</div>
              <div ref="govBarChartRef" style="height: 232px; width: 100%;"></div>
           </div>
           <div class="chart-container" style="flex: 1;">
              <div class="chart-title">{{ t('dataOpen.assetCategoryShare') }}</div>
              <div ref="govPieChartRef" style="height: 232px; width: 100%;"></div>
           </div>
        </div>
      </div>

      <!-- Economy Tab -->
      <div v-if="activeTab === 'economy'" class="tab-panel">
        <EconomicOperation />
      </div>
    </div>
  </div>
</template>
<style scoped>
.board-content{
  height: 395px;
  overflow: scroll;
}
.data-board {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 20px;
  padding-top:0px;
  padding-bottom:10px;
}
.board-header {
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}
.tabs {
  display: flex;
  gap: 30px;
}
.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  color: #64748b;
  position: relative;
}
.tab.active {
  color: #1e293b;
}
.tab-indicator {
  width: 4px;
  height: 16px;
  background: transparent;
  border-radius: 2px;
}
.tab.active .tab-indicator {
  background: #3b82f6;
}
.cards-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}
.cards-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
.data-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding:10px 20px;
  text-align: center;
}
.card-label {
  color: #64748b;
  font-size: 14px;

}
.card-value {
  color: #94a3b8;
  font-size: 14px;
}
.card-value .num {
  font-size: 24px;
  font-weight: bold;
  margin-right: 4px;
}
.text-blue { color: #2563eb; }
.text-cyan { color: #0891b2; }
.chart-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;
}
.chart-title {
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 10px;
}

@media screen and (max-width: 768px) {
  .cards-grid-4, .cards-grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
  .gov-charts-grid {
    flex-direction: column !important;
  }
  .tabs {
    gap: 15px;
    flex-wrap: wrap;
  }
  .tab {
    font-size: 14px;
  }
  .board-content {
    height: auto;
    max-height: 600px;
  }
  .chart-container {
    padding: 10px;
  }
  .data-board{
    padding:10px;
  }
}
</style>
