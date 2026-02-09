// Service Worker for Caching Strategy
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `security-system-${CACHE_VERSION}`;

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/features.html',
    '/solutions.html',
    '/technology.html',
    '/contact.html',
    '/main.js'
];

// 图片资源缓存策略：缓存优先
const IMAGE_CACHE = `${CACHE_NAME}-images`;
// 静态资源缓存策略：网络优先，失败时使用缓存
const STATIC_CACHE = `${CACHE_NAME}-static`;
// API 缓存策略：网络优先
const API_CACHE = `${CACHE_NAME}-api`;

// 安装事件：预缓存静态资源
self.addEventListener('install', (event) => {
    console.log('Service Worker 安装中...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('预缓存静态资源');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('Service Worker 激活中...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // 删除旧版本缓存
                        if (cacheName.startsWith('security-system-') && cacheName !== CACHE_NAME) {
                            console.log('删除旧缓存:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// 请求拦截：实现缓存策略
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 只处理同源请求
    if (url.origin !== location.origin) {
        return;
    }
    
    // 根据资源类型选择缓存策略
    if (isImageRequest(request)) {
        // 图片：缓存优先策略
        event.respondWith(cacheFirst(request, IMAGE_CACHE));
    } else if (isAPIRequest(request)) {
        // API：网络优先策略
        event.respondWith(networkFirst(request, API_CACHE));
    } else {
        // 其他静态资源：网络优先，失败时使用缓存
        event.respondWith(networkFirst(request, STATIC_CACHE));
    }
});

// 判断是否为图片请求
function isImageRequest(request) {
    return request.destination === 'image' || 
           /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(request.url);
}

// 判断是否为 API 请求
function isAPIRequest(request) {
    return request.url.includes('/api/');
}

// 缓存优先策略（适合图片等不常变化的资源）
async function cacheFirst(request, cacheName) {
    // 先查找缓存
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // 缓存未命中，从网络获取
    try {
        const networkResponse = await fetch(request);
        
        // 只缓存成功的响应
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            // 克隆响应，因为响应只能使用一次
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('网络请求失败:', error);
        // 返回离线页面或默认图片
        return new Response('Network error', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// 网络优先策略（适合经常更新的资源）
async function networkFirst(request, cacheName) {
    try {
        // 先尝试从网络获取
        const networkResponse = await fetch(request);
        
        // 更新缓存
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('网络请求失败，使用缓存:', error);
        
        // 网络失败，使用缓存
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // 缓存也没有，返回错误
        return new Response('Offline - No cached version available', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// 监听消息事件（用于手动清理缓存）
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            })
        );
    }
});
