import { addDoc, getFirestore, collection, } from 'firebase/firestore'

const db = getFirestore();

export const saveToRepetitionList = (word: string, translation: string) => {
  const data = { word, count: 0, translation, quiz_mcq_pass_count: 0, quiz_translate_pass: 0 };
  const cityRef = collection(db, 'repetition_list');
  return addDoc(cityRef, data)
}
