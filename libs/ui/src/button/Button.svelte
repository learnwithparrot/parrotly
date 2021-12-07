<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let variant: 'filled' | 'outlined' | 'flat' = 'flat';
  export let color: 'default' | 'success' | 'danger' | 'warning' | 'accent' =
    'default';
  export let text = '';
  export let type = '';
  export let iconPrefix = '';
  export let iconSuffix = '';
  export let icon = '';
  export let disabled = false;
  export let title = '';
  export let className = '';
</script>

<template>
  <button
    class={`btn ${className}`}
    class:btn--default={color === 'default'}
    class:btn--success={color === 'success'}
    class:btn--warning={color === 'warning'}
    class:btn--danger={color === 'danger'}
    class:btn--accent={color === 'accent'}
    class:btn--filled={variant === 'filled'}
    class:btn--outlined={variant === 'outlined'}
    class:btn--flat={variant === 'flat'}
    {type}
    {disabled}
    {title}
    aria-label="Delete repetition list"
    on:click={(event) => dispatch('click', event)}
  >
    {#if icon}
      <i class="las {icon} text-[20px] text-current" />
    {:else}
      <slot name="icon-prefix">
        {#if iconPrefix}
          <i class="las {iconPrefix} text-[20px] text-current" />
        {/if}
      </slot>
      <slot>
        {#if text}
          <span class="mx-2 text-current">{text}</span>
        {/if}
      </slot>
      <slot name="icon-suffix">
        {#if iconSuffix}
          <i class="las {iconSuffix} text-[20px] text-current" />
        {/if}
      </slot>
    {/if}
  </button>
</template>

<style lang="scss" global>
  .btn {
    @apply outline-none font-alegreya flex-none flex text-base items-center;
    @apply justify-center px-2 h-9 rounded-sm duration-300 transition;
  }

  .btn--filled,
  .btn--flat {
    @apply border-0;
    color: var(--text-flat);
    background-color: theme('colors.transparent');
    &:focus,
    &:hover {
      background-color: var(--focus-bg-flat);
    }
  }

  .btn--filled {
    background-color: var(--bg-flat);
    @apply shadow;
  }

  .dark .btn--accent,
  .btn--accent {
    --text-flat: theme('colors.accent.500');
    --focus-bg-flat: theme('colors.accent.200');
    --bg-flat: theme('colors.accent.100');
  }

  .dark .btn--warning,
  .btn--warning {
    --text-flat: theme('colors.warning.500');
    --focus-bg-flat: theme('colors.warning.200');
    --bg-flat: theme('colors.warning.100');
  }

  .dark .btn--danger,
  .btn--danger {
    --text-flat: theme('colors.danger.500');
    --focus-bg-flat: theme('colors.danger.200');
    --bg-flat: theme('colors.danger.100');
  }

  .dark .btn--success,
  .btn--success {
    --focus-bg-flat: theme('colors.success.200');
    --text-flat: theme('colors.success.500');
    --bg-flat: theme('colors.success.100');
  }

  .btn--default {
    --focus-bg-flat: theme('colors.primary.200');
    --text-flat: theme('colors.black');
    --bg-flat: theme('colors.primary.100');
  }

  .dark .btn--default {
    --focus-bg-flat: theme('colors.primary.900');
    --text-flat: theme('colors.primary.300');
    --bg-flat: theme('colors.primary.100');
  }
</style>
