<!--
  World Map Component
  Function: Display trade tension between China and other countries/regions
  Use ECharts for map visualization
-->
<template>
  <div class="world-map-container">
    <div ref="mapChart" class="map-chart"></div>
    
    <!-- Legend -->
    <div class="map-legend">
      <div class="legend-item">
        <span class="legend-color" style="background-color: #67c23a;"></span>
        <span class="legend-text">Low Tension</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background-color: #e6a23c;"></span>
        <span class="legend-text">Medium Tension</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background-color: #f56c6c;"></span>
        <span class="legend-text">High Tension</span>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
// Import world map
import 'echarts/map/js/world'

export default {
  name: 'WorldMap',
  props: {
    // Trade tension data
    tensionData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    tensionData: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    // Initialize chart
    initChart() {
      this.chart = echarts.init(this.$refs.mapChart)
      this.updateChart()
    },
    
    // Update chart data
    updateChart() {
      if (!this.chart) return
      
      // China coordinates (start point for lines)
      const chinaCoord = [104.195, 35.861]
      
      // Target country/region coordinates
      const regionCoords = {
        // English Mapping
        'USA': [-95.712, 37.090],
        'EU': [10.451, 51.165],
        'Japan': [138.252, 36.204],
        'South Korea': [127.766, 35.907],
        'ASEAN': [101.975, 12.879],
        'UK': [-3.436, 55.378],
        'Germany': [10.451, 51.165],
        'France': [2.2137, 46.2276],
        'Russia': [105.3188, 61.5240],
        'India': [78.9629, 20.5937],
        'Australia': [133.7751, -25.2744],
        'Canada': [-106.3468, 56.1304],
        'Brazil': [-51.9253, -14.2350],

        // Chinese Mapping (for compatibility)
        '美国': [-95.712, 37.090],
        '欧盟': [10.451, 51.165],
        '日本': [138.252, 36.204],
        '韩国': [127.766, 35.907],
        '东盟': [101.975, 12.879],
        '英国': [-3.436, 55.378],
        '德国': [10.451, 51.165],
        '法国': [2.2137, 46.2276],
        '俄罗斯': [105.3188, 61.5240],
        '印度': [78.9629, 20.5937],
        '澳大利亚': [133.7751, -25.2744],
        '加拿大': [-106.3468, 56.1304],
        '巴西': [-51.9253, -14.2350],

        // Adapt to backend China-X format
        'China-US': [-95.712, 37.090],
        'China-USA': [-95.712, 37.090],
        'China-EU': [10.451, 51.165],
        'China-Japan': [138.252, 36.204],
        'China-South Korea': [127.766, 35.907],
        'China-Korea': [127.766, 35.907],
        'China-ASEAN': [101.975, 12.879],
        'China-UK': [-3.436, 55.378],
        'China-Germany': [10.451, 51.165],
        'China-France': [2.2137, 46.2276],
        'China-Russia': [105.3188, 61.5240],
        'China-India': [78.9629, 20.5937],
        'China-Australia': [133.7751, -25.2744],
        'China-Canada': [-106.3468, 56.1304],
        'China-Brazil': [-51.9253, -14.2350]
      }
      
      // Get color based on tension level
      const getTensionColor = (level) => {
        const colorMap = {
          'Low': '#67c23a',
          'Medium': '#e6a23c',
          'High': '#f56c6c',
          '低': '#67c23a',
          '中': '#e6a23c',
          '高': '#f56c6c'
        }
        return colorMap[level] || '#409eff'
      }
      
      // Filter data with valid coordinates
      const validData = this.tensionData.filter(item => regionCoords[item.region])

      // Generate line data
      const linesData = validData.map(item => ({
        coords: [chinaCoord, regionCoords[item.region]],
        lineStyle: {
          color: getTensionColor(item.level),
          width: 2
        }
      }))
      
      // Generate scatter data (markers)
      const scatterData = validData.map(item => ({
        name: item.region,
        value: [...regionCoords[item.region], item.level],
        itemStyle: {
          color: getTensionColor(item.level)
        }
      }))
      
      // Add China marker
      scatterData.push({
        name: 'China',
        value: [...chinaCoord, ''],
        itemStyle: {
          color: '#409eff'
        }
      })
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: '#ffffff',
          borderColor: '#dcdfe6',
          borderWidth: 1,
          textStyle: {
            color: '#303133'
          },
          formatter: function(params) {
            if (params.componentSubType === 'scatter') {
              return `${params.name}<br/>Tension Level: ${params.value[2] || 'Base'}`
            }
            return params.name
          }
        },
        geo: {
          map: 'world',
          roam: true,
          zoom: 1.2,
          itemStyle: {
            areaColor: '#e0e0e0', // Light Gray
            borderColor: '#ffffff'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#dcdfe6'
            }
          },
          label: {
            show: false
          }
        },
        series: [
          // Lines
          {
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2,
            effect: {
              show: true,
              period: 4,
              trailLength: 0.1,
              symbolSize: 4,
              color: '#409eff'
            },
            lineStyle: {
              width: 2,
              opacity: 0.8,
              curveness: 0.2
            },
            data: linesData
          },
          // Scatter Points
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            symbolSize: 12,
            label: {
              show: true,
              position: 'right',
              color: '#606266',
              fontSize: 12,
              formatter: '{b}'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            },
            data: scatterData
          }
        ]
      }
      
      this.chart.setOption(option)
    },
    
    // 窗口大小变化时重新渲染
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/theme.less';

.world-map-container {
  width: 100%;
  position: relative;
  
  .map-chart {
    width: 100%;
    height: 500px;
  }
  
  .map-legend {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 12px 16px;
    border-radius: 4px;
    border: 1px solid @border-color;
    
    .legend-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .legend-color {
        width: 20px;
        height: 12px;
        border-radius: 2px;
        margin-right: 8px;
      }
      
      .legend-text {
        font-size: 14px;
        color: @text-primary;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .world-map-container {
    .map-chart {
      height: 300px;
    }
    
    .map-legend {
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      
      .legend-item {
        .legend-text {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
