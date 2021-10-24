
import './app/firebase/firestore-init'
import './app/create-context-menu.ts';
import './app/message.listeners'
import './app/event.listeners'
import { initBackgroundProcess } from './app/background-process'


(async function init() {
  initBackgroundProcess()
})()

