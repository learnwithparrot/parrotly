<script lang="ts">
  import { onMount } from 'svelte';
  import {
    AddToRepetitionListWrapper,
    SideNavWrapper,
    ShowWordCardWrapper,
  } from './components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
  import type {
    MESSAGE_AUTH_CREDENTIAL,
    MESSAGE_TRIGGER_SHOW_WORD,
    MESSAGE_CHANGE_THEME,
    MESSAGE_SIGN_OUT,
  } from '@parrotly.io/types';
  import { shortcut } from './actions';

  let isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // let globalHref = browser.extension.getURL('global.css');
  let lineAwesomeHref = browser.extension.getURL('line-awesome.min.css');
  let robotoHref =
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';

  /**
   * Used to authenticate the extension once
   * we authenticate on the dashboard
   */
  function onMessage(event) {
    // We only accept messages from ourselves
    if (event.source != window) return;

    if (event.data?.type == 'FROM_PAGE') {
      if (event.data?.event === EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS) {
        const message: MESSAGE_AUTH_CREDENTIAL = {
          type: EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS,
          idToken: event.data.idToken,
          password: event.data?.password,
          email: event.data?.email,
        };
        browser.runtime.sendMessage(message);
      } else if (event.data?.event === EXTENSION_MESSAGES.ON_SIGN_OUT) {
        const message: MESSAGE_SIGN_OUT = {
          type: EXTENSION_MESSAGES.ON_SIGN_OUT,
        };
        browser.runtime.sendMessage(message);
      }
    }
  }

  function triggerShowWord() {
    const message: MESSAGE_TRIGGER_SHOW_WORD = {
      type: EXTENSION_MESSAGES.TRIGGER_SHOW_WORD,
    };
    browser.runtime.sendMessage(message);
  }

  function setupListeners() {
    window.addEventListener('message', onMessage);
    browser.runtime.onMessage.addListener(function (request) {
      if (request.type === EXTENSION_MESSAGES.CHANGE_THEME) {
        isDarkTheme = request.isDarkTheme;
      }
    });
  }

  function getCurrentTheme() {
    const message: MESSAGE_CHANGE_THEME = {
      type: EXTENSION_MESSAGES.GET_CURRENT_THEME,
    };
    browser.runtime.sendMessage(message);
  }

  onMount(() => {
    setupListeners();
    getCurrentTheme();
  });
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
  <link rel="stylesheet" href={lineAwesomeHref} />
  <link rel="stylesheet" href={robotoHref} />

  <main id="parrot-root" class="z-modal" class:dark={isDarkTheme}>
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
