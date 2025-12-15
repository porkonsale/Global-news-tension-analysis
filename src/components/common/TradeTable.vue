<!--
  Trade Data Table Component
  Function: Display trade tension list, support sorting and filtering
-->
<template>
  <div class="trade-table-container">
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{ prop: 'updateTime', order: 'descending' }"
      @sort-change="handleSortChange"
    >
      <el-table-column
        prop="region"
        label="Country/Region"
        width="180"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="region-name">{{ scope.row.region }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="level"
        label="Tension Level"
        width="150"
        sortable="custom"
      >
        <template slot-scope="scope">
          <el-tag
            :type="getTensionTagType(scope.row.level)"
            size="medium"
            effect="dark"
          >
            {{ scope.row.level }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="score"
        label="Tension Score"
        width="120"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="tension-score">{{ scope.row.score }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="updateTime"
        label="Update Time"
        width="180"
        sortable="custom"
      >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 8px">{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="newsCount"
        label="Related News Count"
        width="180"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="news-count">{{ scope.row.newsCount }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Action"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleViewDetail(scope.row)"
          >
            View Details
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TradeTable',
  props: {
    // Table Data
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      sortProp: 'updateTime',
      sortOrder: 'descending'
    }
  },
  computed: {
    // Processed table data (sorting and pagination)
    tableData() {
      let data = [...this.data]
      
      // Sorting
      if (this.sortProp) {
        data.sort((a, b) => {
          let aVal = a[this.sortProp]
          let bVal = b[this.sortProp]
          
          // Special handling for tension level sorting
          if (this.sortProp === 'level') {
            const levelMap = { 'Low': 1, 'Medium': 2, 'High': 3, '低': 1, '中': 2, '高': 3 }
            aVal = levelMap[aVal] || 0
            bVal = levelMap[bVal] || 0
          }
          
          if (this.sortOrder === 'ascending') {
            return aVal > bVal ? 1 : -1
          } else {
            return aVal < bVal ? 1 : -1
          }
        })
      }
      
      // Pagination
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return data.slice(start, end)
    },
    
    // Total count
    total() {
      return this.data.length
    }
  },
  methods: {
    // Get tag type based on tension level
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
    },
    
    // Sort change
    handleSortChange({ prop, order }) {
      this.sortProp = prop
      this.sortOrder = order
    },
    
    // Page size change
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    
    // Current page change
    handleCurrentChange(val) {
      this.currentPage = val
    },
    
    // View detail
    handleViewDetail(row) {
      this.$emit('view-detail', row)
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/theme.less';

.trade-table-container {
  .region-name {
    font-weight: 500;
    color: @text-primary;
  }
  
  .tension-score {
    font-weight: 600;
    font-family: 'Courier New', monospace;
    color: @primary-color;
  }
  
  .news-count {
    font-weight: 500;
    color: @text-primary;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
