import api from '@/utils/api'

export function login(username, password) {
  return api({
    url: '/PubApi/login',
    method: 'post',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'userCode': username,
      'userPassword': password
    }
  })
}

export function getInfo(token) {
  return api({
    url: 'http://127.0.0.1:8090/users/getInfo',
    method: 'get',
    params: { '_ImpToken_': token }
  })
}

export function logout() {
  return api({
    url: '/PubApi/logout',
    method: 'post'
  })
}
