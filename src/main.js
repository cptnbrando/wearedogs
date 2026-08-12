// @ts-nocheck
// First import, and pinned to its own chunk in vite.config.js: ES modules
// evaluate dependencies in import order, so every polyfilled built-in exists
// before the vendor chunk's module-level code runs on older Chromiums.
import './lib/potato-polyfills.js'
import App from './App.svelte'
import './app.css'
import './app.scss'
import { mount } from 'svelte'
import '@lottiefiles/dotlottie-wc'

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app
