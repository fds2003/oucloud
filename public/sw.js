/**
 * OUCloud 纯前端在线工具平台 - 离线 Service Worker
 * 目标：实现已安装 PWA 在完全断网 / 涉密隔离环境下的 0 毫秒离线秒开可用。
 */

// CACHE_NAME 由 vite.config.ts 的 bumpSwCacheVersion 插件在构建期替换为
// 入口 chunk hash（'oucloud-<hash>'），代码变更即自动失效重建离线缓存；
// 此处的固定值仅作为开发期兜底，请勿手动维护版本号。
const CACHE_NAME = 'oucloud-v1'

const STATIC_SHELL_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/favicon.ico',
]

// 安装阶段：预缓存核心骨架资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_SHELL_ASSETS)
    }).then(() => {
      return self.skipWaiting()
    })
  )
})

// 激活阶段：清理过期的旧版本缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// 请求拦截阶段
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 只处理 GET 请求及同源资源
  // 只处理 GET 请求及同源资源，排除 Vite 内部与开发期实时编译模块
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.search.includes('t=')
  ) {
    return
  }

  // 1. 页面导航请求 (HTML Document): Network-first，离线时回退到本地缓存或首页
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(async () => {
          // 断网时优先返回该 URL 缓存，若无则返回已缓存的首页
          const cachedResponse = await caches.match(request)
          if (cachedResponse) return cachedResponse
          return (await caches.match('/')) || Response.error()
        })
    )
    return
  }

  // 2. 静态资源 (JS, CSS, 图片, 字体等): Stale-While-Revalidate 策略
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone)
            })
          }
          return networkResponse
        })
        .catch(() => {
          // 离线时网络拉取失败是预期表现，静默返回已有的缓存
          return cachedResponse
        })

      return cachedResponse || fetchPromise
    })
  )
})
