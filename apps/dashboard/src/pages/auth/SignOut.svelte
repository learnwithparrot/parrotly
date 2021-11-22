<script>
  import { onMount } from 'svelte';
  import { getAuth } from 'firebase/auth';


  onMount(() => {
    getAuth().signOut();
  });
</script>

<span>Hello world</span>
