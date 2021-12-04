<script>
  import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  import { onMount } from 'svelte';

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

  onMount(signInWithGoogle);
</script>

<template>
  <div class="w-full h-full flex items-center justify-between">
    <span>Login in progress</span>
  </div>
</template>
