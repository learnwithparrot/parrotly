import { DatabaseFunctionType } from './utils'
import { getDoc, setDoc } from './utils/firebase'
import { IUser } from '@parrotly.io/types'
import { FirebaseRefs } from '@parrotly.io/constants'

export const initFirestore: DatabaseFunctionType = async (snapshot, context) => {
  // const userSnapshot = await getDoc<IUser>(`${FirebaseRefs.users}/${context.auth.uid}`)

  // if (!userSnapshot.exists) return
  // const user = userSnapshot.data()
  // if (!user.isAdmin) return
  // console.log({user})

  const countStat = { count: 0 }

  setDoc(`${FirebaseRefs.repetition_lists}/${FirebaseRefs.stats}`, countStat) /** Repetition List */
  setDoc(`${FirebaseRefs.users}/${FirebaseRefs.stats}`, countStat) /** Users List */
}
