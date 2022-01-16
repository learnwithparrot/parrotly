<script lang="ts">
  import {
    AddToRepetitionList,
    FloatingPanel,
    LoginPrompt,
  } from '@parrotly.io/extension-components';
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
  let userSignedIn = false;
  browser.runtime.onMessage.addListener(function (request) {
    switch (request.type) {
      /** This listener shows the window to add word from context menu. */
      case EXTENSION_MESSAGES.SHOW_ADD_WORD_TO_SELECTION_LIST:
        //There is only the default category until multiple categories are handled within the application.
        userSignedIn = request.userSignedIn;
        if (userSignedIn) {
          defaultCategory = request.categories[0];
          translateText();
        }
        toggleModal();
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

  const toggleModal = () => {
    isModalVisible = !isModalVisible;
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
    <FloatingPanel on:close={toggleModal}>
      {#if userSignedIn}
        <AddToRepetitionList
          on:close={toggleModal}
          {translation}
          on:addToRepetitionList={(event) =>
            addToRepetitionList(event.detail.text, event.detail.translation)}
          on:playWord={(event) => playText(event.detail.translation)}
        />
      {:else}
        <LoginPrompt on:click={toggleModal} />
      {/if}
    </FloatingPanel>
  {/if}
</template>

<style lang="scss">
</style>
