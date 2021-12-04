import { BehaviorSubject, Observable } from "rxjs";
import type { Operator } from 'rxjs'
import { shareReplay } from "rxjs/operators";
import type { Readable } from "svelte/store";

export function storeToObservable<T>(store: Readable<T>, bufferSize = 1) {
  return new Observable<T>(observer => {
    const unsubscribe = store.subscribe(data => observer.next(data))
  }).pipe(
    shareReplay({ refCount: true, bufferSize: bufferSize })
  )
}

export class SvelteSubject<T> extends BehaviorSubject<T> {
  set(value) {
    super.next(value);
  }

  lift<R>(operator: Operator<T, R>) {
    const result = new SvelteSubject<R>(null);
    result.operator = operator;
    result.source = this;
    return result;
  }
}

