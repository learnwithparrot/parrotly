<script lang="ts">
  import { ShowWordCard } from '@parrotly.io/extension-components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';

  let isModalVisible = false;

  browser.runtime.onMessage.addListener(function (request) {
    if (request.type === EXTENSION_MESSAGES.SHOW_WORD) {
      toggleShowModal();
    }
  });

  const toggleShowModal = () => {
    isModalVisible = !isModalVisible;
  };

  const playText = async (text: string) => {
    browser.runtime.sendMessage({
      type: EXTENSION_MESSAGES.PLAY_TEXT,
      text,
    });
  };

  const knowWord = async (id: string) => {
    browser.runtime.sendMessage({
      type: EXTENSION_MESSAGES.KNOW_WORD,
      id,
    });
  };
</script>

<template>
  {#if isModalVisible}
    <ShowWordCard
      languageTo="en"
      on:close={() => (isModalVisible = false)}
      on:playWord={(event) => playText(event.detail.translation)}
      on:knowWord={(event) => knowWord(event.detail.id)}
      id="lksdklsdlsdlsd"
      word="Long word standing here."
      translation="Long word translation standing here."
    />
  {/if}
</template>

<style lang="scss">
</style>
