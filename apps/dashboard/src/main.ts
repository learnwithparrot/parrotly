import "./app.css";
import App from './App.svelte'
import { initFirebase } from './firestore-init';

initFirebase();

const app = new App({
  target: document.getElementById('app')
})

export default app
