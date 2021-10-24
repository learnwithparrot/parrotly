<script lang="ts">
  import { ExtensionSideNavPage, WelcomePage, ShowWordPage } from './pages';
  import { Router, Route, Link } from 'svelte-routing';

  export let url = '';
</script>

<main>
  <Router {url}>
    <nav>
      <Link to="/welcome">Welcome</Link>
      <Link to="/sidenav">Sidenav</Link>
      <Link to="/show_word">Show Word</Link>
    </nav>
    <div>
      <Route path="/sidenav" component={ExtensionSideNavPage} />
      <Route path="/show_word" component={ShowWordPage} />
      <Route component={WelcomePage} />
    </div>
  </Router>
</main>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  /* range input styles   */
  input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    height: 13px;
    cursor: pointer;
    /* overflow-x: hidden; */
    color: rgba(203, 213, 225,1);
    /* background:teal; */
    margin: 0;
    padding: 0;
  }

  input[type='range']:focus {
    outline: none;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 13px;
    height: 13px;
    margin-top: -6px;
    border-radius: 50%;
    border: 0;
    background: rgba(71, 85, 105, 1);
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 1px;
    background: rgba(148, 163, 184, 1);
  }

  input[type='range']::-moz-range-thumb {
    -moz-appearance: none;
    width: 13px;
    height: 13px;
    margin-top: -6px;
    border-radius: 50%;
    border: 0;
    background: rgba(71, 85, 105, 1);
    cursor: pointer;
  }

  input[type='range']::-moz-range-progress {
    width: 100%;
    height: 1px;
    background: rgba(148, 163, 184, 1);
  }
  input[type='range']::-moz-range-track {
    width: 100%;
    height: 1px;
    background: rgba(203, 213, 225,1);
  }
</style>
