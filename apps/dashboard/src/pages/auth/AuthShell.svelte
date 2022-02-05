<script lang="ts">
  import { getAuth } from 'firebase/auth';
  import { onMount } from 'svelte';

  import { Route, useNavigate } from 'svelte-navigator';
  import Redirect from '../../components/Redirect.svelte';
  import Login from './Login.svelte';
  import SignOut from './SignOut.svelte';
  import LoginWithGoogle from './LoginWithGoogle.svelte';

  const navigate = useNavigate();
  const auth = getAuth();

  onMount(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate(`/dashboard/my_words/${user.uid}`);
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    });
  });
</script>

<template>
  <Route path="login" component={Login} />
  <Route path="login__google" component={LoginWithGoogle} />
  <Route path="signout" component={SignOut} />
  <Route component={Redirect} to="login" />
</template>
