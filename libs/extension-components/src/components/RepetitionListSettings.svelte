<script lang="ts">
  import type { IUserSettings } from '@parrotly.io/types';
  import { onMount } from 'svelte';
  import { Toggle } from '@parrotly.io/ui';
  import { createEventDispatcher } from 'svelte';

  export let initialData: IUserSettings;
  const dispatch = createEventDispatcher();

  let maximumMCQs = initialData.maximumMCQs;
  let maximumQuizzes = initialData.maximumQuizzes;
  let maximumRepetition = initialData.maximumRepetition;
  let showCardIntervalDurationMinutes =
    initialData.showCardIntervalDurationMinutes;
  let showCardDurationSeconds = initialData.showCardDurationSeconds;
  let enableNotifications = initialData.enableNotifications;

  $: {
    dispatch('settings', {
      maximumMCQs,
      maximumQuizzes,
      maximumRepetition,
      showCardIntervalDurationMinutes,
      showCardDurationSeconds,
      enableNotifications,
    });
  }
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
        <span>{maximumRepetition} Displays</span>
      </div>
      <input
        type="range"
        min="50"
        max="300"
        step="1"
        class="h-8"
        bind:value={maximumRepetition}
      />
    </div>
    <div class="flex flex-col items-start justify-stretch mt-6">
      <div class="flex justify-between w-full">
        <span
          title="The maximum number of times we will show you an mcq type question for a word."
        >
          Number of MCQ displays:
        </span>
        <span>{maximumMCQs} Displays</span>
      </div>
      <input
        type="range"
        min="50"
        max="300"
        step="1"
        class="h-8"
        bind:value={maximumMCQs}
      />
    </div>
    <div class="flex flex-col items-start justify-stretch mt-6">
      <div class="flex justify-between w-full">
        <span
          title="The maximum number of times we will show you a quiz type question for a word."
        >
          Number of quiz displays:
        </span>
        <span>{maximumQuizzes} Displays</span>
      </div>
      <input
        type="range"
        min="50"
        max="300"
        step="1"
        class="h-8"
        bind:value={maximumQuizzes}
      />
    </div>

    <div class="flex flex-col items-start justify-stretch mt-6">
      <div class="flex justify-between w-full">
        <span title="Interval between 2 consecutive words shown.">
          Interval between cards:
        </span>
        <span>{showCardIntervalDurationMinutes} Minutes</span>
      </div>
      <input
        type="range"
        min="5"
        max="120"
        step="1"
        class="h-8"
        bind:value={showCardIntervalDurationMinutes}
      />
    </div>
    <div class="flex flex-col items-start justify-stretch mt-6">
      <div class="flex justify-between w-full">
        <span
          title="The maximum number of times we will show you a quiz type question for a word."
        >
          Duration show card:
        </span>
        <span>{showCardDurationSeconds} Seconds</span>
      </div>
      <input
        type="range"
        min="5"
        max="60"
        step="1"
        class="h-8"
        bind:value={showCardDurationSeconds}
      />
    </div>
    <div class="flex justify-between items-start justify-stretch mt-2">
      <span
        title="Show browser notification when the browser is not the active window."
      >
        Enable notifications: {enableNotifications}
      </span>
      <Toggle
        on:change={(event) => (enableNotifications = event.detail.checked)}
        defaultChecked={enableNotifications}
        statusText={{ on: 'On', off: 'OFF' }}
      />
    </div>
  </div>
</template>
