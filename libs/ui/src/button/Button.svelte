<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let text = '';
  export let iconPrefix = '';
  export let iconSuffix = '';
  export let icon = '';
  export let disabled = false;
  export let title = '';
</script>

<template>
  <button
    class="outline-none font-roboto flex-none flex text-base items-center justify-center px-2 min-w-5 h-9 rounded-sm text-black dark:text-primary-300 border-0 hover:bg-primary-200 focus:bg-primary-200 dark:hover:bg-primary-900 dark:focus:bg-primary-900 transition duration-300"
    type="button"
    {disabled}
    {title}
    aria-label="Delete repetition list"
    on:click={(event) => dispatch('click', event)}
  >
    {#if icon}
      <i class="las {icon} text-[30] text-current" />
    {:else}
      <slot name="icon-prefix">
        {#if iconPrefix}
          <i class="las {iconPrefix} text-[30] text-current" />
        {/if}
      </slot>
      <slot>
        {#if text}
          <span class="mx-2">{text}</span>
        {/if}
      </slot>
      <slot name="icon-suffix">
        {#if iconSuffix}
          <i class="las {iconSuffix} text-[30] text-current" />
        {/if}
      </slot>
    {/if}
  </button>
</template>
