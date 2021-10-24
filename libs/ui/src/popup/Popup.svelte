<script lang="ts">
  import { slide } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import type { IMenuItem } from '.';

  export let placeholder: string;
  export let menuItems: IMenuItem[] = [];
  let title = placeholder;

  const dispatch = createEventDispatcher();
  let dropdownOpen = false;

  $: {
    const item = menuItems.find((item) => item.active);
    title = item?.label || item?.value || placeholder;
  }

  function onMenuItem(item: IMenuItem) {
    dispatch('menuitem', item);
    onClose();
  }
  function onOpen() {
    dropdownOpen = true;
  }
  function onClose() {
    dropdownOpen = false;
  }
</script>

<div
  on:mouseenter={onOpen}
  on:mouseleave={onClose}
  on:focus={onOpen}
  class="flex-none relative inline-block text-left flex items-baseline"
  on:blur={onClose}
>
  <div>
    <slot name="trigger" {title}>
      <span>{title}</span>
    </slot>
  </div>
  {#if dropdownOpen}
    <div
      class="z-popup top-full absolute right-0 rounded-sm shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
      transition:slide={{ duration: 1000 }}
    >
      <ul class="py-1" role="none">
        {#each menuItems as item}
          <slot name="menu-item" {item}>
            <li
              href="#"
              class="block flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
              role="menuitem"
              class:bg-gray-100={item.active}
              class:text-gray-900={item.active}
              class:text-gray-700={!item.active}
              tabindex="-1"
              id="menu-item-0"
              on:click={() => onMenuItem(item)}
            >
              <slot name="prefix-icon" {item}>
                {#if item.prefixIcon}
                  <i
                    class="lab {item.prefixIcon} text-[30] mr-2 text-current"
                  />
                {/if}
              </slot>
              <span>{item.label || item.value}</span>
              <slot name="sufix-icon" {item}>
                {#if item.suffixIcon}
                  <i
                    class="lab {item.suffixIcon} text-[30] ml-2 text-current"
                  />
                {/if}
              </slot>
            </li>
          </slot>
        {/each}
      </ul>
    </div>
  {/if}
</div>
