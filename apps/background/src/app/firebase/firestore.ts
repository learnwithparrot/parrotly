import {
  getFirestore, collection, runTransaction,
  enableIndexedDbPersistence, doc, clearIndexedDbPersistence,
  query, where, Query, CollectionReference, increment, updateDoc, deleteDoc, setDoc,
} from 'firebase/firestore'
import { auth$, authOrEMPTY$ } from './auth';
import {
  docData, collectionData,
} from 'rxfire/firestore';
import { IRepetitionList, IRepetitionWord, IUserSettings, RepetitionStyle } from '@parrotly.io/types'
import { getAuth } from 'firebase/auth'
import { first, shareReplay, switchMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { DocumentReference } from 'node_modules/rxfire/firestore/interfaces';
import { FirebaseRefs, userSettingsPath } from '@parrotly.io/constants';


const db = getFirestore();

auth$.pipe(first()).subscribe(user => {
  if (user) return
  clearIndexedDbPersistence(db)
  enableIndexedDbPersistence(db)
})


export const userAndSettings$ = authOrEMPTY$.pipe(
  switchMap(user => {
    const settingsRef = doc(db, `${FirebaseRefs.settings}/${user.uid}`) as DocumentReference<IUserSettings>;
    return combineLatest([
      of(user),
      docData(settingsRef, { idField: 'id' }),
    ])
  }),
  shareReplay({ bufferSize: 1, refCount: true })
)

export const categoriesAndLists$ = authOrEMPTY$.pipe(
  switchMap(user => {
    const repetitionListCollection = collection(db, FirebaseRefs.repetition_lists);
    const collectionQuerry = query(repetitionListCollection, where("creatorId", "==", user.uid)) as Query<IRepetitionList>;
    return collectionData(collectionQuerry, { idField: 'id' }).pipe(
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
      ))
    )
  }),
  shareReplay({ bufferSize: 1, refCount: true })
)

categoriesAndLists$.subscribe(() => null)

//methods
export const saveToRepetitionList = async (word: string, translation: string, category_id?: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) { // user is signed in.
    return runTransaction(db, async (transaction) => {
      const id = user.uid;
      const repetitionListRef = doc(db, FirebaseRefs.repetition_lists, category_id || `${id}_default`) as DocumentReference<IRepetitionList>
      const repetitionListSnapshot = await transaction.get(repetitionListRef)
      const wordsSample = repetitionListSnapshot.data().wordsSample ?? []
      const repetitionWordRef = doc(collection(repetitionListRef, FirebaseRefs.list))
      const wordCount = increment(1)
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

export const incrementWordShowCount = async (repetitionWordId: string, category_id: string, type: RepetitionStyle, passedQuizOrMcq = false) => {
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
