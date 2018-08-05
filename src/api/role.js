import api from '@/utils/api'
import { getToken } from '@/utils/auth'

export function getAllPermissions() {
  return api({
    url: 'http://127.0.0.1:8090/sys/permissions/all',
    method: 'get',
    params: { '_ImpToken_': getToken() }
  })
}

export function getAllRoles() {
  return api({
    url: 'http://127.0.0.1:8090/sys/role/conf/all',
    method: 'get',
    params: { '_ImpToken_': getToken() }
  })
}

export function getRoleInfos() {
  return api({
    url: 'http://127.0.0.1:8090/sys/role/conf/getRoleInfos',
    method: 'get',
    params: { }
  })
}

export function addRole(role) {
  return api({
    url: 'http://127.0.0.1:8090/sys/role/conf/permissions',
    method: 'post',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'pkRole': role.pkRole,
      'roleCode': role.roleCode,
      'roleName': role.roleName,
      'roleInfo': role.roleInfo,
      'permissions': role.permissions
    }
  })
}

export function updateRole(role) {
  return api({
    url: 'http://127.0.0.1:8090/sys/role/conf/permissions/' + role.pkRole,
    method: 'post',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'pkRole': role.pkRole,
      'roleCode': role.roleCode,
      'roleName': role.roleName,
      'roleInfo': role.roleInfo,
      'permissions': role.permissions
    }
  })
}

export function deleteRole(pkRole) {
  return api({
    url: 'http://127.0.0.1:8090/sys/role/conf/' + pkRole,
    method: 'delete',
    params: {
    }
  })
}
