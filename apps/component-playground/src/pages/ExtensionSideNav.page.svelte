<script>
  import { ExtensionSideNav } from '@parrotly.io/extension-components';
</script>

<ExtensionSideNav
  on:close={() => {}}
  userSettings={{
    maximumMCQs: 50,
    maximumQuizzes: 50,
    maximumRepetition: 50,
    languageLearned: 'de',
    languageSpoken: 'en',
    showCardDurationSeconds: 7,
    showCardIntervalDurationMinutes: 30,
  }}
/>
