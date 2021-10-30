<script lang="ts">
  import { onMount } from 'svelte';
  let currentItem = 'my_word_list';
  let emptyStar = '☆';
  let fullStar = '★';
  let rating = 4;
  let ratingTransformed = new Array(4).fill(null).map((_) => fullStar);
  for (let i = 0; i < 5 - rating; i++) {
    ratingTransformed.push(emptyStar);
  }
  const ratingString = ratingTransformed.join('');
  const translationWords = [
    { word: 'Contention', translation: 'Meinungsverschiedenheit' },
    { word: 'Put', translation: 'Stellen' },
    { word: 'Present', translation: 'Vorstellen' },
    { word: 'Just now', translation: 'So eben' },
    { word: 'Strike', translation: 'Streit' },
    { word: 'Concern', translation: 'Angehen + AKK' },
  ];

  onMount(() => {});
</script>

<template>
  <section class="flex flex-col flex-1 p-4 justify-start gap-4">
    <header class="flex justify-between">
      <h1 class="font-alegreya text-2xl font-semibold">Word List</h1>
      <input
        type="text"
        placeholder="search"
        class="outline-none bg-primary-600 min-w-[200px] bg-opacity-30 p-2"
      />
    </header>
    <nav class="flex gap-4">
      <button
        class="text-white outline-none font-roboto flex-none flex text-base items-center justify-center px-5 h-9 rounded-sm border-0 bg-primary-400 hover:bg-primary-900 focus:bg-primary-900 transition duration-300"
        class:bg-primary-800={currentItem === 'my_word_list'}
        on:click={() => (currentItem = 'my_word_list')}
      >
        My Word Lists
      </button>
      <button
        class="text-white outline-none font-roboto flex-none flex text-base items-center justify-center px-5 h-9 rounded-sm border-0 bg-primary-400 hover:bg-primary-900 focus:bg-primary-900 transition duration-300"
        class:bg-primary-800={currentItem === 'public_word_list'}
        on:click={() => (currentItem = 'public_word_list')}
      >
        Public Word Lists
      </button>
      <button
        class="text-white outline-none font-roboto flex-none flex text-base items-center justify-center px-5 h-9 rounded-sm border-0 bg-primary-400 hover:bg-primary-900 focus:bg-primary-900 transition duration-300"
      >
        New Word List
      </button>
    </nav>

    <ul class="grid">
      <li
        class="border border-primary-500 h-60 w-50 rounded-sm flex flex-col gap-2 p-4 hover:bg-primary-500 focus:bg-primary-500  dark:hover:bg-primary-800 dark:focus:bg-primary-800 duration-300 dark:text-white dark:focus:text-white"
      >
        <div class="flex justify-between flex-none items-center">
          <h3 class="text-lg font-alegreya">German most used words</h3>
          <div class="flex gap-4 items-center">
            {#if currentItem}
            <button
              class="text-white outline-none font-roboto flex-none flex text-base items-center justify-center px-5 h-9 rounded-sm border-0 bg-primary-400 hover:bg-primary-900 focus:bg-primary-900 transition duration-300"
            >
              Submit rating
            </button>
          {/if}
            <span class="text-xl font-semibold">{ratingString}</span>
          </div>
        </div>
        <span>German -> English (699 words)</span>
        <div class="flex gap-2 flex-wrap flex-1">
          {#each translationWords as item}
            <span>{item.word} -> {item.translation}</span>
          {/each}
        </div>
        <div class="flex-none flex gap-4">
          {#if currentItem}
            <button
              class="text-white outline-none font-roboto flex-none flex text-base items-center justify-center px-5 h-9 rounded-sm border-0 bg-primary-400 dark:bg-primary-600 hover:bg-primary-900 focus:bg-primary-900 transition duration-300"
            >
              Copy to My Word Lists
            </button>
          {/if}
          <button
            class="outline-none font-roboto flex-none flex text-base items-center justify-center w-9 h-9 rounded-sm text-black dark:text-primary-300 border-0 hover:bg-primary-200 focus:bg-primary-200 hover:bg-primary-900 focus:bg-primary-900 transition duration-300"
            type="button"
            aria-label="Play sound"
          >
            <i class="las la-eye text-[30]" />
          </button>
          <button
            class="outline-none font-roboto flex-none flex text-base items-center justify-center w-9 h-9 rounded-sm text-black dark:text-primary-300 border-0 hover:bg-primary-200 focus:bg-primary-200 hover:bg-primary-900 focus:bg-primary-900 transition duration-300"
            type="button"
            aria-label="Play sound"
          >
            <i class="las la-trash text-[30]" />
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style>
</style>
