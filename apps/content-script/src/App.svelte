<script lang="ts">
  import { onMount } from 'svelte';
  import AddToRepetitionListWrapper from './components/AddToRepetitionListWrapper.svelte';
  import SideNavWrapper from './components/SideNavWrapper.svelte';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';

  export let name: string;

  let globalHref = browser.extension.getURL('global.css');
  let lineAwesomeHref = browser.extension.getURL('line-awesome.min.css');
  let robotoHref =
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';

  function onMessage(event) {
    // We only accept messages from ourselves
    if (event.source != window) return;

    if (event.data.type && event.data.type == 'FROM_PAGE') {
      console.log({ data: event.data });
      browser.runtime.sendMessage({
        type: EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS,
        credential: event.data.credential,
      });
    }
  }

  window.addEventListener('message', onMessage);
</script>

<template>
  <link rel="stylesheet" href={globalHref} />
  <link rel="stylesheet" href={lineAwesomeHref} />
  <link rel="stylesheet" href={robotoHref} />

  <main id="parrot-root" class="z-modal">
    <AddToRepetitionListWrapper />
    <SideNavWrapper />
  </main>
</template>

<style global>
  *:not(style) {
    all: initial;
    box-sizing: border-box;
  }
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
