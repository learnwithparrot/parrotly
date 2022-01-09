<script lang="ts">
  import { ShowWordCard, MCQCard } from '@parrotly.io/extension-components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
  import type {
    IRepetitionWord,
    IUserSettings,
    MESSAGE_SHOW_WORD,
    MESSAGE_KNOW_WORD,
    MESSAGE_MCQ_ANSWER,
    IRepetitionList,
    MESSAGE_PLAY_TEXT,
  } from '@parrotly.io/types';
  import McqCard from 'libs/extension-components/src/components/MCQCard.svelte';

  let _word: IRepetitionWord;
  let _category: IRepetitionList;
  let _settings: IUserSettings;
  let _type: MESSAGE_SHOW_WORD['type'];
  let _options:string[];

  let isModalVisible = false;

  browser.runtime.onMessage.addListener(function (request: MESSAGE_SHOW_WORD) {
    if (
      [EXTENSION_MESSAGES.SHOW_WORD, EXTENSION_MESSAGES.SHOW_MCQ].includes(
        request.type
      )
    ) {
      _word = request.word;
      _category = request.category;
      _settings = request.settings;
      _options = request.options
      _type = request.type;
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

  const onAnswer = async (isRightAnswer:boolean= false) => {
    const message: MESSAGE_MCQ_ANSWER = {
      type:   EXTENSION_MESSAGES.MCQ_ANSWER,
      id: _word.id,
      categoryId: _category.id,
      isRightAnswer,
    };
    browser.runtime.sendMessage(message);
  };

  const handleClose = () => {
    isModalVisible = false;
  };
</script>

<template>
  {#if isModalVisible}
    {#if _type === EXTENSION_MESSAGES.SHOW_WORD}
      <ShowWordCard
        on:close={handleClose}
        on:playWord={playText}
        on:knowWord={knowWord}
        showWordDurationSeconds={_settings?.showCardDurationSeconds ?? 500}
        languageTo={_category?.languageTranslation ?? 'en'}
        word={_word?.word ?? 'lksdoiwelksd'}
        translation={_word?.translation ?? 'lksdoiweosd'}
      />
    {:else}
      <MCQCard
        on:close={handleClose}
        on:knowWord={knowWord}
        on:rightAnswer={() => onAnswer(true)}
        on:wrongAnswer={() => onAnswer(false)}
        options={_options}
        showWordDurationSeconds={_settings?.showMCQDurationSeconds ?? 500}
        word={_word?.word ?? 'lksdoiwelksd'}
        translation={_word?.translation ?? 'lksdoiweosd'}
      />
    {/if}
  {/if}
</template>

<style lang="scss">
</style>
