<script lang="ts">
  import { fly } from 'svelte/transition';

  export let onClose: () => {};

  let text = '';
  let popper;
  const onWindowClick = (e: Event) => {
    //@ts-ignore
    if (!section.contains(e.target)) {
      onClose();
    }
  };

  let section: HTMLElement;
</script>

<svelte:window on:click={onWindowClick} />
<template>
  <button>This is a bare button component</button>
</template>
