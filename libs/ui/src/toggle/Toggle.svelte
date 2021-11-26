<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let checked;
  const dispatch = createEventDispatcher();
  const labelFor = `${Math.random()}`;

  function change() {
    dispatch('change', { checked });
  }
</script>

<div class="flex justify-end items-center gap-4">
  <slot name="right" {checked} {labelFor} />
  <div
    class="relative inline-block w-10 align-middle select-none transition duration-200 ease-in"
  >
    <input
      type="checkbox"
      name="toggle"
      id={labelFor}
      bind:checked
      on:change={change}
      class="toggle-checkbox transition-all duration-700 absolute block w-6 h-6 checked:border-success-500 rounded-full bg-white border-4 border-primary-400 appearance-none cursor-pointer"
    />
    <label
      for={labelFor}
      class="toggle-label block transition-all duration-700 overflow-hidden h-6 rounded-full bg-primary-200 cursor-pointer"
    />
  </div>
  <slot name="left" {checked} {labelFor} />
  {#if !$$slots.left}
    <slot {checked} {labelFor} />
  {/if}
</div>

<style lang="postcss">
  .toggle-checkbox:checked {
    right: 0;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: rgba(94, 234, 212, 1);
  }
</style>
