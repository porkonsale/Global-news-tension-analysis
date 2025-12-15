<!--
  NLP Analysis Tool Page
  Function: Sentiment analysis and content summary via URL or text content
-->
<template>
  <div class="nlp-analyzer-page">
    <!-- Input Type Selection -->
    <el-card class="input-card" shadow="never">
      <div slot="header" class="card-header-content">
        <span class="card-title">
          <i class="el-icon-document"></i>
          Content Input
        </span>
      </div>
      
      <el-tabs v-model="inputType" @tab-click="handleTabChange">
        <!-- URL Input -->
        <el-tab-pane label="URL Input" name="url">
          <el-form ref="urlForm" :model="urlFormData" :rules="urlRules">
            <el-form-item label="News URL" prop="url">
              <el-input
                v-model="urlFormData.url"
                placeholder="Please enter news URL"
                clearable
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  :loading="analyzing"
                  @click="handleAnalyzeUrl"
                >
                  Analyze
                </el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- Text Input -->
        <el-tab-pane label="Text Input" name="text">
          <el-form ref="textForm" :model="textFormData" :rules="textRules">
            <el-form-item label="Article Content" prop="content">
              <el-input
                v-model="textFormData.content"
                type="textarea"
                :rows="10"
                placeholder="Please paste article content..."
                show-word-limit
                :maxlength="10000"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <div class="word-count">
                <span>Word Count: {{ textFormData.content.length }} / 10000</span>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="analyzing"
                @click="handleAnalyzeText"
              >
                <i class="el-icon-s-data"></i>
                Start Analysis
              </el-button>
              <el-button @click="handleClearText">Clear Content</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- Analysis Result -->
    <el-card v-if="showResult" class="result-card" shadow="never">
      <div slot="header" class="card-header-content">
        <span class="card-title">
          <i class="el-icon-data-analysis"></i>
          Analysis Result
        </span>
        <el-button
          type="text"
          icon="el-icon-download"
          @click="handleExportResult"
        >
          Export Result
        </el-button>
      </div>
      
      <!-- Loading State -->
      <div v-if="analyzing" class="analyzing-container">
        <div class="analyzing-icon">
          <i class="el-icon-loading"></i>
        </div>
        <p class="analyzing-text">AI is analyzing, please wait...</p>
        <el-progress
          :percentage="analyzeProgress"
          :status="analyzeProgress === 100 ? 'success' : null"
        ></el-progress>
      </div>
      
      <!-- Analysis Result Content -->
      <div v-else class="result-content">
        <!-- Sentiment Analysis -->
        <div class="sentiment-section">
          <h3 class="section-title">
            <i class="el-icon-s-opportunity"></i>
            Tension Analysis
          </h3>
          <div class="sentiment-result">
            <div class="sentiment-label">
              <span class="label-text">Overall Tension Score:</span>
              <span class="score-value" :class="getScoreClass(result.sentiment.score)">
                {{ result.sentiment.score !== undefined ? result.sentiment.score.toFixed(4) : 'N/A' }}
              </span>
              <el-tag
                :type="getSentimentTagType(result.sentiment.type)"
                size="large"
                effect="dark"
                style="margin-left: 10px;"
              >
                {{ result.sentiment.label }}
              </el-tag>
            </div>
            
            <div class="score-explanation">
              <small>Score Range: -1 (Mild/Cooperative) to 1 (Intense/Conflict)</small>
            </div>
          </div>
        </div>
        
        <!-- Sentence Analysis Details -->
        <div class="summary-section">
          <h3 class="section-title">
            <i class="el-icon-s-order"></i>
            Sentence Analysis Details
          </h3>
          <ul class="summary-list">
            <li
              v-for="(para, index) in result.paragraphs"
              :key="index"
              class="summary-item"
              style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;"
            >
              <div style="flex: 1; padding-right: 20px;">
                <span class="bullet-point">{{ index + 1 }}</span>
                <span class="point-content">{{ para.text }}</span>
              </div>
              <div class="score-tag" style="min-width: 80px; text-align: right;">
                <el-tag :type="getScoreType(para.avg_intensity)" size="small">
                  {{ para.avg_intensity.toFixed(4) }}
                </el-tag>
              </div>
            </li>
          </ul>
        </div>
        
      </div>
    </el-card>
  </div>
</template>

<script>
import { nlpApi } from '@/api'

export default {
  name: 'NlpAnalyzer',
  data() {
    return {
      inputType: 'url',
      urlFormData: {
        url: ''
      },
      textFormData: {
        content: ''
      },
      urlRules: {
        url: [
          { required: true, message: 'Please enter URL', trigger: 'blur' },
          { type: 'url', message: 'Please enter valid URL format', trigger: 'blur' }
        ]
      },
      textRules: {
        content: [
          { required: true, message: 'Please enter article content', trigger: 'blur' },
          { min: 50, message: 'Content must be at least 50 characters', trigger: 'blur' }
        ]
      },
      analyzing: false,
      analyzeProgress: 0,
      showResult: false,
      result: {
        sentiment: {
          type: 'positive',
          label: 'Positive',
          positive: 75,
          neutral: 20,
          negative: 5
        },
        summary: [],
        keywords: []
      }
    }
  },
  mounted() {
    // Auto-fill if route query exists
    if (this.$route.query.url) {
      this.inputType = 'url'
      this.urlFormData.url = this.$route.query.url
      // Auto trigger analysis
      this.$nextTick(() => {
        this.handleAnalyzeUrl()
      })
    }
  },
  methods: {
    // Switch input type
    handleTabChange() {
      this.showResult = false
    },
    
    // Analyze by URL
    async handleAnalyzeUrl() {
      this.$refs.urlForm.validate(async (valid) => {
        if (!valid) return
        
        this.analyzing = true
        this.showResult = true
        this.analyzeProgress = 0
        
        // Simulate analysis progress
        const progressInterval = setInterval(() => {
          if (this.analyzeProgress < 90) {
            this.analyzeProgress += 15
          }
        }, 300)
        
        try {
          // Actual call to backend API
          const res = await nlpApi.analyzeByUrl({ url: this.urlFormData.url })
          
          clearInterval(progressInterval)
          this.analyzeProgress = 100
          
          // Process data returned from backend
          const score = res.overall_score !== undefined ? res.overall_score : 0
          let type = 'neutral'
          let label = 'Neutral'
          
          // Determine type based on score (-1 to 1)
          if (score > 0.3) {
            type = 'negative' // High tension -> Red
            label = 'Intense'
          } else if (score < -0.3) {
            type = 'positive' // Low tension -> Green
            label = 'Mild'
          }

          this.result = {
            sentiment: {
              type: type,
              label: label,
              score: score
            },
            paragraphs: res.paragraph_analysis || [],
            keywords: []
          }
            
          setTimeout(() => {
            this.analyzing = false
            this.$message.success('Analysis completed')
          }, 500)
        } catch (error) {
          clearInterval(progressInterval)
          this.analyzing = false
          this.$message.error('Analysis failed, please try again')
          console.error('Analysis failed:', error)
        }
      })
    },
    
    // 通过文本分析
    async handleAnalyzeText() {
      this.$refs.textForm.validate(async (valid) => {
        if (!valid) return
        
        this.analyzing = true
        this.showResult = true
        this.analyzeProgress = 0
        
        const progressInterval = setInterval(() => {
          if (this.analyzeProgress < 90) {
            this.analyzeProgress += 15
          }
        }, 300)
        
        try {
          // Actual call to backend API
          const res = await nlpApi.analyzeByText({ full_text: this.textFormData.content })
          
          clearInterval(progressInterval)
          this.analyzeProgress = 100
          
          // Process data returned from backend
          const score = res.overall_score !== undefined ? res.overall_score : 0
          let type = 'neutral'
          let label = 'Neutral'
          
          if (score > 0.3) {
            type = 'negative'
            label = 'Intense'
          } else if (score < -0.3) {
            type = 'positive'
            label = 'Mild'
          }

          this.result = {
            sentiment: {
              type: type,
              label: label,
              score: score
            },
            paragraphs: res.paragraph_analysis || [],
            keywords: []
          }
            
          setTimeout(() => {
            this.analyzing = false
            this.$message.success('Analysis completed')
          }, 500)
        } catch (error) {
          clearInterval(progressInterval)
          this.analyzing = false
          this.$message.error('Analysis failed, please try again')
          console.error('Analysis failed:', error)
        }
      })
    },
    
    // Clear text
    handleClearText() {
      this.textFormData.content = ''
      this.showResult = false
    },
    
    // Export result
    handleExportResult() {
      this.$message.info('Export feature under development...')
    },
    
    // Get sentiment tag type
    getSentimentTagType(type) {
      const typeMap = {
        'positive': 'success',
        'neutral': 'info',
        'negative': 'danger'
      }
      return typeMap[type] || 'info'
    },
    
    getScoreType(score) {
      if (score > 0.3) return 'danger'
      if (score < -0.3) return 'success'
      return 'info'
    },
    
    getScoreClass(score) {
      if (score > 0.3) return 'text-danger'
      if (score < -0.3) return 'text-success'
      return 'text-info'
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/theme.less';

.nlp-analyzer-page {
  .input-card,
  .result-card {
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
  
  .word-count {
    text-align: right;
    color: @text-disabled;
    font-size: 12px;
  }
  
  .analyzing-container {
    padding: 40px 20px;
    text-align: center;
    
    .analyzing-icon {
      font-size: 48px;
      color: @primary-color;
      margin-bottom: 16px;
      
      i {
        animation: rotate 1.5s linear infinite;
      }
    }
    
    .analyzing-text {
      font-size: 16px;
      color: @text-primary;
      margin-bottom: 20px;
    }
  }
  
  .result-content {
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: @text-primary;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      
      i {
        margin-right: 8px;
        color: @primary-color;
      }
    }
    
    .sentiment-section {
      margin-bottom: 32px;
      
      .sentiment-result {
        .sentiment-label {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          
          .label-text {
            font-size: 14px;
            color: @text-secondary;
          }
          
          .score-value {
            font-size: 24px;
            font-weight: bold;
            
            &.text-danger { color: #f56c6c; }
            &.text-success { color: #67c23a; }
            &.text-info { color: #909399; }
          }
        }
        
        .score-explanation {
            color: @text-secondary;
            font-size: 12px;
        }
      }
    }
    
    .summary-section {
      margin-bottom: 32px;
      
      .summary-list {
        list-style: none;
        padding: 0;
        
        .summary-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
          padding: 12px;
          background-color: @bg-secondary;
          border-radius: 4px;
          transition: all 0.3s ease;
          
          &:hover {
            background-color: @bg-hover;
          }
          
          .bullet-point {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            height: 24px;
            background-color: @primary-color;
            color: #fff;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 600;
            margin-right: 12px;
          }
          
          .point-content {
            flex: 1;
            font-size: 14px;
            line-height: 1.6;
            color: @text-primary;
          }
        }
      }
    }
    
    .keywords-section {
      .keywords-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        
        .keyword-tag {
          font-size: 14px;
          padding: 8px 16px;
          cursor: default;
        }
      }
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
