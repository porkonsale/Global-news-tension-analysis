<template>
  <div class="trend-chart-container">
    <div ref="chart" class="chart-content"></div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'TrendChart',
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myChart: null
    }
  },
  watch: {
    chartData: {
      handler(val) {
        if (val && val.length > 0) {
          this.initChart()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      if (this.myChart) {
        this.myChart.resize()
      }
    },
    initChart() {
      if (!this.$refs.chart) return
      
      if (!this.myChart) {
        this.myChart = echarts.init(this.$refs.chart)
      }

      if (!this.chartData || this.chartData.length === 0) {
        this.myChart.clear()
        return
      }

      // Process data
      // Expected format from backend: [{ region: 'China-US', trend: [{year, month, avg_tension}, ...] }, ...]
      
      // 1. Get all unique time points (Year-Month) and sort them
      let timePoints = new Set()
      this.chartData.forEach(regionData => {
        regionData.trend.forEach(point => {
          timePoints.add(`${point.year}-${String(point.month).padStart(2, '0')}`)
        })
      })
      const xAxisData = Array.from(timePoints).sort()

      // 2. Prepare series data
      const series = this.chartData.map(regionData => {
        // Create a map for quick lookup
        const dataMap = {}
        regionData.trend.forEach(point => {
          dataMap[`${point.year}-${String(point.month).padStart(2, '0')}`] = point.avg_tension
        })

        // Fill data for each x-axis point (handle missing data if any)
        const data = xAxisData.map(time => dataMap[time] !== undefined ? dataMap[time] : null)

        return {
          name: regionData.region,
          type: 'line',
          data: data,
          smooth: true, // Smooth curves
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3
          },
          emphasis: {
            focus: 'series'
          }
        }
      })

      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#ccc',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: this.chartData.map(item => item.region),
          bottom: 0,
          icon: 'circle'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          name: 'Tension Level',
          nameLocation: 'middle',
          nameGap: 40,
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: series,
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
      }

      this.myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.trend-chart-container {
  width: 100%;
  height: 400px;
}
.chart-content {
  width: 100%;
  height: 100%;
}
</style>
