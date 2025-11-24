# 贡献指南 / Contributing Guide

感谢你考虑为 SVG to GIF Converter 做出贡献！

## 如何贡献

### 报告 Bug
1. 在 [Issues](../../issues) 中搜索是否已有相同问题
2. 如果没有，创建新 Issue
3. 提供详细的复现步骤和环境信息

### 提出新功能
1. 在 [Issues](../../issues) 中创建 Feature Request
2. 描述功能的使用场景和价值
3. 等待社区反馈

### 提交代码
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 开发设置

### 环境要求
- Node.js 16+
- npm 7+

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm start
```

### 代码规范
- 使用有意义的变量名
- 添加必要的注释
- 保持代码简洁

## 项目结构

```
src/
├── main.js          # Electron 主进程
├── preload.js       # 预加载脚本
├── converter.js     # 核心转换逻辑
└── ui/
    ├── index.html   # 界面结构
    ├── styles.css   # 样式
    └── renderer.js  # 渲染进程逻辑
```

## 测试

在提交 PR 前，请确保：
1. 代码可以正常运行
2. 已测试主要功能
3. 没有明显的性能问题

## 许可证

通过贡献，你同意你的代码使用 MIT 许可证。

