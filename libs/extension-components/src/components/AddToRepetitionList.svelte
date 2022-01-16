<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button } from '@parrotly.io/ui';

  export let translation: string;
  let selected_words: string;

  const dispatch = createEventDispatcher();

  let selection = window.getSelection();
  selected_words = selection.toString().trim() || 'some long wod here';

  const addToRepetitionList = async () => {
    dispatch('addToRepetitionList', {
      text: selected_words,
      translation,
    });
    dispatch('close');
  };

  const playWords = async (event) => {
    event.stopPropagation();
    dispatch('playWord', {
      translation,
    });
  };
</script>

<template>
  <form
    class="flex-auto text-current"
    on:submit|preventDefault|stopPropagation={addToRepetitionList}
  >
    <div class="flex flex-wrap text-current">
      <input
        type="text"
        bind:value={selected_words}
        class="flex-auto dark:bg-primary-700 bg-opacity-95 dark:hover:bg-opacity-55 dark:focus:bg-opacity-55 bg-primary-100 hover:bg-primary-200 focus:bg-primary-200 dark:hover:bg-primary-800 dark:focus:bg-primary-800 font-roboto text-base px-2 transition duration-300 py-2 outline-none capitalize focus:bg-gray-200 hover:bg-gray-200 rounded-sm w-full mb-2 text-current"
      />

      <input
        type="text"
        bind:value={translation}
        class="flex-auto dark:bg-primary-700 bg-opacity-95 dark:hover:bg-opacity-55 dark:focus:bg-opacity-55 bg-primary-100 hover:bg-primary-200 focus:bg-primary-200 dark:hover:bg-primary-800 dark:focus:bg-primary-800 font-roboto text-base px-2 transition duration-300 py-2 capitalize outline-none focus:bg-gray-200 hover:bg-gray-200 rounded-sm w-full mb-2 text-current"
      />
    </div>
    <div class="flex space-x-3 font-medium">
      <div class="flex-auto flex space-x-3 justify-end">
        <Button on:click={playWords} type="button" icon="la-volume-down" />
        <Button
          text="Submit"
          type="submit"
          color="success"
          className="font-alegreya"
        />
      </div>
    </div>
  </form>
</template>
