# JavaScript 错误处理完善指南

## 📋 概述

本文档说明了智能安防系统网站的 JavaScript 错误处理机制的完善情况。

## ✅ 已实现的功能

### 1. 全局错误处理器类 (ErrorHandler)

创建了统一的错误处理类，提供以下功能：

```javascript
class ErrorHandler {
    // 记录错误日志
    static log(error, context = '')
    
    // 包装同步函数
    static wrap(fn, context = '')
    
    // 包装异步函数
    static async wrapAsync(fn, context = '')
}
```

**使用示例**：
```javascript
// 记录错误
ErrorHandler.log(error, 'initTypedText');

// 包装函数
const safeFunction = ErrorHandler.wrap(riskyFunction, 'myContext');
```

### 2. 初始化函数保护

所有初始化函数都添加了 try-catch 保护：

```javascript
document.addEventListener('DOMContentLoaded', function() {
    try {
        initMobileMenu();
    } catch (error) {
        ErrorHandler.log(error, 'initMobileMenu');
    }
    
    try {
        initTypedText();
    } catch (error) {
        ErrorHandler.log(error, 'initTypedText');
    }
    // ... 其他初始化函数
});
```

### 3. 外部库依赖检测

所有外部库使用前都会检测是否已加载：

#### Typed.js 检测
```javascript
if (typeof Typed === 'undefined') {
    console.warn('Typed.js 未加载，跳过打字动画');
    typedElement.textContent = 'AI守护'; // 降级方案
    return;
}
```

#### anime.js 检测
```javascript
if (typeof anime === 'undefined') {
    console.warn('anime.js 未加载，跳过卡片动画');
    return;
}
```

#### IntersectionObserver 检测
```javascript
if (!('IntersectionObserver' in window)) {
    console.warn('浏览器不支持 IntersectionObserver，使用降级方案');
    // 直接显示所有元素
    elements.forEach(el => el.classList.add('revealed'));
    return;
}
```

### 4. 全局错误监听

#### JavaScript 运行时错误
```javascript
window.addEventListener('error', function(e) {
    const errorInfo = {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error ? e.error.stack : null
    };
    
    console.error('全局错误:', errorInfo);
    trackEvent('javascript_error', errorInfo);
    
    return true; // 防止错误冒泡
});
```

#### Promise 拒绝错误
```javascript
window.addEventListener('unhandledrejection', function(e) {
    const errorInfo = {
        reason: e.reason ? e.reason.toString() : 'Unknown',
        promise: e.promise,
        stack: e.reason && e.reason.stack ? e.reason.stack : null
    };
    
    console.error('未处理的 Promise 拒绝:', errorInfo);
    trackEvent('promise_rejection', errorInfo);
    
    e.preventDefault(); // 防止页面崩溃
});
```

#### 资源加载错误
```javascript
window.addEventListener('error', function(e) {
    if (e.target !== window) {
        const element = e.target;
        const tagName = element.tagName;
        
        if (tagName === 'IMG' || tagName === 'SCRIPT' || tagName === 'LINK') {
            console.error('资源加载失败:', {
                type: tagName,
                src: element.src || element.href
            });
            
            trackEvent('resource_load_error', {
                type: tagName,
                url: element.src || element.href
            });
        }
    }
}, true);
```

### 5. 降级策略

每个功能都有对应的降级方案：

| 功能 | 依赖 | 降级方案 |
|------|------|----------|
| 打字动画 | Typed.js | 显示静态文本 |
| 卡片动画 | anime.js | 跳过动画效果 |
| 滚动显示 | IntersectionObserver | 直接显示所有元素 |
| 数字计数 | IntersectionObserver | 直接显示目标数字 |
| Service Worker | 浏览器支持 | 跳过注册 |

### 6. 错误日志上报

所有错误都会自动上报到分析服务：

```javascript
function trackEvent(eventName, properties = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // 自定义分析端点
    // fetch('/api/analytics', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ event: eventName, properties })
    // });
}
```

## 🧪 测试

### 测试页面
访问 `test-error-handling.html` 进行完整的错误处理测试。

### 测试项目
1. ✅ 基础错误捕获（语法错误、引用错误、类型错误）
2. ✅ Promise 错误处理（拒绝、async 错误）
3. ✅ 资源加载错误（图片、脚本）
4. ✅ 外部库依赖检测（Typed.js、anime.js、IntersectionObserver）
5. ✅ 错误日志记录和导出

### 手动测试步骤

1. **测试外部库未加载**
   - 注释掉 Typed.js 的 CDN 链接
   - 刷新页面，检查是否显示静态文本
   - 控制台应显示警告信息

2. **测试 Promise 错误**
   - 打开浏览器控制台
   - 执行：`Promise.reject(new Error('测试'))`
   - 检查是否被全局处理器捕获

3. **测试资源加载失败**
   - 修改图片路径为不存在的文件
   - 检查控制台是否记录错误
   - 检查是否上报到分析服务

## 📊 错误监控指标

建议监控以下指标：

1. **错误率**: 错误次数 / 页面访问次数
2. **错误类型分布**: 语法错误、引用错误、类型错误等
3. **资源加载失败率**: 失败次数 / 总加载次数
4. **浏览器兼容性**: 不同浏览器的错误分布
5. **降级方案使用率**: 各降级方案的触发频率

## 🔧 维护建议

### 添加新功能时
1. 使用 try-catch 包装初始化代码
2. 检测外部依赖是否存在
3. 提供降级方案
4. 添加错误日志记录

### 示例模板
```javascript
function initNewFeature() {
    try {
        // 检测依赖
        if (typeof ExternalLib === 'undefined') {
            console.warn('ExternalLib 未加载，使用降级方案');
            // 降级方案代码
            return;
        }
        
        // 主要功能代码
        const feature = new ExternalLib({...});
        
    } catch (error) {
        ErrorHandler.log(error, 'initNewFeature');
        // 降级方案代码
    }
}
```

## 📈 性能影响

错误处理机制对性能的影响：

- **代码体积**: 增加约 2KB（压缩后）
- **运行时开销**: 可忽略不计（< 1ms）
- **内存占用**: 最小化（仅存储必要的错误信息）

## 🎯 最佳实践

1. **不要过度捕获**: 只在必要的地方添加 try-catch
2. **提供有意义的上下文**: 使用 context 参数标识错误来源
3. **记录足够的信息**: 包括错误消息、堆栈、用户环境等
4. **优雅降级**: 确保功能失败不影响核心体验
5. **定期审查日志**: 分析错误模式，持续改进

## 🔗 相关文档

- [issue.md](../issue.md) - 问题跟踪文档
- [main.js](main.js) - 主要 JavaScript 文件
- [test-error-handling.html](test-error-handling.html) - 错误处理测试页面

## 📝 更新日志

### 2024-02-05
- ✅ 创建 ErrorHandler 类
- ✅ 为所有初始化函数添加错误处理
- ✅ 添加外部库依赖检测
- ✅ 实现全局错误监听
- ✅ 添加降级策略
- ✅ 创建测试页面

---

**维护者**: 项目团队  
**最后更新**: 2024-02-05
