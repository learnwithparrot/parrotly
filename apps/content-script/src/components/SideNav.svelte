<script lang="ts">
  import { fly } from 'svelte/transition';

  export let onClose: () => {};

  let text = '';
  let popper;
  const onWindowClick = (e: Event) => {
    console.log({ e });

    //@ts-ignore
    if (!section.contains(e.target)) {
      onClose();
    }
  };

  let section: HTMLElement;
</script>

<svelte:window on:click={onWindowClick} />
<template>
  <div
    class="flex absolute bg-gray-200 p-6 right-0 top-0 shadow-lg items-center justify-center z-modal max-w-popup h-full w-[350px]"
    bind:this={section}
    on:click|stopPropagation
    transition:fly={{ x: 20, duration: 300 }}
  >
    <span>This is the sidenav</span>
    <button class="px-2 py-2 bg-gray-500 rounded-sm" on:click={onClose}
      >Close</button
    >
  </div>
</template>
