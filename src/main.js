import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { initNetworkStatusListener } from './utils/networkStatus.js'
import { initMobileFullscreenCapsule } from './utils/mobileFullscreen.js'

// Enable iOS WebKit Standalone WebApp :active pseudo-class, touch response, and fullscreen capsule
if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', () => {}, { passive: true });
  initNetworkStatusListener();
  initMobileFullscreenCapsule();

  // Register PWA Service Worker for offline gym resilience in production
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.debug('[FitCycle SW] Registration info:', err);
      });
    });
  }
}

createApp(App).mount('#app')
