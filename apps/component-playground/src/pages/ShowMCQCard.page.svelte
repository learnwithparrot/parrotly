<script>
  import {
    MCQCard,
  } from '@parrotly.io/extension-components';
</script>

<MCQCard
  on:disable={() => {}}
  on:close={() => {}}
  on:rightAnswer={() => {}}
  on:wrongAnswer={() => {}}
  on:knowWord={() => {}}
  word="Long word standing here."
  options={['Long word translation standing here.', 'Sencond option']}
  translation="Third option"
/>
