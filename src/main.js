// @ts-nocheck
import App from './App.svelte'
import './app.css'
import './app.scss'
import { mount } from 'svelte'
import '@lottiefiles/dotlottie-wc'

// The static boot screen (index.html) has done its job once we're here —
// Svelte mounts by appending into #app, so clear the placeholder first.
const boot = document.getElementById('wad-boot');
if (boot) boot.remove();

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app
