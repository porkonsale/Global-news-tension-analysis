# 新闻看板系统 - 项目文档

## 项目概述

这是一个基于 Vue 2.6 开发的贸易新闻看板系统，采用 Manus 工业风深色主题设计，提供贸易紧张程度可视化、新闻爬虫和 NLP 分析功能。

## 技术栈

- **框架**: Vue 2.6
- **UI 组件库**: Element UI
- **状态管理**: Vuex
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **样式**: Less
- **数据可视化**: ECharts 4

## 项目结构

```
src/
├── api/                    # API 接口管理
│   └── index.js           # 统一的 API 接口定义
├── assets/                 # 静态资源
│   └── styles/            # 样式文件
│       └── theme.less     # Manus 深色主题
├── components/            # 组件
│   ├── common/           # 公共组件
│   │   ├── InputForm.vue       # 输入表单组件
│   │   ├── ResultCard.vue      # 结果卡片组件
│   │   ├── TradeTable.vue      # 贸易数据表格
│   │   └── WorldMap.vue        # 世界地图可视化
│   └── layout/           # 布局组件
│       ├── Layout.vue          # 全局布局
│       └── Sidebar.vue         # 侧边栏导航
├── router/                # 路由配置
│   └── index.js
├── store/                 # Vuex 状态管理
│   └── index.js
├── utils/                 # 工具函数
│   └── request.js        # Axios 封装
├── views/                 # 页面组件
│   ├── HomePage.vue           # 首页 - 贸易紧张程度看板
│   ├── CrawlerTool.vue        # 贸易新闻爬虫工具
│   └── NlpAnalyzer.vue        # NLP 分析工具
├── App.vue               # 根组件
└── main.js              # 入口文件
```

## 核心功能模块

### 1. 首页 (HomePage)

**功能**：
- 世界地图可视化展示中国与各国/地区的贸易紧张程度
- 连线颜色表示紧张程度（绿色-低、黄色-中、红色-高）
- 贸易紧张程度数据表格，支持排序和搜索
- 点击查看详情，可跳转到爬虫工具查看相关新闻

**组件**：
- `WorldMap.vue`: ECharts 地图组件
- `TradeTable.vue`: 数据表格组件

**路由**: `/home`

### 2. 贸易新闻爬虫 (CrawlerTool)

**功能**：
- 选择两个国家进行新闻爬取
- 支持时间范围选择和数量设置
- 实时显示爬取进度
- 卡片列表展示爬取结果
- 支持分页加载更多
- 可直接跳转到 NLP 分析工具

**组件**：
- `InputForm.vue`: 国家选择表单
- `ResultCard.vue`: 新闻卡片展示

**路由**: `/crawler`

### 3. NLP 分析工具 (NlpAnalyzer)

**功能**：
- 支持 URL 输入和文本输入两种方式
- 情感分析（正面/中性/负面）
- 置信度可视化展示（进度条）
- 内容摘要（核心观点 bullet points）
- 关键词提取
- 支持结果导出

**路由**: `/nlp`

## 设计特点

### Manus 工业风主题

- **深色系配色**：
  - 主背景：`#1a1d24`
  - 次级背景：`#21252b`
  - 卡片背景：`#282c34`
  - 主题色：`#409eff`

- **交互反馈**：
  - Hover 微动画
  - 状态变化过渡效果
  - 加载动画

- **视觉层次**：
  - 卡片式组件
  - 高对比度强调色
  - 清晰的边界线

### 响应式设计

- 侧边栏在小屏设备自动折叠
- 移动端适配优化
- 灵活的网格布局

## API 接口规范

所有接口在 `src/api/index.js` 中统一管理，分为以下模块：

### 首页接口 (homeApi)
```javascript
getTradeTension()          // 获取贸易紧张程度数据
getTradeTensionList(params) // 获取详细列表
```

### 爬虫接口 (crawlerApi)
```javascript
crawlNews(data)            // 爬取新闻
getCrawlHistory(params)    // 获取爬取历史
```

### NLP 接口 (nlpApi)
```javascript
analyzeByUrl(data)         // 通过 URL 分析
analyzeByText(data)        // 通过文本分析
```

### 通用接口 (commonApi)
```javascript
getCountryList()           // 获取国家列表
```

## 状态管理

使用 Vuex 管理全局状态：

```javascript
state: {
  loading: false,              // 全局加载状态
  userInfo: null,              // 用户信息
  tradeTensionCache: null,     // 贸易数据缓存
  crawlerHistory: []           // 爬虫历史记录
}
```

## 运行项目

### 安装依赖
```bash
cd d:\Users\10314\Desktop\NewsDashboard\Vue_test\vue01
npm install
```

### 开发模式
```bash
npm run serve
```
访问：http://localhost:8080

### 生产构建
```bash
npm run build
```

## 后端对接指南

### 1. 配置 API 基础路径

在项目根目录创建 `.env.development` 文件：
```
VUE_APP_BASE_API=http://localhost:5000/api
```

在项目根目录创建 `.env.production` 文件：
```
VUE_APP_BASE_API=https://your-production-api.com/api
```

### 2. 后端接口返回格式建议

```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 实际数据
  }
}
```

### 3. 错误处理

错误统一在 `src/utils/request.js` 中处理，返回标准格式：
```json
{
  "code": 400/401/403/404/500,
  "message": "错误信息",
  "data": null
}
```

## 开发规范

### 命名规范
- **组件名**: PascalCase (如 `WorldMap.vue`)
- **方法名**: camelCase (如 `handleSubmit`)
- **常量**: 全大写下划线分隔 (如 `API_BASE_URL`)

### 代码注释
- 每个组件顶部注释说明功能
- 复杂方法添加注释说明
- API 接口添加用途说明

### 组件拆分原则
- 单个组件不超过 500 行
- 公共逻辑提取为工具函数
- 可复用组件放在 `components/common`

## 扩展功能建议

1. **用户认证**: 添加登录/注册功能
2. **数据导出**: 支持 Excel/CSV 导出
3. **实时更新**: WebSocket 实时推送数据
4. **数据对比**: 历史数据对比分析
5. **报告生成**: 自动生成分析报告
6. **多语言支持**: i18n 国际化

## 常见问题

### Q: ECharts 地图不显示？
A: 确保已正确引入世界地图数据：`import 'echarts/map/js/world'`

### Q: Element UI 深色主题不生效？
A: 检查 `src/assets/styles/theme.less` 是否正确引入到 `App.vue`

### Q: 接口请求失败？
A: 检查 `.env` 文件中的 API 地址配置，确保后端服务正常运行

## 联系与支持

如有问题或建议，请通过以下方式联系：
- 项目地址: [项目 Git 仓库]
- 文档地址: [在线文档]

---

**版本**: 1.0.0  
**更新日期**: 2025-11-06  
**开发者**: [Your Name]
