// Main JavaScript for Security System Website

// 全局错误处理器
class ErrorHandler {
    static log(error, context = '') {
        const errorInfo = {
            message: error.message || String(error),
            context: context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.error(`[${context}] 错误:`, error);
        
        // 发送到分析服务
        if (typeof trackEvent !== 'undefined') {
            trackEvent('javascript_error', errorInfo);
        }
        
        return errorInfo;
    }
    
    static wrap(fn, context = '') {
        return function(...args) {
            try {
                return fn.apply(this, args);
            } catch (error) {
                ErrorHandler.log(error, context);
                return null;
            }
        };
    }
    
    static async wrapAsync(fn, context = '') {
        try {
            return await fn();
        } catch (error) {
            ErrorHandler.log(error, context);
            return null;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components with error handling
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
    
    try {
        initScrollReveal();
    } catch (error) {
        ErrorHandler.log(error, 'initScrollReveal');
    }
    
    try {
        initNumberCounters();
    } catch (error) {
        ErrorHandler.log(error, 'initNumberCounters');
    }
    
    try {
        initSolutionMatcher();
    } catch (error) {
        ErrorHandler.log(error, 'initSolutionMatcher');
    }
    
    try {
        initChatWidget();
    } catch (error) {
        ErrorHandler.log(error, 'initChatWidget');
    }
    
    try {
        initSmoothScroll();
    } catch (error) {
        ErrorHandler.log(error, 'initSmoothScroll');
    }
    
    try {
        initPainPointAnimations();
    } catch (error) {
        ErrorHandler.log(error, 'initPainPointAnimations');
    }
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Typed Text Animation
function initTypedText() {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;
    
    try {
        // 检查 Typed.js 是否已加载
        if (typeof Typed === 'undefined') {
            console.warn('Typed.js 未加载，跳过打字动画');
            typedElement.textContent = 'AI守护';
            return;
        }
        
        new Typed('#typed-text', {
            strings: ['AI守护', '智能预警', '零破坏改造'],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    } catch (error) {
        ErrorHandler.log(error, 'initTypedText');
        // 降级方案：显示静态文本
        typedElement.textContent = 'AI守护';
    }
}

// Scroll Reveal Animation
function initScrollReveal() {
    try {
        // 检查浏览器是否支持 IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            console.warn('浏览器不支持 IntersectionObserver，使用降级方案');
            // 降级方案：直接显示所有元素
            document.querySelectorAll('.scroll-reveal').forEach(el => {
                el.classList.add('revealed');
            });
            return;
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);
        
        // Observe all scroll-reveal elements
        const elements = document.querySelectorAll('.scroll-reveal');
        if (elements.length === 0) {
            console.info('未找到需要滚动显示的元素');
            return;
        }
        
        elements.forEach(el => {
            observer.observe(el);
        });
    } catch (error) {
        ErrorHandler.log(error, 'initScrollReveal');
        // 降级方案：直接显示所有元素
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            el.classList.add('revealed');
        });
    }
}

// Number Counter Animation
function initNumberCounters() {
    try {
        const counters = document.querySelectorAll('.number-counter');
        if (counters.length === 0) return;
        
        const animateCounter = (counter) => {
            try {
                const target = parseInt(counter.getAttribute('data-target'));
                if (isNaN(target)) {
                    console.warn('计数器目标值无效:', counter);
                    return;
                }
                
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 16);
            } catch (error) {
                ErrorHandler.log(error, 'animateCounter');
                // 降级方案：直接显示目标值
                const target = parseInt(counter.getAttribute('data-target'));
                if (!isNaN(target)) {
                    counter.textContent = target;
                }
            }
        };
        
        // 检查浏览器是否支持 IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            // 降级方案：直接动画所有计数器
            counters.forEach(counter => animateCounter(counter));
            return;
        }
        
        // Animate counters when they come into view
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    } catch (error) {
        ErrorHandler.log(error, 'initNumberCounters');
    }
}

// Solution Matcher Form
function initSolutionMatcher() {
    try {
        const form = document.getElementById('solution-matcher');
        if (!form) return;
        
        const resultDiv = document.getElementById('matcher-result');
        const investmentSpan = document.getElementById('investment');
        const savingsSpan = document.getElementById('savings');
        const paybackSpan = document.getElementById('payback');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
            
            const formData = new FormData(form);
            const scenario = formData.get('scenario');
            const cameras = parseInt(formData.get('cameras')) || 50;
            const area = parseInt(formData.get('area')) || 5000;
            
            // Calculate based on scenario
            let basePrice = 0;
            let annualSavings = 0;
            
            switch(scenario) {
                case 'heritage':
                    basePrice = cameras * 800 + area * 0.5;
                    annualSavings = cameras * 1200 + 50000;
                    break;
                case 'campus':
                    basePrice = cameras * 600 + area * 0.3;
                    annualSavings = cameras * 900 + 30000;
                    break;
                case 'school':
                    basePrice = cameras * 500 + area * 0.4;
                    annualSavings = cameras * 700 + 20000;
                    break;
                case 'commercial':
                    basePrice = cameras * 700 + area * 0.6;
                    annualSavings = cameras * 1000 + 40000;
                    break;
                default:
                    basePrice = cameras * 650 + area * 0.45;
                    annualSavings = cameras * 950 + 35000;
            }
            
            // Apply discount for existing equipment
            const existingEquipment = formData.getAll('existing[]');
            const discount = existingEquipment.length * 0.1; // 10% per equipment type
            const finalPrice = basePrice * (1 - discount);
            const paybackPeriod = finalPrice / annualSavings;
            
                // Update UI
                if (investmentSpan) investmentSpan.textContent = `¥${finalPrice.toLocaleString()}`;
                if (savingsSpan) savingsSpan.textContent = `¥${annualSavings.toLocaleString()}`;
                if (paybackSpan) paybackSpan.textContent = `${paybackPeriod.toFixed(1)}年`;
                
                if (resultDiv) {
                    resultDiv.classList.remove('hidden');
                    
                    // Animate the result
                    if (typeof anime !== 'undefined') {
                        anime({
                            targets: resultDiv,
                            opacity: [0, 1],
                            translateY: [20, 0],
                            duration: 500,
                            easing: 'easeOutQuad'
                        });
                    }
                }
                
                // Track conversion
                if (typeof trackEvent !== 'undefined') {
                    trackEvent('solution_matcher_completed', {
                        scenario,
                        cameras,
                        area,
                        price: finalPrice
                    });
                }
            } catch (error) {
                ErrorHandler.log(error, 'solutionMatcherSubmit');
                alert('计算出错，请稍后重试或联系客服');
            }
        });
    } catch (error) {
        ErrorHandler.log(error, 'initSolutionMatcher');
    }
}

// Chat Widget
function initChatWidget() {
    const chatBtn = document.getElementById('chat-btn');
    const chatPanel = document.getElementById('chat-panel');
    
    if (chatBtn && chatPanel) {
        chatBtn.addEventListener('click', function() {
            chatPanel.classList.toggle('hidden');
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', function(e) {
            if (!chatBtn.contains(e.target) && !chatPanel.contains(e.target)) {
                chatPanel.classList.add('hidden');
            }
        });
    }
}

// Smooth Scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Pain Point Card Animations
function initPainPointAnimations() {
    try {
        const painPointCards = document.querySelectorAll('.pain-point-card');
        if (painPointCards.length === 0) return;
        
        // 检查 anime.js 是否已加载
        if (typeof anime === 'undefined') {
            console.warn('anime.js 未加载，跳过卡片动画');
            return;
        }
        
        painPointCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                try {
                    const svg = this.querySelector('svg');
                    if (svg) {
                        anime({
                            targets: svg,
                            scale: [1, 1.2],
                            rotate: [0, 10],
                            duration: 300,
                            easing: 'easeOutQuad'
                        });
                    }
                } catch (error) {
                    ErrorHandler.log(error, 'painPointCardHover');
                }
            });
            
            card.addEventListener('mouseleave', function() {
                try {
                    const svg = this.querySelector('svg');
                    if (svg) {
                        anime({
                            targets: svg,
                            scale: [1.2, 1],
                            rotate: [10, 0],
                            duration: 300,
                            easing: 'easeOutQuad'
                        });
                    }
                } catch (error) {
                    ErrorHandler.log(error, 'painPointCardLeave');
                }
            });
        });
    } catch (error) {
        ErrorHandler.log(error, 'initPainPointAnimations');
    }
}

// Consult Button Handler
document.addEventListener('DOMContentLoaded', function() {
    const consultBtn = document.getElementById('consult-btn');
    if (consultBtn) {
        consultBtn.addEventListener('click', function() {
            // Scroll to chat widget
            const chatWidget = document.getElementById('chat-widget');
            if (chatWidget) {
                chatWidget.scrollIntoView({ behavior: 'smooth' });
                // Open chat panel
                setTimeout(() => {
                    const chatPanel = document.getElementById('chat-panel');
                    if (chatPanel) {
                        chatPanel.classList.remove('hidden');
                    }
                }, 1000);
            }
            
            trackEvent('consult_button_clicked');
        });
    }
});

// Chat Functions
function startChat(type) {
    const messages = {
        price: '您好!我是专业的安防顾问,很高兴为您提供报价方案。请告诉我您的具体需求,如监控点位数量、使用场景等,我会为您制定最优方案。',
        demo: '您好!我们的产品演示可以帮您更直观地了解系统功能。演示大约需要30分钟,包含功能介绍和案例分享。请留下您的联系方式,我会安排专业顾问与您联系。',
        tech: '您好!我是技术专家,可以为您解答技术相关问题。我们的系统采用AI深度学习算法,支持99%识别准确率。您有什么具体的技术疑问吗?',
        case: '您好!我们在古村落保护、企业园区、智慧校园等场景都有成功案例。特别是黄山宏村、西递古村等文物保护项目,获得了文物局的高度认可。您想了解哪个场景的案例?'
    };
    
    alert(messages[type] || '您好!很高兴为您服务。请留下您的联系方式,我们会安排专业顾问与您联系。');
    
    trackEvent('chat_started', { type });
}

// Analytics Tracking
function trackEvent(eventName, properties = {}) {
    // Send data to analytics service
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Example: Custom analytics endpoint
    // fetch('/api/analytics', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ event: eventName, properties })
    // });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        trackEvent('page_load_time', { loadTime: Math.round(loadTime) });
    });
    
    // Monitor scroll depth
    let maxScrollDepth = 0;
    const trackScroll = debounce(() => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            trackEvent('scroll_depth', { depth: scrollDepth });
        }
    }, 1000);
    
    window.addEventListener('scroll', trackScroll);
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Service Worker 注册
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.info('浏览器不支持 Service Worker');
        return;
    }
    
    try {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker 注册成功:', registration.scope);
                    
                    // 检查更新
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('发现新版本 Service Worker');
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // 新版本可用，提示用户刷新
                                if (confirm('网站有新版本可用，是否立即更新？')) {
                                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                                    window.location.reload();
                                }
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('Service Worker 注册失败:', error);
                    ErrorHandler.log(error, 'registerServiceWorker');
                });
            
            // 监听 Service Worker 控制器变化
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Service Worker 控制器已更新');
            });
        });
    } catch (error) {
        ErrorHandler.log(error, 'registerServiceWorker');
    }
}

// 注册 Service Worker
registerServiceWorker();

// 缓存管理工具
window.CacheManager = {
    // 清除所有缓存
    clearAll() {
        // 清除 Service Worker 缓存
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
        }
        
        // 清除 localStorage 缓存
        ImageCache.cleanup();
        
        console.log('所有缓存已清除');
    },
    
    // 获取缓存大小
    async getSize() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            const usage = estimate.usage || 0;
            const quota = estimate.quota || 0;
            const percentUsed = (usage / quota * 100).toFixed(2);
            
            return {
                usage: formatBytes(usage),
                quota: formatBytes(quota),
                percentUsed: percentUsed + '%'
            };
        }
        return null;
    },
    
    // 预缓存资源列表
    async precache(urls) {
        if ('caches' in window) {
            const cache = await caches.open('precache-v1');
            await cache.addAll(urls);
            console.log('预缓存完成:', urls.length, '个资源');
        }
    }
};

// 格式化字节大小
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Enhanced Lazy Loading for Images
function initLazyLoading() {
    // 检查浏览器是否支持 IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // 降级方案：直接加载所有图片
        loadAllImages();
        return;
    }
    
    const config = {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.01
    };
    
    // 图片懒加载观察器
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                loadImage(element);
                observer.unobserve(element);
            }
        });
    }, config);
    
    // 观察所有懒加载图片
    const lazyImages = document.querySelectorAll('img[data-src], [data-bg]');
    lazyImages.forEach(element => {
        imageObserver.observe(element);
    });
    
    // 预加载关键图片（首屏图片）
    preloadCriticalImages();
}

// 加载单个图片元素
function loadImage(element) {
    const isImg = element.tagName === 'IMG';
    
    if (isImg) {
        // 处理 <img> 标签
        const src = element.dataset.src;
        const srcset = element.dataset.srcset;
        
        if (src) {
            // 添加加载动画
            element.classList.add('loading');
            
            // 创建新图片对象预加载
            const img = new Image();
            
            img.onload = () => {
                element.src = src;
                if (srcset) {
                    element.srcset = srcset;
                }
                element.classList.remove('lazy', 'loading');
                element.classList.add('loaded');
                
                // 添加淡入动画
                element.style.opacity = '0';
                setTimeout(() => {
                    element.style.transition = 'opacity 0.3s ease-in';
                    element.style.opacity = '1';
                }, 10);
            };
            
            img.onerror = () => {
                element.classList.remove('loading');
                element.classList.add('error');
                console.error('图片加载失败:', src);
            };
            
            img.src = src;
            if (srcset) {
                img.srcset = srcset;
            }
        }
    } else {
        // 处理背景图片
        const bg = element.dataset.bg;
        if (bg) {
            element.style.backgroundImage = `url('${bg}')`;
            element.classList.remove('lazy');
            element.classList.add('loaded');
        }
    }
}

// 降级方案：直接加载所有图片
function loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src], [data-bg]');
    lazyImages.forEach(element => {
        loadImage(element);
    });
}

// 预加载关键图片（首屏图片）
function preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('[data-priority="high"]');
    criticalImages.forEach(element => {
        loadImage(element);
    });
}

// 图片缓存管理
const ImageCache = {
    // 缓存键前缀
    CACHE_PREFIX: 'img_cache_',
    CACHE_VERSION: 'v1',
    CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7天
    
    // 生成缓存键
    getCacheKey(url) {
        return `${this.CACHE_PREFIX}${this.CACHE_VERSION}_${url}`;
    },
    
    // 保存到缓存
    set(url, data) {
        try {
            const cacheData = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(this.getCacheKey(url), JSON.stringify(cacheData));
        } catch (e) {
            console.warn('缓存保存失败:', e);
        }
    },
    
    // 从缓存获取
    get(url) {
        try {
            const cached = localStorage.getItem(this.getCacheKey(url));
            if (!cached) return null;
            
            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;
            
            // 检查是否过期
            if (age > this.CACHE_DURATION) {
                this.remove(url);
                return null;
            }
            
            return cacheData.data;
        } catch (e) {
            console.warn('缓存读取失败:', e);
            return null;
        }
    },
    
    // 删除缓存
    remove(url) {
        try {
            localStorage.removeItem(this.getCacheKey(url));
        } catch (e) {
            console.warn('缓存删除失败:', e);
        }
    },
    
    // 清理过期缓存
    cleanup() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.CACHE_PREFIX)) {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        const cacheData = JSON.parse(cached);
                        const age = Date.now() - cacheData.timestamp;
                        if (age > this.CACHE_DURATION) {
                            localStorage.removeItem(key);
                        }
                    }
                }
            });
        } catch (e) {
            console.warn('缓存清理失败:', e);
        }
    }
};

// 初始化缓存清理
ImageCache.cleanup();

// Initialize lazy loading
initLazyLoading();

// Global Error Handling
window.addEventListener('error', function(e) {
    const errorInfo = {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error ? e.error.stack : null
    };
    
    console.error('全局错误:', errorInfo);
    
    // Log errors to analytics service
    if (typeof trackEvent !== 'undefined') {
        trackEvent('javascript_error', errorInfo);
    }
    
    // 防止错误冒泡导致页面崩溃
    return true;
});

// Unhandled Promise Rejection
window.addEventListener('unhandledrejection', function(e) {
    const errorInfo = {
        reason: e.reason ? e.reason.toString() : 'Unknown',
        promise: e.promise,
        stack: e.reason && e.reason.stack ? e.reason.stack : null
    };
    
    console.error('未处理的 Promise 拒绝:', errorInfo);
    
    // Log promise rejections to analytics service
    if (typeof trackEvent !== 'undefined') {
        trackEvent('promise_rejection', errorInfo);
    }
    
    // 防止未处理的 Promise 导致页面崩溃
    e.preventDefault();
});

// 资源加载错误处理
window.addEventListener('error', function(e) {
    if (e.target !== window) {
        const element = e.target;
        const tagName = element.tagName;
        
        if (tagName === 'IMG' || tagName === 'SCRIPT' || tagName === 'LINK') {
            console.error('资源加载失败:', {
                type: tagName,
                src: element.src || element.href,
                currentSrc: element.currentSrc
            });
            
            if (typeof trackEvent !== 'undefined') {
                trackEvent('resource_load_error', {
                    type: tagName,
                    url: element.src || element.href
                });
            }
        }
    }
}, true);

// Export functions for use in other pages
window.SecuritySystem = {
    trackEvent,
    startChat,
    debounce,
    initScrollReveal,
    initNumberCounters,
    ImageCache,
    CacheManager,
    loadImage,
    preloadCriticalImages
};