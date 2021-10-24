export enum FirebaseRefs {
  repetition_lists = 'repetition_lists',
  list = 'list',
  users = 'users',
  settings = 'settings',
  stats = '--stats--',
}

export const userSettingsPath = (userId) => `${FirebaseRefs.settings}/${userId}`
