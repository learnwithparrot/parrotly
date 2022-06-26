import { Query, CollectionReference } from 'firebase/firestore'
import {
  getFirestore, collection, runTransaction,
  enableIndexedDbPersistence, doc, clearIndexedDbPersistence,
  query, where, increment, updateDoc, deleteDoc, setDoc, Timestamp
} from 'firebase/firestore'
import { auth$, authOrNEVER } from './auth';
import { docData, collectionData } from 'rxfire/firestore';
import type { IRepetitionList, IRepetitionWord, IUserSettings, RepetitionStyle } from '@parrotly.io/types'
import { getAuth } from 'firebase/auth'
import { first, shareReplay, switchMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { DocumentReference } from 'node_modules/rxfire/firestore/interfaces';
import { FirebaseRefs, userSettingsPath } from '@parrotly.io/constants';


const db = getFirestore();

/**
 * Here, we aren't using the authWithDelay$ because
 * authWithDelay$ is delayed to permit the below to run before even the first call
 * to any firestore functions.
 * https://firebase.google.com/docs/reference/js/firestore_.md?hl=cs#clearindexeddbpersistence
 */
auth$.pipe(first()).subscribe(user => {
  console.log(user ? 'Enabled cache storage' : 'Cleared cache and enabled cache storage')
  if (!user)
    clearIndexedDbPersistence(db)
  enableIndexedDbPersistence(db)
})


export const userAndSettings$ = authOrNEVER.pipe(
  switchMap(user => {
    const settingsRef = doc(
      db, `${FirebaseRefs.settings}/${user?.uid}`
    ) as DocumentReference<IUserSettings>;
    const settings$ = docData(settingsRef, { idField: 'id' })
    return combineLatest([
      of(user),
      settings$,
    ])
  }),
  shareReplay({ bufferSize: 1, refCount: true })
)

export const categories$ = authOrNEVER.pipe(
  switchMap(user => {
    const repetitionListCollection = collection(db, FirebaseRefs.repetition_lists);
    const collectionQuerry = query(repetitionListCollection, where("creatorId", "==", user.uid)) as Query<IRepetitionList>;
    return collectionData(collectionQuerry, { idField: 'id' })
  }),
  shareReplay({ bufferSize: 1, refCount: true })
)

export const categoriesAndLists$ = categories$.pipe(
  switchMap(lists => combineLatest(
    lists.map(list => {
      const listCollection = collection(
        db,
        `${FirebaseRefs.repetition_lists}/${list.id}/${FirebaseRefs.list}`
      ) as CollectionReference<IRepetitionWord>;
      const collection$ = collectionData(listCollection, { idField: 'id' })
      return combineLatest(
        of(list),
        collection$
      )
    })
  )),
  shareReplay({ bufferSize: 1, refCount: true })
)

categoriesAndLists$.subscribe(() => null)

//methods
export const saveToRepetitionList = async (word: string, translation: string, category_id?: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;// user is not signed in.
  return runTransaction(db, async (transaction) => {
    const id = user.uid;
    const repetitionListRef = doc(db, FirebaseRefs.repetition_lists, category_id || `${id}_default`) as DocumentReference<IRepetitionList>
    const repetitionListSnapshot = await transaction.get(repetitionListRef)
    const wordsSample = repetitionListSnapshot.data().wordsSample ?? []
    const repetitionWordRef = doc(collection(repetitionListRef, FirebaseRefs.list))
    const wordCount = increment(1)
    if (wordsSample.length > 9) {
      wordsSample.splice(0, 1)
    }
    wordsSample.push({ word, translation })
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
    };
    transaction.update(repetitionListRef, { wordCount, wordsSample })
    transaction.set(repetitionWordRef, data)
  })
}

export const disableShowWord = async (durationHours: number) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;// user is not signed in.
  const settings = doc(db, userSettingsPath(user.uid)) as DocumentReference<IUserSettings>
  const now = new Date();
  now.setHours(now.getHours() + durationHours);
  updateDoc(settings, { "disableUntil.showWord": Timestamp.fromDate(now) })
}

export const incrementWordDisplayCount = async (repetitionWordId: string, category_id: string, type: RepetitionStyle, passedQuizOrMcq = false) => {
  const countShows = increment(1)
  const wordRef = doc(db, FirebaseRefs.repetition_lists, category_id, FirebaseRefs.list, repetitionWordId) as DocumentReference<IRepetitionWord>
  switch (type) {
    case 'show':
      updateDoc(wordRef, { countShows })
      break;
    case 'mcq': {
      let field = "countMCQs.failed";
      if (passedQuizOrMcq) field = "countMCQs.passed"
      updateDoc(wordRef, { [field]: countShows })
    }
      break;
    case 'quiz': {
      let field = "countQuizzes.failed";
      if (passedQuizOrMcq) field = "countQuizzes.passed"
      updateDoc(wordRef, { [field]: countShows })
    }
      break;
  }
}

export const deleteRepetitionWord = async (wordId: string, category_id: string) => {
  const wordRef = doc(db, FirebaseRefs.repetition_lists, category_id, FirebaseRefs.list, wordId) as DocumentReference<IRepetitionWord>
  deleteDoc(wordRef)
}

export const updateUserSettings = async (userSettings: IUserSettings, id: string) => {
  const settings = doc(db, userSettingsPath(id)) as DocumentReference<IUserSettings>
  setDoc(settings, userSettings, { merge: true })
}
