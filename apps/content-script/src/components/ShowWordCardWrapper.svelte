<script lang="ts">
  import { ShowWordCard } from '@parrotly.io/extension-components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES, LanguageType } from '@parrotly.io/constants';
  import type {
    IRepetitionWord,
    IUserSettings,
    IRepetitionList,
  } from '@parrotly.io/types';

  let _word: IRepetitionWord;
  let _category: IRepetitionList;
  let _settings: IUserSettings;

  let word = '',
    translation = '',
    showWordDuration = 4,
    languageTo: LanguageType = 'de';

  $: {
    if (_word) {
      word = _word.word;
      // translation = _word.translation;
      // languageTo = _word.languageTranslation;
    }
  }

  let isModalVisible = false;

  browser.runtime.onMessage.addListener(function (request) {
    if (request.type === EXTENSION_MESSAGES.SHOW_WORD) {
      const { word, category, settings } = request as {
        word: IRepetitionWord;
        settings: IUserSettings;
        category: IRepetitionList;
      };
      _word = word;
      _category = category;
      _settings = settings;
      toggleShowModal();
    }
  });

  const toggleShowModal = () => {
    isModalVisible = !isModalVisible;
  };

  const playText = async () => {
    browser.runtime.sendMessage({
      type: EXTENSION_MESSAGES.PLAY_TEXT,
      text: _word.translation,
      lang: _word.languageTranslation,
    });
  };

  const knowWord = async () => {
    browser.runtime.sendMessage({
      type: EXTENSION_MESSAGES.KNOW_WORD,
      id: _word.id, categoryId:_category.id,
    });
  };
</script>

<template>
  {#if isModalVisible}
    <ShowWordCard
      on:close={() => (isModalVisible = false)}
      on:playWord={playText}
      on:knowWord={knowWord}
      showWordDurationSeconds={showWordDuration}
      {languageTo}
      {word}
      {translation}
    />
  {/if}
</template>

<style lang="scss">
</style>
