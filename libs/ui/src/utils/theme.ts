import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

export function isDarkMode(onDestroy: Observable<boolean>): Observable<boolean> {
  return new Observable<boolean>(subscriber => {

    if (!window.matchMedia) {
      subscriber.error(new Error('No windows Media Match available'));
    }

    function emitValue(event: Event) {
      subscriber.next((event as MediaQueryListEvent).matches);
    }

    const mediaListQuery = window.matchMedia('(prefers-color-scheme: dark)');

    onDestroy.pipe(first()).subscribe(() => {
      mediaListQuery.removeEventListener('change', emitValue)
      !subscriber.closed && subscriber.complete()
    })

    mediaListQuery.addEventListener('change', emitValue);
    subscriber.next(mediaListQuery.matches);

    return () => {
      mediaListQuery.removeEventListener('change', emitValue);
      !subscriber.closed && subscriber.complete()
    }
  })
}
