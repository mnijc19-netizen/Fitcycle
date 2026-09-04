import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Enable iOS WebKit Standalone WebApp :active pseudo-class & touch animation response
if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', () => {}, { passive: true });
}

createApp(App).mount('#app')
