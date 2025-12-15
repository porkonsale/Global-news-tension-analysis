<!--
  Home Page - Trade Tension Dashboard
  Function: Display world map and trade tension data table
-->
<template>
  <div class="home-page">
    <!-- Map Card -->
    <el-card class="map-card" shadow="never">
      <div slot="header" class="card-header-content">
        <span class="card-title">
          <i class="el-icon-map-location"></i>
          Global Trade Tension Distribution Map
        </span>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-refresh"
          :loading="loading"
          @click="fetchData"
        >
          Refresh Data
        </el-button>
      </div>
      <WorldMap :tensionData="tensionData" />
    </el-card>

    <!-- Data Table Card -->
    <el-card class="table-card" shadow="never">
      <div slot="header" class="card-header-content">
        <span class="card-title">
          <i class="el-icon-data-analysis"></i>
          Trade Tension Details
        </span>
        <el-input
          v-model="searchText"
          placeholder="Search Country/Region"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 200px"
          clearable
        />
      </div>
      <TradeTable
        :data="filteredTableData"
        @view-detail="handleViewDetail"
      />
    </el-card>

    <!-- Trend Chart Card -->
    <el-card class="trend-card" shadow="never" style="margin-top: 20px;">
      <div slot="header" class="card-header-content">
        <span class="card-title">
          <i class="el-icon-trend-charts"></i>
          Trade Tension Trend Analysis
        </span>
      </div>
      <TrendChart :chartData="trendData" :loading="loading" />
    </el-card>

    <!-- Detail Dialog -->
    <el-dialog
      title="Trade Tension Details"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <div v-if="selectedRow" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Country/Region">
            {{ selectedRow.region }}
          </el-descriptions-item>
          <el-descriptions-item label="Tension Level">
            <el-tag :type="getTensionTagType(selectedRow.level)">
              {{ selectedRow.level }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Tension Score">
            {{ selectedRow.score }}
          </el-descriptions-item>
          <el-descriptions-item label="Related News Count">
            {{ selectedRow.newsCount }}
          </el-descriptions-item>
          <el-descriptions-item label="Update Time" :span="2">
            {{ selectedRow.updateTime }}
          </el-descriptions-item>
          <el-descriptions-item label="Remark" :span="2">
            {{ selectedRow.remark || 'No Remark' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">Close</el-button>
        <el-button type="primary" @click="handleViewNews">View Related News</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import WorldMap from '@/components/common/WorldMap.vue'
import TradeTable from '@/components/common/TradeTable.vue'
import TrendChart from '@/components/common/TrendChart.vue'
import { homeApi } from '@/api'

export default {
  name: 'HomePage',
  components: {
    WorldMap,
    TradeTable,
    TrendChart
  },
  data() {
    return {
      loading: false,
      searchText: '',
      tensionData: [],
      tableData: [],
      trendData: [],
      dialogVisible: false,
      selectedRow: null
    }
  },
  computed: {
    // 过滤后的表格数据
    filteredTableData() {
      if (!this.searchText) {
        return this.tableData
      }
      return this.tableData.filter(item =>
        item.region.toLowerCase().includes(this.searchText.toLowerCase())
      )
    }
  },
  mounted() {
    // 只在首次挂载时加载数据
    if (this.tableData.length === 0) {
      this.fetchData()
    }
  },
  activated() {
    // 当使用 keep-alive 时，组件被激活时调用
    // 可以在这里选择性地刷新数据
    // 暂时注释掉自动刷新，用户可以手动点击刷新按钮
    // this.fetchData()
  },
  methods: {
    // 获取数据
    async fetchData() {
      this.loading = true
      try {
        // 并行请求分布数据和趋势数据
        const [distRes, trendRes] = await Promise.all([
          homeApi.getTradeTension(),
          homeApi.getTradeTensionTrend()
        ])
        
        // 处理分布数据
        const data = Array.isArray(distRes) ? distRes : (distRes.data || [])
        
        if (data.length > 0) {
          // Convert data format
          this.tensionData = data.map(item => {
            let level = 'Medium'
            if (item.avg_tension > 0.5) level = 'High'
            if (item.avg_tension < -0.5) level = 'Low'
            
            return {
              region: item.region,
              level: level,
              score: item.avg_tension
            }
          })
          
          this.tableData = data.map(item => {
            let level = 'Medium'
            if (item.avg_tension > 0.5) level = 'High'
            if (item.avg_tension < -0.5) level = 'Low'
            
            return {
              region: item.region,
              level: level,
              score: item.avg_tension,
              updateTime: `${item.Year}-${item.Month}`,
              newsCount: item.article_count,
              remark: 'No Remark'
            }
          })
        } else {
          this.$message.warning('No distribution data')
        }

        // Process trend data
        const tData = Array.isArray(trendRes) ? trendRes : (trendRes.data || [])
        if (tData.length > 0) {
          this.trendData = tData
        }

        this.$message.success('Data refreshed successfully')
        this.loading = false
      } catch (error) {
        console.error('Failed to fetch data:', error)
        this.$message.error('Data loading failed')
        this.loading = false
      }
    },
    
    // View details
    handleViewDetail(row) {
      this.selectedRow = row
      this.dialogVisible = true
    },
    
    // View related news
    handleViewNews() {
      this.$router.push({
        path: '/crawler',
        query: {
          region: this.selectedRow.region
        }
      })
    },
    
    // Get tension tag type
    getTensionTagType(level) {
      const typeMap = {
        'Low': 'success',
        'Medium': 'warning',
        'High': 'danger',
        '低': 'success',
        '中': 'warning',
        '高': 'danger'
      }
      return typeMap[level] || 'info'
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/theme.less';

.home-page {
  .map-card,
  .table-card {
    margin-bottom: 20px;
    
    /deep/ .el-card__header {
      padding: 16px 20px;
      border-bottom: 1px solid @border-color;
    }
    
    .card-header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: @text-primary;
        
        i {
          margin-right: 8px;
          color: @primary-color;
        }
      }
    }
  }
  
  .detail-content {
    /deep/ .el-descriptions {
      .el-descriptions-item__label {
        background-color: @bg-secondary;
        color: @text-secondary;
      }
      
      .el-descriptions-item__content {
        background-color: @bg-card;
        color: @text-primary;
      }
    }
  }
}
</style>
