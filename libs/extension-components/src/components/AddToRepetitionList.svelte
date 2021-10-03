<script lang="ts">
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

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

  $: {
    //Find position of window
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

  const playWords = async () => {
    dispatch('playWord', {
      translation,
    });
  };

</script>

<svelte:window on:click={onWindowClick} />

<template>
  <div
    class="flex absolute bg-white rounded-md p-6 shadow-xl z-modal w-popup"
    style="left:{dimens.left}; top:{dimens.top};"
    bind:this={section}
    on:click|stopPropagation
    transition:fly={{ y: 20, duration: 300 }}
  >
    <!-- on:click|stopPropagation -->
    <form
      class="flex-auto"
      on:submit|preventDefault|stopPropagation={addToRepetitionList}
    >
      <div class="flex flex-wrap">
        <input
          type="text"
          bind:value={selected_words}
          class="flex-auto font-roboto text-base px-2 transition duration-300 py-2 outline-none capitalize focus:bg-gray-200 hover:bg-gray-200 rounded-sm w-full mb-2"
        />

        <input
          type="text"
          bind:value={translation}
          class="flex-auto font-roboto text-base px-2 transition duration-300 py-2 capitalize outline-none focus:bg-gray-200 hover:bg-gray-200 rounded-sm w-full mb-2"
        />
      </div>
      <div class="flex space-x-3 font-medium">
        <div class="relative inline-block text-left ml-auto">
          <div>
            <div
              class=" text-sm text-gray-500 underline height align-baseline flex items-end"
              aria-expanded="true"
              aria-haspopup="true"
            >
              Default category
            </div>
          </div>

          <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          -->
          {#if false}
            <div
              class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1"
            >
              <div class="py-1" role="none">
                <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                <a
                  href="#"
                  class="text-gray-700 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-0">Account settings</a
                >
                <a
                  href="#"
                  class="text-gray-700 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-1">Support</a
                >
                <a
                  href="#"
                  class="text-gray-700 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-2">License</a
                >
                <form method="POST" action="#" role="none">
                  <button
                    type="submit"
                    class="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                    role="menuitem"
                    tabindex="-1"
                    id="menu-item-3"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          {/if}
        </div>
        <div class="flex-auto flex space-x-3 justify-end">
          <button
            on:click|stopPropagation={playWords}
            class="flex-none flex text-base items-center justify-center w-9 h-9 rounded-sm text-gray-900 border hover:bg-gray-200 hover:text-black transition duration-300"
            type="button"
            aria-label="like"
          >
            <i class="las la-volume-down text-[30]" />
          </button>
          <button
            class="w-1/2 flex text-base items-center justify-center font-alegreya rounded-sm bg-black text-white hover:bg-gray-800"
            type="submit"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
