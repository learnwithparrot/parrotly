<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Language } from '@parrotly.io/constants';
  import { Button } from '@parrotly.io/ui';
  import { ShowWordcontainer } from '..';

  // bind props
  export let showWordDurationSeconds = 4;
  export let word: string;
  export let translation: string;
  export let languageTo: Language; //id of the word doc in db

  //variable declarations
  let url;
  const dispatch = createEventDispatcher();

  $: {
    url = `https://www.google.com/search?q=how+to+use+%22${translation}%22+in+${languageTo}`;
  }

  function onPlayWord() {
    dispatch('playWord');
  }

</script>

<template>
  <ShowWordcontainer
    {showWordDurationSeconds}
    on:disable
    on:close
    on:knowWord
  >
    <div
      class="flex-1 font-roboto justify-center items-center flex sm:flex-col dark:text-primary-300"
      class:md:flex-col={(word + translation).length > 25}
      slot="main-content"
    >
      <span class="text-3xl text-current">{word}</span>
      <span class="text-3xl text-current">-</span>
      <span class="text-3xl text-current">{translation}</span>
    </div>

    <svelte:fragment slot="actions">
      <Button
        icon="la-volume-down"
        aria-label="Play sound"
        on:click={onPlayWord}
      />
      <a href={url} target="_blank" class="btn btn--flat btn--default mx-4">
        <span class="text-current"> How to use? </span>
        <i class="las la-long-arrow-alt-up text-[30px] rotate-45 text-current" />
      </a>
    </svelte:fragment>
  </ShowWordcontainer>
</template>
