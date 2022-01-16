<script lang="ts">
  import { slide } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { timer, merge, Subject } from 'rxjs';
  import { take, map, toArray } from 'rxjs/operators';
  import { Button, Dropdown } from '@parrotly.io/ui';

  // bind props
  export let showWordDurationSeconds = 4;
  export let word: string;
  export let translation: string;
  // cannot send more than two options
  export let options: string[];
  let selectedOption: string;

  let mcqs: string[] = [];

  let disableOptions = [
    { label: 'For 1 Hour', value: 1 },
    { label: 'For 2 Hour', value: 2 },
    { label: 'For 4 Hour', value: 4 },
    { label: 'For 8 Hour', value: 8 },
  ];

  $: {
    mcqs = shuffle([...options, translation]);
  }

  //variable declarations
  const dispatch = createEventDispatcher();
  const TIME_PADDING = 2;
  const durationPlusAnimationDuration = showWordDurationSeconds + TIME_PADDING;
  const countDown$ = timer(0, 1000).pipe(
    take(durationPlusAnimationDuration + 1),
    map((count) => durationPlusAnimationDuration - count)
  );
  const closeSubject = new Subject<null>();
  const close$ = merge(
    countDown$.pipe(toArray()),
    closeSubject.asObservable()
  ).pipe(take(1));

  close$.subscribe(onClose);

  function onClose() {
    dispatch('close');
  }
  function onCloseClicked() {
    closeSubject.next();
  }

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function onKnowWord() {
    dispatch('knowWord');
    closeSubject.next();
  }

  function onOptionClicked(option: string) {
    if (selectedOption) return;
    selectedOption = option;
    if (selectedOption === translation) {
      dispatch('rightAnswer');
      setTimeout(() => onCloseClicked(), 1000);
    } else {
      dispatch('wrongAnswer');
      setTimeout(() => onCloseClicked(), 2000);
    }
  }
</script>

<template>
  <div
    class="flex flex-col fixed dark:bg-primary-800 bg-opacity-80 dark:bg-opacity-80 bg-primary-100 p-4 pb-2 left-0 top-0 shadow-lg backdrop-blur-sm z-modal max-w-popup w-full dark:text-primary-300"
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
      class="flex-1 font-roboto justify-center items-center flex flex-col dark:text-primary-300"
    >
      <span class=" text-3xl text-current">{word}</span>
      <span class=" text-3xl text-current">-</span>
      <div class="flex gap-2">
        {#each mcqs as mcq}
          <Button
            on:click={() => onOptionClicked(mcq)}
            text={mcq}
            variant="filled"
            color={selectedOption && mcq === translation
              ? 'success'
              : selectedOption === mcq
              ? 'danger'
              : 'default'}
          />
        {/each}
      </div>
    </div>
    <div class="flex-initial flex ">
      <Dropdown horizontal="left" items={disableOptions}>
        <!-- This is not an error ref:https://svelte.dev/tutorial/slot-props -->
        <Button
          let:toggleVisible
          let:active
          on:click={toggleVisible}
          slot="trigger"
        >
          <span>
            {active?.value
              ? `Pause showing words ( ${active.label} )`
              : 'Pause showing words'}
          </span>
          <svg
            class="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </Button>

        <a
          slot="item"
          href="#"
          let:classActive
          let:active
          let:item
          let:click
          on:click={click}
          class="text-gray-700 block px-4 py-2 text-sm dark:hover:bg-primary-700 hover:bg-primary-200"
          class:[classActive]={active?.value === item.value}
          role="menuitem"
          tabindex="-1"
          id="menu-item-0"
        >
          {item.label}
        </a>
      </Dropdown>
      <Button on:click={onKnowWord} text="I know this word" color="success" />
      <span class="flex-1" />
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
