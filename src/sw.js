/*
 * sw.js
 * Service Worker configuration for PulseFit app caching and offline PWA support.
 * Created: 2026-07-23
 */

const CACHE_NAME = 'pulsefit-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through network-first strategy for dynamic resources
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
