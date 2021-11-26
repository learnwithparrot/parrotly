<script lang="ts">
  import type { IUserReptitionListSettings } from '@parrotly.io/types';
  import { onMount } from 'svelte';
  import { Toggle } from '@parrotly.io/ui';
  import { createEventDispatcher } from 'svelte';

  export let settings: IUserReptitionListSettings;
  const dispatch = createEventDispatcher();

  // let maximumMCQs = settings.maximumMCQs;
  // let maximumQuizzes = settings.maximumQuizzes;
  // let maximumRepetition = settings.maximumRepetition;
  // let showCardIntervalDurationMinutes =
  //   settings.showCardIntervalDurationMinutes;
  // let showCardDurationSeconds = settings.showCardDurationSeconds;
  // let enableNotifications = settings.enableNotifications;

  // $: {
  //   settings = {
  //     maximumMCQs,
  //     maximumQuizzes,
  //     maximumRepetition,
  //     showCardIntervalDurationMinutes,
  //     showCardDurationSeconds,
  //     enableNotifications,
  //   };
  //   dispatch('settings', settings);
  // }
</script>

<template>
  <div class="flex flex-col flex-grow">
    <div class="flex flex-col items-start justify-stretch mt-2">
      <div class="flex justify-between w-full">
        <span
          title="The maximum number of times we will show you the word and it's translation."
        >
          Number of word displays:
        </span>
        <span>{settings.maximumRepetition} Displays</span>
      </div>
      <input
        type="range"
        min="50"
        max="300"
        step="1"
        class="h-8"
        bind:value={settings.maximumRepetition}
      />
    </div>
    <div class="flex flex-col items-start justify-stretch mt-6">
      <div class="flex justify-between w-full">
        <span
          title="The maximum number of times we will show you an mcq type question for a word."
        >
          Number of MCQ displays:
        </span>
        <span>{settings.maximumMCQs} Displays</span>
      </div>
      <input
        type="range"
        min="50"
        max="300"
        step="1"
        class="h-8"
        bind:value={settings.maximumMCQs}
      />
    </div>
    <div class="flex flex-col items-start justify-stretch mt-6">
      <div class="flex justify-between w-full">
        <span
          title="The maximum number of times we will show you a quiz type question for a word."
        >
          Number of quiz displays:
        </span>
        <span>{settings.maximumQuizzes} Displays</span>
      </div>
      <input
        type="range"
        min="50"
        max="300"
        step="1"
        class="h-8"
        bind:value={settings.maximumQuizzes}
      />
    </div>

    <div class="flex flex-col items-start justify-stretch mt-6">
      <div class="flex justify-between w-full">
        <span title="Interval between 2 consecutive words shown.">
          Interval between cards:
        </span>
        <span>{settings.showCardIntervalDurationMinutes} Minutes</span>
      </div>
      <input
        type="range"
        min="5"
        max="120"
        step="1"
        class="h-8"
        bind:value={settings.showCardIntervalDurationMinutes}
      />
    </div>
    <div class="flex flex-col items-start justify-stretch mt-6">
      <div class="flex justify-between w-full">
        <span
          title="The maximum number of times we will show you a quiz type question for a word."
        >
          Duration show card:
        </span>
        <span>{settings.showCardDurationSeconds} Seconds</span>
      </div>
      <input
        type="range"
        min="5"
        max="60"
        step="1"
        class="h-8"
        bind:value={settings.showCardDurationSeconds}
      />
    </div>
    <div class="flex justify-between items-start justify-stretch mt-2">
      <span
        title="Show browser notification when the browser is not the active window."
      >
        Enable notifications:
      </span>
      <Toggle
        on:change={(event) =>
          (settings.enableNotifications = event.detail.checked)}
        bind:checked={settings.enableNotifications}
        let:checked
      >
        <slot name="left">
          {#if checked} ON {:else} OFF {/if}
        </slot>
      </Toggle>
    </div>
  </div>
</template>
