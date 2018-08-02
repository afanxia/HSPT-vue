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
    url: 'http://127.0.0.1:8090/sys/role/conf/',
    method: 'post',
    params: {
      '_ImpToken_': getToken(),
      'role': role
    }
  })
}

export function updateRole(role) {
  return api({
    url: 'http://127.0.0.1:8090/sys/role/conf/' + role.roleId,
    method: 'patch',
    params: {
      '_ImpToken_': getToken(),
      'role': role
    }
  })
}

export function deleteRole(roleId) {
  return api({
    url: 'http://127.0.0.1:8090/sys/role/conf/' + roleId,
    method: 'delete',
    params: {
      '_ImpToken_': getToken()
    }
  })
}
