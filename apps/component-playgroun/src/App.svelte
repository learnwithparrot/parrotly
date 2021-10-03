<script lang="ts">
  import { ExtensionSideNavPage, WelcomePage } from './pages';
  import { Router, Route, Link } from 'svelte-routing';

  // import '../app.css';

  export let url = '';
</script>

<main>
  <Router {url}>
    <nav>
      <Link to="/welcome">Welcome</Link>
      <Link to="/sidenav">Sidenav</Link>
    </nav>
    <div>
      <Route path="/sidenav" component={ExtensionSideNavPage} />
      <Route component={WelcomePage} />
    </div>
  </Router>
</main>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
