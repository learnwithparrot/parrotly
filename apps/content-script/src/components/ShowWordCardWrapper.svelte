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
    MESSAGE_ON_WORD_SHOWN,
    MESSAGE_DISABLE_SHOW_WORD,
  } from '@parrotly.io/types';

  let _word: IRepetitionWord;
  let _category: IRepetitionList;
  let _settings: IUserSettings;
  let _type: MESSAGE_SHOW_WORD['type'];
  let _options: string[];

  let isModalVisible = false;

  browser.runtime.onMessage.addListener(function (request: MESSAGE_SHOW_WORD) {
    const validTypes = [
      EXTENSION_MESSAGES.SHOW_WORD,
      EXTENSION_MESSAGES.SHOW_MCQ,
    ];
    if (document.hidden || !validTypes.includes(request.type)) return;
    notifyWordShown(request.type);
    _word = request.word;
    _type = request.type;
    _category = request.category;
    _settings = request.settings;
    _options = request.options;
    toggleShowModal();
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

  const notifyWordShown = async (type: MESSAGE_SHOW_WORD['type']) => {
    const message: MESSAGE_ON_WORD_SHOWN = {
      type: EXTENSION_MESSAGES.ON_WORD_SHOWN,
      trigger: type,
      id: _word.id,
      categoryId: _category.id,
    };
    browser.runtime.sendMessage(message);
  };

  const onAnswer = async (isRightAnswer: boolean = false) => {
    const message: MESSAGE_MCQ_ANSWER = {
      type: EXTENSION_MESSAGES.MCQ_ANSWER,
      id: _word.id,
      categoryId: _category.id,
      isRightAnswer,
    };
    browser.runtime.sendMessage(message);
  };

  const handleDisable = async (
    event: CustomEvent<{ durationHours: number }>
  ) => {
    const durationHours = event.detail?.durationHours;
    if (!durationHours) return;
    const message: MESSAGE_DISABLE_SHOW_WORD = {
      type: EXTENSION_MESSAGES.DISABLE_SHOW_WORD,
      durationHours,
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
        on:disable={handleDisable}
        on:knowWord={knowWord}
        showWordDurationSeconds={_settings?.showCardDurationSeconds ?? 6}
        languageTo={_category?.languageTranslation ?? 'en'}
        word={_word?.word}
        translation={_word?.translation}
      />
    {:else}
      <MCQCard
        on:close={handleClose}
        on:knowWord={knowWord}
        on:disable={handleDisable}
        on:rightAnswer={() => onAnswer(true)}
        on:wrongAnswer={() => onAnswer(false)}
        options={_options}
        showWordDurationSeconds={_settings?.showMCQDurationSeconds ?? 16}
        word={_word?.word}
        translation={_word?.translation}
      />
    {/if}
  {/if}
</template>

<style lang="scss">
</style>
