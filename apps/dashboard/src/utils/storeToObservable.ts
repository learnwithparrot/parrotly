import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";
import type { Readable } from "svelte/store";

export function storeToObservable<T>(store: Readable<T>, bufferSize = 1) {
  return new Observable<T>(observer => {
    const unsubscribe = store.subscribe(data => observer.next(data))
  }).pipe(
    shareReplay({ refCount: true, bufferSize: bufferSize })
  )

}
