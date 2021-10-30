<script lang="ts">
  import { slide } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { timer, merge, Subject } from 'rxjs';
  import { take, map, toArray } from 'rxjs/operators';
  import type { LanguageType } from '@parrotly.io/constants';

  // bind props
  export let showWordDurationSeconds = 4;
  export let word: string;
  export let translation: string;
  export let languageTo: LanguageType; //id of the word doc in db

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
  ).pipe(take(1));

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

  function onPlaySound() {
    dispatch('playSound');
  }

  function onKnowWord() {
    dispatch('knowWord');
    closeSubject.next()
  }
</script>

<template>
  <div
    class="flex flex-col fixed bg-white p-6 left-0 top-0 shadow-lg z-modal max-w-popup w-full h-[350px]"
    bind:this={section}
    on:click|stopPropagation
    transition:slide={{ duration: 1500 }}
  >
    <div class="flex-initial flex ">
      <a
        class="outline-none font-alegreya text-base flex-none flex items-center justify-center px-5 h-9 rounded-sm border-0 text-primary-900 hover:bg-primary-200 focus:bg-primary-200 hover:text-black transition duration-300 -translate-x-6 -translate-y-4"
        href="https://learnwithparrot.io"
        target="_blank"
      >
        <span>Learn with Parrot</span>
        <i class="lab la-earlybirds text-[30]" />
      </a>
    </div>
    <div
      class="flex-1 font-roboto justify-center items-center flex sm:flex-col {(
        word + translation
      ).length > 25
        ? 'md:flex-col'
        : ''}"
    >
      <span class=" text-3xl">{word}</span> <span class=" text-3xl">-</span>
      <span class=" text-3xl">{translation}</span>
    </div>
    <div class="flex-initial flex ">
      <button
        on:click={onKnowWord}
        class="outline-none font-roboto flex text-base items-center justify-center h-9 px-5 hover:bg-green-200 focus:bg-green-200 text-green-500 rounded-sm bg-green-100 border-transparent"
        >I know this word</button
      >
      <span class="flex-1" />
      <button
        class="outline-none font-roboto flex-none flex text-base items-center justify-center w-9 h-9 rounded-sm text-black border-0 hover:bg-primary-200 focus:bg-primary-200 transition duration-300"
        type="button"
        aria-label="Play sound"
        on:click={onPlaySound}
      >
        <i class="las la-volume-down text-[30]" />
      </button>
      <a
        href={url}
        target="_blank"
        class="outline-none font-roboto flex text-base items-center mx-2 justify-center h-9 px-5 hover:bg-primary-200 focus:bg-primary-200 rounded-sm bg-primary-100"
      >
        <span> How to use? </span>
        <i class="las la-long-arrow-alt-up text-[30] rotate-45" />
      </a>
      <button
        class="outline-none font-roboto flex-none flex text-base items-center justify-center px-5 h-9 rounded-sm border-0 bg-black hover:bg-primary-800 focus:bg-primary-800 transition duration-300"
        type="button"
        aria-label="Close word modal"
        on:click={onCloseClicked}
      >
        <span class="mr-2 text-white">
          Close&nbsp;
          {#if $countDown$ > -1}
            ({$countDown$})
          {/if}
        </span>
        <i class="las la-times text-[30] text-white" />
      </button>
    </div>
  </div>
</template>
