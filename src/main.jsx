import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Aggressively purge all caches and force service worker reset.
// Required because old SW cached 404 responses for images.
const CACHE_VERSION = 'v2';
(async () => {
  try {
    // Delete ALL caches
    const names = await caches.keys();
    await Promise.all(names.map(n => caches.delete(n)));
    if (names.length) console.log('[cache-purge] Deleted all caches:', names);

    // Unregister old service worker so it stops serving stale content
    const regs = await navigator.serviceWorker?.getRegistrations();
    if (regs?.length) {
      for (const reg of regs) {
        await reg.unregister();
      }
      console.log('[cache-purge] Unregistered old service workers');
      // Mark that we've purged so we don't loop
      if (!sessionStorage.getItem('cache-purged')) {
        sessionStorage.setItem('cache-purged', CACHE_VERSION);
        // Reload once to pick up fresh content without any SW interference
        window.location.reload();
        return;
      }
    }
  } catch (e) {
    console.warn('[cache-purge] Error:', e);
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
