<script lang="ts">
  import SideNav from './SideNav.svelte';
  // import browser from 'webextension-polyfill';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';

  let isModalVisible = false;
  let text = '';
  /**
   * This listener shows the window to add word from context menu.
   */
  browser.runtime.onMessage.addListener(function (request) {
    if (request.type === EXTENSION_MESSAGES.SHOW_SIDE_NAV) {
      toggleShowModal();
    }
  });

  const toggleShowModal = () => {
    isModalVisible = !isModalVisible;
  };
</script>

<template>
  {#if isModalVisible}
    <SideNav onClose={() => (isModalVisible = false)} />
  {/if}
</template>

<style lang="scss">
</style>
