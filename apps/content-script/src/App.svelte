<script lang="ts">
  import {
    AddToRepetitionListWrapper,
    SideNavWrapper,
    ShowWordCardWrapper,
  } from './components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
  import { shortcut } from './actions';
  import ShowWordCard from 'libs/extension-components/src/components/ShowWordCard.svelte';

  // let globalHref = browser.extension.getURL('global.css');
  let lineAwesomeHref = browser.extension.getURL('line-awesome.min.css');
  let robotoHref =
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';

  function onMessage(event) {
    // We only accept messages from ourselves
    if (event.source != window) return;

    if (event.data.type && event.data.type == 'FROM_PAGE') {
      browser.runtime.sendMessage({
        type: EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS,
        credential: event.data.credential,
      });
    }
  }

  function triggerShowWord() {
    console.log('triggering showing word');
    browser.runtime.sendMessage({
      type: EXTENSION_MESSAGES.TRIGGER_SHOW_WORD,
    });
  }

  // window.addEventListener('message', onMessage);
</script>

<svelte:window on:message={onMessage} />
<svelte:body
  use:shortcut={{
    control: true,
    alt: true,
    code: 'Digit2',
    callback: triggerShowWord,
  }} />
<template>
  <!-- <link rel="stylesheet" href={globalHref} /> -->
  <link rel="stylesheet" href={lineAwesomeHref} />
  <link rel="stylesheet" href={robotoHref} />

  <main id="parrot-root" class="z-modal">
    <AddToRepetitionListWrapper />
    <SideNavWrapper />
    <ShowWordCardWrapper />
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
