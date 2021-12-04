<script lang="ts">
  import { ShowWordCard } from '@parrotly.io/extension-components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
  import type {
    IRepetitionWord,
    IUserSettings,
    MESSAGE_SHOW_WORD,
    MESSAGE_KNOW_WORD,
    IRepetitionList,
    MESSAGE_PLAY_TEXT,
  } from '@parrotly.io/types';

  let _word: IRepetitionWord;
  let _category: IRepetitionList;
  let _settings: IUserSettings;

  let isModalVisible = false;

  browser.runtime.onMessage.addListener(function (request: MESSAGE_SHOW_WORD) {
    if (request.type === EXTENSION_MESSAGES.SHOW_WORD) {
      _word = request.word;
      _category = request.category;
      _settings = request.settings;
      toggleShowModal();
    }
  });

  const toggleShowModal = () => {
    isModalVisible = !isModalVisible;
  };

  const playText = async () => {
    const message: MESSAGE_PLAY_TEXT = {
      type: EXTENSION_MESSAGES.PLAY_TEXT,
      text: _word.translation,
      lang: _category.languageTranslation,
    };
    browser.runtime.sendMessage(message);
  };

  const knowWord = async () => {
    const message: MESSAGE_KNOW_WORD = {
      type: EXTENSION_MESSAGES.KNOW_WORD,
      id: _word.id,
      categoryId: _category.id,
    };
    browser.runtime.sendMessage(message);
  };

  const handleClose = () => {
    isModalVisible = false;
  };

</script>

<template>
  {#if isModalVisible}
    <ShowWordCard
      on:close={handleClose}
      on:playWord={playText}
      on:knowWord={knowWord}
      showWordDurationSeconds={_settings?.showCardDurationSeconds ?? 500}
      languageTo={_category?.languageTranslation??'en'}
      word={_word?.word??'lksdoiwelksd'}
      translation={_word?.translation??'lksdoiweosd'}
    />
  {/if}
</template>

<style lang="scss">
</style>
