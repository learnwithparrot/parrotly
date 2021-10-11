import App from './App.svelte';
import type { IRepetitionList } from '@parrotly.io/types'

let word: IRepetitionList;

const app = new App({
  target: document.body,
  props: {
    name: 'dashboard',
  },
});

export default app;
