<script lang="ts">
  import { Welcome, About, OnBoard, Components, Dashboard } from './pages';
  import { Router, Route, Link } from 'svelte-navigator';
  import { Redirect, Sidenav } from './components';

  export let url = '';
</script>

<main class="flex items-stretch dark:bg-primary-700 bg-primary-100 w-screen">
  <Router {url}>
    <Route path="/about" component={About} />
    <Route path="/dashboard/*"  component={Dashboard} />
    <Route path="/onboarding" component={OnBoard} />
    <Route path="/component" component={Components} />
    <Route component={Redirect} to="dashboard" />
  </Router>
</main>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
