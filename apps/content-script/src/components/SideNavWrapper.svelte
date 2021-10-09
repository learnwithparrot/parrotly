<script lang="ts">
  import { ExtensionSideNav } from '@parrotly.io/extension-components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';

  let isModalVisible = false;

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
    <ExtensionSideNav on:close={() => (isModalVisible = false)} />
  {/if}
</template>

<style lang="scss">
</style>
