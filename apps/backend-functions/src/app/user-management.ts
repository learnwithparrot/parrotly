import { AuthFunctionType } from './utils';
import * as admin from 'firebase-admin'
import { IRepetitionList, IUser, IUserSettings } from '@parrotly.io/types';
import { defaultUserList, FirebaseRefs } from '@parrotly.io/constants';

/**
 * 1. create user and increments counter count.
 * 2. Creates settings doc.
 * 3. Creates default repetition list and increments counter stat.
 * 4. @todo: send welcome email.
 */
export const onNewUser: AuthFunctionType = async (user, context) => {
  const db = admin.firestore()
  const userStatsDocPath = db.doc(`${FirebaseRefs.users}/${FirebaseRefs.stats}`)
  const listStatsDocPath = db.doc(`${FirebaseRefs.repetition_lists}/${FirebaseRefs.stats}`)
  const id = user.uid
  const batch = db.batch()
  const increment = admin.firestore.FieldValue.increment(1);

  const userData: IUser = {
    email: user.email,
    displayName: user.displayName,
    photoUrl: user.photoURL,
    id,
  }

  const defaultUserSettings: IUserSettings = {
    id, forbiddenUrls: [],
    languageLearned: 'de',
    languageSpoken: 'en',
    maximumMCQs: 50,
    maximumQuizzes: 50,
    quantityOfTranslations: 'small',
    maximumRepetition: 100,
    showCardDurationSeconds: 6,
    showCardIntervalDurationMinutes: 30,
    enableNotifications: true,
    theme: 'rotate'
  }

  batch.set(db.doc(`${FirebaseRefs.users}/${id}`), userData)
  batch.set(db.doc(`${FirebaseRefs.settings}/${id}`), defaultUserSettings)
  batch.update(userStatsDocPath, { count: increment },)


  //3. create default list and increments list counter stat
  const listId = defaultUserList(user.uid)
  const defaultList: IRepetitionList = {
    wordCount: 0,
    wordsSample: [],
    numberOfFork: 0,
    rating: 2.5,
    id: listId,
    public: false,
    languageWord: defaultUserSettings.languageSpoken,
    languageTranslation: defaultUserSettings.languageLearned,
    default: true,
    name: 'Default List',
    creatorId: id,
    creatorDisplayName: user.displayName,
    creatorPhotoUrl: user.photoURL
  }

  batch.set(db.doc(`${FirebaseRefs.repetition_lists}/${listId}`), defaultList)
  batch.update(listStatsDocPath, { count: increment },)

  return batch.commit()
}

