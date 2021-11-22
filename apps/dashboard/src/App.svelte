<script lang="ts">
  import AppWrapper from './pages/AppWrapper.svelte';
  import { Router } from 'svelte-navigator';

  export let url = '';
</script>

<Router {url}>
  <AppWrapper />
</Router>

