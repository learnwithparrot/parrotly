<script lang="ts">
  import type {VariantType} from './Chip'

  export let variant: VariantType;
  export let title;

  let baseStyles = `text-sm p-1 rounded-sm`;
  let classList = '';

  $: {
    switch (variant) {
      case 'black':
        classList = `${baseStyles} bg-black-200 bg-opacity-50`;
        break;
      case 'white':
        classList = `${baseStyles} bg-white-200 bg-opacity-50`;
        break;
      case 'current':
        classList = `${baseStyles} bg-current-200 bg-opacity-50`;
        break;
      case 'success':
        classList = `${baseStyles} bg-success-200 bg-opacity-50`;
        break;
      case 'danger':
        classList = `${baseStyles} bg-danger-200 bg-opacity-50`;
        break;
      case 'warning':
        classList = `${baseStyles} bg-warning-200 bg-opacity-50`;
        break;
      case 'primary':
        classList = `${baseStyles} bg-primary-200 dark:bg-primary-500 bg-opacity-50`;
        break;
      case 'default':
        classList = `${baseStyles} bg-accent-200 bg-opacity-50`;
        break;
      default:
        classList = `${baseStyles} bg-accent-200 bg-opacity-50`;
    }
  }
</script>

<div class={classList} {title}>
  <slot />
</div>
