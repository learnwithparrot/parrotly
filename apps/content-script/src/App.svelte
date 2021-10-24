<script lang="ts">
  import {
    AddToRepetitionListWrapper,
    SideNavWrapper,
    ShowWordCardWrapper,
  } from './components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
  import { shortcut } from './actions';

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

  /* range input styles */
  input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    height: 13px;
    cursor: pointer;
    /* overflow-x: hidden; */
    color: teal;
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
    background: #00bef3;
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 1px;
    background: #00bef3;
  }

  input[type='range']::-moz-range-thumb {
    -moz-appearance: none;
    width: 13px;
    height: 13px;
    margin-top: -6px;
    border-radius: 50%;
    border: 0;
    background: #00bef3;
    cursor: pointer;
  }

  input[type='range']::-moz-range-progress {
    width: 100%;
    height: 1px;
    background: #00bef3;
  }
  input[type='range']::-moz-range-track {
    width: 100%;
    height: 1px;
    background: teal;
  }
</style>
