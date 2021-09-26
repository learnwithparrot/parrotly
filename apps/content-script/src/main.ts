import App from './App.svelte';
import { createFonts } from './create-fonts';


createFonts()
const container = document.createElement('div')
container.style.position="static"
container.style.all="initial"
document.body.appendChild(container)
const shadowRoot = container.attachShadow({ mode: 'open' })
const app = new App({
  target: shadowRoot,
});

export default app;
