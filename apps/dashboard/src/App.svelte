<script lang="ts">
  import Welcome from './pages/Welcome.svelte';
  import About from './pages/About.svelte';
  import OnBoard from './pages/Onboard.svelte';
  import { Router, Route, Link } from 'svelte-routing';

  // import '../app.css';

  export let url = '';
</script>

<main>
  <Router {url}>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/welcome">Welcome</Link>
    </nav>
    <div>
      <Route path="/about" component={About} />
      <Route path="/onboarding" component={OnBoard} />
      <Route component={Welcome} />
    </div>
  </Router>
</main>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
