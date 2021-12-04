<script lang="ts">
  import { AddToRepetitionList } from '@parrotly.io/extension-components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
  import type {
    IRepetitionList,
    MESSAGE_ADD_WORD_TO_REPETITION_LIST,
    MESSAGE_PLAY_TEXT,
    MESSAGE_TRANSLATE_TEXT,
  } from '@parrotly.io/types';

  let isModalVisible = false;
  let defaultCategory: IRepetitionList;
  let translation = '';
  browser.runtime.onMessage.addListener(function (request) {
    switch (request.type) {
      /** This listener shows the window to add word from context menu. */
      case EXTENSION_MESSAGES.SHOW_ADD_WORD_TO_SELECTION_LIST:
        //There is only the default category until multiple categories are handled within the application.
        defaultCategory = request.categories[0];
        translateText();
        showModal();
        break;
      case EXTENSION_MESSAGES.TRANSLATION_COMPLETE:
        translation = request.text;
        break;
    }
  });

  const addToRepetitionList = async (text: string, translation: string) => {
    const message: MESSAGE_ADD_WORD_TO_REPETITION_LIST = {
      type: EXTENSION_MESSAGES.ADD_WORD_TO_REPETITION_LIST,
      text,
      translation,
    };
    browser.runtime.sendMessage(message);
  };

  const playText = async (text: string) => {
    const message: MESSAGE_PLAY_TEXT = {
      type: EXTENSION_MESSAGES.PLAY_TEXT,
      text: translation,
      lang: defaultCategory.languageTranslation,
    };
    browser.runtime.sendMessage(message);
  };

  const showModal = () => {
    isModalVisible = true;
  };

  function translateText() {
    const message: MESSAGE_TRANSLATE_TEXT = {
      type: EXTENSION_MESSAGES.TRANSLATE_TEXT,
      text: window.getSelection().toString().trim(),
      languageWord: defaultCategory.languageWord,
      languageTranslation: defaultCategory.languageTranslation,
    };
    browser.runtime.sendMessage(message);
  }
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
