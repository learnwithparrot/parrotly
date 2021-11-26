<script lang="ts">
  import { Route } from 'svelte-navigator';
  import { Sidenav } from '../../components';
  import Modal from '../../components/Modal.svelte';
  import Redirect from '../../components/Redirect.svelte';
  import MyRepetitionLists from './MyRepetitionLists.svelte';
  import PublicRepetitionLists from './PublicRepetitionLists.svelte';
  import RepetitionListDetails from './RepetitionListDetails.svelte';
  import Settings from './Settings.svelte';

  let showSettings = false;

  function handleSettings() {
    showSettings = !showSettings;
  }
</script>

<Sidenav on:settings={handleSettings} />
<div class="flex flex-col max-w-screen-xl mx-auto w-full">
  <Route path="my_list" component={MyRepetitionLists} />
  <Route path="my_list/:id" component={RepetitionListDetails} />
  <Route path="public_list" component={PublicRepetitionLists} />
  <Route component={Redirect} to="my_list" />
</div>

<Modal open={showSettings} on:close={handleSettings} title="Settings">
  <svelte:fragment slot="content">
    <Settings />
  </svelte:fragment>
</Modal>
