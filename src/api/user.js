import api from '@/utils/api'
import { getToken } from '@/utils/auth'

export function getAllRolesInUserPage() {
  return api({
    url: '/roles/allRoles',
    method: 'get',
    params: { 'token': getToken() }
  })
}

export function getAllUsers(listQuery) {
  return api({
    url: '/users/all',
    method: 'get',
    params: {
      'token': getToken(),
      'page': listQuery.pageNum,
      'page_size': listQuery.pageRow
    }
  })
}

export function addUser(user) {
  return api({
    url: '/users/',
    method: 'post',
    params: {
      'token': getToken(),
      'user': user
    }
  })
}

export function updateUser(user) {
  return api({
    url: '/users/' + user.userId,
    method: 'patch',
    params: {
      'token': getToken(),
      'user': user
    }
  })
}

export function deleteUser(userId) {
  return api({
    url: '/users/' + userId,
    method: 'delete',
    params: {
      'token': getToken()
    }
  })
}
