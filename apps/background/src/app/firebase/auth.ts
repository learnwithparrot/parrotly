declare const browser:any;
// import browser from 'webextension-polyfill';
import { getAuth, signInWithCredential, GoogleAuthProvider, OAuthCredential } from "firebase/auth";
import { StorageKeys } from "../constants";
import { setStorageItem } from "../storage";

export function signInWithGoogle(credential: OAuthCredential) {
  setStorageItem(StorageKeys.auth_id_token, credential.idToken)
  browser.storage.local.set('auth_id_token', credential.idToken);

  //https://github.com/firebase/firebase-js-sdk/issues/4002#issuecomment-857796894
  const _credential = GoogleAuthProvider.credential(credential.idToken);
  signInWithCredentialInfo(_credential)
}

export function signInWithCredentialInfo(credential: OAuthCredential) {
  const auth = getAuth();
  setTimeout(() => {
    signInWithCredential(auth, credential)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        console.log({ result });
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        console.log({ error })
        // The AuthCredential type that was used.
        // ...
      });

  }, 1000);

}
