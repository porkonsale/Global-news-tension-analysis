<!--
  Result Card Component
  Function: Display data results in card format
-->
<template>
  <div class="result-card" :class="{ 'is-loading': loading }">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <i class="el-icon-loading"></i>
      <span>Loading...</span>
    </div>

    <!-- Content Area -->
    <div v-else class="card-content">
      <!-- Header -->
      <div class="card-header" v-if="title || $slots.header">
        <slot name="header">
          <h3 class="card-title">{{ title }}</h3>
          <div class="card-extra" v-if="extra">
            <span>{{ extra }}</span>
          </div>
        </slot>
      </div>

      <!-- Body Content -->
      <div class="card-body">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div class="card-footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultCard',
  props: {
    // Title
    title: {
      type: String,
      default: ''
    },
    // Extra Info
    extra: {
      type: String,
      default: ''
    },
    // Loading State
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/theme.less';

.result-card {
  background-color: @bg-card;
  border: 1px solid @border-color;
  border-radius: 4px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: @primary-color;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  }

  &.is-loading {
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: @text-secondary;

    i {
      font-size: 32px;
    }

    span {
      font-size: 14px;
    }
  }

  .card-content {
    .card-header {
      padding: 16px 20px;
      border-bottom: 1px solid @border-color;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: @text-primary;
        margin: 0;
      }

      .card-extra {
        font-size: 14px;
        color: @text-secondary;
      }
    }

    .card-body {
      padding: 20px;
    }

    .card-footer {
      padding: 12px 20px;
      border-top: 1px solid @border-color;
      background-color: @bg-secondary;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }
  }
}
</style>
