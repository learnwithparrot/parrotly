// import browser from 'webextension-polyfill';
import { getAuth, signInWithCredential, GoogleAuthProvider, OAuthCredential } from "firebase/auth";
import { StorageKeys } from "../constants";
import { setStorageItem } from "../storage";
import { authState, idToken } from 'rxfire/auth';
import { switchMap } from "rxjs/operators";
import { EMPTY, of } from "rxjs";



const auth = getAuth();
export const auth$ = authState(auth)//.pipe(switchMap(user => user ? of(user) : EMPTY))
export const authOrEMPTY$ = authState(auth).pipe(switchMap(user => user ? of(user) : EMPTY))
export const idToken$ = idToken(auth)

export function signInWithGoogle(credential: OAuthCredential) {
  setStorageItem(StorageKeys.auth_id_token, credential.idToken)

  //https://github.com/firebase/firebase-js-sdk/issues/4002#issuecomment-857796894
  const _credential = GoogleAuthProvider.credential(credential.idToken);
  signInWithCredentialInfo(_credential)
}

export function signInWithCredentialInfo(credential: OAuthCredential) {
  const auth = getAuth();
  return signInWithCredential(auth, credential)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // ...
      console.log({message:'Signing in with google credentials successful', result})
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      console.error({ error })
      // The AuthCredential type that was used.
      // ...
    });


}
