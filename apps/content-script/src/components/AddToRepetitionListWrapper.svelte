<script lang="ts">
  import AddToRepetitionList from './AddToRepetitionList.svelte';
  // import browser from 'webextension-polyfill';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';

  let isModalVisible = false;
  let text = '';
  /**
   * This listener shows the window to add word from context menu.
   */
  browser.runtime.onMessage.addListener(function (request) {
    if (request.type === EXTENSION_MESSAGES.SHOW_ADD_WORD_TO_SELECTION_LIST) {
      showModal(request.text);
    }
  });

  const showModal = (selection: string) => {
    isModalVisible = true;
    text = selection;
  };
</script>

<template>
  {#if isModalVisible}
    <AddToRepetitionList onClose={() => (isModalVisible = false)} />
  {/if}
</template>

<style lang="scss">
</style>
