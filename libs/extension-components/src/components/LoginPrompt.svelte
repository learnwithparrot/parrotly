<script>
  import { createEventDispatcher } from 'svelte';
  import { Button } from '@parrotly.io/ui';

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('click');
  }
</script>

<template>
  <div class="flex flex-col gap-2 text-current">
    <span class="text-current text-center"> You are not connected. </span>
    <span class="text-current text-center"> Please login to save your settings and words. </span>
    <a
      href="https://app.learnwithparrot.com/auth/signout"
      on:click={handleClick}
      target="_blank"
      style="display:contents"
    >
      <Button variant={'filled'} color="success">Login</Button>
    </a>
  </div>
</template>
