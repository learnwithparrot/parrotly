<script lang="ts">
  import { AuthShell, Dashboard } from '.';
  import { Route, useNavigate } from 'svelte-navigator';
  import { Redirect } from '../components';
  import { getAuth } from 'firebase/auth';
  import { onMount } from 'svelte';

  const navigate = useNavigate();
  const auth = getAuth();

  onMount(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) navigate('/auth');
    });
  });
</script>

<main
  class="flex items-stretch dark:bg-primary-800 bg-primary-100 w-screen p-3 pr-0 h-screen"
>
  <Route path="/auth/*" component={AuthShell} />
  <Route path="/dashboard/*" component={Dashboard} />
  <Route component={Redirect} to="auth" />
</main>
