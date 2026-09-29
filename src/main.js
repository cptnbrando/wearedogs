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
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}

export default app
