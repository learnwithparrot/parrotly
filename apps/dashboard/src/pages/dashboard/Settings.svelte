<script lang="ts">
  import type { IUserReptitionListSettings } from '@parrotly.io/types';
  import { onMount } from 'svelte';
  import { SettingsService } from '../../services';
  import { RepetitionListSettings } from '@parrotly.io/extension-components';
  import { SvelteSubject } from '@parrotly.io/ui/utils';
  import { SUPPORTED_LANGUAGES, Language } from '@parrotly.io/constants';
  import { Toggle } from '@parrotly.io/ui';
  import { combineLatest, Subject } from 'rxjs';
  import {
    debounceTime,
    first,
    map,
    shareReplay,
    switchMap,
    takeUntil,
  } from 'rxjs/operators';
  import { authState } from 'rxfire/auth';
  import { getAuth } from '@firebase/auth';

  const settings = new SvelteSubject<IUserReptitionListSettings>(
    {} as IUserReptitionListSettings
  );
  const nativeLanguage = new SvelteSubject<Language>('en');
  const desiredLanguage = new SvelteSubject<Language>('de');
  const userTheme = new SvelteSubject<boolean>(true);

  const destroy = new Subject<boolean>();
  const settingsService = new SettingsService();

  const auth$ = authState(getAuth()).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  const userSettings$ = auth$.pipe(
    switchMap((user) => settingsService.getDocData(user.uid)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  const welcomeMode$ = userSettings$.pipe(
    map((settings) => !settings.languageLearned || !settings.languageSpoken)
  );

  userSettings$.pipe(first()).subscribe((userSettings) => {
    settings.next(userSettings);
    userTheme.next(userSettings.theme === 'dark');
    nativeLanguage.next(userSettings.languageSpoken);
    desiredLanguage.next(userSettings.languageLearned);
  });

  const supportedLanguages = Object.keys(SUPPORTED_LANGUAGES).map((key) => ({
    value: key,
    label: SUPPORTED_LANGUAGES[key],
  }));

  onMount(() => {
    combineLatest([settings, userTheme, nativeLanguage, desiredLanguage, auth$])
      .pipe(takeUntil(destroy.asObservable()), debounceTime(300))
      .subscribe(
        ([newSettings, theme, languageSpoken, languageLearned, user]) =>
          settingsService.update(user.uid, {
            ...newSettings,
            languageLearned,
            languageSpoken,
            theme: theme ? 'dark' : 'light',
          })
      );
    return () => destroy.next();
  });
</script>

<template>
  {#if $welcomeMode$}
    <span
      class="font-alegreya text-left text-md max-w-[620px] mb-4  text-success-500 bg-success-100 p-2"
    >
      Hi, welcome.<br />
      So stoked to help you passively learn the vocabulary of any language. Please
      save your language and theme preferences below and we can start having some
      fun learning.
    </span>
  {/if}
  <div class="container">
    <div class="flex flex-col">
      <h3 class="font-alegreya font-semibold text-lg">General</h3>
      <div class="flex items-center justify-between">
        <span>Theme </span>

        <Toggle bind:checked={$userTheme} let:checked let:labelFor>
          <label for={labelFor} class="inline" slot="left">
            <i class="las text-[25px] la-moon" />
          </label>
          <label for={labelFor} class="inline" slot="right">
            <i class="las text-[25px] la-sun" />
          </label>
        </Toggle>
      </div>
      <div class="flex items-center justify-between mt-4">
        <span>I speak </span>
        <select
          class="block flex outline-none items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 duration-300 rounded-sm"
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
        <span>I want to learn </span>
        <select
          class="block flex outline-none items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 duration-300 rounded-sm"
          bind:value={$desiredLanguage}
        >
          {#each supportedLanguages as language}
            <option value={language.value}>
              {language.label || language.value}
            </option>
          {/each}
        </select>
      </div>
    </div>
    <div class="flex flex-col">
      <h3 class="font-alegreya font-semibold text-lg">Word Repetition</h3>
      <RepetitionListSettings bind:settings={$settings} />
    </div>
  </div>
</template>

<style lang="scss">
  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    justify-content: space-between;
    align-items: start;
    @apply gap-4 flex-wrap;
  }
</style>
