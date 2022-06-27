<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button } from '@parrotly.io/ui';
  import { ShowWordcontainer } from '..';

  // bind props
  export let showWordDurationSeconds = 4;
  export let word: string;
  export let translation: string;
  // cannot send more than two options
  export let options: string[];
  let selectedOption: string;

  let mcqs: string[] = [];

  $: {
    const els = [options[0], options[1], translation].filter((el) => !!el);
    mcqs = shuffle(els);
  }

  //variable declarations
  const dispatch = createEventDispatcher();

  function onClose() {
    dispatch('close');
  }

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function onOptionClicked(option: string) {
    if (selectedOption) return;
    selectedOption = option;
    if (selectedOption === translation) {
      dispatch('rightAnswer');
      const VIEW_RIGHT_ANSWER_DURATION= 1000;
      setTimeout(onClose,   VIEW_RIGHT_ANSWER_DURATION);
    } else {
      dispatch('wrongAnswer');
      const VIEW_WRONG_ANSWER_DURATION = 2000;
      setTimeout(onClose, VIEW_WRONG_ANSWER_DURATION);
    }
  }

</script>

<template>
  <ShowWordcontainer
    {showWordDurationSeconds}
    on:close={onClose}
    on:knowWord
    on:disable
  >
    <div
      class="flex-1 font-roboto justify-center items-center flex flex-col dark:text-primary-300"
      slot="main-content"
    >
      <span class=" text-3xl text-current">{word}</span>
      <span class=" text-3xl text-current">-</span>
      <div class="flex gap-2 mb-4">
        {#each mcqs as mcq}
          <Button
            on:click={() => onOptionClicked(mcq)}
            text={mcq}
            variant="filled"
            color={selectedOption && mcq === translation
              ? 'success'
              : selectedOption === mcq
              ? 'danger'
              : 'default'}
          />
        {/each}
      </div>
    </div>
  </ShowWordcontainer>
</template>
