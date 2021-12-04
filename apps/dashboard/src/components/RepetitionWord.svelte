<script lang="ts">
  import type { IRepetitionWord } from '@parrotly.io/types';
  import { Button, Chip } from '@parrotly.io/ui';
  import { createEventDispatcher } from 'svelte';

  export let word: IRepetitionWord;

  let titleCountShows = ``;
  let titleCountMCQs = ``;
  let titleCountQuizzes = ``;

  $: titleCountShows = `${word.countShows} Repetitions so far.`;
  $: titleCountMCQs = `${word.countMCQs.passed} MCQs passed so far.`;
  $: titleCountQuizzes = `${word.countQuizzes.passed} Quizzes passed so far.`;

  const dispatch = createEventDispatcher();
</script>

<template>
  <li
    class="border border-primary-500 rounded-sm flex flex-col gap-2 p-4 pb-2 hover:bg-primary-500 focus:bg-primary-500  dark:hover:bg-primary-700 dark:focus:bg-primary-700 duration-300 dark:text-primary-300 dark:focus:text-white"
  >
    <span class="font-bold">{word.word}</span>
    <span>{word.translation}</span>
    <div class="flex justify-start gap-4 flex-wrap">
      <Chip variant="primary" title={titleCountShows}>
        👀 {word.countShows}
      </Chip>
      <Chip variant="success" title={titleCountMCQs}>
        👀 {word.countMCQs.passed}
      </Chip>
      <Chip variant="success" title={titleCountQuizzes}>
        👀 {word.countQuizzes.passed}
      </Chip>
    </div>
    <div class="flex justify-end">
      <Button icon="la-eye" on:click={() => dispatch('view', word)} />
      <Button icon="la-trash" on:click={() => dispatch('delete', word)} />
    </div>
  </li>
</template>
