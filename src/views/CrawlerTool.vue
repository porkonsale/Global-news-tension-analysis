<!--
  Trade News Crawler Tool Page
  Function: Input two countries, crawl related trade news
-->
<template>
  <div class="crawler-page">
    <!-- Input Form Card -->
    <el-card class="input-card" shadow="never">
      <div slot="header" class="card-header-content">
        <span class="card-title">
          <i class="el-icon-link"></i>
          News Crawl Configuration
        </span>
      </div>
      <InputForm
        ref="inputForm"
        button-text="Start Crawling"
        :loading="crawling"
        @submit="handleCrawl"
        @reset="handleReset"
      >
        <!-- Extra Fields: Time Range -->
        <template #extra-fields>
          <el-form-item label="Time Range">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="to"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          
          <el-form-item label="News Count">
            <el-input-number
              v-model="newsCount"
              :min="1"
              :max="3"
              :step="1"
            ></el-input-number>
          </el-form-item>
        </template>
      </InputForm>
    </el-card>

    <!-- Crawl Results Card -->
    <el-card class="result-card-container" shadow="never">
      <div slot="header" class="card-header-content">
        <span class="card-title">
          <i class="el-icon-document"></i>
          Crawl Results (Total {{ newsList.length }} items)
        </span>
        <el-button
          v-if="newsList.length > 0"
          type="text"
          icon="el-icon-download"
          @click="handleExport"
        >
          Export Data
        </el-button>
      </div>
      
      <!-- Empty State -->
      <el-empty
        v-if="newsList.length === 0 && !crawling"
        description="No crawl results, please configure and start crawling first"
      ></el-empty>
      
      <!-- Loading State -->
      <div v-if="crawling" class="loading-container">
        <el-progress
          :percentage="crawlProgress"
          :status="crawlProgress === 100 ? 'success' : null"
        ></el-progress>
        <p class="loading-text">Crawling news, please wait...</p>
      </div>
      
      <!-- News List -->
      <div v-if="newsList.length > 0 && !crawling" class="news-list">
        <ResultCard
          v-for="(news, index) in displayedNews"
          :key="index"
          :title="news.title"
          :extra="news.source"
        >
          <div class="news-content">
            <p class="news-summary">{{ news.summary }}</p>
            <div class="news-meta">
              <span class="news-time">
                <i class="el-icon-time"></i>
                {{ news.publishTime }}
              </span>
              <span class="news-crawl-time">
                <i class="el-icon-download"></i>
                Crawl Time: {{ news.crawlTime }}
              </span>
            </div>
          </div>
          <template #footer>
            <el-button
              type="text"
              size="small"
              icon="el-icon-view"
              @click="handleViewSource(news.url)"
            >
              View Source
            </el-button>
            <el-button
              type="text"
              size="small"
              icon="el-icon-document"
              @click="handleAnalyze(news)"
            >
              Analyze Content
            </el-button>
          </template>
        </ResultCard>
        
        <!-- Load More -->
        <div v-if="hasMore" class="load-more">
          <el-button @click="loadMore">Load More</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import InputForm from '@/components/common/InputForm.vue'
import ResultCard from '@/components/common/ResultCard.vue'
import { newsApi } from '@/api'

export default {
  name: 'CrawlerTool',
  components: {
    InputForm,
    ResultCard
  },
  data() {
    return {
      crawling: false,
      crawlProgress: 0,
      dateRange: [],
      newsCount: 3,
      newsList: [],
      displayCount: 10, // Initial display count
      pickerOptions: {
        shortcuts: [
          {
            text: 'Last Week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last Month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last 3 Months',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    // Currently displayed news list
    displayedNews() {
      return this.newsList.slice(0, this.displayCount)
    },
    // Has more to load
    hasMore() {
      return this.displayCount < this.newsList.length
    }
  },
  mounted() {
    // Auto-fill if route query exists
    if (this.$route.query.region) {
      const formData = {
        country1: 'CN',
        country2: this.getCountryCode(this.$route.query.region)
      }
      this.$refs.inputForm.setFormData(formData)
    }
  },
  methods: {
    // 开始爬取
    async handleCrawl(formData) {
      this.crawling = true
      this.crawlProgress = 0
      this.newsList = []
      
      // 模拟爬取进度
      const progressInterval = setInterval(() => {
        if (this.crawlProgress < 90) {
          this.crawlProgress += 10
        }
      }, 500)
      
      try {
        // 获取国家名称
        const country1Name = this.getCountryName(formData.country1)
        const country2Name = this.getCountryName(formData.country2)
        
        // 格式化日期
        let startDate = ''
        let endDate = ''
        if (this.dateRange && this.dateRange.length === 2) {
          const formatDate = (date) => {
            const d = new Date(date)
            let month = '' + (d.getMonth() + 1)
            let day = '' + d.getDate()
            const year = d.getFullYear()
            if (month.length < 2) month = '0' + month
            if (day.length < 2) day = '0' + day
            return [year, month, day].join('-')
          }
          startDate = formatDate(this.dateRange[0])
          endDate = formatDate(this.dateRange[1])
        } else {
           // 默认最近30天
           const end = new Date()
           const start = new Date()
           start.setDate(start.getDate() - 30)
           const formatDate = (date) => {
            const d = new Date(date)
            let month = '' + (d.getMonth() + 1)
            let day = '' + d.getDate()
            const year = d.getFullYear()
            if (month.length < 2) month = '0' + month
            if (day.length < 2) day = '0' + day
            return [year, month, day].join('-')
          }
           startDate = formatDate(start)
           endDate = formatDate(end)
        }

        console.log('查询参数:', { country1: country1Name, country2: country2Name, start_date: startDate, end_date: endDate })
        
        // 调用后端接口获取新闻
        const res = await newsApi.fetchNews({
          country1: country1Name,
          country2: country2Name,
          start_date: startDate,
          end_date: endDate,
          limit: this.newsCount || 50
        })
        
        clearInterval(progressInterval)
        this.crawlProgress = 100
        
        console.log('后端返回:', res)
        
        // 适配后端直接返回数组的情况
        const articles = Array.isArray(res) ? res : (res.data || [])
        
        if (articles.length > 0) {
          // 转换后端数据格式为前端需要的格式
          this.newsList = articles.map((article, index) => ({
            uuid: article.uuid || index,
            title: article.title || '无标题',
            source: article.source || '未知来源',
            summary: article.description || article.snippet || '暂无摘要',
            url: article.url,
            publishTime: article.published_at ? new Date(article.published_at).toLocaleDateString() : '未知时间',
            crawlTime: new Date().toLocaleString(),
            content: article.content,
            sentiment: article.sentiment,
            aiSummary: article.ai_summary
          }))
          
          setTimeout(() => {
            this.crawling = false
            this.$message.success(`成功获取 ${this.newsList.length} 条新闻`)
          }, 500)
        } else {
          throw new Error('未获取到新闻数据')
        }
      } catch (error) {
        clearInterval(progressInterval)
        this.crawling = false
        const errorMsg = error.response?.data?.detail || error.message || '获取新闻失败，请重试'
        this.$message.error(errorMsg)
        console.error('获取新闻失败:', error)
      }
    },
    
    // 重置表单
    handleReset() {
      this.dateRange = []
      this.newsCount = 50
      this.newsList = []
      this.displayCount = 10
    },
    
    // 查看原文
    handleViewSource(url) {
      window.open(url, '_blank')
    },
    
    // 分析内容
    handleAnalyze(news) {
      this.$router.push({
        path: '/nlp',
        query: {
          url: news.url,
          uuid: news.uuid
        }
      })
    },
    
    // 导出数据
    handleExport() {
      // 导出为 JSON 文件
      const dataStr = JSON.stringify(this.newsList, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `news_export_${new Date().getTime()}.json`
      link.click()
      URL.revokeObjectURL(url)
      this.$message.success('导出成功')
    },
    
    // 加载更多
    loadMore() {
      this.displayCount += 10
    },
    
    // 获取国家代码
    getCountryCode(region) {
      const codeMap = {
        '美国': 'US',
        '欧盟': 'EU',
        '日本': 'JP',
        '韩国': 'KR',
        '东盟': 'ASEAN'
      }
      return codeMap[region] || 'US'
    },
    
    // 获取国家名称（用于搜索）
    getCountryName(code) {
      const nameMap = {
        'CN': 'China',
        'US': 'United States',
        'EU': 'European Union',
        'JP': 'Japan',
        'KR': 'South Korea',
        'ASEAN': 'ASEAN',
        'UK': 'United Kingdom',
        'DE': 'Germany',
        'FR': 'France',
        'CA': 'Canada',
        'AU': 'Australia',
        'IN': 'India',
        'BR': 'Brazil',
        'RU': 'Russia',
        'MX': 'Mexico'
      }
      return nameMap[code] || code
    },
    
    // 获取随机日期
    getRandomDate() {
      const days = Math.floor(Math.random() * 30)
      const date = new Date()
      date.setDate(date.getDate() - days)
      return date.toISOString().split('T')[0]
    },
    
    // 获取当前时间
    getCurrentTime() {
      return new Date().toLocaleString('zh-CN')
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/theme.less';

.crawler-page {
  .input-card,
  .result-card-container {
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
  
  .loading-container {
    padding: 40px 20px;
    text-align: center;
    
    .loading-text {
      margin-top: 16px;
      color: @text-secondary;
      font-size: 14px;
    }
  }
  
  .news-list {
    .news-content {
      .news-summary {
        font-size: 14px;
        line-height: 1.6;
        color: @text-secondary;
        margin-bottom: 12px;
      }
      
      .news-meta {
        display: flex;
        gap: 20px;
        font-size: 12px;
        color: @text-disabled;
        
        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
    
    .load-more {
      text-align: center;
      padding: 20px 0;
    }
  }
}
</style>
