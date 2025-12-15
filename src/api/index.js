/**
 * API Interface Management
 * All API requests are defined here
 */

import request from '@/utils/request'

/**
 * Home Page Related APIs
 */
export const homeApi = {
  // Get Trade Tension Data
  getTradeTension() {
    return request({
      url: '/tension/distribution',
      method: 'get'
    })
  },
  
  // Get Trade Tension Detail List
  getTradeTensionList(params) {
    return request({
      url: '/tension/details',
      method: 'get',
      params
    })
  },

  // Get Trade Tension Trend
  getTradeTensionTrend() {
    return request({
      url: '/tension/trend',
      method: 'get'
    })
  }
}

/**
 * News Collection Related APIs
 */
export const newsApi = {
  // Fetch News (Single Page)
  fetchNews(params) {
    return request({
      url: '/news/trade',
      method: 'get',
      params
    })
  },
  
  // 全量采集新闻
  fetchAllNews(params) {
    return request({
      url: '/news/fetch-all',
      method: 'post',
      params
    })
  },
  
  // 获取查询历史
  getQueryHistory() {
    return request({
      url: '/news/query-history',
      method: 'get'
    })
  },
  
  // 获取文章列表
  getArticlesList(params) {
    return request({
      url: '/articles/list',
      method: 'get',
      params
    })
  },
  
  // 获取文章详情
  getArticleDetail(uuid) {
    return request({
      url: `/articles/${uuid}`,
      method: 'get'
    })
  }
}

/**
 * 爬虫相关接口（保留兼容）
 */
export const crawlerApi = {
  // 爬取新闻（实际调用 newsApi）
  crawlNews(data) {
    return newsApi.fetchNews(data)
  },
  
  // 获取爬取历史
  getCrawlHistory(params) {
    return newsApi.getQueryHistory(params)
  }
}

/**
 * NLP 分析相关接口
 */
export const nlpApi = {
  // 通过 URL 分析新闻
  analyzeByUrl(data) {
    return request({
      url: '/nlp/analyze',
      method: 'post',
      data
    })
  },
  
  // 通过文本内容分析
  analyzeByText(data) {
    return request({
      url: '/nlp/analyze',
      method: 'post',
      data
    })
  },
  
  // 通过 UUID 获取文章并分析
  analyzeByUuid(uuid) {
    return newsApi.getArticleDetail(uuid)
  }
}

/**
 * 通用接口
 */
export const commonApi = {
  // 获取国家列表
  getCountryList() {
    return request({
      url: '/common/countries',
      method: 'get'
    })
  }
}
