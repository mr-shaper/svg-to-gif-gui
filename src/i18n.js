// 国际化语言包
const translations = {
    'zh-CN': {
        // 标题
        appTitle: 'SVG to GIF 转换器',
        
        // 文件选择
        svgFile: 'SVG 文件',
        selectFile: '选择文件',
        chooseFile: '请选择 .svg 文件',
        
        // 尺寸预设
        sizePreset: '尺寸预设',
        originalSize: '原始',
        customSize: '自定义尺寸',
        originalSizeLabel: '原始尺寸 (100%)',
        recommendedSize: '推荐尺寸 (75%)',
        compressedSize: '压缩尺寸 (50%)',
        smallSize: '小尺寸 (社交媒体)',
        
        // 场景标签
        highQuality: '高质量演示',
        webDisplay: '网页展示',
        emailAttachment: '邮件附件',
        socialMedia: '微信/朋友圈',
        
        // 参数设置
        width: '宽度 (px)',
        height: '高度 (px)',
        frameRate: '帧率 (FPS)',
        duration: '时长 (秒)',
        gifQuality: 'GIF 质量 (1-20)',
        highQualityLabel: '高质量',
        smallFileLabel: '小文件',
        fileSizeLimit: '文件大小限制 (MB)',
        autoCompressHint: '超过将自动压缩',
        
        // 输出设置
        outputFile: '输出文件',
        selectPath: '选择路径',
        savePathHint: '选择保存路径 (可选)',
        
        // 按钮
        autoDetect: '自动检测',
        startConversion: '开始转换',
        openFolder: '打开文件夹',
        
        // 状态提示
        ready: '准备就绪',
        detecting: '(检测中...)',
        detected: '(已检测: %s秒)',
        noAnimation: '(未检测到动画)',
        detectFailed: '(检测失败)',
        originalSizeHint: '(原始: %sx%s)',
        
        // 转换过程
        initializing: '初始化...',
        loadingSvg: '加载 SVG...',
        preparingAnimation: '准备动画控制...',
        recording: '开始录制 (%s 帧)...',
        recordingFrame: '录制帧: %s/%s',
        screenshotComplete: '截图完成，开始编码 GIF...',
        encodingFrame: '合成帧: %s/%s',
        fileTooLarge: '文件过大 (%sMB)，正在自动优化...',
        complete: '完成!',
        
        // 结果显示
        conversionSuccess: '转换成功!',
        fileSize: '文件大小: %s MB',
        autoCompressed: '已自动压缩',
        originalFileSize: '原: %s MB',
        saved: '节省: %s MB / %s%%',
        sizeOk: '文件大小符合要求',
        sizeWarning: '文件超过 %s MB，建议降低质量或分辨率',
        
        // 错误信息
        error: '错误',
        selectSvgFirst: '请先选择一个 SVG 文件',
        
        // 页脚
        runningOn: '运行在',
        
        // 语言
        language: '语言',
        chinese: '中文',
        english: 'English'
    },
    
    'en-US': {
        // Title
        appTitle: 'SVG to GIF Converter',
        
        // File Selection
        svgFile: 'SVG File',
        selectFile: 'Select File',
        chooseFile: 'Please select .svg file',
        
        // Size Presets
        sizePreset: 'Size Preset',
        originalSize: 'Original',
        customSize: 'Custom Size',
        originalSizeLabel: 'Original Size (100%)',
        recommendedSize: 'Recommended (75%)',
        compressedSize: 'Compressed (50%)',
        smallSize: 'Small (Social Media)',
        
        // Scenario Labels
        highQuality: 'High Quality',
        webDisplay: 'Web Display',
        emailAttachment: 'Email',
        socialMedia: 'Social Media',
        
        // Parameters
        width: 'Width (px)',
        height: 'Height (px)',
        frameRate: 'Frame Rate (FPS)',
        duration: 'Duration (sec)',
        gifQuality: 'GIF Quality (1-20)',
        highQualityLabel: 'High Quality',
        smallFileLabel: 'Small File',
        fileSizeLimit: 'File Size Limit (MB)',
        autoCompressHint: 'Auto compress if exceeded',
        
        // Output Settings
        outputFile: 'Output File',
        selectPath: 'Select Path',
        savePathHint: 'Select save path (optional)',
        
        // Buttons
        autoDetect: 'Auto Detect',
        startConversion: 'Start Conversion',
        openFolder: 'Open Folder',
        
        // Status Hints
        ready: 'Ready',
        detecting: '(Detecting...)',
        detected: '(Detected: %ss)',
        noAnimation: '(No animation)',
        detectFailed: '(Detection failed)',
        originalSizeHint: '(Original: %sx%s)',
        
        // Conversion Process
        initializing: 'Initializing...',
        loadingSvg: 'Loading SVG...',
        preparingAnimation: 'Preparing animation...',
        recording: 'Recording (%s frames)...',
        recordingFrame: 'Recording frame: %s/%s',
        screenshotComplete: 'Screenshot complete, encoding GIF...',
        encodingFrame: 'Encoding frame: %s/%s',
        fileTooLarge: 'File too large (%sMB), optimizing...',
        complete: 'Complete!',
        
        // Results
        conversionSuccess: 'Conversion successful!',
        fileSize: 'File size: %s MB',
        autoCompressed: 'Auto compressed',
        originalFileSize: 'Original: %s MB',
        saved: 'Saved: %s MB / %s%%',
        sizeOk: 'File size meets requirement',
        sizeWarning: 'File exceeds %s MB, consider reducing quality or resolution',
        
        // Errors
        error: 'Error',
        selectSvgFirst: 'Please select an SVG file first',
        
        // Footer
        runningOn: 'Running on',
        
        // Language
        language: 'Language',
        chinese: '中文',
        english: 'English'
    }
};

// 获取当前语言
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'zh-CN';
}

// 设置语言
function setLanguage(lang) {
    localStorage.setItem('language', lang);
}

// 获取翻译文本
function t(key, ...args) {
    const lang = getCurrentLanguage();
    let text = translations[lang][key] || translations['en-US'][key] || key;
    
    // 替换占位符
    if (args.length > 0) {
        args.forEach((arg, index) => {
            text = text.replace('%s', arg);
        });
    }
    
    return text;
}

module.exports = { getCurrentLanguage, setLanguage, t, translations };

