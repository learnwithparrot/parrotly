<script>
  import { Button } from '@parrotly.io/ui';
  import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

  const signInWithGoogle = () => {
    const auth = getAuth();
    auth.useDeviceLanguage();

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        var data = {
          type: 'FROM_PAGE',
          credential,
        };
        window.postMessage(data, '*');
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };
</script>

<template>
  <div class="w-full h-full flex items-center justify-between">
    <div
      class="bg-primary-700 shadow-sm rounded-sm max-w-[500px] max-h-[500px] flex flex-col items-center"
    >
      <Button text="Sign in with Google" on:click={signInWithGoogle} />
    </div>
  </div>
</template>
