import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 全局加载状态
    loading: false,
    // 用户信息
    userInfo: null,
    // 贸易紧张程度数据缓存
    tradeTensionCache: null,
    // 爬虫历史记录
    crawlerHistory: []
  },
  
  getters: {
    // 是否已登录
    isLoggedIn: state => !!state.userInfo,
    // 获取缓存的贸易数据
    getCachedTensionData: state => state.tradeTensionCache,
    // 获取爬虫历史
    getCrawlerHistory: state => state.crawlerHistory
  },
  
  mutations: {
    // 设置加载状态
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    // 设置用户信息
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    
    // 缓存贸易紧张程度数据
    SET_TENSION_CACHE(state, data) {
      state.tradeTensionCache = {
        data,
        timestamp: Date.now()
      }
    },
    
    // 添加爬虫历史记录
    ADD_CRAWLER_HISTORY(state, record) {
      state.crawlerHistory.unshift(record)
      // 最多保留 20 条记录
      if (state.crawlerHistory.length > 20) {
        state.crawlerHistory = state.crawlerHistory.slice(0, 20)
      }
    },
    
    // 清空爬虫历史
    CLEAR_CRAWLER_HISTORY(state) {
      state.crawlerHistory = []
    }
  },
  
  actions: {
    // 设置加载状态
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading)
    },
    
    // 更新贸易数据缓存
    updateTensionCache({ commit }, data) {
      commit('SET_TENSION_CACHE', data)
    },
    
    // 添加爬虫记录
    addCrawlerRecord({ commit }, record) {
      commit('ADD_CRAWLER_HISTORY', record)
    },
    
    // 清空爬虫历史
    clearCrawlerHistory({ commit }) {
      commit('CLEAR_CRAWLER_HISTORY')
    }
  },
  
  modules: {
    // 可以在这里添加模块
  }
})
