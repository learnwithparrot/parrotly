import {
  getFirestore, collection, arrayRemove, arrayUnion,
  enableIndexedDbPersistence, doc, clearIndexedDbPersistence,
  query, where, Query, CollectionReference, increment as firestoreIncrement,
  runTransaction, DocumentSnapshot
} from 'firebase/firestore'
import { auth$, authOrEMPTY$ } from './auth';
import {
  docData as docData_$, collectionData as collection_$,
} from 'rxfire/firestore';
import { IRepetitionList, IRepetitionWord, IUserSettings } from '@parrotly.io/types'
import { getAuth } from 'firebase/auth'
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { DocumentReference } from 'node_modules/rxfire/firestore/interfaces';
import { FirebaseRefs } from '@parrotly.io/constants';


const db = getFirestore();
enableIndexedDbPersistence(db)

auth$.subscribe(user => {
  if (user) enableIndexedDbPersistence(db)
  else clearIndexedDbPersistence(db)
})

const repetitionListCollection = collection(db, FirebaseRefs.repetition_lists);

export const userAndSettings$ = authOrEMPTY$.pipe(
  switchMap(user => {
    const settingsRef = doc(db, `${FirebaseRefs.settings}/${user.uid}`) as DocumentReference<IUserSettings>;
    return docData_$(settingsRef, { idField: 'id' })
  }),
  shareReplay({ bufferSize: 1, refCount: true })
)

export const categoriesAndLists$ = authOrEMPTY$.pipe(
  switchMap(user => {
    console.log({ user, origin: 'categoriesAndLists$' })
    const q = query(repetitionListCollection, where("creatorId", "==", user.uid)) as Query<IRepetitionList>;
    return collection_$(q, { idField: 'id' }).pipe(
      tap(data => console.log({ data, origin: 'tap' })),
      switchMap(lists => combineLatest(lists.map(list => {
        const listCollection = collection(
          db,
          `${FirebaseRefs.repetition_lists}/${list.id}/${FirebaseRefs.list}`
        ) as CollectionReference<IRepetitionWord>;
        const collection$ = collection_$(listCollection)
        return combineLatest(
          of(list),
          collection$
        )
      })))
    )
  }),
  shareReplay({ bufferSize: 1, refCount: true })
)

//methods
export const saveToRepetitionList = async (word: string, translation: string, category_id?: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) { // user is signed in.
    return runTransaction(db, async (transaction) => {
      const id = user.uid;
      const repetitionListRef = doc(db, FirebaseRefs.repetition_lists, category_id || `${id}_default`)
      const repetitionListSnapshot = await (await transaction.get(repetitionListRef)) as DocumentSnapshot<IRepetitionList>
      const wordsSample = repetitionListSnapshot.data().wordsSample ?? []
      const repetitionWordRef = doc(collection(repetitionListRef, FirebaseRefs.list))
      const wordCount = firestoreIncrement(1)
      if (wordsSample.length > 9) {
        wordsSample.splice(0, 1)
        wordsSample.push({ word, translation })
      } else {
        wordsSample.push({ word, translation })
      }
      const data: IRepetitionWord = {
        word, translation,
        countMCQs: {
          passed: 0, failed: 0,
        },
        countQuizzes: {
          passed: 0, failed: 0
        },
        countShows: 0,
        isExpression: false,
        languageTranslation: 'de',
        languageWord: 'en',
      };
      transaction.update(repetitionListRef, { wordCount, wordsSample })
      transaction.set(repetitionWordRef, data)
    })
  }
}
