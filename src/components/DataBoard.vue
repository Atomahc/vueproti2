<script setup lang="ts">
import { ref, onMounted, watch, nextTick, shallowRef } from 'vue'
import * as echarts from 'echarts'
import EconomicOperation from './EconomicOperation.vue'

const activeTab = ref('trade') // 'trade' or 'governance' or 'economy'

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
    legend: { show: false },
    grid: { left: '3%', right: '4%', bottom: '3%', top:'6%'},
    xAxis: { type: 'category',  },
    yAxis: { type: 'value' },
    series: [
      { name: '放行数量', type: 'bar', barWidth: 30, data: [38928, 22731], itemStyle: { color: '#2563eb' } },
      { name: '预约数量', type: 'bar', barWidth: 30, data: [38928, 22731], itemStyle: { color: '#93c5fd' } }
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
    yAxis: { type: 'category', data: ['市容环境', '地下管网', '交通设施', '公共设施', '园林绿化'] },
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
        name: '资产类别',
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
          { value: 6632, name: '地下管网', itemStyle: { color: '#00709a' } },
          { value: 5698, name: '市容环境', itemStyle: { color: '#00a3d3' } },
          { value: 4463, name: '交通设施', itemStyle: { color: '#14c5e3' } },
          { value: 4435, name: '公共设施', itemStyle: { color: '#56ddf3' } },
          { value: 4125, name: '园林绿化', itemStyle: { color: '#a0efff' } }
        ]
      }
    ]
  }
  govPieChart.setOption(pieOption)
}

const switchTab = (tab: string) => {
  activeTab.value = tab
  nextTick(() => {
    if (tab === 'trade') initTradeChart()
    if (tab === 'governance') initGovCharts()
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
        <div class="tab" :class="{ active: activeTab === 'trade' }" @click="switchTab('trade')">
          <div class="tab-indicator"></div>口岸贸易数据
        </div>
        <div class="tab" :class="{ active: activeTab === 'governance' }" @click="switchTab('governance')">
          <div class="tab-indicator"></div>城市治理数据
        </div>
        <div class="tab" :class="{ active: activeTab === 'economy' }" @click="switchTab('economy')">
          <div class="tab-indicator"></div>经济运行情况
        </div>
      </div>
    </div>
    
    <div class="board-content">
      <!-- Trade Tab -->
      <div v-show="activeTab === 'trade'" class="tab-panel">
        <div class="cards-grid-4">
          <div class="data-card">
             <div class="card-label">铁路货运总量</div>
             <div class="card-value"><span class="num text-blue">67,873</span>万吨</div>
          </div>
          <div class="data-card">
             <div class="card-label">铁路班列数</div>
             <div class="card-value"><span class="num text-blue">873</span>列</div>
          </div>
          <div class="data-card">
             <div class="card-label">铁路换装量</div>
             <div class="card-value"><span class="num text-blue">873</span>亿元</div>
          </div>
          <div class="data-card">
             <div class="card-label">车辆通关数</div>
             <div class="card-value"><span class="num text-blue">1,873</span>辆</div>
          </div>
        </div>
        <div class="cards-grid-4" style="margin-top: 15px;">
          <div class="data-card">
             <div class="card-label">重车放行数量</div>
             <div class="card-value"><span class="num text-blue">38,928</span>辆</div>
          </div>
          <div class="data-card">
             <div class="card-label">商品车放行数量</div>
             <div class="card-value"><span class="num text-blue">22,731</span>辆</div>
          </div>
          <div class="data-card">
             <div class="card-label">重车预约数量</div>
             <div class="card-value"><span class="num text-blue">38,928</span>辆</div>
          </div>
          <div class="data-card">
             <div class="card-label">商品车预约数量</div>
             <div class="card-value"><span class="num text-blue">22,731</span>辆</div>
          </div>
        </div>
        
        <div class="chart-container" style="margin-top: 10px;">
           <div class="chart-title">车辆放行与预约数量对比</div>
           <div ref="tradeChartRef" style="height: 150px; width: 100%;"></div>
        </div>
      </div>
      
      <!-- Governance Tab -->
      <div v-show="activeTab === 'governance'" class="tab-panel">
        <div class="cards-grid-3">
          <div class="data-card">
             <div class="card-label">当月新增案件数</div>
             <div class="card-value"><span class="num text-cyan">352</span>件</div>
          </div>
          <div class="data-card">
             <div class="card-label">资产部件总数</div>
             <div class="card-value"><span class="num text-cyan">25,353</span>项</div>
          </div>
          <div class="data-card">
             <div class="card-label">设施类别数</div>
             <div class="card-value"><span class="num text-cyan">5</span>类</div>
          </div>
        </div>
        
        <div class="gov-charts-grid" style="margin-top: 20px; display: flex; gap: 20px;">
           <div class="chart-container" style="flex: 1;">
              <div class="chart-title">城市资产部件分布</div>
              <div ref="govBarChartRef" style="height: 232px; width: 100%;"></div>
           </div>
           <div class="chart-container" style="flex: 1;">
              <div class="chart-title">资产类别占比</div>
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
</style>
