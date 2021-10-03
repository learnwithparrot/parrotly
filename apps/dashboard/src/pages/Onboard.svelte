<script lang="ts">
  import { initFirebase } from '../firestore-init';
  import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  import { onMount } from 'svelte';
  onMount(() => {
    initFirebase();
  });

  const signInWithGoogle = () => {
    const auth = getAuth();
    auth.useDeviceLanguage();

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        var data = {
          type: 'FROM_PAGE',
          credential,
        };
        window.postMessage(data, '*');
        // ...
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

<main>
  <span>This is the onboarding page</span>
  <button on:click={signInWithGoogle} class="mx-3 bg-gray-500 px-2 py-2 rounded-sm">Sign in with Google</button>
</main>

<style>
</style>
