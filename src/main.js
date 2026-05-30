// @ts-nocheck
import App from './App.svelte'
import './app.scss'
import { mount } from 'svelte'

const app = mount(App, {
  target: document.getElementById('app'),
  // props: { someProp: 'value' }
});

export default app
