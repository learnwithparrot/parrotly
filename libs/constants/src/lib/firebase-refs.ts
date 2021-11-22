export const FirebaseRefs = {
  repetition_lists: 'repetition_lists',
  list: 'list',
  users: 'users',
  settings: 'settings',
  stats: '--stats--',
}

export function userSettingsPath(userId) { return `${FirebaseRefs.settings}/${userId}`; }
export function defaultUserList(userId) { return `${userId}_default`; }
