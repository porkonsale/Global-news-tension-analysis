/**
 * API 接口测试文档
 * 
 * 前端与后端 FastAPI 的接口对接说明
 */

// ================================
// 1. 新闻采集接口
// ================================

/**
 * 1.1 获取新闻（单页）
 * 
 * 前端调用：
 * import { newsApi } from '@/api'
 * 
 * const res = await newsApi.fetchNews({
 *   search: 'US-China trade',      // 必需：搜索关键词
 *   categories: 'politics,business', // 可选：分类
 *   page: 1,                        // 页码
 *   limit: 50                       // 每页数量
 * })
 * 
 * 后端返回：
 * {
 *   success: true,
 *   data: [
 *     {
 *       uuid: "xxx",
 *       title: "标题",
 *       description: "描述",
 *       url: "链接",
 *       published_at: "2024-01-01T00:00:00",
 *       source: "来源",
 *       content: "正文内容",
 *       sentiment: "positive/neutral/negative",
 *       ai_summary: "AI摘要"
 *     }
 *   ],
 *   meta: {
 *     found: 100,
 *     page: 1
 *   }
 * }
 */

/**
 * 1.2 全量采集新闻（自动分页）
 * 
 * 前端调用：
 * const res = await newsApi.fetchAllNews({
 *   search: 'climate change',
 *   categories: 'science'
 * })
 * 
 * 后端返回：
 * {
 *   success: true,
 *   stats: {
 *     total_found: 500,
 *     processed: 500,
 *     failed: 0
 *   },
 *   elapsed_time: 120.5
 * }
 */

/**
 * 1.3 获取查询历史
 * 
 * 前端调用：
 * const res = await newsApi.getQueryHistory()
 * 
 * 后端返回：
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: 1,
 *       search_text: "US-China trade",
 *       categories: "politics,business",
 *       found_count: 100,
 *       query_time: "2024-01-01 12:00:00"
 *     }
 *   ]
 * }
 */

/**
 * 1.4 获取文章列表
 * 
 * 前端调用：
 * const res = await newsApi.getArticlesList({
 *   query_id: 1,    // 可选：查询记录ID
 *   limit: 50,
 *   offset: 0
 * })
 * 
 * 后端返回：
 * {
 *   success: true,
 *   data: [...],
 *   count: 50
 * }
 */

/**
 * 1.5 获取文章详情
 * 
 * 前端调用：
 * const res = await newsApi.getArticleDetail('uuid-xxx')
 * 
 * 后端返回：
 * {
 *   success: true,
 *   data: {
 *     uuid: "xxx",
 *     title: "标题",
 *     content: "完整正文",
 *     sentiment: "positive",
 *     ai_summary: "AI摘要"
 *   }
 * }
 */

// ================================
// 2. NLP 分析接口（预留，待后续实现）
// ================================

/**
 * 2.1 情感分析接口
 * 
 * 前端调用：
 * const res = await nlpApi.analyzeByText({
 *   content: "文章内容..."
 * })
 * 
 * 预期返回：
 * {
 *   success: true,
 *   data: {
 *     sentiment: "positive/neutral/negative",
 *     confidence: 0.85
 *   }
 * }
 */

/**
 * 2.2 智能摘要接口
 * 
 * 前端调用：
 * const res = await nlpApi.analyzeByUrl({
 *   url: "https://..."
 * })
 * 
 * 预期返回：
 * {
 *   success: true,
 *   data: {
 *     summary: "30-50词摘要",
 *     sentiment: "positive"
 *   }
 * }
 */

// ================================
// 3. 使用示例
// ================================

// 在 Vue 组件中使用：
export default {
  name: 'Example',
  methods: {
    async loadNews() {
      try {
        const res = await this.$api.newsApi.fetchNews({
          search: 'US-China trade',
          categories: 'politics,business',
          limit: 20
        })
        
        if (res.success) {
          this.newsList = res.data
        }
      } catch (error) {
        this.$message.error('加载失败')
      }
    }
  }
}
