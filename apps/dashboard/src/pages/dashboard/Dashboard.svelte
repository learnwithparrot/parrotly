<script lang="ts">
  import { Route, Link } from 'svelte-navigator';
  import { Sidenav } from '../../components';
import Redirect from '../../components/Redirect.svelte';
  import Settings from './Settings.svelte';
  import WordList from './WordList.svelte';
  // import '../app.css';

  export let url = '';
</script>

  <Sidenav />
  <Route path="settings" component={Settings} />
  <Route path="word_list" component={WordList} />
  <Route component={Redirect} to="word_list" />

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
