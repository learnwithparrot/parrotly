<script lang="ts">
  import { SUPPORTED_LANGUAGES } from '@parrotly.io/constants';

  import type { IRepetitionList } from '@parrotly.io/types';
  import { createEventDispatcher } from 'svelte';
  import { convertNumToStringRatings } from './../utils';

  export let publicView = false;
  export let repetitionList: IRepetitionList;

  const dispatch = createEventDispatcher();

  function onView(item: IRepetitionList) {
    dispatch('view', repetitionList);
  }

  function deleteList(item: IRepetitionList) {
    dispatch('delete', repetitionList);
  }

  function copyToOwnWordList(item: IRepetitionList) {
    dispatch('copyToOwnWordList', repetitionList);
  }
</script>

<li
  class="border border-primary-500 h-60 w-50 rounded-sm flex flex-col gap-2 p-4 hover:bg-primary-500 focus:bg-primary-500  dark:hover:bg-primary-700 dark:focus:bg-primary-700 duration-300 dark:text-primary-300 dark:focus:text-white"
>
  <div class="flex justify-between flex-none items-center">
    <h3 class="text-lg font-alegreya">{repetitionList.name}</h3>
    <div class="flex gap-4 items-center">
      {#if publicView}
        <button
          class="text-white outline-none font-roboto flex-none flex text-base items-center justify-center px-5 h-9 rounded-sm border-0 bg-primary-400 hover:bg-primary-900 focus:bg-primary-900 transition duration-300"
        >
          Submit rating
        </button>
      {/if}
      <span class="text-xl font-semibold">
        {convertNumToStringRatings(repetitionList.rating)}
      </span>
    </div>
  </div>
  <span>
    {SUPPORTED_LANGUAGES[repetitionList.languageWord]} -> {SUPPORTED_LANGUAGES[
      repetitionList.languageTranslation
    ]} ({repetitionList.wordCount} word:s)
  </span>
  <div class="flex gap-2 flex-wrap flex-1">
    {#each repetitionList.wordsSample as item}
      <span>{item.word} -> {item.translation}</span>
    {/each}
  </div>
  <div class="flex-none flex gap-4">
    {#if publicView}
      <button
        class="text-white outline-none font-roboto flex-none flex text-base items-center justify-center px-5 h-9 rounded-sm border-0 bg-primary-400 dark:bg-primary-600 hover:bg-primary-900 focus:bg-primary-900 transition duration-300"
        on:click={() => copyToOwnWordList(repetitionList)}
      >
        Copy to My Word Lists
      </button>
    {/if}
    <button
      class="outline-none font-roboto flex-none flex text-base items-center justify-center w-9 h-9 rounded-sm text-black dark:text-primary-300 border-0 hover:bg-primary-200 focus:bg-primary-200 dark:hover:bg-primary-900 dark:focus:bg-primary-900 transition duration-300"
      type="button"
      aria-label="View repetition list"
      on:click={() => onView(repetitionList)}
    >
      <i class="las la-eye text-[30]" />
    </button>
    {#if !publicView}
      <button
        class="outline-none font-roboto flex-none flex text-base items-center justify-center w-9 h-9 rounded-sm text-black dark:text-primary-300 border-0 hover:bg-primary-200 focus:bg-primary-200 dark:hover:bg-primary-900 dark:focus:bg-primary-900 transition duration-300"
        type="button"
        aria-label="Delete repetition list"
        on:click={() => deleteList(repetitionList)}
      >
        <i class="las la-trash text-[30]" />
      </button>
    {/if}
  </div>
</li>
