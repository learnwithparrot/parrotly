<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let container: HTMLElement;

  const dispatch = createEventDispatcher();

  const onWindowClick = (e: Event) => {
    //@ts-ignore
    if (!container.contains(e.target)) {
      dispatch('clickOutside');
    }
  };
</script>

<svelte:window on:click={onWindowClick} />

<template>
  <slot />
</template>
