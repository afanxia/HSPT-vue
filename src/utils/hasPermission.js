import store from '../store'

export function hasPermission(permission) {
  let myPermissions = store.getters.permissions

  const tmpPerm = JSON.stringify(myPermissions)
  if (tmpPerm && typeof (JSON.parse(tmpPerm) === 'object')) {
    myPermissions = JSON.parse(tmpPerm)
  }
  for (const perm of myPermissions) {
    if (perm.permissionsCode === permission) {
      return true
    }
  }
  return false
}
