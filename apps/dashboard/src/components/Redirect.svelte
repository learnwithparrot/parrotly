<script lang="ts">
  import { onMount } from 'svelte';
  import { useNavigate } from 'svelte-navigator';
  export let to: string | Promise<string>;

  const navigate = useNavigate();

  onMount(async () => {
    if (typeof to === 'string') return navigate(to);
    const path = await to;
    navigate(path);
  });
</script>

<template>
  Redirecting ...
</template>
