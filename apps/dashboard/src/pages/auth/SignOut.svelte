<script>
  import { onMount } from 'svelte';
  import { getAuth } from 'firebase/auth';
import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
import Redirect from '../../components/Redirect.svelte';


  onMount(() => {
    getAuth().signOut();
    //Sign out extension
    let data = { type: 'FROM_PAGE', event:EXTENSION_MESSAGES.ON_SIGN_OUT };
    window.postMessage(data, '*');

  });
</script>

<Redirect to="../login" />
