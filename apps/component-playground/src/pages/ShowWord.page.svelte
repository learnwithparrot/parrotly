<script>
  import { ShowWordCard } from '@parrotly.io/extension-components';
</script>

<ShowWordCard
  languageTo="en"
  on:close={() => {}}
  on:playWord={() => {}}
  on:knowWord={() => {}}
  word="Long word standing here."
  translation="Long word translation standing here."
/>
