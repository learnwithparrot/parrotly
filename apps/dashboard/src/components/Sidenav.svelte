<script lang="ts">
  import { Link } from 'svelte-navigator';
  import { getAuth } from 'firebase/auth';
  import { authState } from 'rxfire/auth';
  import { map, startWith } from 'rxjs/operators';

  const menuItems$ = authState(getAuth()).pipe(
    map((user) => [
      {
        path: `./my_list/${user?.uid}_default`,
        icon: 'lar la-copy',
        label: 'My List',
      },
      {
        path: './public_list',
        icon: 'las la-users',
        label: 'Public List',
      },
      {
        path: './settings',
        icon: 'las la-cog',
        label: 'Settings',
      },
      {
        path: '/auth/signout',
        icon: 'las la-sign-out-alt',
        label: 'Sign Out',
      },
    ]),
    startWith([])
  );

  function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
    const isActive = href === '/' ? isCurrent : isPartiallyCurrent || isCurrent;

    // The object returned here is spread on the anchor element's attributes
    const defaultClass =
      'hover:text-primary-800 hover:bg-primary-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-primary-800 duration-200  dark:focus:bg-primary-800 duration-200  text-primary-600 dark:text-primary-400 rounded-sm font-alegreya';
    if (isActive) {
      return { class: `${defaultClass} bg-primary-800 text-primary-400` };
    }
    return { class: defaultClass };
  }
</script>

<template>
  <section class="relative bg-white dark:bg-primary-700 w-72 rounded-[3px]">
    <div class="flex flex-col sm:flex-row sm:justify-around">
      <div class="w-72">
        <div class="flex items-center justify-start mx-6 mt-10">
          <div class="h-10 w-10 bg-primary-300 block" />
          <h1
            class="text-primary-600 dark:text-white ml-4 text-3xl font-bold font-alegreya"
          >
            Tail-Kit
          </h1>
        </div>
        <nav class="mt-10 px-6 ">
          {#each $menuItems$ as menuItem}
            <Link to={menuItem.path} {getProps}>
              <i class="{menuItem.icon} h-[20] w-[20] text-current text-2xl" />
              <span class="mx-4 text-lg"> {menuItem.label} </span>
              <span class="flex-grow text-right" />
            </Link>
          {/each}
        </nav>
        <div class="absolute bottom-0 my-10">
          <a
            class="text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100 transition-colors duration-200 flex items-center py-2 px-8"
            href="#"
          >
            <svg
              width="20"
              fill="currentColor"
              height="20"
              class="h-5 w-5"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1088 1256v240q0 16-12 28t-28 12h-240q-16 0-28-12t-12-28v-240q0-16 12-28t28-12h240q16 0 28 12t12 28zm316-600q0 54-15.5 101t-35 76.5-55 59.5-57.5 43.5-61 35.5q-41 23-68.5 65t-27.5 67q0 17-12 32.5t-28 15.5h-240q-15 0-25.5-18.5t-10.5-37.5v-45q0-83 65-156.5t143-108.5q59-27 84-56t25-76q0-42-46.5-74t-107.5-32q-65 0-108 29-35 25-107 115-13 16-31 16-12 0-25-8l-164-125q-13-10-15.5-25t5.5-28q160-266 464-266 80 0 161 31t146 83 106 127.5 41 158.5z"
              />
            </svg>
            <span class="mx-4 font-medium"> Support </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
