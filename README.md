# 🎨 SVG to GIF Converter

<div align="center">

**A beautiful and intelligent desktop tool for converting SVG animations to GIF**  
**一个美观、智能的 SVG 动画转 GIF 桌面工具**

Cross-platform Electron app · Supports Windows and macOS  
跨平台 Electron 应用 · 支持 Windows 和 macOS

[English](#english) | [中文](#中文)

![Version](https://img.shields.io/badge/version-1.3.0-blue)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)

</div>

---

## English

### ✨ Features

- **🎯 Smart Size Detection**: Automatically detect SVG dimensions with 4 scenario-based presets
- **⭐ Intelligent Recommendations**: Suggest optimal compression ratios (75%/50%/30%)
- **📦 Auto Compression**: Automatically optimize when file size exceeds limit
- **🎨 Quality Control**: 1-20 level quality adjustment
- **⏱️ Duration Detection**: Automatically detect animation duration
- **🌐 Bilingual UI**: Support for Chinese and English with language switcher
- **🎨 GitHub Dark Theme**: Beautiful, modern, and eye-friendly interface
- **⚡ Fast Startup**: 90% faster with intelligent dependency management
- **💻 Cross-platform**: Works on both macOS and Windows

### 🚀 Quick Start

#### Windows Users
1. Double-click `start_win.bat`
2. Wait for automatic dependency installation (first time only, ~1 minute)
3. The application will launch automatically

#### macOS Users
1. Double-click `start_mac.command`
2. If system prompts "cannot open from unidentified developer":
   - Right-click the file → Select "Open" → Click "Open" in the popup
3. Wait for automatic dependency installation (first time only, ~1 minute)
4. Subsequent launches take only 5 seconds!

### 📖 How to Use

1. **Select SVG File** → Auto-detects size and duration
2. **Choose Size Preset** → Select from 4 preset options:
   - ⭐ **Recommended (75%)**: Web display, blog posts (default)
   - **Compressed (50%)**: Email attachments
   - **Small (30%)**: Social media sharing
   - **Original (100%)**: High-quality presentations
3. **Adjust Parameters** (optional) → Width, height, quality auto-filled
4. **Start Conversion** → Done!

### 🛠️ Manual Development

```bash
# Install dependencies
npm install

# Start in development mode
npm start

# Build (requires electron-builder)
npm run pack-mac  # Package for macOS
npm run pack-win  # Package for Windows
```

### 🧹 Clean Dependencies

If you encounter dependency issues:
- **macOS**: Double-click `clean.command`
- **Windows**: Double-click `clean.bat`

### 📄 License

[MIT License](LICENSE)

---

## 中文

### ✨ 特性

- **🎯 智能尺寸识别**：自动检测 SVG 尺寸，提供 4 种场景化预设方案
- **⭐ 智能推荐**：根据使用场景推荐最佳压缩比例（75%/50%/30%）
- **📦 自动压缩**：文件超过限制时自动优化
- **🎨 质量可调**：1-20 级质量精细控制
- **⏱️ 时长检测**：自动识别动画时长
- **🌐 双语界面**：支持中英文切换
- **🎨 GitHub Dark 主题**：美观、现代、护眼的界面
- **⚡ 快速启动**：智能依赖管理，启动快 90%
- **💻 跨平台**：支持 macOS 和 Windows

### 🚀 快速开始

#### Windows 用户
1. 双击运行 `start_win.bat`
2. 等待自动安装依赖（首次约 1 分钟）
3. 程序会自动启动

#### macOS 用户
1. 双击运行 `start_mac.command`
2. 如果系统提示"无法打开，因为它来自身份不明的开发者"：
   - 右键点击文件 → 选择"打开" → 在弹窗中点击"打开"
3. 等待自动安装依赖（首次约 1 分钟）
4. 后续启动只需 5 秒！

### 📖 使用方法

1. **选择 SVG 文件** → 自动检测尺寸和时长
2. **选择尺寸预设** → 从 4 种预设中选择：
   - ⭐ **推荐尺寸 (75%)**：网页展示、博客文章（默认）
   - **压缩尺寸 (50%)**：邮件附件
   - **小尺寸 (30%)**：社交媒体分享
   - **原始尺寸 (100%)**：高质量演示
3. **调整参数**（可选）→ 宽度、高度、质量自动填充
4. **开始转换** → 完成！

### 💡 推荐配置

| 场景 | 分辨率 | 帧率 | 质量 | 限制 |
|------|--------|------|------|------|
| 社交媒体 | 600x400 | 15 | 12-15 | 5 MB |
| 邮件附件 | 800x600 | 20 | 10 | 10 MB |
| 网页展示 | 1200x800 | 24 | 8-10 | 15 MB |
| 高质量 | 1920x1080 | 30 | 5-8 | 50 MB |

### 🛠️ 手动开发

```bash
# 安装依赖
npm install

# 开发模式启动
npm start

# 打包（需要先安装 electron-builder）
npm run pack-mac  # 打包 macOS 应用
npm run pack-win  # 打包 Windows 应用
```

### 🧹 清理依赖

如果遇到依赖问题：
- **macOS**：双击运行 `clean.command`
- **Windows**：双击运行 `clean.bat`

### 🔧 核心技术

- Electron
- Puppeteer (渲染与录制)
- gif-encoder (GIF 合成)
- pngjs (PNG 解码)

### 📚 文档

- [更新日志 / Changelog](CHANGELOG.md)
- [贡献指南 / Contributing](CONTRIBUTING.md)

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 📄 许可证

[MIT License](LICENSE)

---

<div align="center">

**Made with ❤️**

If this project helps you, please give it a ⭐ Star!  
如果这个项目对你有帮助，请给个 ⭐ Star！

</div>
