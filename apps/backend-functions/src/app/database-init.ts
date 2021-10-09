import * as admin from 'firebase-admin'
import { DatabaseFunctionType } from './utils'
import { getDoc, setDoc } from './utils/firebase'
import { IUser } from './types'

export const initFirestore: DatabaseFunctionType = async (snapshot, context) => {
  const db = admin.firestore()
  const userSnapshot = await getDoc<IUser>(`users/${context.auth.uid}`)

  if (!userSnapshot.exists) return

  const user = userSnapshot.data()
  if (!user.isAdmin) return

  const countStat = { count: 0 }

  setDoc(`repetition_lists/--stats--`, countStat) /** Repetition List */
  setDoc(`users/--stats--`, countStat) /** Users List */
}
