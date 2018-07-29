import api from '@/utils/api'
import { getToken } from '@/utils/auth'

export function getAllRolesInUserPage() {
  return api({
    url: 'http://127.0.0.1:8090/sys/role/conf/all',
    method: 'get',
    params: {
    }
  })
}

export function getAllUsers(listQuery) {
  return api({
    url: 'http://127.0.0.1:8090/sys/user/',
    method: 'get',
    params: {
      'page': listQuery.pageNum - 1,
      'size': listQuery.pageRow
    }
  })
}

export function addUser(user) {
  return api({
    url: 'http://127.0.0.1:8090/sys/user/role/' + user.roleId,
    method: 'post',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'userCode': user.userCode,
      'userName': user.userName,
      'userEmail': user.userEmail,
      'userPhone': user.userPhone,
      'endTime': '',
      'userPassword': user.userPassword
    }
  })
}

export function updateUser(user) {
  return api({
    url: 'http://127.0.0.1:8090/sys/user/role/' + user.roleId,
    method: 'patch',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'userCode': user.userCode,
      'userName': user.userName,
      'userEmail': user.userEmail,
      'userPhone': user.userPhone,
      'endTime': '',
      'userPassword': user.userPassword
    }
  })
}

export function deleteUser(userId) {
  return api({
    url: 'http://127.0.0.1:8090/sys/user/' + userId,
    method: 'delete',
    params: {
    }
  })
}
