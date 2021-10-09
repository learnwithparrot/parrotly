import { addDoc, getFirestore, collection } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const db = getFirestore();

export const saveToRepetitionList = (word: string, translation: string, category_id?: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) { // user is signed in.
    const id = user.uid;
    const repetitionCollection = collection(db, 'repetition_lists', category_id || `${id}_default`, 'list')
    const data = { word, count: 0, translation, quiz_mcq_pass_count: 0, quiz_translate_pass: 0 };
    return addDoc(repetitionCollection, data)
  }
}
