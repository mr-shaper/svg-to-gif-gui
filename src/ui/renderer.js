// 初始化语言
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = getCurrentLanguage();
    document.getElementById('languageSelect').value = savedLang;
    updateUILanguage();
});

// 语言切换
document.getElementById('languageSelect').addEventListener('change', (e) => {
    setLanguage(e.target.value);
    updateUILanguage();
});

const inputPathEl = document.getElementById('inputPath');
const outputPathEl = document.getElementById('outputPath');
const btnSelect = document.getElementById('btnSelect');
const btnSavePath = document.getElementById('btnSavePath');
const btnDetect = document.getElementById('btnDetect');
const btnStart = document.getElementById('btnStart');
const sizePresetGroup = document.getElementById('sizePresetGroup');
const sizePreset = document.getElementById('sizePreset');
const originalSizeHint = document.getElementById('originalSizeHint');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const durationInput = document.getElementById('duration');
const durationHint = document.getElementById('durationHint');
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const maxSizeInput = document.getElementById('maxSize');
const statusText = document.getElementById('statusText');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const resultArea = document.getElementById('resultArea');
const sizeInfo = document.getElementById('sizeInfo');
const btnOpenFolder = document.getElementById('btnOpenFolder');

// Platform info
document.getElementById('platform').textContent = window.electronAPI.platform === 'darwin' ? 'macOS' : 'Windows';

let currentInputPath = '';
let currentOutputPath = '';
let currentSvgInfo = null;

// 更新质量滑块显示
qualityInput.addEventListener('input', () => {
    qualityValue.textContent = qualityInput.value;
});

// 尺寸预设选择
sizePreset.addEventListener('change', () => {
    const selectedValue = sizePreset.value;
    
    if (selectedValue === 'custom') {
        // 自定义尺寸，不改变当前值
        return;
    }
    
    if (currentSvgInfo && currentSvgInfo.recommendations) {
        const recommendation = currentSvgInfo.recommendations.find(r => 
            `${r.width}x${r.height}` === selectedValue
        );
        
        if (recommendation) {
            widthInput.value = recommendation.width;
            heightInput.value = recommendation.height;
            qualityInput.value = recommendation.quality;
            qualityValue.textContent = recommendation.quality;
        }
    }
});

// 手动修改宽高时，切换到自定义
widthInput.addEventListener('input', () => {
    if (sizePreset.value !== 'custom') {
        sizePreset.value = 'custom';
    }
});

heightInput.addEventListener('input', () => {
    if (sizePreset.value !== 'custom') {
        sizePreset.value = 'custom';
    }
});

// Select Input File
btnSelect.addEventListener('click', async () => {
    const path = await window.electronAPI.selectFile();
    if (path) {
        currentInputPath = path;
        inputPathEl.value = path;
        // Auto-generate output path
        if (!currentOutputPath) {
            currentOutputPath = path.replace('.svg', '.gif');
            outputPathEl.value = currentOutputPath;
        }
        
        // 自动检测 SVG 信息（尺寸 + 时长）
        durationHint.textContent = '(检测中...)';
        originalSizeHint.textContent = '(检测中...)';
        btnDetect.disabled = true;
        
        try {
            const svgInfo = await window.electronAPI.detectSvgInfo(path);
            currentSvgInfo = svgInfo;
            
            if (svgInfo) {
                // 更新时长
                if (svgInfo.duration > 0) {
                    durationInput.value = svgInfo.duration;
                    durationHint.textContent = `(已检测: ${svgInfo.duration}秒)`;
                    durationHint.style.color = 'var(--color-success)';
                } else {
                    durationHint.textContent = '(未检测到动画)';
                    durationHint.style.color = 'var(--color-text-secondary)';
                }
                
                // 显示原始尺寸
                originalSizeHint.textContent = `(原始: ${svgInfo.width}x${svgInfo.height})`;
                originalSizeHint.style.color = 'var(--color-text-secondary)';
                
                // 填充尺寸预设选项
                sizePreset.innerHTML = '<option value="custom">自定义尺寸</option>';
                
                if (svgInfo.recommendations && svgInfo.recommendations.length > 0) {
                    svgInfo.recommendations.forEach(rec => {
                        const option = document.createElement('option');
                        option.value = `${rec.width}x${rec.height}`;
                        option.textContent = `${rec.label} - ${rec.width}x${rec.height} (${rec.scenario})`;
                        if (rec.recommended) {
                            option.textContent = `⭐ ${option.textContent}`;
                            option.setAttribute('data-recommended', 'true');
                        }
                        sizePreset.appendChild(option);
                    });
                    
                    // 默认选择推荐尺寸（75%）
                    const recommended = svgInfo.recommendations.find(r => r.recommended);
                    if (recommended) {
                        sizePreset.value = `${recommended.width}x${recommended.height}`;
                        widthInput.value = recommended.width;
                        heightInput.value = recommended.height;
                        qualityInput.value = recommended.quality;
                        qualityValue.textContent = recommended.quality;
                    }
                    
                    // 显示预设选择器
                    sizePresetGroup.style.display = 'block';
                }
            } else {
                durationHint.textContent = '(检测失败)';
                durationHint.style.color = 'var(--color-danger)';
            }
        } catch (error) {
            console.error('检测失败:', error);
            durationHint.textContent = '(检测失败)';
            durationHint.style.color = 'var(--color-danger)';
        } finally {
            btnDetect.disabled = false;
        }
    }
});

// Select Output Path
btnSavePath.addEventListener('click', async () => {
    const path = await window.electronAPI.selectSaveFile();
    if (path) {
        currentOutputPath = path;
        outputPathEl.value = path;
    }
});

// Detect Duration (Manual) - 重新检测所有信息
btnDetect.addEventListener('click', async () => {
    if (!currentInputPath) {
        alert('请先选择一个 SVG 文件');
        return;
    }
    
    durationHint.textContent = '(检测中...)';
    originalSizeHint.textContent = '(检测中...)';
    btnDetect.disabled = true;
    
    try {
        const svgInfo = await window.electronAPI.detectSvgInfo(currentInputPath);
        currentSvgInfo = svgInfo;
        
        if (svgInfo) {
            // 更新时长
            if (svgInfo.duration > 0) {
                durationInput.value = svgInfo.duration;
                durationHint.textContent = `(已检测: ${svgInfo.duration}秒)`;
                durationHint.style.color = 'var(--color-success)';
            } else {
                durationHint.textContent = '(未检测到动画)';
                durationHint.style.color = 'var(--color-text-secondary)';
            }
            
            // 显示原始尺寸
            originalSizeHint.textContent = `(原始: ${svgInfo.width}x${svgInfo.height})`;
            originalSizeHint.style.color = 'var(--color-text-secondary)';
            
            // 更新尺寸预设
            sizePreset.innerHTML = '<option value="custom">自定义尺寸</option>';
            
            if (svgInfo.recommendations && svgInfo.recommendations.length > 0) {
                svgInfo.recommendations.forEach(rec => {
                    const option = document.createElement('option');
                    option.value = `${rec.width}x${rec.height}`;
                    option.textContent = `${rec.label} - ${rec.width}x${rec.height} (${rec.scenario})`;
                    if (rec.recommended) {
                        option.textContent = `⭐ ${option.textContent}`;
                        option.setAttribute('data-recommended', 'true');
                    }
                    sizePreset.appendChild(option);
                });
                
                sizePresetGroup.style.display = 'block';
            }
        } else {
            durationHint.textContent = '(检测失败)';
            durationHint.style.color = 'var(--color-danger)';
        }
    } catch (error) {
        console.error('检测失败:', error);
        durationHint.textContent = '(检测失败)';
        durationHint.style.color = 'var(--color-danger)';
    } finally {
        btnDetect.disabled = false;
    }
});

// Start Conversion
btnStart.addEventListener('click', () => {
    if (!currentInputPath) {
        alert('请先选择一个 SVG 文件');
        return;
    }

    const config = {
        inputPath: currentInputPath,
        outputPath: currentOutputPath || currentInputPath.replace('.svg', '.gif'),
        width: parseInt(document.getElementById('width').value),
        height: parseInt(document.getElementById('height').value),
        fps: parseInt(document.getElementById('fps').value),
        duration: parseInt(document.getElementById('duration').value),
        quality: parseInt(qualityInput.value),
        maxSizeMB: parseFloat(maxSizeInput.value)
    };

    // UI Reset
    btnStart.disabled = true;
    resultArea.style.display = 'none';
    progressBar.style.display = 'block';
    progressFill.style.width = '0%';
    statusText.textContent = '初始化...';

    window.electronAPI.startConversion(config);
});

// Listeners
window.electronAPI.onProgress((data) => {
    statusText.textContent = data.status;
    progressFill.style.width = `${data.progress}%`;
});

window.electronAPI.onComplete((result) => {
    statusText.textContent = '完成!';
    progressFill.style.width = '100%';
    btnStart.disabled = false;
    resultArea.style.display = 'block';
    
    // 显示文件大小信息
    const sizeMB = result.sizeMB || (result.size / (1024 * 1024)).toFixed(2);
    const maxSize = parseFloat(maxSizeInput.value);
    
    let sizeHTML = `<div>文件大小: <span class="highlight">${sizeMB} MB</span></div>`;
    
    if (result.compressed) {
        const savedMB = (result.originalSizeMB - sizeMB).toFixed(2);
        const savedPercent = ((1 - sizeMB / result.originalSizeMB) * 100).toFixed(1);
        sizeHTML += `<div class="success">✓ 已自动压缩 (原: ${result.originalSizeMB} MB, 节省: ${savedMB} MB / ${savedPercent}%)</div>`;
    } else if (parseFloat(sizeMB) > maxSize) {
        sizeHTML += `<div class="warning">⚠ 文件超过 ${maxSize} MB，建议降低质量或分辨率</div>`;
    } else {
        sizeHTML += `<div class="success">✓ 文件大小符合要求</div>`;
    }
    
    sizeInfo.innerHTML = sizeHTML;
    
    // Update open folder button
    const finalPath = result.path || result;
    btnOpenFolder.onclick = () => window.electronAPI.showItem(finalPath);
});

window.electronAPI.onError((msg) => {
    statusText.textContent = `错误: ${msg}`;
    statusText.style.color = '#da3633';
    btnStart.disabled = false;
});

