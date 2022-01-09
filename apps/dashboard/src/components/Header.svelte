<script lang="ts">
  import { Link, useNavigate } from 'svelte-navigator';
  import { getAuth } from 'firebase/auth';
  import { authState } from 'rxfire/auth';
  import { map, startWith } from 'rxjs/operators';
  import { Button } from '@parrotly.io/ui';
  import { createEventDispatcher } from 'svelte';

  const router = useNavigate();
  const dispatch = createEventDispatcher();

  const menuItems$ = authState(getAuth()).pipe(
    map((user) => [
      {
        path: `./my_list/${user?.uid}_default`,
        icon: 'lar la-copy',
        label: 'My List',
      },
      // {
      //   path: './public_list',
      //   icon: 'las la-users',
      //   label: 'Public List',
      // },
      // {
      //   path: './settings',
      //   icon: 'las la-cog',
      //   label: 'Settings',
      // },
      // {
      //   path: '/auth/signout',
      //   icon: 'las ',
      //   label: 'Sign Out',
      // },
    ]),
    startWith([])
  );

  function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
    const isActive = href === '/' ? isCurrent : isPartiallyCurrent || isCurrent;

    // The object returned here is spread on the anchor element's attributes
    const defaultClass =
      'hover:text-primary-800 hover:bg-primary-100 flex items-center p-1 transition-colors dark:hover:text-white dark:hover:bg-primary-800 duration-200  dark:focus:bg-primary-800 duration-200  text-primary-600 dark:text-primary-400 rounded-sm font-alegreya';
    if (isActive) {
      return { class: `${defaultClass} bg-primary-800 text-primary-400` };
    }
    return { class: defaultClass };
  }

  function handleSettings() {
    dispatch('settings');
  }

  function handleSignout() {
    router('/auth/signout');
  }
</script>

<template>
  <!-- bg-white dark:bg-primary-700 -->
  <div class="flex sm:flex-row justify-between mb-4">
    <a
      class="outline-none font-alegreya text-3xl font-medium flex-none flex items-center justify-center dark:text-primary-300"
      href="https://app.learnwithparrot.com"
      target="_blank"
    >
      <i class="lab la-earlybirds text-[30px]" />
      <span>Learn with Parrot</span>
    </a>
    <nav class="flex gap-4 items-center px-4">
      {#each $menuItems$ as menuItem}
        <Link to={menuItem.path} {getProps}>
          <i class="{menuItem.icon} w-[20px] text-current text-2xl" />
          <span class="mx-4 text-lg"> {menuItem.label} </span>
        </Link>
      {/each}
      <Button on:click={handleSettings} icon="las la-cog" title="Settings" />
      <Button
        on:click={handleSignout}
        icon="las la-sign-out-alt"
        title="Sign out"
      />
    </nav>
  </div>
</template>
