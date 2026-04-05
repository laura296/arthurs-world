import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// One-time purge of poisoned image caches from old service worker.
// The old SW cached 404 responses for images that didn't exist yet.
// This deletes those caches so fresh images load from the network.
(async () => {
  try {
    const cacheNames = await caches.keys();
    const stale = cacheNames.filter(n => n === 'images' || n.includes('workbox-precache'));
    await Promise.all(stale.map(n => caches.delete(n)));
    if (stale.length) {
      console.log('[cache-purge] Cleared stale caches:', stale);
    }
    // Also force service worker update
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.update();
  } catch {}
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
