<script lang="ts">
  import type { IRepetitionList } from '@parrotly.io/types';
  import {RepetitionListItem, Modal } from '../../components/';
  import { onMount } from 'svelte';
  import { Button } from '@parrotly.io/ui';
  import { convertNumToStringRatings } from '../../utils';
  import { SUPPORTED_LANGUAGES } from '@parrotly.io/constants';

  type ViewInterface = 'my_word_list' | 'public_word_list';

  let currentItem: ViewInterface = 'my_word_list';

  const wordsSample = [
    { word: 'Contention', translation: 'Meinungsverschiedenheit' },
    { word: 'Behest', translation: 'Das Geheiß' },
    { word: 'Present', translation: 'Vorstellen' },
    { word: 'Just now', translation: 'So eben' },
    { word: 'Strike', translation: 'Streit' },
    { word: 'Concern', translation: 'Angehen + AKK' },
  ];

  const repetitionLists: IRepetitionList[] = [
    {
      name: 'Most used words in German',
      languageTranslation: 'de',
      languageWord: 'en',
      wordsSample,
      creatorDisplayName: 'Some creator name here',
      id: '92ceb8ef855346a8811f3c279061d3f6',
      default: true,
      public: false,
      wordCount: 20,
      rating: 4,
      numberOfFork: 0,
      creatorId: 'lksdoweoidslksd',
      creatorPhotoUrl: 'lkweoisdlksd',
    },
    {
      name: 'Most used verbs in German',
      languageTranslation: 'de',
      languageWord: 'en',
      wordsSample,
      creatorDisplayName: 'Some creator name here',
      id: '92ceb8ef855346a8811f3c279061d3f6',
      default: false,
      public: true,
      wordCount: 20,
      rating: 4,
      numberOfFork: 0,
      creatorId: 'lksdoweoidslksd',
      creatorPhotoUrl: 'lkweoisdlksd',
    },
  ];
  let activeList: IRepetitionList ;

  onMount(() => {});

  function onView(list: IRepetitionList) {
    activeList = list;
  }
</script>

<template>
  <section class="flex flex-col flex-1 pt-1 justify-start gap-4">
    <header class="flex justify-between">
      <h1 class="font-alegreya text-3xl font-semibold dark:text-primary-300">
        Public Repetition Lists
      </h1>
      <input
        type="text"
        placeholder="search"
        class="outline-none bg-primary-600 min-w-[200px] bg-opacity-30 p-2"
      />
    </header>

    <ul class="grid gap-4">
      {#each repetitionLists as repetitionList}
        <RepetitionListItem
          {repetitionList}
          on:view={({ detail }) => onView(detail)}
          publicView={true}
        />
      {/each}
    </ul>
  </section>
  <Modal
    open={Boolean(activeList)}
    on:close={() => (activeList = null)}
    title={activeList?.name ?? ''}
  >
    <nav class="flex justify-between mb-2 items-center" slot="header">
      {#if activeList?.name}
        <h2 class="text-2xl">{activeList.name}</h2>
      {/if}
      <Button iconPrefix="la-times" on:close={() => (activeList = null)} />
    </nav>
    <svelte:fragment slot="content">
      {#if activeList}
        <div class="flex justify-between">
          <div class="flex justify-start items-center">
            <div class="h-7 w-7 bg-primary-300 rounded-sm mr-4" />
            <span>{activeList.creatorDisplayName}</span>
          </div>
          <span class="text-base">
            {convertNumToStringRatings(activeList.rating)}
          </span>
        </div>
        <div class="flex justify-start mt-4 justify-between">
          <span class="text-base">16 / {activeList.wordCount} Word(s)</span>
          <span>
            {SUPPORTED_LANGUAGES[activeList.languageWord]} -> {SUPPORTED_LANGUAGES[
              activeList.languageTranslation
            ]}
          </span>
        </div>
        <ul class="flex justify-start max-h-52 flex-col overflow-y-auto">
          {#each activeList.wordsSample as wordSample}
            <li class="p-2">{wordSample.word} -> {wordSample.translation}</li>
          {/each}
          {#each activeList.wordsSample as wordSample}
            <li class="p-2">{wordSample.word} -> {wordSample.translation}</li>
          {/each}
          {#each activeList.wordsSample as wordSample}
            <li class="p-2">{wordSample.word} -> {wordSample.translation}</li>
          {/each}
        </ul>
        <div class="flex justify-end mt-4">
          <Button iconPrefix="la-copy" text="Add to my Repetition List" />
        </div>
      {/if}
    </svelte:fragment>
  </Modal>
</template>

<style>
</style>
