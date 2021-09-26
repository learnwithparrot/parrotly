<script lang="ts">
  import { Welcome, About, OnBoard, Components } from './pages';
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
      <Link to="/component">Component</Link>
    </nav>
    <div>
      <Route path="/about" component={About} />
      <Route path="/onboarding" component={OnBoard} />
      <Route path="/component" component={Components} />
      <Route component={Welcome} />
    </div>
  </Router>
</main>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
