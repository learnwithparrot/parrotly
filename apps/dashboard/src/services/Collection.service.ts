import {
  collection, doc, deleteDoc, getDoc, setDoc,
  getFirestore, query, DocumentReference,
} from "firebase/firestore";
import type { PartialWithFieldValue } from "firebase/firestore";
import type { CollectionReference, Query } from 'firebase/firestore'
import { collectionData, docData, } from 'rxfire/firestore'
import { combineLatest, Subject } from "rxjs";
import type { Observable } from 'rxjs'
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators'

export type GetQuery<T> = (query: Query<T>) => Query<T>
export type ValueChanges<S, T = any> = T extends string ? Observable<S> : Observable<S[]>

/**
 * T: Type of the object in the application.
 * S: Type of the object in firebase
 * hint: in app we use Date and in firbase we use Timestamp
 */
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

  formatFromFirestore(_: S): T { return _ as unknown as T };
  formatForFirestore(_: Partial<T>): PartialWithFieldValue<S> { return _ as PartialWithFieldValue<S> };

  initializeBaseRef(path: string) {
    this.baseRef = collection(this.db, path) as CollectionReference<S>;
  }

  verifyBaseRef() {
    if (!this.baseRef) throw new Error(`Initial ref isn't setup, perhaps the constructor observable hasn't yet emitted.`)
  }

  docData$(id: string, relativeToBaseRef = true) {
    this.verifyBaseRef()
    let docRef = doc(this.baseRef, id)
    if (!relativeToBaseRef)
      docRef = doc(this.db, id) as DocumentReference<S>

    return docData(docRef, { idField: 'id' }).pipe(
      map(_ => this.formatFromFirestore(_)),
      takeUntil(this.unsubscribe.asObservable()),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  }

  async getDocData(id: string, relativeToBaseRef = true) {
    this.verifyBaseRef()
    let docRef = doc(this.baseRef, id)
    if (!relativeToBaseRef)
      docRef = doc(this.db, id) as DocumentReference<S>

    const data = await getDoc(docRef).then(
      _ => this.formatFromFirestore(_.data())
    )
    return data;
  }

  documentChanges(id: string) {
    return this.docData$(id)
  }

  valueChanges(): Observable<T[]>;
  valueChanges(id: string): ValueChanges<T, string>;
  valueChanges(getQuery: GetQuery<S>): Observable<T[]>;
  valueChanges(ids: string[]): Observable<T[]>;
  valueChanges(paramOne?: string | string[] | GetQuery<S>): ValueChanges<T> {
    this.verifyBaseRef()

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
      shareReplay({ bufferSize: 1, refCount: true }),
      map(
        fromFirestoreList => fromFirestoreList.map(
          fromFirestore => this.formatFromFirestore(fromFirestore)
        )),

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
    this.verifyBaseRef()
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

  update(id: string, data: Partial<T>, relativeToBaseRef = true) {
    this.verifyBaseRef()
    const forFirestore = this.formatForFirestore(data)
    let docRef = doc(this.baseRef, id)
    if (!relativeToBaseRef)
      docRef = doc(this.db, id) as DocumentReference<S>

    setDoc(docRef, forFirestore, { merge: true })
  }

  unsubscribeAll() {
    // this.unsubscribe.next(null)
  }
}
