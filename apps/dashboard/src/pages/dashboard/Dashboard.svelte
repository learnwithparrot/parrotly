<script lang="ts">
  import type { IUserSettings } from '@parrotly.io/types';
  import { onMount } from 'svelte';
  import { getAuth } from 'firebase/auth';
  import { authState } from 'rxfire/auth';
  import { filter, first, map } from 'rxjs/operators';
  import { Route } from 'svelte-navigator';
  import { Header } from '../../components';
  import Modal from '../../components/Modal.svelte';
  import Redirect from '../../components/Redirect.svelte';
  import PublicRepetitionLists from './PublicRepetitionLists.svelte';
  import RepetitionListDetails from './RepetitionListDetails.svelte';
  import Settings from './Settings.svelte';

  export let userSettings: IUserSettings;

  let showSettings = false;

  const path = authState(getAuth())
    .pipe(
      filter((user) => !!user),
      map((user) => `my_words/${user.uid}`),
      first()
    )
    .toPromise();

  function handleSettings() {
    showSettings = !showSettings;
  }
  onMount(() => {
    if (!userSettings?.languageLearned || !userSettings?.languageSpoken)
      handleSettings();
  });
</script>

<Header on:settings={handleSettings} />
<div class="flex flex-col max-w-screen-xl mx-auto w-full">
  <Route path="my_words/:id" component={RepetitionListDetails} />
  <Route path="public_list" component={PublicRepetitionLists} />
  <Route component={Redirect} to={path} />
</div>

<Modal open={showSettings} on:close={handleSettings} title="Settings">
  <svelte:fragment slot="content">
    <Settings />
  </svelte:fragment>
</Modal>
