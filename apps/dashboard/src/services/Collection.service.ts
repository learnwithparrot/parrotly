import {
  collection, doc, deleteDoc,
  getFirestore, query, DocumentReference
} from "firebase/firestore";
import type { CollectionReference, Query } from 'firebase/firestore'
import { collectionData, docData } from 'rxfire/firestore'
import { combineLatest, Subject } from "rxjs";
import type { Observable } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'

export type GetQuery<T> = (query: Query<T>) => Query<T>
export type ValueChanges<S, T = any> = T extends string ? Observable<S> : Observable<S[]>

export abstract class CollectionService<T, S = T> {
  private unsubscribe = new Subject<boolean>()
  public db = getFirestore()
  public baseRef: CollectionReference<S>;

  constructor(public path: string | Observable<string>) {
    if (typeof path === 'string') this.initializeBaseRef(path)
    else
      path.pipe(
        takeUntil(this.unsubscribe.asObservable())
      ).subscribe(_ => this.initializeBaseRef(_))
  }

  abstract formatFromFirestore(_: S): T;
  abstract formatForFirestore(_: S): T;

  initializeBaseRef(path: string) {
    this.baseRef = collection(this.db, path) as CollectionReference<S>;
  }

  docData$(id: string, relativeToBaseRef = true) {
    if (!this.baseRef) throw new Error(`Initial ref isn't setup, perhaps the constructor observable hasn't yet emitted.`)
    let docRef = doc(this.baseRef, id)
    if (!relativeToBaseRef)
      docRef = doc(this.db, id) as DocumentReference<S>

    return docData(docRef, { idField: 'id' }).pipe(
      map(_ => this.formatFromFirestore(_)),
      takeUntil(this.unsubscribe.asObservable())
    )
  }

  documentChanges(id: string) {
    return this.docData$(id)
  }

  valueChanges(): Observable<T[]>;
  valueChanges(id: string): ValueChanges<T, string>;
  valueChanges(getQuery: GetQuery<S>): Observable<T[]>;
  valueChanges(ids: string[]): Observable<T[]>;
  valueChanges(paramOne?: string | string[] | GetQuery<S>): ValueChanges<T> {
    if (!this.baseRef) throw new Error(`Initial ref isn't setup, perhaps the constructor observable hasn't yet emitted.`)

    let collectionQuery = query<S>(this.baseRef)

    if (paramOne) {
      if (Array.isArray(paramOne)) {
        return combineLatest(
          paramOne.map(_ => this.docData$(_))
        )
      } else if (typeof paramOne === 'string')
        return combineLatest(
          [this.docData$(paramOne)]
        )
      collectionQuery = paramOne(collectionQuery);
    }
    return collectionData(collectionQuery, { idField: 'id' }).pipe(
      takeUntil(this.unsubscribe.asObservable()),
      map(
        fromFirestoreList => fromFirestoreList.map(
          fromFirestore => this.formatFromFirestore(fromFirestore)
        )
      ),
    )
  }

  /**
   * Simply deletes the list of documents with native firebase method.
   * @param docPath string or list of strings of document path
   * @param absolute is the path to the doc an absolute route or relative to `baseRef` property
   * If deleting anyone of the document fails, we aren't able to know which failed.
   */
  delete(docPath: string | string[], relativeToBaseRef = true) {
    const paths = []
    if (!this.baseRef) throw new Error(`Initial ref isn't setup, perhaps the constructor observable hasn't yet emitted.`)
    if (typeof docPath === 'string') paths.push(docPath)
    else paths.push(...docPath)

    return Promise.all(
      paths.map(_ => {
        if (relativeToBaseRef)
          return doc(this.baseRef, _)
        return doc(_)
      })
        .map(_ => deleteDoc(_))
    )
  }

  unsubscribeAll() {
    // this.unsubscribe.next(null)
  }
}
