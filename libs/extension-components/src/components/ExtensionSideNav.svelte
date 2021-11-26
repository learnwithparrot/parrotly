<script lang="ts">
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import RepetitionListSettings from './RepetitionListSettings.svelte';
  import AutoTranslationSettings from './AutoTranslationSettings.svelte';
  import type { IMenuItem } from '@parrotly.io/ui/popup';
  import type {
    IUserReptitionListSettings,
    IUserLanguageSettings,
    IUserSettings,
  } from '@parrotly.io/types';
  import { combineLatest, Subject } from 'rxjs';
  import { debounceTime } from 'rxjs/operators';
  import type { LanguageType } from '@parrotly.io/constants';
  import { onMount } from 'svelte';
  import SideNavLogin from './SideNavLogin.svelte';

  export let userSettings: IUserSettings;

  const dispatch = createEventDispatcher();

  let container: HTMLElement;
  let currentTab: 'showWord' | 'autoTranslation' = 'showWord';
  const repetitionListSettings = new Subject<IUserReptitionListSettings>();
  const languageSettings = new Subject<IUserLanguageSettings>();

  let nativeLanguages: IMenuItem[] = [
    { label: 'English', value: 'en', active: true },
    { label: 'Deutsch', value: 'de' },
    { label: 'Français', value: 'fr' },
  ];

  let desiredLanguages: IMenuItem[] = [
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de', active: true },
    { label: 'Français', value: 'fr' },
  ];

  function mapSelectedItem(items: IMenuItem[], selectedItem: string) {
    let selectedLanguage: LanguageType;
    let nativeLanguages = items.map((_) => {
      if (_.value === selectedItem) {
        if (_.active) _.active = false;
        else {
          _.active = true;
          selectedLanguage = _.value;
        }
      } else _.active = false;
      return _;
    });
    return { nativeLanguages, selectedLanguage };
  }

  function nativeLanguageSelected(event) {
    const { selectedLanguage, nativeLanguages: mappedLanguages } =
      mapSelectedItem(nativeLanguages, event.target.value);
    nativeLanguages = mappedLanguages;
    const languageLearned = desiredLanguages.find((lang) => lang.active)?.value;
    languageSettings.next({
      languageSpoken: selectedLanguage,
      languageLearned,
    });
  }

  function desiredLanguageSelected(event) {
    const { selectedLanguage, nativeLanguages: mappedLanguages } =
      mapSelectedItem(desiredLanguages, event.target.value);
    desiredLanguages = mappedLanguages;
    const languageSpoken = nativeLanguages.find((lang) => lang.active)?.value;
    languageSettings.next({
      languageSpoken,
      languageLearned: selectedLanguage,
    });
  }

  const onWindowClick = (e: Event) => {
    //@ts-ignore
    if (!container.contains(e.target)) {
      dispatch('close');
    }
  };

  function nextRepetitionListSettings(data: IUserReptitionListSettings) {
    repetitionListSettings.next(data);
  }

  onMount(() => {
    const sub = combineLatest([
      repetitionListSettings.asObservable(),
      languageSettings.asObservable(),
    ])
      .pipe(debounceTime(1500))
      .subscribe(([repetitionList, languages]) => {
        const _settings = { ...repetitionList, ...languages };
        dispatch('settings', _settings);
        Object.keys(_settings).forEach((key) => {
          userSettings[key] = _settings[key];
        });
      });

    nativeLanguageSelected({
      target: { value: userSettings.languageSpoken },
    });
    desiredLanguageSelected({
      target: { value: userSettings.languageLearned },
    });

    return () => sub.unsubscribe();
  });
</script>

<svelte:window on:click={onWindowClick} />
<template>
  <div
    class="fixed flex items-stretch right-0 top-0 z-modal max-w-popup h-full w-[350px]"
    bind:this={container}
    on:click|stopPropagation
    transition:fly={{ x: 30, duration: 300 }}
  >
    <div class="drop-shadow" />
    <div
      class="relative flex-grow flex p-4 pt-1 flex-col bg-white  items-stretch justify-start "
    >
      <div class="flex items-center justify-start mb-4">
        <a
          class="outline-none font-alegreya text-2xl font-medium flex-none flex items-center justify-center dark:text-primary-300"
          href="https://learnwithparrot.io"
          target="_blank"
        >
          <span>Learn with Parrot</span>
          <i class="lab la-earlybirds text-[30]" />
        </a>
      </div>
      {#if !userSettings}
        <SideNavLogin />
      {:else}
        <div class="flex items-center justify-between">
          <span>I speak: </span>
          <select
            class="block flex outline-none items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 duration-300 rounded-sm"
            on:change={nativeLanguageSelected}
          >
            {#each nativeLanguages as language}
              <option value={language.value}>
                {language.label || language.value}
              </option>
            {/each}
          </select>
        </div>
        <div class="flex items-center justify-between mt-2">
          <span>I want to learn:</span>
          <select
            class="block flex outline-none items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 duration-300 rounded-sm"
            on:change={desiredLanguageSelected}
          >
            {#each desiredLanguages as language}
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
          <RepetitionListSettings
            settings={userSettings}
            on:settings={(event) => nextRepetitionListSettings(event.detail)}
          />
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
