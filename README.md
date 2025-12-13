# 新闻看板系统 (News Dashboard)

一个基于 Vue 2.6 开发的专业数据看板系统，采用 Manus 工业风深色主题设计，提供贸易紧张程度可视化、新闻爬虫和 NLP 分析功能。

![Vue](https://img.shields.io/badge/Vue-2.6.14-brightgreen)
![Element UI](https://img.shields.io/badge/Element%20UI-2.15.14-blue)
![ECharts](https://img.shields.io/badge/ECharts-4.x-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ 功能特性

### 🗺️ 首页 - 贸易紧张程度看板
- ECharts 世界地图可视化
- 贸易关系连线展示（颜色编码）
- 数据表格（排序、搜索、分页）
- 详情弹窗

### 🔗 贸易新闻爬虫工具
- 双国家选择（支持搜索）
- 时间范围筛选
- 实时进度显示
- 新闻卡片展示
- 分页加载

### 📊 NLP 分析工具
- URL / 文本双输入模式
- 情感分析（正面/中性/负面）
- 置信度可视化
- 内容摘要提取
- 关键词标签

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run serve
```
访问: http://localhost:8080

### 生产构建
```bash
npm run build
```

## 📁 项目结构

```
src/
├── api/                    # API 接口管理
├── assets/styles/         # Manus 深色主题
├── components/
│   ├── common/           # 公共组件
│   └── layout/           # 布局组件
├── router/               # 路由配置
├── store/                # Vuex 状态管理
├── utils/                # 工具函数
└── views/                # 页面组件
    ├── HomePage.vue
    ├── CrawlerTool.vue
    └── NlpAnalyzer.vue
```

## 🎨 设计特点

### Manus 工业风主题
- 深色系基调 (#1a1d24)
- 卡片式布局
- 高对比度配色
- 流畅的过渡动画

### 响应式设计
- 侧边栏自动折叠
- 移动端适配
- 灵活的网格布局

## 🔌 后端对接

### 配置 API 地址
编辑 `.env.development`:
```env
VUE_APP_BASE_API=http://localhost:5000/api
```

### API 接口
所有接口定义在 `src/api/index.js`，包括：
- 贸易紧张程度数据
- 新闻爬取
- NLP 分析

详细文档请查看 [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

## 📚 文档

- [快速开始指南](./QUICK_START.md) - 详细的入门指南
- [项目文档](./PROJECT_DOCUMENTATION.md) - 完整的技术文档
- [开发任务清单](./TODO.md) - 功能规划和优化建议
- [交付总结](./DELIVERY_SUMMARY.md) - 项目交付说明

## 🛠️ 技术栈

- Vue 2.6.14
- Element UI 2.15.14
- Vue Router 3.5.1
- Vuex 3.6.2
- Axios 1.13.2
- ECharts 4.x
- Less 4.0.0

## 📝 开发规范

### 命名规范
- 组件名: PascalCase
- 方法名: camelCase
- 常量: UPPER_CASE

### 代码注释
- 每个组件顶部说明功能
- 复杂方法添加注释
- API 接口注明用途

## 🎯 路由

| 路由 | 页面 | 功能 |
|------|------|------|
| `/home` | 首页 | 贸易紧张程度看板 |
| `/crawler` | 爬虫工具 | 新闻爬取 |
| `/nlp` | NLP 分析 | 内容分析 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License

## 📞 支持

如有问题，请查看项目文档或提交 Issue。

---

**开发状态**: ✅ 前端完成，等待后端对接  
**版本**: 1.0.0  
**最后更新**: 2025-11-06
