<script lang="ts">
  import {
    ExtensionSideNavPage,
    WelcomePage,
    ExtensionSideNavLoginPage,
    ShowWordPage,
    ShowMCQCardPage,
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
      <Link to="/sidenav_login">Sidenav Login</Link>
      <Link to="/show_mcq">Show MCQ</Link>
    </nav>
    <div>
      <Route path="/sidenav" component={ExtensionSideNavPage} />
      <Route path="/show_word" component={ShowWordPage} />
      <Route path="/add_to_repetition_list" component={AddToRepetitionList} />
      <Route path="/sidenav_login" component={ExtensionSideNavLoginPage} />
      <Route path="/show_mcq" component={ShowMCQCardPage} />
      <Route component={WelcomePage} />
    </div>
  </Router>
</main>
