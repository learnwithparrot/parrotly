<script lang="ts">
  import { Button, Textfield } from '@parrotly.io/ui';
  import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    EmailAuthProvider,
    signInWithEmailAndPassword,
  } from 'firebase/auth';
  import type { UserCredential } from 'firebase/auth';
  import icon_google from './../assets/icon-google.svg';
import { EXTENSION_MESSAGES } from '@parrotly.io/constants';

  let email = '';
  let password = '';
  let confirm_password = '';
  let isSigningUp = false;

  /**
   * Sends message to extension with user credentials
   * to login user in the extension.
   * @param idToken
   */
  function loginExtension(
    idToken: string,
    email?: string,
    password?: string
  ): void {
    let data: any = { type: 'FROM_PAGE', idToken, event:EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS };
    if (email && password) {
      data.email = email;
      data.password = password;
    }
    window.postMessage(data, '*');
  }

  const signInWithGoogle = () => {
    const auth = getAuth();
    auth.useDeviceLanguage();

    //reset email and password
    email = '';
    password = '';

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        loginExtension(credential.idToken);
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
      .then(async (result) => {
        const token = await result.user.getIdToken();
        loginExtension(token, email, password);
      })
      .catch((error) => {});
  };

  const signup = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password).then(
      async (userCred) => {
        const token = await userCred.user.getIdToken();
        loginExtension(token, email, password);
      }
    );
  };

  const toggleSignin = () => (isSigningUp = !isSigningUp);
</script>

<template>
  <div class="flex flex-col gap-2 max-w-lg">
    <h1 class="text-2xl text-center text-primary-500 font-alegreya ml-[-12px]">
      Sign in with Email and Password
    </h1>
    {#if isSigningUp}
      <small
        class="font-alegreya hover:underline focus:underline cursor-pointer text-primary-500"
        on:click={toggleSignin}
      >
        Already have an account, Sign in.
      </small>
    {:else}
      <small
        class="font-alegreya hover:underline focus:underline cursor-pointer text-primary-500"
        on:click={toggleSignin}
      >
        Don't have an account yet, register.
      </small>
    {/if}

    <Textfield label="Email" id="email" name="email" bind:value={email} />
    <Textfield
      label="Password"
      id="password"
      name="password"
      type="password"
      bind:value={password}
      hint="Should contain numbers, symbols and at least 8 characters long."
    />

    {#if isSigningUp}
      <Textfield
        label="Confirm Password"
        id="confirm_password"
        name="confirm_password"
        type="password"
        bind:value={confirm_password}
        hint="Should contain numbers, symbols and at least 8 characters long."
        error={isSigningUp && confirm_password !== password
          ? 'Both passwords do not correspond'
          : ''}
      />
    {/if}

    <Button
      text={isSigningUp ? 'Sign Up' : 'Sign in'}
      on:click={() => (isSigningUp ? signup() : signInWithEmail())}
      color="success"
      disabled={isSigningUp && confirm_password !== password}
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
        <img src={icon_google} alt="Login with google" class="h-6" />
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
