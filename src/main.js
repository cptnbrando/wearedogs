// @ts-nocheck
import App from './App.svelte'
import './app.css'
import './app.scss'
import { mount } from 'svelte'
import '@lottiefiles/dotlottie-wc'

const app = mount(App, {
  target: document.getElementById('app'),
});

// Keeps songs and images from data.wearedogs.net on the device (public/sw.js):
// replays cost no R2 request and work with no signal. Persistent storage stops
// the browser from clearing saved songs when the phone runs low on space.
// Production only: on the dev server a failed registration (embedded preview
// browsers can't fetch worker scripts at all) logs a console error that no
// .catch() can silence, and a worker caching songs mid-development only hides
// changes. The LAN dev origin isn't a secure context, so it never ran there.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}

export default app
