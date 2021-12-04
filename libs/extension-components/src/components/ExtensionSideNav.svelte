<script lang="ts">
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import RepetitionListSettings from './RepetitionListSettings.svelte';
  import AutoTranslationSettings from './AutoTranslationSettings.svelte';
  import { Toggle } from '@parrotly.io/ui';
  import type {
    IUserReptitionListSettings,
    IUserSettings,
  } from '@parrotly.io/types';
  import { SUPPORTED_LANGUAGES } from '@parrotly.io/constants';
  import type { Language } from '@parrotly.io/constants';
  import { onMount } from 'svelte';
  import SideNavLogin from './SideNavLogin.svelte';
  import { BehaviorSubject, combineLatest, Operator, Subject } from 'rxjs';
  import { takeUntil, debounceTime, skip } from 'rxjs/operators';

  export let userSettings = {} as IUserSettings;

  const dispatch = createEventDispatcher();
  const destroy = new Subject<boolean>();
  let container: HTMLElement;
  let currentTab: 'showWord' | 'autoTranslation' = 'showWord';
  const repetitionListSettings =
    new BehaviorSubject<IUserReptitionListSettings>(userSettings);
  const nativeLanguage = new BehaviorSubject<Language>(
    userSettings.languageSpoken
  );
  const desiredLanguage = new BehaviorSubject<Language>(
    userSettings.languageLearned
  );
  const userTheme = new BehaviorSubject<boolean>(userSettings.theme === 'dark');

  /**
   * For some weird reason, importing svelte subjects here
   * prevents content-script project from compilling without
   * any proper error hence we're using behaviour subjects as below
   */

  //@ts-ignore
  repetitionListSettings.set = repetitionListSettings.next;
  //@ts-ignore
  nativeLanguage.set = nativeLanguage.next;
  //@ts-ignore
  desiredLanguage.set = desiredLanguage.next;
  //@ts-ignore
  userTheme.set = userTheme.next;

  const supportedLanguages = Object.keys(SUPPORTED_LANGUAGES).map((key) => ({
    value: key,
    label: SUPPORTED_LANGUAGES[key],
  }));

  const onWindowClick = (e: Event) => {
    //@ts-ignore
    if (!container.contains(e.target)) {
      dispatch('close');
    }
  };

  onMount(() => {
    const sub = combineLatest([
      repetitionListSettings,
      nativeLanguage,
      desiredLanguage,
      userTheme,
    ])
      .pipe(skip(1), debounceTime(300), takeUntil(destroy))
      .subscribe(
        ([repetitionList, languageSpoken, languageLearned, isDarkMode]) => {
          const settings = {
            ...repetitionList,
            theme: isDarkMode ? 'dark' : 'light',
            languageSpoken,
            languageLearned,
          };
          dispatch('settings', settings);
          Object.keys(settings).forEach((key) => {
            userSettings[key] = settings[key];
          });
        }
      );
  });
</script>

<svelte:window on:click={onWindowClick} />
<template>
  <div
    class="fixed flex items-stretch right-0 top-0 z-modal max-w-popup h-full w-[350px] dark:bg-primary-800 bg-primary-100 dark:text-primary-300"
    bind:this={container}
    on:click|stopPropagation
    transition:fly={{ x: 30, duration: 300 }}
  >
    <div class="drop-shadow" />
    <div
      class="relative flex-grow flex p-4 pt-1 flex-col  items-stretch justify-start "
    >
      <div class="flex items-center justify-start mb-4">
        <a
          class="outline-none font-alegreya dark:text-primary-300 text-2xl font-medium flex-none flex items-center justify-center hover:underline focus:underline"
          href="https://learnwithparrot.io"
          target="_blank"
        >
          <span class="text-current">Learn with Parrot</span>
          <i class="lab la-earlybirds dark:text-primary-300 text-[30px]" />
        </a>
      </div>
      {#if !userSettings}
        <SideNavLogin />
      {:else}
        <div class="flex items-center justify-between dark:text-primary-300">
          <span class="dark:text-primary-300">Theme </span>
          <Toggle bind:checked={$userTheme} let:labelFor>
            <label for={labelFor} class="inline" slot="left">
              <i class="las text-[25px] text-current la-moon" />
            </label>
            <label for={labelFor} class="inline" slot="right">
              <i class="las text-[25px] text-current la-sun" />
            </label>
          </Toggle>
        </div>
        <div class="flex items-center justify-between mt-4">
          <span class="dark:text-primary-300">I speak </span>
          <select
            class="block bg-transparent dark:text-primary-300 text-justify flex outline-none items-center px-4 py-2 text-sm hover:bg-primary-100 hover:text-primary-900 focus:bg-primary-100 focus:text-primary-900 duration-300 rounded-sm"
            bind:value={$nativeLanguage}
          >
            {#each supportedLanguages as language}
              <option value={language.value}>
                {language.label || language.value}
              </option>
            {/each}
          </select>
        </div>
        <div class="flex items-center justify-between mt-4">
          <span class="dark:text-primary-300">I want to learn&nbsp;</span>
          <select
            class="block bg-transparent dark:text-primary-300 text-justify flex outline-none items-center px-4 py-2 text-sm hover:bg-primary-100 hover:text-primary-900 focus:bg-primary-100 focus:text-primary-900 duration-300 rounded-sm"
            bind:value={$desiredLanguage}
          >
            {#each supportedLanguages as language}
              <option value={language.value}>
                {language.label || language.value}
              </option>
            {/each}
          </select>
        </div>

        <!-- tabs -->
        <div
          class="flex flex-none rounded-sm justify-start my-4 bg-gray-50 py-1"
        >
          <button
            class="px-4 py-2 mr-2 cursor-pointer rounded-sm hover:bg-primary-300 hover:text-primary-500 focus:bg-primary-300 focus:text-primary-500"
            on:click={() => (currentTab = 'autoTranslation')}
            class:bg-primary-300={currentTab === 'autoTranslation'}
            class:text-primary-500={currentTab === 'autoTranslation'}
            class:shadow-sm={currentTab === 'autoTranslation'}
          >
            Auto Translation
          </button>
          <button
            class="px-4 py-2 cursor-pointer rounded-sm  hover:bg-primary-300 hover:text-primary-500 focus:bg-primary-300 focus:text-primary-500"
            class:bg-primary-300={currentTab === 'showWord'}
            class:text-primary-500={currentTab === 'showWord'}
            class:shadow-sm={currentTab === 'showWord'}
            on:click={() => (currentTab = 'showWord')}
          >
            Repetition List
          </button>
        </div>
        {#if currentTab === 'showWord'}
          <RepetitionListSettings bind:settings={$repetitionListSettings} />
        {:else}
          <AutoTranslationSettings />
        {/if}
      {/if}
    </div>
  </div>
</template>

<style>
  .drop-shadow {
    background: linear-gradient(
      to left,
      rgba(0, 0, 0, 0.2) 0px,
      rgba(0, 0, 0, 0.2) 1px,
      rgba(0, 0, 0, 0.1) 1px,
      rgba(0, 0, 0, 0) 100%
    );
    bottom: 0px;
    left: -3px;
    opacity: 0.5;
    pointer-events: none;
    position: absolute;
    top: 0px;
    height: 100%;
    transition-duration: 0.22s;
    transition-property: left, opacity, width;
    transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
    flex: 0 0 3px;
    width: 3px;
  }
</style>
