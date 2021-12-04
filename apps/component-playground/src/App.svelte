<script lang="ts">
  import {
    ExtensionSideNavPage,
    WelcomePage,
    ShowWordPage,
    AddToRepetitionList,
  } from './pages';
  import { Router, Route, Link } from 'svelte-navigator';

  export let url = '';
</script>

<main class="dark">
  <Router {url}>
    <nav>
      <Link to="/welcome">Welcome</Link>
      <Link to="/sidenav">Sidenav</Link>
      <Link to="/show_word">Show Word</Link>
      <Link to="/add_to_repetition_list">Add to repetition list</Link>
    </nav>
    <div>
      <Route path="/sidenav" component={ExtensionSideNavPage} />
      <Route path="/show_word" component={ShowWordPage} />
      <Route path="/add_to_repetition_list" component={AddToRepetitionList} />
      <Route component={WelcomePage} />
    </div>
  </Router>
</main>
