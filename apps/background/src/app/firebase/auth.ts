import {
  getAuth, signInWithCredential, GoogleAuthProvider,
  User, EmailAuthProvider, signOut
} from "firebase/auth";
import type { OAuthCredential, EmailAuthCredential } from "firebase/auth";
import { StorageKeys } from "../constants";
import { removeStorageItem, setStorageItem } from "../storage";
import { authState, idToken } from 'rxfire/auth';
import { delay, shareReplay, switchMap } from "rxjs/operators";
import { NEVER, Observable, of } from "rxjs";


const auth = getAuth();
export const auth$ = authState(auth).pipe(shareReplay({ bufferSize: 1, refCount: true }))
export const authWithDelay$ = auth$.pipe(delay(100))

saveUserToLocalStorage(authWithDelay$)

export const authOrNEVER = authWithDelay$.pipe(
  switchMap(user => user ? of(user) : NEVER),
  shareReplay({bufferSize:1, refCount:true}),
)

export const idToken$ = idToken(auth)

export function logout() {
  const auth = getAuth()
  signOut(auth)
}

export function signIn(idToken: string, email?: string, password?: string) {
  if (email && password) return signInWithEmailAndPassword(email, password)
  return signInWithGoogle(idToken)
}

export function signInWithGoogle(idToken: string) {
  //https://github.com/firebase/firebase-js-sdk/issues/4002#issuecomment-857796894
  const _credential = GoogleAuthProvider.credential(idToken);
  signInWithCredentialInfo(_credential)
}

export function signInWithEmailAndPassword(email: string, password: string) {
  const _credential = EmailAuthProvider.credential(email, password);
  signInWithCredentialInfo(_credential)
}

export function signInWithCredentialInfo(credential: OAuthCredential | EmailAuthCredential) {
  const auth = getAuth();
  return signInWithCredential(auth, credential)
    .then((result) => {
      console.log({ message: 'Signing in with credentials successful', result })
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
