import api from '@/utils/api'
import { getToken } from '@/utils/auth'

export function getAllPermissions() {
  return api({
    url: '/permissions/all',
    method: 'get',
    params: { 'token': getToken() }
  })
}

export function getAllRoles() {
  return api({
    url: '/roles/all',
    method: 'get',
    params: { 'token': getToken() }
  })
}

export function addRole(role) {
  return api({
    url: '/roles/',
    method: 'post',
    params: {
      'token': getToken(),
      'role': role
    }
  })
}

export function updateRole(role) {
  return api({
    url: '/roles/' + role.roleId,
    method: 'patch',
    params: {
      'token': getToken(),
      'role': role
    }
  })
}

export function deleteRole(roleId) {
  return api({
    url: '/roles/' + roleId,
    method: 'delete',
    params: {
      'token': getToken()
    }
  })
}
