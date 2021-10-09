import * as functions from 'firebase-functions';

///////////////////////////////////
// DOCUMENT ON-CHANGES FUNCTIONS //
///////////////////////////////////

export type FunctionType = (change: functions.Change<functions.firestore.DocumentSnapshot>, context: functions.EventContext) => any;
export type DocCreateDeleteFunctionType = (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => any;
export type AuthFunctionType = (user: functions.auth.UserRecord, context: functions.EventContext) => any;
export type DatabaseFunctionType = (snapshot: functions.database.DataSnapshot, context: functions.EventContext) => any;

/**
 * Trigger a function when a document is written (create / update / delete).
 *
 * Handles internal features such as skipping functions when we backup / restore the db.
 */
export function onDocumentWrite(docPath: string, fn: FunctionType) {
  return functions.firestore
    .document(docPath)
    .onWrite(fn);
}

export function onDocumentUpdate(docPath: string, fn: FunctionType) {
  return functions.firestore
    .document(docPath)
    .onUpdate(fn);
}

export function onDocumentDelete(docPath: string, fn: DocCreateDeleteFunctionType) {
  return functions.firestore
    .document(docPath)
    .onDelete(fn)
}

export function onDocumentCreate(docPath: string, fn: DocCreateDeleteFunctionType) {
  return functions.firestore
    .document(docPath)
    .onCreate(fn);
}


///////////////////////////////////
// AUTH TRIGGER FUNCTIONS //
///////////////////////////////////

export function onNewAuthUser(fn: AuthFunctionType) {
  return functions.auth.user().onCreate(fn)
}


export function onDeleteAuthUser(fn: AuthFunctionType) {
  return functions.auth.user().onDelete(fn)
}


///////////////////////////////////
// REALTIME DATABASE TRIGGER //
///////////////////////////////////

export function onDatabaseIntent(path: string, fn: DatabaseFunctionType) {
  return functions.database.ref(path).onCreate(fn)
}

export function onActionIntent(path: string, fn: DatabaseFunctionType) {
  return onDatabaseIntent(`/intents/${path}`, fn)
}
