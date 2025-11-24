const puppeteer = require('puppeteer');
const GifEncoder = require('gif-encoder');
const pngFileStream = require('png-file-stream');
const fs = require('fs');
const path = require('path');

/**
 * 检测 SVG 的尺寸和动画时长
 */
async function detectSvgInfo(inputPath) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const fileUrl = `file://${inputPath}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    // 在浏览器中执行代码来检测尺寸和动画时长
    const info = await page.evaluate(() => {
        const svg = document.querySelector('svg');
        
        // 获取 SVG 尺寸
        let width = 0;
        let height = 0;
        
        if (svg) {
            // 优先使用 viewBox
            const viewBox = svg.getAttribute('viewBox');
            if (viewBox) {
                const parts = viewBox.split(/\s+|,/);
                width = parseFloat(parts[2]) || 0;
                height = parseFloat(parts[3]) || 0;
            }
            
            // 如果没有 viewBox，使用 width/height 属性
            if (!width || !height) {
                width = parseFloat(svg.getAttribute('width')) || svg.clientWidth || 800;
                height = parseFloat(svg.getAttribute('height')) || svg.clientHeight || 600;
            }
        }
        
        // 获取动画时长
        const animations = document.getAnimations({ subtree: true });
        let maxDuration = 0;
        
        if (animations.length > 0) {
            animations.forEach(anim => {
                const timing = anim.effect?.getTiming();
                if (timing) {
                    const animDuration = (timing.delay || 0) + 
                                       (timing.duration || 0) * (timing.iterations || 1);
                    
                    if (timing.iterations === Infinity) {
                        const singleDuration = (timing.delay || 0) + (timing.duration || 0);
                        maxDuration = Math.max(maxDuration, singleDuration);
                    } else {
                        maxDuration = Math.max(maxDuration, animDuration);
                    }
                }
            });
        }
        
        return {
            width: Math.round(width),
            height: Math.round(height),
            duration: Math.ceil(maxDuration / 1000)
        };
    });
    
    await browser.close();
    return info;
}

/**
 * 根据原始尺寸生成推荐的压缩尺寸
 */
function generateRecommendedSizes(originalWidth, originalHeight) {
    const recommendations = [];
    
    // 计算宽高比
    const aspectRatio = originalWidth / originalHeight;
    
    // 100% 原始尺寸
    recommendations.push({
        label: '原始尺寸 (100%)',
        width: originalWidth,
        height: originalHeight,
        scale: 1.0,
        quality: 10,
        scenario: '高质量演示'
    });
    
    // 75% 压缩
    const width75 = Math.round(originalWidth * 0.75);
    const height75 = Math.round(originalHeight * 0.75);
    recommendations.push({
        label: '推荐尺寸 (75%)',
        width: width75,
        height: height75,
        scale: 0.75,
        quality: 10,
        scenario: '网页展示',
        recommended: true
    });
    
    // 50% 压缩
    const width50 = Math.round(originalWidth * 0.5);
    const height50 = Math.round(originalHeight * 0.5);
    recommendations.push({
        label: '压缩尺寸 (50%)',
        width: width50,
        height: height50,
        scale: 0.5,
        quality: 12,
        scenario: '邮件附件'
    });
    
    // 小尺寸（适合社交媒体）
    let smallWidth, smallHeight;
    if (aspectRatio > 1) {
        // 横向图
        smallWidth = Math.min(600, Math.round(originalWidth * 0.3));
        smallHeight = Math.round(smallWidth / aspectRatio);
    } else {
        // 纵向图
        smallHeight = Math.min(600, Math.round(originalHeight * 0.3));
        smallWidth = Math.round(smallHeight * aspectRatio);
    }
    
    recommendations.push({
        label: '小尺寸 (社交媒体)',
        width: smallWidth,
        height: smallHeight,
        scale: smallWidth / originalWidth,
        quality: 15,
        scenario: '微信/朋友圈'
    });
    
    return recommendations;
}

/**
 * 检测 SVG 动画的实际时长（保留兼容性）
 */
async function detectAnimationDuration(inputPath) {
    const info = await detectSvgInfo(inputPath);
    return info.duration;
}

// Revert to using 'gifencoder' + 'png-file-stream' pipeline which is streaming and memory efficient.
// Although 'gifencoder' documentation mentions canvas, it can work with pure streams of PNGs via 'png-file-stream'
// without needing the 'canvas' library installed explicitly if we don't use the canvas-dependent methods.
// The 'png-file-stream' decodes PNGs and pipes raw data to 'gifencoder'.
// This was our ORIGINAL approach which is actually robust, provided 'canvas' is NOT required for this specific pipeline.
// Let's verify: 'gifencoder' constructor takes width/height. 'createWriteStream' takes options.
// It seems 'gifencoder' might internally require 'canvas' for some operations, but let's try.
// If 'gifencoder' strictly requires 'canvas' package to be present, we are in trouble.
// Wait! 'gifencoder' package has 'canvas' as a dependency in its package.json?
// Checking npm... 'gifencoder' depends on 'canvas'. So it will try to install it.
// We need a Pure JS GIF encoder.
// 'gif-encoder' (with hyphen) IS pure JS, but has memory limits.
// We fixed the memory limit in the code by increasing highWaterMark.
// Let's stick with 'gif-encoder' (with hyphen) but fix the code usage.

// ... user previously had "Error: GIF memory limit exceeded". 
// I updated converter.js to use highWaterMark, but I need to make sure package.json uses 'gif-encoder' (hyphen).

async function convertSvgToGif(options, onProgress) {
    const { 
        inputPath, 
        outputPath, 
        width, 
        height, 
        fps, 
        duration,
        quality = 10,  // GIF 质量 (1-20, 越小质量越好但文件越大)
        maxSizeMB = 10 // 最大文件大小限制 (MB)
    } = options;

    const tmpDir = path.join(path.dirname(outputPath), 'temp_frames');

    // 1. Prepare directories
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    } else {
        const files = fs.readdirSync(tmpDir);
        for (const file of files) {
            fs.unlinkSync(path.join(tmpDir, file));
        }
    }

    onProgress({ status: '启动浏览器...', progress: 5 });

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // 2. Load SVG
    const fileUrl = `file://${inputPath}`;
    onProgress({ status: `加载 SVG...`, progress: 10 });
    
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // 3. Prepare for recording
    onProgress({ status: '准备动画控制...', progress: 15 });
    
    await page.evaluate(() => {
        const animations = document.getAnimations({ subtree: true });
        animations.forEach(anim => {
            anim.pause();
            anim.currentTime = 0;
        });
    });

    // 4. Capture frames
    const totalFrames = duration * fps;
    onProgress({ status: `开始录制 (${totalFrames} 帧)...`, progress: 20 });

    const frames = [];

    for (let i = 0; i < totalFrames; i++) {
        const currentTime = (i / fps) * 1000; // ms

        await page.evaluate((time) => {
            document.getAnimations({ subtree: true }).forEach(anim => {
                anim.currentTime = time;
            });
        }, currentTime);

        const framePath = path.join(tmpDir, `frame-${i.toString().padStart(4, '0')}.png`);
        await page.screenshot({ path: framePath, omitBackground: false });
        frames.push(framePath);

        const percent = 20 + (i / totalFrames) * 40; 
        if (i % 5 === 0) { 
            onProgress({ status: `录制帧: ${i + 1}/${totalFrames}`, progress: percent });
        }
    }

    await browser.close();
    onProgress({ status: '截图完成，开始编码 GIF...', progress: 60 });

    // 5. Create GIF
    // Using 'gif-encoder' (Pure JS) with memory fix
    // We must require it dynamically to avoid issues if not installed yet
    const GifEncoder = require('gif-encoder');
    const { PNG } = require('pngjs');

    return new Promise((resolve, reject) => {
        try {
            const fileStream = fs.createWriteStream(outputPath);
            // Increase buffer size to 10MB to be safe for large frames
            const gif = new GifEncoder(width, height, { highWaterMark: 10 * 1024 * 1024 });
            
            gif.pipe(fileStream);
            gif.setFrameRate(fps);
            gif.setRepeat(0); 
            gif.setQuality(quality); // 使用用户指定的质量参数
            gif.writeHeader();

            let processedCount = 0;

            const processNextFrame = () => {
                if (processedCount >= frames.length) {
                    gif.finish();
                    return;
                }

                const framePath = frames[processedCount];
                
                fs.createReadStream(framePath)
                    .pipe(new PNG())
                    .on('parsed', function() {
                        try {
                            gif.addFrame(this.data);
                            
                            processedCount++;
                            const percent = 60 + (processedCount / frames.length) * 40;
                            
                            if (processedCount % 5 === 0 || processedCount === frames.length) {
                                onProgress({ 
                                    status: `合成帧: ${processedCount}/${frames.length}`, 
                                    progress: percent 
                                });
                            }

                            // Force immediate garbage collection hint and delay
                            // to let the stream drain
                            setTimeout(processNextFrame, 10);
                            
                        } catch (e) {
                            reject(e);
                        }
                    })
                    .on('error', reject);
            };

            fileStream.on('close', () => {
                try {
                    frames.forEach(f => fs.unlinkSync(f));
                    fs.rmdirSync(tmpDir);
                } catch(e) {}
                
                // 检查文件大小
                const stats = fs.statSync(outputPath);
                const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
                
                onProgress({ status: '完成!', progress: 100 });
                resolve({
                    path: outputPath,
                    size: stats.size,
                    sizeMB: fileSizeInMB
                });
            });

            fileStream.on('error', reject);

            processNextFrame();

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 根据目标大小自动调整参数并重新生成 GIF
 */
async function autoCompressGif(originalOptions, targetSizeMB, onProgress) {
    const originalResult = originalOptions.result;
    const originalSizeMB = parseFloat(originalResult.sizeMB);
    
    if (originalSizeMB <= targetSizeMB) {
        return originalResult; // 已经满足要求
    }
    
    onProgress({ status: `文件过大 (${originalSizeMB}MB), 自动优化中...`, progress: 5 });
    
    // 计算压缩比例
    const compressionRatio = targetSizeMB / originalSizeMB;
    
    // 策略：结合降低分辨率和增加质量参数
    let newWidth = originalOptions.width;
    let newHeight = originalOptions.height;
    let newQuality = originalOptions.quality || 10;
    
    // 如果需要压缩超过 50%，降低分辨率
    if (compressionRatio < 0.5) {
        const scaleFactor = Math.sqrt(compressionRatio * 1.2); // 稍微保守一点
        newWidth = Math.round(originalOptions.width * scaleFactor);
        newHeight = Math.round(originalOptions.height * scaleFactor);
        onProgress({ status: `降低分辨率: ${originalOptions.width}x${originalOptions.height} → ${newWidth}x${newHeight}`, progress: 20 });
    }
    
    // 调整质量参数（质量值越大文件越小，但画质越差）
    newQuality = Math.min(20, Math.round(newQuality + (1 - compressionRatio) * 15));
    
    onProgress({ status: `重新生成 GIF (质量: ${newQuality})...`, progress: 30 });
    
    // 使用新参数重新生成
    const compressedOptions = {
        ...originalOptions,
        width: newWidth,
        height: newHeight,
        quality: newQuality,
        outputPath: originalOptions.outputPath.replace('.gif', '_compressed.gif')
    };
    
    const result = await convertSvgToGif(compressedOptions, (progress) => {
        // 映射进度到 30-90%
        const mappedProgress = 30 + (progress.progress / 100) * 60;
        onProgress({ 
            status: progress.status, 
            progress: mappedProgress 
        });
    });
    
    onProgress({ status: '压缩完成!', progress: 100 });
    
    return {
        ...result,
        originalSize: originalResult.size,
        originalSizeMB: originalSizeMB,
        compressed: true
    };
}

module.exports = { 
    convertSvgToGif, 
    detectAnimationDuration, 
    detectSvgInfo,
    generateRecommendedSizes,
    autoCompressGif 
};
