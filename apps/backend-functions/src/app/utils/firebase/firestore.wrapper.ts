import * as admin from 'firebase-admin'

export const getDoc = async <T>(path: string) => {
  return admin.firestore().doc(path).get() as Promise<FirebaseFirestore.DocumentSnapshot<T>>
}

export const setDoc = async <T>(path: string, data: FirebaseFirestore.DocumentData) => {
  return admin.firestore().doc(path).set(data)
}
