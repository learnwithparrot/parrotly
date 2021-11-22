<script lang="ts">
  import { Route } from 'svelte-navigator';
  import { Sidenav } from '../../components';
  import Redirect from '../../components/Redirect.svelte';
  import MyRepetitionLists from './MyRepetitionLists.svelte';
  import PublicRepetitionLists from './PublicRepetitionLists.svelte';
  import RepetitionListDetails from './RepetitionListDetails.svelte';
</script>

<Sidenav />
<div class="flex flex-col max-w-screen-lg mx-auto w-full">
  <Route path="my_list" component={MyRepetitionLists} />
  <Route path="my_list/:id" component={RepetitionListDetails} />
  <Route path="public_list" component={PublicRepetitionLists} />
  <Route component={Redirect} to="my_list" />
</div>
