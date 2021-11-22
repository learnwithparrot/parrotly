<script lang="ts">
  import { getAuth } from 'firebase/auth';
  import { onMount } from 'svelte';

  import { Route, useNavigate } from 'svelte-navigator';
  import Redirect from '../../components/Redirect.svelte';
  import Login from './Login.svelte';
  import SignOut from './SignOut.svelte';

  const navigate = useNavigate();
  const auth = getAuth();

  onMount(() => {
    auth.onAuthStateChanged((user) => {
      if (user) navigate('/dashboard');
    });
  });
</script>

<div class="flex flex-col max-w-screen-lg mx-auto w-full">
  <Route path="login" component={Login} />
  <Route path="signout" component={SignOut} />
  <Route component={Redirect} to="login" />
</div>
