import {AuthCredential, getAuth, signInWithCredential, GoogleAuthProvider, OAuthCredential} from "firebase/auth";

export function signInWithGoogle(credential: OAuthCredential) {
  const auth = getAuth();

  //https://github.com/firebase/firebase-js-sdk/issues/4002#issuecomment-857796894
  const _credential = GoogleAuthProvider.credential(credential.idToken) ;

  setTimeout(() => {
    signInWithCredential(auth, _credential)
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
