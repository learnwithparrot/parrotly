<script lang="ts">
  import { AddToRepetitionList } from '@parrotly.io/extension-components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';

  let isModalVisible = false;
  let text = '';
  let translation = '';
  browser.runtime.onMessage.addListener(function (request) {
    switch (request.type) {
      /** This listener shows the window to add word from context menu. */
      case EXTENSION_MESSAGES.SHOW_ADD_WORD_TO_SELECTION_LIST:
        showModal();
        break;
      case EXTENSION_MESSAGES.TRANSLATION_COMPLETE:
        translation = request.text;
        break;
    }
  });

  const addToRepetitionList = async (text: string, translation: string) => {
    browser.runtime.sendMessage({
      type: EXTENSION_MESSAGES.ADD_WORD_TO_REPETITION_LIST,
      text,      translation,
    });
  };

  const playText = async (text: string) => {
    browser.runtime.sendMessage({
      type: EXTENSION_MESSAGES.PLAY_TEXT,
      translation,
    });
  };

  const showModal = () => {
    isModalVisible = true;
    browser.runtime.sendMessage({
      type: EXTENSION_MESSAGES.TRANSLATE_TEXT,
      text: window.getSelection().toString().trim(),
    });
  };
</script>

<template>
  {#if isModalVisible}
    <AddToRepetitionList
      {translation}
      on:close={() => (isModalVisible = false)}
      on:addToRepetitionList={(event) =>
        addToRepetitionList(event.detail.text, event.detail.translation)}
      on:playWord={(event) => playText(event.detail.translation)}
    />
  {/if}
</template>

<style lang="scss">
</style>
