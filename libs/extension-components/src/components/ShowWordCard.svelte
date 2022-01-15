<script lang="ts">
  import { slide } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { timer, merge, Subject } from 'rxjs';
  import { take, map, toArray } from 'rxjs/operators';
  import type { Language } from '@parrotly.io/constants';
  import { Button } from '@parrotly.io/ui';

  // bind props
  export let showWordDurationSeconds = 4;
  export let word: string;
  export let translation: string;
  export let languageTo: Language; //id of the word doc in db

  //variable declarations
  let section: HTMLElement;
  let url;
  const dispatch = createEventDispatcher();
  const durationPlusAnimationDuration = showWordDurationSeconds + 2;
  const countDown$ = timer(0, 1000).pipe(
    take(durationPlusAnimationDuration + 1),
    map((count) => durationPlusAnimationDuration - count)
  );
  const closeSubject = new Subject<null>();
  const close$ = merge(
    countDown$.pipe(toArray()),
    closeSubject.asObservable()
  ).pipe(take(2));

  $: {
    url = `https://www.google.com/search?q=how+to+use+%22${translation}%22+in+${languageTo}`;
  }

  close$.subscribe(onClose);

  function onClose() {
    dispatch('close');
  }
  function onCloseClicked() {
    closeSubject.next();
  }

  function onPlayWord() {
    dispatch('playWord');
  }

  function onKnowWord() {
    dispatch('knowWord');
    closeSubject.next();
  }
</script>

<template>
  <div
    class="flex flex-col fixed dark:bg-primary-800 bg-opacity-80 dark:bg-opacity-80 bg-primary-100 p-4 pb-2 left-0 top-0 shadow-lg backdrop-blur-sm z-modal max-w-popup w-full dark:text-primary-300"
    bind:this={section}
    on:click|stopPropagation
    transition:slide={{ duration: 1500 }}
  >
    <div class="flex-initial flex ">
      <a
        class="outline-none font-alegreya text-base flex-none flex items-center justify-center px-5 h-9 rounded-sm border-0 text-primary-900 hover:bg-primary-200 focus:bg-primary-200 hover:text-black transition duration-300 -translate-x-6 -translate-y-4 dark:text-primary-300"
        href="https://app.learnwithparrot.com"
        target="_blank"
      >
        <span class="text-current">Learn with Parrot</span>
        <i class="lab la-earlybirds text-current text-[30]" />
      </a>
    </div>
    <div
      class="flex-1 font-roboto justify-center items-center flex sm:flex-col dark:text-primary-300"
      class:md:flex-col={(word + translation).length > 25}
    >
      <span class=" text-3xl text-current">{word}</span>
      <span class=" text-3xl text-current">-</span>
      <span class=" text-3xl text-current">{translation}</span>
    </div>
    <div class="flex-initial flex ">
      <Button
        on:click={onKnowWord}
        text="I know this word"
        color="success"
      />
      <span class="flex-1" />
      <Button
        icon="la-volume-down"
        aria-label="Play sound"
        on:click={onPlayWord}
      />
      <a href={url} target="_blank" class="btn btn--flat btn--default mx-4">
        <span class="text-current"> How to use? </span>
        <i class="las la-long-arrow-alt-up text-[30] rotate-45 text-current" />
      </a>
      <Button
        on:click={onCloseClicked}
        color="accent"
        iconSuffix="las la-times"
        title="Sign out"
      >
        <span class="mr-2 text-current">
          Close&nbsp;
          {#if $countDown$ > -1}
            ({$countDown$})
          {/if}
        </span>
      </Button>
    </div>
  </div>
</template>
