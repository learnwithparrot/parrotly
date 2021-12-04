import type { DatabaseFunctionType } from './utils'
import { setDoc } from './utils/firebase'
import { FirebaseRefs } from '@parrotly.io/constants'

export const initFirestore: DatabaseFunctionType = async (snapshot, context) => {
  const countStat = { count: 0 }

  setDoc(`${FirebaseRefs.repetition_lists}/${FirebaseRefs.stats}`, countStat) /** Repetition List */
  setDoc(`${FirebaseRefs.users}/${FirebaseRefs.stats}`, countStat) /** Users List */
}
