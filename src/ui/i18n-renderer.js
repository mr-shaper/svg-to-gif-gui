// 渲染器端的国际化支持
const translations = {
    'zh-CN': {
        appTitle: 'SVG to GIF 转换器',
        svgFile: 'SVG 文件',
        selectFile: '选择文件',
        chooseFile: '请选择 .svg 文件',
        sizePreset: '尺寸预设',
        customSize: '自定义尺寸',
        width: '宽度 (px)',
        height: '高度 (px)',
        frameRate: '帧率 (FPS)',
        duration: '时长 (秒)',
        autoDetect: '自动检测',
        gifQuality: 'GIF 质量 (1-20)',
        highQuality: '高质量',
        smallFile: '小文件',
        fileSizeLimit: '文件大小限制 (MB)',
        autoCompressHint: '超过将自动压缩',
        outputFile: '输出文件',
        selectPath: '选择路径',
        savePathHint: '选择保存路径 (可选)',
        startConversion: '开始转换',
        ready: '准备就绪',
        conversionSuccess: '转换成功!',
        openFolder: '打开文件夹',
        runningOn: 'Running on',
        detecting: '(检测中...)',
        detected: '(已检测: %s秒)',
        noAnimation: '(未检测到动画)',
        detectFailed: '(检测失败)',
        originalSizeHint: '(原始: %sx%s)',
        selectSvgFirst: '请先选择一个 SVG 文件',
        // 预设选项
        originalSizeLabel: '原始尺寸 (100%)',
        recommendedSize: '推荐尺寸 (75%)',
        compressedSize: '压缩尺寸 (50%)',
        smallSize: '小尺寸 (社交媒体)',
        highQualityScenario: '高质量演示',
        webDisplay: '网页展示',
        emailAttachment: '邮件附件',
        socialMedia: '微信/朋友圈'
    },
    'en-US': {
        appTitle: 'SVG to GIF Converter',
        svgFile: 'SVG File',
        selectFile: 'Select File',
        chooseFile: 'Please select .svg file',
        sizePreset: 'Size Preset',
        customSize: 'Custom Size',
        width: 'Width (px)',
        height: 'Height (px)',
        frameRate: 'Frame Rate (FPS)',
        duration: 'Duration (sec)',
        autoDetect: 'Auto Detect',
        gifQuality: 'GIF Quality (1-20)',
        highQuality: 'High Quality',
        smallFile: 'Small File',
        fileSizeLimit: 'File Size Limit (MB)',
        autoCompressHint: 'Auto compress if exceeded',
        outputFile: 'Output File',
        selectPath: 'Select Path',
        savePathHint: 'Select save path (optional)',
        startConversion: 'Start Conversion',
        ready: 'Ready',
        conversionSuccess: 'Conversion successful!',
        openFolder: 'Open Folder',
        runningOn: 'Running on',
        detecting: '(Detecting...)',
        detected: '(Detected: %ss)',
        noAnimation: '(No animation)',
        detectFailed: '(Detection failed)',
        originalSizeHint: '(Original: %sx%s)',
        selectSvgFirst: 'Please select an SVG file first',
        // 预设选项
        originalSizeLabel: 'Original Size (100%)',
        recommendedSize: 'Recommended (75%)',
        compressedSize: 'Compressed (50%)',
        smallSize: 'Small (Social Media)',
        highQualityScenario: 'High Quality',
        webDisplay: 'Web Display',
        emailAttachment: 'Email',
        socialMedia: 'Social Media'
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

// 获取翻译
function t(key, ...args) {
    const lang = getCurrentLanguage();
    let text = translations[lang]?.[key] || translations['en-US']?.[key] || key;
    
    // 替换占位符
    if (args.length > 0) {
        args.forEach(arg => {
            text = text.replace('%s', arg);
        });
    }
    
    return text;
}

// 更新所有UI文本
function updateUILanguage() {
    const lang = getCurrentLanguage();
    
    // 更新标题和标签
    document.getElementById('appTitle').textContent = t('appTitle');
    document.getElementById('labelSvgFile').textContent = t('svgFile');
    document.getElementById('btnSelect').textContent = t('selectFile');
    document.getElementById('inputPath').placeholder = t('chooseFile');
    
    document.getElementById('labelSizePreset').childNodes[0].textContent = t('sizePreset') + ' ';
    document.getElementById('labelWidth').textContent = t('width');
    document.getElementById('labelHeight').textContent = t('height');
    document.getElementById('labelFrameRate').textContent = t('frameRate');
    document.getElementById('labelDuration').childNodes[0].textContent = t('duration') + ' ';
    document.getElementById('btnDetectText').textContent = t('autoDetect');
    
    document.getElementById('labelGifQuality').textContent = t('gifQuality');
    document.getElementById('qualityHigh').textContent = t('highQuality');
    document.getElementById('qualitySmall').textContent = t('smallFile');
    
    document.getElementById('labelFileSizeLimit').childNodes[0].textContent = t('fileSizeLimit') + ' ';
    document.getElementById('autoCompressHint').textContent = t('autoCompressHint');
    
    document.getElementById('labelOutputFile').textContent = t('outputFile');
    document.getElementById('btnSavePath').textContent = t('selectPath');
    document.getElementById('outputPath').placeholder = t('savePathHint');
    
    document.getElementById('btnStart').textContent = t('startConversion');
    document.getElementById('statusText').textContent = t('ready');
    document.getElementById('resultMsg').textContent = t('conversionSuccess');
    document.getElementById('btnOpenFolder').textContent = t('openFolder');
    document.getElementById('footerRunningOn').textContent = t('runningOn');
    
    // 更新 HTML lang 属性
    document.documentElement.lang = lang;
}

