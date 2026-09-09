<template>
  <div class="economic-dashboard">
    <!-- 头部指标 -->
    <div class="top-indicators">
      <div class="indicator-card" v-for="(item, index) in topIndicators" :key="index">
        <div class="ind-title">{{ item.title }}</div>
        <div class="ind-value">{{ item.value }}<span>亿元</span></div>
        <div :class="['ind-trend', item.trend > 0 ? 'up' : 'down']">
          {{ item.trend > 0 ? '▲' : '▼' }} 同比 {{ item.trend > 0 ? '+' : '' }}{{ item.trend }}%
        </div>
        <div class="ind-line" :style="{ background: item.color }"></div>
      </div>
    </div>

    <!-- 中间图表行1 -->
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">地区生产总值三产结构</div>
        <v-chart class="chart" :option="pieOption" autoresize />
      </div>
      <div class="chart-card">
        <div class="chart-title">主要指标同比增速对比</div>
        <v-chart class="chart" :option="barOption1" autoresize />
      </div>
    </div>

    <!-- 中间图表行2 -->
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">主要指标本期与同期对比</div>
        <v-chart class="chart" :option="barOption2" autoresize />
      </div>
      <div class="chart-card">
        <div class="chart-title">营利性服务业细分行业营业收入 (1-5月)</div>
        <v-chart class="chart" :option="barOption3" autoresize />
      </div>
    </div>

    <!-- 底部指标 -->
    <div class="bottom-indicators">
      <div class="indicator-card" v-for="(item, index) in bottomIndicators" :key="index">
        <div class="ind-title">{{ item.title }}</div>
        <div class="ind-value">{{ item.value }}<span>亿元</span></div>
        <div class="ind-compare">同期 {{ item.compare }}亿元</div>
        <div :class="['ind-trend', item.trend > 0 ? 'up' : 'down']">
          {{ item.trend > 0 ? '▲' : '▼' }} 同比 {{ item.trend > 0 ? '+' : '' }}{{ item.trend }}%
        </div>
        <div class="ind-line-left" :style="{ background: item.color }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { use, graphic } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const topIndicators = [
  { title: '地区生产总值', value: '122.02', trend: 5.4, color: '#4bc0c0' },
  { title: '规上工业增加值', value: '27.61', trend: 20.1, color: '#36a2eb' },
  { title: '固定资产投资额', value: '19.68', trend: -20.0, color: '#ff6384' },
  { title: '社会消费品零售总额', value: '2.61', trend: -9.4, color: '#ff9f40' },
]

const bottomIndicators = [
  { title: '金融存款余额', value: '148.33', compare: '135.93', trend: 9.1, color: '#4bc0c0' },
  { title: '金融贷款余额', value: '134.34', compare: '86.02', trend: 56.2, color: '#36a2eb' },
  { title: '外贸进出口\n(申报数)', value: '689.44', compare: '678.30', trend: 1.6, color: '#ff6384' },
  { title: '外贸进出口\n(结关数)', value: '631.81', compare: '678.30', trend: -6.9, color: '#ff9f40' },
]

const pieOption = ref({
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [
    {
      name: '三产结构',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: true, formatter: '{b}\n{c}亿元\n{d}%' },
      data: [
        { value: 6.71, name: '第一产业', itemStyle: { color: '#ff9f40' } },
        { value: 24.95, name: '第二产业', itemStyle: { color: '#4bc0c0' } },
        { value: 90.35, name: '第三产业', itemStyle: { color: '#ff6384' } },
      ],
    },
  ],
})

const barOption1 = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'value' },
  yAxis: {
    type: 'category',
    data: ['建筑业总产值', '限上零售业销售额', '固定资产投资额', '外贸进出口(结关)', '住宿业营业额', '交通运输仓储邮政', '营利性服务业营收', '地区生产总值', '一般公共预算收入', '金融存款余额', '农林牧渔业总产值', '规上工业增加值', '多式联运和运输代理', '餐饮业营业额', '规上工业总产值', '房地产销售面积', '金融贷款余额', '房地产销售额'].reverse()
  },
  series: [
    {
      name: '同比增速(%)',
      type: 'bar',
      label: { show: true, position: 'right' },
      data: [-41.2, -40.1, -20.0, -6.9, -1.2, -0.3, 0.3, 5.4, 6.1, 9.1, 15.8, 20.1, 21.0, 31.5, 41.1, 44.1, 56.2, 56.8].reverse(),
      itemStyle: {
        color: (params: any) => params.value > 0 ? '#4bc0c0' : '#ff6384'
      }
    }
  ]
})

const barOption2 = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
 
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['地区生产总值', '规上工业总产值', '规上工业增加值', '营利性服务业营收', '限上批发业销售额', '一般公共预算收入'] },
  yAxis: { type: 'value', name: '金额(亿元)' },
  series: [
    {
      name: '1-6月',
      type: 'bar',
      data: [122.0, 140.5, 27.6, 54.5, 134.5, 18.8],
      itemStyle: { color: '#36a2eb' }
    },
    {
      name: '去年同期',
      type: 'bar',
      data: [116.0, 99.6, 20.6, 54.4, 161.6, 17.7],
      itemStyle: { color: '#99a3a4' }
    }
  ]
})

const barOption3 = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['信息传输软件\n和信息技术服务业', '租赁和商务服务业', '科学研究和技术服务业', '文化体育和娱乐业'] },
  yAxis: { type: 'value', name: '营业收入(亿元)' },
  series: [
    {
      name: '营业收入',
      type: 'bar',
      label: { show: true, position: 'top', formatter: '{c}亿元' },
      data: [
        { value: 27.25, itemStyle: { color: '#e74c3c' } },
        { value: 15.21, itemStyle: { color: '#e67e22' } },
        { value: 7.34, itemStyle: { color: '#1abc9c' } },
        { value: 4.73, itemStyle: { color: '#2ecc71' } }
      ]
    }
  ]
})
</script>

<style scoped>
.economic-dashboard {
}
.top-indicators, .bottom-indicators {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.indicator-card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  text-align: center;
}
.ind-title {
  font-size: 16px;
  color: #606266;
  margin-bottom: 10px;
}
.ind-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}
.ind-value span {
  font-size: 14px;
  font-weight: normal;
  margin-left: 5px;
}
.ind-compare {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}
.ind-trend {
  font-size: 14px;
}
.ind-trend.up { color: #4bc0c0; }
.ind-trend.down { color: #ff6384; }
.ind-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}
.ind-line-left {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
}
.charts-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.chart-card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}
.chart-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
  text-align: center;
}
.chart {
  height: 350px;
}

@media screen and (max-width: 768px) {
  .top-indicators, .bottom-indicators {
    flex-wrap: wrap;
    gap: 10px;
  }
  .indicator-card {
    flex: 0 0 calc(50% - 5px);
    box-sizing: border-box;
    padding: 10px;
  }
  .ind-value {
    font-size: 20px;
  }
  .charts-row {
    flex-direction: column;
  }
  .chart-card {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
