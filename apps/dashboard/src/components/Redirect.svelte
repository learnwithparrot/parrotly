<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  export let to: string;

  const navigate = useNavigate();
  navigate(to);
</script>
