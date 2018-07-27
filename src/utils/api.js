import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'
import store from '../store'

// import qs from 'qs'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_URL, // api的base_url
  timeout: 15000 // 请求超时时间2
})
// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['_ImpToken_'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // config.params.token = getToken()
    // config.params['_ImpToken_'] = getToken()
  }

  // 配置request的POST为form-data形式
  if (config.method === 'post') {
  //  config.data = qs.stringify(config.data)
  //  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  return config
}, error => {
  // Do something with request error
  console.error(error) // for debug
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status === 1) {
      return res
    } else if (res.status === 2) {
      Message({
        showClose: true,
        message: res.returnMsg,
        type: 'error',
        duration: 500,
        onClose: () => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }
      })
      return Promise.reject('未登录')
    } else {
      Message({
        message: res.returnMsg,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(res)
    }
  },
  error => {
    console.error('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)
export default service

