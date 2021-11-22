<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { Button } from '@parrotly.io/ui';

  export let open = false;
  export let title = '';

  $: {
    console.log({ open });
  }

  const dispatch = createEventDispatcher();
</script>

<tempalte>
  {#if open}
    <div
      class="fixed left-0 right-0 w-screen dark:bg-primary-800 bg-primary-400 bg-opacity-80 dark:bg-opacity-80 z-modal h-screen top-0 bottom-0 backdrop-blur-sm flex items-center justify-center"
      transition:fade={{ duration: 100 }}
      on:click={() => dispatch('close')}
    >
      <slot name="modal">
        <div
          transition:fly={{ y: 30, duration: 300 }}
          on:click|stopPropagation
          class="min-w-[600px] bg-white dark:bg-primary-700 rounded-sm shadow-md p-4 flex flex-col dark:text-primary-400"
        >
          <slot name="header">
            <nav class="flex justify-between mb-2 items-center">
              {#if title}
                <h2 class="text-2xl">{title}</h2>
              {/if}
                <Button
                  iconPrefix="la-times"
                  on:click={() => dispatch('close')}
                />
            </nav>
          </slot>
          <slot name="content" />
          <slot name="footer" />
        </div>
      </slot>
    </div>
  {/if}
</tempalte>
