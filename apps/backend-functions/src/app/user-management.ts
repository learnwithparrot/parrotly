import { AuthFunctionType } from './utils';
import * as admin from 'firebase-admin'
import { IRepetitionList, IUser } from './types';

/**
 * 1. create user and increments counter count.
 * 2. Creates default repetition list and increments counter stat.
 * 3. @todo: send welcome email.
 */
export const onNewUser: AuthFunctionType = async (user, context) => {
  const db = admin.firestore()
  const userStatsDocPath = db.doc('users/--stats--')
  const listStatsDocPath = db.doc('repetition_lists/--stats--')
  const id = user.uid
  const batch = db.batch()
  const increment = admin.firestore.FieldValue.increment(1);

  const userData: IUser = {
    email: user.email,
    displayName: user.displayName,
    photoUrl: user.photoURL,
    languageSpoken: 'en',
    languageLearned: 'de',
    id,
  }

  batch.set(db.doc(`users/${id}`), userData)
  batch.update(userStatsDocPath, {count:increment},)


  //2. create default list and increments list counter stat
  const listId = `${user.uid}_default`
  const defaultList: IRepetitionList = {
    wordCount: 0,
    wordsSample: [],
    numberOfFork: 0,
    rating: 2.5,
    id: listId,
    public: false,
    default: true,
    name: 'Default List',
    creatorId: id,
    creatorDisplayName: user.displayName,
    creatorPhotoUrl: user.photoURL
  }

  batch.set(db.doc(`list/${listId}`), defaultList)
  batch.update(listStatsDocPath, {count:increment},)

  return batch.commit()
}

