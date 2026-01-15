// Main JavaScript for Security System Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initTypedText();
    initScrollReveal();
    initNumberCounters();
    initSolutionMatcher();
    initChatWidget();
    initSmoothScroll();
    initPainPointAnimations();
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
    if (typedElement) {
        new Typed('#typed-text', {
            strings: ['AI守护', '智能预警', '零破坏改造'],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Scroll Reveal Animation
function initScrollReveal() {
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
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Number Counter Animation
function initNumberCounters() {
    const counters = document.querySelectorAll('.number-counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
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
    };
    
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
}

// Solution Matcher Form
function initSolutionMatcher() {
    const form = document.getElementById('solution-matcher');
    const resultDiv = document.getElementById('matcher-result');
    const investmentSpan = document.getElementById('investment');
    const savingsSpan = document.getElementById('savings');
    const paybackSpan = document.getElementById('payback');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
            investmentSpan.textContent = `¥${finalPrice.toLocaleString()}`;
            savingsSpan.textContent = `¥${annualSavings.toLocaleString()}`;
            paybackSpan.textContent = `${paybackPeriod.toFixed(1)}年`;
            
            resultDiv.classList.remove('hidden');
            
            // Animate the result
            anime({
                targets: resultDiv,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 500,
                easing: 'easeOutQuad'
            });
            
            // Track conversion
            trackEvent('solution_matcher_completed', {
                scenario,
                cameras,
                area,
                price: finalPrice
            });
        });
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
    const painPointCards = document.querySelectorAll('.pain-point-card');
    
    painPointCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this.querySelector('svg'),
                scale: [1, 1.2],
                rotate: [0, 10],
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this.querySelector('svg'),
                scale: [1.2, 1],
                rotate: [10, 0],
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
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
    // In a real implementation, this would send data to analytics service
    console.log('Event tracked:', eventName, properties);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
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

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// Unhandled Promise Rejection
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    trackEvent('promise_rejection', {
        reason: e.reason.toString()
    });
});

// Export functions for use in other pages
window.SecuritySystem = {
    trackEvent,
    startChat,
    debounce,
    initScrollReveal,
    initNumberCounters
};