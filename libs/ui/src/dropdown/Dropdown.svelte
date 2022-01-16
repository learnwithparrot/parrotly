<script lang="ts">
  import { Button, ClickOutside } from '..';
  import { slide } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  interface DropdownItem {
    value?: any;
    label: string;
  }

  export let items: DropdownItem[];
  export let vertical: 'top' | 'bottom' = 'bottom';
  export let horizontal: 'left' | 'right' = 'right';
  export let active: DropdownItem = undefined;

  let visible = false;
  let container: HTMLDivElement;

  $: {
    console.log({ visible });
  }

  const dispatch = createEventDispatcher();

  function toggleVisible() {
    visible = !visible;
  }

  function click(item: DropdownItem) {
    active = item;
    dispatch('select', { item });
    visible = false;
  }

  function clickOutside() {
    if (visible) visible = false;
  }
</script>

<template>
  <div class="relative inline-block text-left">
    <ClickOutside {container} on:clickOutside={clickOutside}>
      <div bind:this={container} id="another one">
        <slot name="trigger" {toggleVisible} {active}>
          <Button on:click={toggleVisible}>
            {active?.label ?? 'Dropdown'}
            <i class="las la-angle-down ml-2 text-[20px]" />
          </Button>
        </slot>
      </div>
    </ClickOutside>

    {#if visible}
      <div
        class="absolute w-56 rounded-sm shadow-md dark:bg-primary-800 bg-primary-100 dark:text-primary-300 focus:outline-none"
        role="menu"
        transition:slide={{ duration: 300 }}
        class:horizontal--left={horizontal === 'left'}
        class:horizontal--right={horizontal === 'right'}
        class:vertical--top={vertical === 'top'}
        class:vertical--bottom={vertical === 'bottom'}
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div class="py-1" role="none">
          <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
          {#each items as item}
            <slot
              name="item"
              classActive={'active'}
              {item}
              {active}
              click={() => click(item)}
            >
              <span
                on:click={() => click(item)}
                class="text-gray-700 block px-4 py-2 text-sm dark:hover:bg-primary-700"
                class:active={active?.value === item.value}
                role="menuitem"
                tabindex="-1"
                id="menu-item-0"
              >
                {item.label}
              </span>
            </slot>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</template>

<style lang="scss" global>
  .horizontal--left {
    @apply origin-top-left left-0;
  }

  .horizontal--right {
    @apply origin-top-right right-0;
  }

  .vertical--top {
    margin-top: calc(-1rem - 100%);
  }

  .vertical--bottom {
    @apply mt-2;
  }

  .active {
    @apply dark:bg-primary-700 bg-primary-200;
  }
</style>
