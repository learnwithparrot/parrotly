<script lang="ts">
  import { map, startWith, tap } from 'rxjs/operators';
  import { of, Subject } from 'rxjs';
  import { onMount } from 'svelte';
  import { RepetitionWord, Modal } from '../../components';
  import { RepetitionWordService } from './../../services';
  import type { IRepetitionWord } from '@parrotly.io/types';
  import { Button, Chip } from '@parrotly.io/ui';
  import { useParams } from 'svelte-navigator';
  import { storeToObservable } from '../../utils';

  let toDelete: IRepetitionWord = null;
  let toView: IRepetitionWord = null;
  const unsubscribe = new Subject<boolean>();

  const params = useParams();

  const path$ = storeToObservable(params).pipe(
    map((_) => `repetition_lists/${_.id}/list`)
  );
  const service = new RepetitionWordService(path$);
  const words$ = service.valueChanges().pipe(startWith([]));

  //continue working from here.
  onMount(() => {
    return () => {
      service.unsubscribeAll();
      unsubscribe.next(false);
    };
  });

  function deleteWord(word: IRepetitionWord) {
    service.delete(word.id);
  }

  function handleDelete(word: IRepetitionWord) {
    toView = null;
    toDelete = word;
  }

  function handleView(word: IRepetitionWord) {
    toDelete = null;
    toView = word;
  }
</script>

<template>
  <section class="flex flex-col flex-1 pt-1 justify-start gap-4 w-full">
    <header class="flex justify-between w-full">
      <h1 class="font-alegreya text-3xl font-semibold dark:text-white">
        Repetition List Default
      </h1>
      <input
        type="text"
        placeholder="search"
        class="outline-none bg-primary-600 min-w-[200px] bg-opacity-30 p-2"
      />
    </header>
    <ul class="word_list">
      {#each $words$ as word}
        <RepetitionWord
          {word}
          on:delete={(_) => handleDelete(_.detail)}
          on:view={(_) => handleView(_.detail)}
        />
      {/each}
    </ul>
  </section>
  <Modal
    open={Boolean(toDelete)}
    on:close={() => (toDelete = null)}
    title="Are you sure...?"
  >
    <svelte:fragment slot="content">
      {#if toDelete}
        <span>
          Are you sure you want to delete
          <span class="bg-primary-200 dark:bg-primary-500 p-1 text-sm"
            >{toDelete?.word}</span
          >
          ?
        </span>
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="footer">
      <div class="flex justify-end mt-4">
        <Button
          iconPrefix={'la-eye'}
          text="View"
          on:click={(_) => handleView(toDelete)}
        />
        <Button
          iconPrefix={'la-trash'}
          text="Delete"
          on:click={(_) => deleteWord(toDelete)}
        />
      </div>
    </svelte:fragment>
  </Modal>
  <Modal
    open={Boolean(toView)}
    on:close={() => (toView = null)}
    title={toView?.word}
  >
    <svelte:fragment slot="content">
      {#if toView}
        <span>
          Word:
          <span class="font-alegreya"> {toView?.word}</span>
          ?
        </span> <br />
        <span>
          Translation:
          <span class="font-alegreya"> {toView?.translation}</span>
          ?
        </span>
        <div class="flex gap-4 mt-4">
          <Chip variant="default" title="Total Number of views">
            👀 {toView.countShows}
          </Chip>
          <Chip variant="success" title="Passed MCQs">
            👀 {toView.countMCQs.passed}
          </Chip>
          <Chip variant="danger" title="Failed MCQs">
            👀 {toView.countMCQs.failed}
          </Chip>
          <Chip variant="success" title="Passed Quizzes">
            👀 {toView.countQuizzes.passed}
          </Chip>
          <Chip variant="danger" title="Failed Quizzes">
            👀 {toView.countQuizzes.failed}
          </Chip>
        </div>
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="footer">
      <div class="flex justify-end mt-4">
        <Button
          iconPrefix="la-trash"
          text="Delete"
          on:click={() => handleDelete(toView)}
        />
      </div>
    </svelte:fragment>
  </Modal>
</template>

<style>
  .word_list {
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-gap: 16px;
    grid-auto-rows: min-content;
  }
</style>
