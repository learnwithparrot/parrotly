<script>
  import { Button, Textfield } from '@parrotly.io/ui';
  import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    EmailAuthProvider,
    signInWithEmailAndPassword,
  } from 'firebase/auth';
  import icon_google from './../assets/icon-google.svg'

  let email = '';
  let password = '';

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

  const signInWithEmail = () => {
    const auth = getAuth();
    auth.useDeviceLanguage();

    const provider = new EmailAuthProvider();
    signInWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        var data = {
          type: 'FROM_PAGE',
          credential,
        };
        window.postMessage(data, '*');
      })
      .catch((error) => {});
  };
</script>

<template>
  <div class="flex flex-col gap-2 max-w-lg">
    <h1 class="text-2xl text-center text-primary-500 font-alegreya">
      Sign in with Email and Password
    </h1>
    <small
      class="font-alegreya hover:underline focus:underline cursor-pointer text-primary-500"
    >
      Don't have an account yet, register
    </small>

    <Textfield label="Email" id="email" name="email" bind:value={email} />
    <Textfield
      label="Password"
      id="password"
      name="password"
      bind:value={password}
      hint="Should contain numbers, symbols and at least 8 characters long."
    />

    <Button
      text="Sign in"
      on:click={signInWithEmail}
      color="success"
      className="mt-6"
    />

    <div class="divider">
      <span
        class="font-alegreya bg-primary-100 dark:bg-primary-800 z-10 px-4 text-primary-500 "
        >OR</span
      >
    </div>

    <Button
      text="Sign in with Google"
      on:click={signInWithGoogle}
      variant="filled"
    >
      <svelte:fragment slot="icon-prefix">
        <img src={icon_google} alt="Login with google" class="h-6">
      </svelte:fragment>
    </Button>
  </div>
</template>

<style lang="scss">
  .divider {
    @apply relative my-4 w-full flex items-center justify-center;
    &:before {
      top: 50%;
      transform: translateY(-50%);
      height: 2px;
      content: '';
      @apply absolute rounded-sm bg-primary-500 left-0 w-full;
    }
  }
</style>
