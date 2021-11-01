<script lang="ts">
  import { Route, Link } from 'svelte-navigator';
  import { Sidenav } from '../../components';
  import Redirect from '../../components/Redirect.svelte';
  import Settings from './Settings.svelte';
  import RepetitionLists from './RepetitionLists.svelte';
  // import '../app.css';

  export let url = '';
</script>

<Sidenav />
<div class="flex flex-col max-w-screen-lg mx-auto">
  <Route path="settings" component={Settings} />
  <Route path="word_list" component={RepetitionLists} />
  <Route component={Redirect} to="word_list" />
</div>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
