// @ts-nocheck
import App from './App.svelte'
import './app.css'
import './app.scss'
import { mount } from 'svelte'
import '@lottiefiles/dotlottie-wc'

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app
