<!--
  Global Layout Component
  Function: Layout structure with left sidebar + right main content area
-->
<template>
  <div class="layout">
    <!-- Sidebar -->
    <Sidebar @collapse-change="handleCollapseChange" />

    <!-- Main Content Area -->
    <div class="main-container" :class="{ 'is-collapse': isCollapse }">
      <!-- Top Navigation Bar -->
      <div class="header">
        <div class="header-left">
          <h2 class="page-title">{{ pageTitle }}</h2>
        </div>
        <div class="header-right">
          <span class="datetime">{{ currentTime }}</span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <router-view />
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue'

export default {
  name: 'Layout',
  components: {
    Sidebar
  },
  data() {
    return {
      isCollapse: false,
      currentTime: ''
    }
  },
  computed: {
    // Get page title based on route
    pageTitle() {
      const routeMap = {
        '/home': 'Trade Tension Dashboard',
        '/crawler': 'Trade News Crawler Tool',
        '/nlp': 'NLP Analysis Tool'
      }
      return routeMap[this.$route.path] || 'News Dashboard'
    }
  },
  mounted() {
    // Update time
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    // Sidebar collapse state change
    handleCollapseChange(isCollapse) {
      this.isCollapse = isCollapse
    },
    
    // Update current time
    updateTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hour = String(now.getHours()).padStart(2, '0')
      const minute = String(now.getMinutes()).padStart(2, '0')
      const second = String(now.getSeconds()).padStart(2, '0')
      this.currentTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/theme.less';

.layout {
  min-height: 100vh;
  background-color: @bg-primary;
}

.main-container {
  margin-left: 240px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;

  &.is-collapse {
    margin-left: 64px;
  }

  // 顶部导航栏
  .header {
    height: 60px;
    background-color: @bg-secondary;
    border-bottom: 1px solid @border-color;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 999;

    &-left {
      .page-title {
        font-size: 20px;
        font-weight: 600;
        color: @text-primary;
        margin: 0;
      }
    }

    &-right {
      display: flex;
      align-items: center;
      gap: 20px;

      .datetime {
        font-size: 14px;
        color: @text-secondary;
        font-family: 'Courier New', monospace;
      }
    }
  }

  // 内容区域
  .content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .main-container {
    margin-left: 64px;

    .header {
      padding: 0 16px;

      &-left {
        .page-title {
          font-size: 16px;
        }
      }

      &-right {
        .datetime {
          font-size: 12px;
        }
      }
    }

    .content {
      padding: 16px;
    }
  }
}

// 页面切换动画
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
