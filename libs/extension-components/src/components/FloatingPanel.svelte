<script lang="ts">
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { ClickOutside } from '@parrotly.io/ui';

  const dispatch = createEventDispatcher();

  function handleClickOutside() {
    dispatch('close');
  }

  let container: HTMLDivElement;

  let selection = window.getSelection();

  let dimens: any = {
    left: '0px',
    right: '0px',
  };

  //Find position of window
  $: {
    if (selection.rangeCount > 0 && container) {
      let selectionCoords = selection.getRangeAt(0).getBoundingClientRect();
      let windowWidth = container.clientWidth;
      let windowHeight = container.clientHeight;
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
</script>

<template>
  <ClickOutside {container} on:clickOutside={handleClickOutside}>
    <div
      class="flex absolute dark:bg-primary-800 bg-primary-100 bg-opacity-95 dark:bg-opacity-95  dark:text-primary-300 rounded-md p-6 pb-2 shadow-xl z-modal w-popup backdrop-blur-sm"
      style="left:{dimens.left}; top:{dimens.top};"
      bind:this={container}
      on:click|stopPropagation
      transition:fly={{ y: 20, duration: 300 }}
    >
      <slot />
    </div>
  </ClickOutside>
</template>
