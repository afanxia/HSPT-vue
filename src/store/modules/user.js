import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { default as api } from '../../utils/api'
import store from '../../store'
import router from '../../router'

const user = {
  state: {
    token: getToken(),
    userName: '',
    pkUser: '',
    avatar: '',
    role: '',
    menus: [],
    permissions: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    RESET_TOKEN: (state) => {
      state.token = ''
    },
    SET_USER: (state, userInfo) => {
      state.userName = userInfo.userName
      state.pkUser = userInfo.pkUser
      state.avatar = 'https://www.gravatar.com/avatar/6560ed55e62396e40b34aac1e5041028'
      // state.avatar = userInfo.avatar
      state.role = userInfo.roleName
      state.menus = userInfo.menuList
      state.permissions = userInfo.permissionList
    },
    RESET_USER: (state) => {
      state.token = ''
      state.userName = ''
      state.pkUser = ''
      state.avatar = ''
      state.role = ''
      state.menus = []
      state.permissions = []
    }
  },
  actions: {
    // 登录
    Login({ commit, state }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          console.log(response)
          const data = response.data
          const _token = data.token.substr(7) // 为了去掉token开头自带的'Bearer '
          setToken(_token)
          commit('SET_TOKEN', _token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(data => {
          // 储存用户信息
          commit('SET_USER', data.data)
          // 生成路由
          const userInfo = data.data
          store.dispatch('GenerateRoutes', userInfo).then(() => {
            // 生成该用户的新路由json操作完毕之后,调用vue-router的动态新增路由方法,将新路由添加
            router.addRoutes(store.getters.addRouters)
          })
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(data => {
          commit('RESET_USER')
          commit('RESET_TOKEN')
          removeToken()
          resolve(data)
        }).catch(() => {
          commit('RESET_USER')
          commit('RESET_TOKEN')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('RESET_USER')
        commit('RESET_TOKEN')
        removeToken()
        resolve()
      })
    }
  }
}
export default user
