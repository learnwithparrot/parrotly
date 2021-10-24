<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let defaultChecked;
  export let statusText: { on: string; off: string };
  const dispatch = createEventDispatcher();

  function change(event) {
    dispatch('change', { checked: event.target.checked });
  }
</script>

<div class="flex justify-end items-center">
  <div
    class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
  >
    <input
      type="checkbox"
      name="toggle"
      id="toggle"
      checked={defaultChecked}
      on:change={change}
      class="toggle-checkbox transition-all duration-700 absolute block w-6 h-6 checked:border-success-500 rounded-full bg-white border-4 border-primary-400 appearance-none cursor-pointer"
    />
    <label
      for="toggle"
      class="toggle-label block transition-all duration-700 overflow-hidden h-6 rounded-full bg-primary-200 cursor-pointer"
    />
  </div>
  {#if statusText}
    <label for="toggle" class="inline text-xs text-primary-700">
      {defaultChecked ? statusText.on : statusText.off}
    </label>
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
