<script lang="ts">
  import { fly } from 'svelte/transition';

  export let label;
  export let name;
  export let type = 'text';
  export let id;
  export let canExpand = true;
  export let expanded = false;
  export let error = '';
  export let hint = '';
  export let warning = '';
  export let value = '';

  let mouseover = false;
  let input: HTMLInputElement;

  const onFocus = () => (mouseover = true);
  const onBlur = () => (mouseover = false);

  /**
   * Reason why we are foced to change
   * the type here is because current
   * version of svelte doesn't permits us to
   * bind to both the input and value at once
   * on an input.
   */
  $: if (input) input.type = type;
</script>

<template>
  <fieldset
    class="flex flex-col relative font-alegreya flex-auto"
    on:focus={onFocus}
    on:blur={onBlur}
    class:pt-7={canExpand}
  >
    {#if canExpand}
      {#if expanded || mouseover || value}
        <label
          for={id}
          class="absolute left-0 top-0 text-primary-500"
          transition:fly={{ y: 30, duration: 300, x: 20 }}
        >
          {label}
        </label>
      {/if}
    {/if}

    <input
      bind:value
      bind:this={input}
      {id}
      {name}
      class="outline-none  flex-auto p-2 rounded-sm "
      placeholder={mouseover ? '' : label}
      class:input__error={error}
      class:input__default={!error && !warning}
      class:input__warning={warning}
    />
    {#if error || warning || hint}
      <small
        class:hint__error={error}
        class:hint__warning={warning}
        class:hint__default={hint}
      >
        {error || warning || hint}
      </small>
    {/if}
  </fieldset>
</template>

<style lang="scss">
  .hint__default {
    @apply text-primary-500;
  }

  .hint__error {
    @apply text-danger-500;
  }

  .hint__warning {
    @apply text-warning-500;
  }

  .input__default {
    @apply bg-primary-200 dark:bg-primary-700 dark:text-primary-500 placeholder-primary-500;
  }

  .input__error {
    @apply text-danger-500 bg-danger-100;
  }

  .input__warning {
    @apply text-warning-700 bg-warning-50;
  }
</style>
