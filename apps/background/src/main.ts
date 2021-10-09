
import './app/firebase/firestore-init'
import './app/create-context-menu.ts';
import './app/message.listeners'
import './app/event.listeners'
import { getStorageItem } from './app/storage';
import { StorageKeys } from './app/constants';
import { GoogleAuthProvider } from '@firebase/auth';
import { signInWithCredentialInfo } from './app/firebase';


(async function init() {
  //https://github.com/firebase/firebase-js-sdk/issues/4002#issuecomment-857796894
  const idToken = await getStorageItem({ storageKey: StorageKeys.auth_id_token });
  if(!idToken)return;
  const _credential = GoogleAuthProvider.credential(idToken);
  signInWithCredentialInfo(_credential)
})()
