<script lang="ts">
  import type { IRepetitionList } from '@parrotly.io/types';
  import { RepetitionListItem } from '../../components';
  import { useNavigate } from 'svelte-navigator';
  import { RepetitionListService } from '../../services';
  import { authState } from 'rxfire/auth';
  import { getAuth } from '@firebase/auth';
  import { map, startWith, switchMap } from 'rxjs/operators';
  import { SvelteSubject } from '@parrotly.io/ui/utils';
  import { combineLatest } from 'rxjs';
  import { SUPPORTED_LANGUAGES } from '@parrotly.io/constants';

  type ViewInterface = 'my_word_list' | 'public_word_list';

  const service = new RepetitionListService();
  const auth$ = authState(getAuth());
  const search = new SvelteSubject<string>('');
  const list = auth$.pipe(
    switchMap((user) => service.queryMyRepetitionLists(user.uid)),
    startWith([] as IRepetitionList[])
  );

  const filteredList$ = combineLatest([search, list]).pipe(
    map(([keyword, lists]) => {
      return lists.filter(
        (_) =>
          `${_.name} ${SUPPORTED_LANGUAGES[_.languageWord]} ${
            SUPPORTED_LANGUAGES[_.languageWord]
          }`
            .toLowerCase()
            .indexOf(keyword.toLowerCase()) !== -1
      );
    })
  );

  let navigate = useNavigate();

  function onView(list: IRepetitionList) {
    navigate(list.id);
  }
</script>

<template>
  <section class="flex flex-col flex-1 pt-1 justify-start gap-4">
    <header class="flex justify-between">
      <h1 class="font-alegreya text-3xl font-semibold dark:text-primary-300">
        Word List
      </h1>
      <input
        type="text"
        bind:value={$search}
        placeholder="search"
        class="outline-none bg-primary-600 min-w-[200px] bg-opacity-30 p-2"
      />
    </header>

    <ul class="grid gap-4">
      {#each $filteredList$ as repetitionList}
        <RepetitionListItem
          {repetitionList}
          on:view={({ detail }) => onView(detail)}
        />
      {/each}
    </ul>
  </section>
</template>

<style>
</style>
