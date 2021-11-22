<script lang="ts">
  import type { IRepetitionList } from '@parrotly.io/types';

  import { onMount } from 'svelte';
  import { RepetitionListItem } from '../../components';
  import { useNavigate } from 'svelte-navigator';

  type ViewInterface = 'my_word_list' | 'public_word_list';

  let navigate = useNavigate();

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
      id: '92ceb8ef855346a81f3c279061d3f6',
      default: false,
      public: true,
      wordCount: 20,
      rating: 4,
      numberOfFork: 0,
      creatorId: 'lksdoweoidslksd',
      creatorPhotoUrl: 'lkweoisdlksd',
    },
  ];
  let activeList: IRepetitionList = repetitionLists[0];


  function onView(list: IRepetitionList) {
    navigate(list.id);
  }
</script>

<template>
  <section class="flex flex-col flex-1 pt-1 justify-start gap-4">
    <header class="flex justify-between">
      <h1 class="font-alegreya text-3xl font-semibold dark:text-white">
        Word List
      </h1>
      <input
        type="text"
        placeholder="search"
        class="outline-none bg-primary-600 min-w-[200px] bg-opacity-30 p-2"
      />
    </header>
    <nav class="flex gap-4">
      <button
        class="text-white outline-none font-roboto flex-none flex text-base items-center justify-center px-2 h-7 rounded-sm border-0 bg-primary-400 hover:bg-primary-900 focus:bg-primary-900 transition duration-300"
      >
        New Word List
      </button>
    </nav>

    <ul class="grid gap-4">
      {#each repetitionLists as repetitionList}
        <RepetitionListItem
          {repetitionList}
          on:view={({ detail }) => onView(detail)}
        />
      {/each}
    </ul>
  </section>
</template>

<style>
</style>
