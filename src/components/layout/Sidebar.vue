<!--
  Sidebar Component
  Function: Navigation menu, supports responsive collapse
-->
<template>
  <div class="sidebar" :class="{ 'is-collapse': isCollapse }">
    <!-- Logo Area -->
    <div class="sidebar-header">
      <transition name="fade">
        <span v-if="!isCollapse" class="logo-text">News Dashboard</span>
      </transition>
      <i 
        class="el-icon-s-fold collapse-icon" 
        :class="{ 'is-active': isCollapse }"
        @click="toggleCollapse"
      ></i>
    </div>

    <!-- Menu List -->
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="isCollapse"
      :collapse-transition="false"
      background-color="#ffffff"
      text-color="#303133"
      active-text-color="#409eff"
      router
    >
      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">Home</span>
      </el-menu-item>

      <el-menu-item index="/crawler">
        <i class="el-icon-link"></i>
        <span slot="title">Trade News Crawler</span>
      </el-menu-item>

      <el-menu-item index="/nlp">
        <i class="el-icon-document"></i>
        <span slot="title">NLP Analysis Tool</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isCollapse: false
    }
  },
  computed: {
    // Current active menu item
    activeMenu() {
      const route = this.$route
      const { path } = route
      return path
    }
  },
  mounted() {
    // Listen for window resize to automatically collapse sidebar
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // Toggle collapse state
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      this.$emit('collapse-change', this.isCollapse)
    },
    
    // Responsive handling
    handleResize() {
      const width = window.innerWidth
      if (width < 768) {
        this.isCollapse = true
      } else {
        this.isCollapse = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/theme.less';

.sidebar {
  width: 240px;
  height: 100vh;
  background-color: @bg-secondary;
  border-right: 1px solid @border-color;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;

  &.is-collapse {
    width: 64px;
  }

  // Logo 区域
  &-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid @border-color;
    position: relative;

    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: @primary-color;
      white-space: nowrap;
    }

    .collapse-icon {
      font-size: 20px;
      color: @text-secondary;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: @primary-color;
      }

      &.is-active {
        transform: rotate(180deg);
      }
    }
  }

  // 菜单样式
  &-menu {
    flex: 1;
    border-right: none;
    overflow-x: hidden;

    /deep/ .el-menu-item {
      height: 56px;
      line-height: 56px;
      border-left: 3px solid transparent;
      transition: all 0.3s ease;

      &:hover {
        background-color: @bg-hover !important;
      }

      &.is-active {
        background-color: @bg-hover !important;
        border-left-color: @primary-color;
        color: @primary-color !important;
      }

      i {
        font-size: 18px;
        margin-right: 12px;
      }
    }
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .sidebar {
    &:not(.is-collapse) {
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
