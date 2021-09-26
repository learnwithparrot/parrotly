// import {friestore as db} from './firestore-init'
import { setDoc, getFirestore, doc, } from '@firebase/firestore'

const db = getFirestore();

export const saveToRepetitionList = (word: string) => {
  const cityRef = doc(db, 'repetition_list', 'repetition_list_id');
  return setDoc(cityRef, { word, count: 0 })
}
