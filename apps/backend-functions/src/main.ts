import * as admin from 'firebase-admin'
import { onNewAuthUser, onActionIntent } from './app/utils'
import {
  onNewUser, initFirestore,
} from './app'

admin.initializeApp()

export const onAuthNewUser = onNewAuthUser(onNewUser)
export const onInitFirestore = onActionIntent('init', initFirestore)
