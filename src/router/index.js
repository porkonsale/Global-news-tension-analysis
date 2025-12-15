import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/layout/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'HomePage',
        component: () => import('@/views/HomePage.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/crawler',
        name: 'CrawlerTool',
        component: () => import('@/views/CrawlerTool.vue'),
        meta: { title: '贸易新闻爬虫' }
      },
      {
        path: '/nlp',
        name: 'NlpAnalyzer',
        component: () => import('@/views/NlpAnalyzer.vue'),
        meta: { title: 'NLP 分析工具' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash', // 使用 hash 模式，避免页面刷新
  base: process.env.BASE_URL,
  routes
})

// 路由守卫：防止重复导航
router.beforeEach((to, from, next) => {
  // 如果是相同路由，不进行导航
  if (to.path === from.path) {
    next(false)
  } else {
    next()
  }
})

export default router
