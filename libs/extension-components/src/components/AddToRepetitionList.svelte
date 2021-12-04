<script lang="ts">
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { Button } from '@parrotly.io/ui';

  export let translation: string;
  let selected_words: string;

  const dispatch = createEventDispatcher();

  const onWindowClick = (e: Event) => {
    //@ts-ignore
    if (!section.contains(e.target)) {
      dispatch('close');
    }
  };

  let section: HTMLElement;

  let selection = window.getSelection();
  selected_words = selection.toString().trim();

  let dimens: any = {
    left: '0px',
    right: '0px',
  };

  //Find position of window
  $: {
    if (selection.rangeCount > 0 && section) {
      let selectionCoords = selection.getRangeAt(0).getBoundingClientRect();
      let windowWidth = section.clientWidth;
      let windowHeight = section.clientHeight;
      let left =
        selectionCoords.left - windowWidth / 2 + selectionCoords.width / 2;
      let top = selectionCoords.bottom + 10;
      if (left < 0) {
        dimens.left = 0;
      } else {
        if (left + windowWidth > window.innerWidth) {
          dimens.left = 'auto';
          dimens.right = 0;
        } else {
          dimens.left = left + 'px';
        }
      }
      let scrollTop = window.pageYOffset;
      let documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      if (top + scrollTop + windowHeight > documentHeight) {
        dimens.top = documentHeight - windowHeight - 10 + 'px';
      } else {
        dimens.top = top + scrollTop + 'px';
      }
    }
  }

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

<svelte:window on:click={onWindowClick} />

<template>
  <div
    class="flex absolute dark:bg-primary-800 bg-primary-100 dark:bg-primary-100 dark:text-primary-300 rounded-md p-6 shadow-xl z-modal w-popup backdrop-blur-sm"
    style="left:{dimens.left}; top:{dimens.top};"
    bind:this={section}
    on:click|stopPropagation
    transition:fly={{ y: 20, duration: 300 }}
  >
    <form
      class="flex-auto"
      on:submit|preventDefault|stopPropagation={addToRepetitionList}
    >
      <div class="flex flex-wrap -ml-2">
        <input
          type="text"
          bind:value={selected_words}
          class="flex-auto dark:bg-primary-700 bg-primary-100 dark:bg-primary-100 hover:bg-primary-200 focus:bg-primary-200 font-roboto text-base px-2 transition duration-300 py-2 outline-none capitalize focus:bg-gray-200 hover:bg-gray-200 rounded-sm w-full mb-2"
        />

        <input
          type="text"
          bind:value={translation}
          class="flex-auto dark:bg-primary-700 bg-primary-100 dark:bg-primary-100 hover:bg-primary-200 focus:bg-primary-200 font-roboto text-base px-2 transition duration-300 py-2 capitalize outline-none focus:bg-gray-200 hover:bg-gray-200 rounded-sm w-full mb-2"
        />
      </div>
      <div class="flex space-x-3 font-medium">
        <div
          class="relative text-left ml-auto flex items-center"
        >
          <div>
            <div
              class=" text-sm text-gray-500 underline height flex items-end"
              aria-expanded="true"
              aria-haspopup="true"
            >
              Default category
            </div>
          </div>
        </div>
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
  </div>
</template>
