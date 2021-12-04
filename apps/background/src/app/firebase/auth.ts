// import browser from 'webextension-polyfill';
import { getAuth, signInWithCredential, GoogleAuthProvider, User } from "firebase/auth";
import type { OAuthCredential } from "firebase/auth";
import { StorageKeys } from "../constants";
import { removeStorageItem, setStorageItem } from "../storage";
import { authState, idToken } from 'rxfire/auth';
import { delay, filter, shareReplay, switchMap, takeUntil } from "rxjs/operators";
import { EMPTY, Observable, of } from "rxjs";


const auth = getAuth();
export const auth$ = authState(auth).pipe(shareReplay({ bufferSize: 1, refCount: true }))
export const authWithDelay$ = auth$.pipe(delay(100))

saveUserToLocalStorage(authWithDelay$)

export const takeUntil$ = authWithDelay$.pipe(filter(user => !user))
export const authOrEMPTY$ = authWithDelay$.pipe(
  switchMap(user => user ? of(user) : EMPTY),
  takeUntil(takeUntil$)
)

export const idToken$ = idToken(auth)

export function signInWithGoogle(credential: OAuthCredential) {
  //https://github.com/firebase/firebase-js-sdk/issues/4002#issuecomment-857796894
  const _credential = GoogleAuthProvider.credential(credential.idToken);
  signInWithCredentialInfo(_credential)
}

export function signInWithCredentialInfo(credential: OAuthCredential) {
  const auth = getAuth();
  return signInWithCredential(auth, credential)
    .then((result) => {
      console.log({ message: 'Signing in with google credentials successful', result })
    })
    .catch((error) => {
      console.error({ error })
    });


}

function saveUserToLocalStorage(auth$: Observable<User>) {
  auth$.subscribe(user => {
    if (user) {
      setStorageItem(StorageKeys.user_uid, user.uid)
    } else
      removeStorageItem(StorageKeys.user_uid)
  })
}
