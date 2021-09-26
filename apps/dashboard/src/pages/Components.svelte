<script lang="ts">
  import {ExtensionSideNav} from '@parrotly.io/ui'
  import { onMount } from 'svelte';
  onMount(() => {});
</script>

<main>
  <span>This is the components page.</span>
  <ExtensionSideNav onClose={() => {}} />
</main>

<style>
  main{
    display: grid;
    grid-auto-flow: row;
    row-gap: 20px;
  }
</style>
