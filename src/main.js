// @ts-nocheck
import App from './App.svelte'
import './app.css'
import './app.scss'
import { mount } from 'svelte'
import '@lottiefiles/dotlottie-wc'

// The router rewrites the URL (dropping any query string) while it resolves
// deep links, so anything that wants the original params — like the SALE DAY
// preview hooks (?saleday / ?salein) — reads this snapshot instead.
window.__WAD_INITIAL_SEARCH = window.location.search;

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app
