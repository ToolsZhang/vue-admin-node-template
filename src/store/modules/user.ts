import { login, logout, getInfo } from '@/api/login'
import Vue from 'vue'
import { getToken, setToken, removeToken } from '@/utils/token'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state: any, token: any) => {
      state.token = token
    },
    SET_NAME: (state: any, name: any) => {
      state.name = name
    },
    SET_DEPT: (state: any, dept: any) => {
      state.dept = dept
    },
    SET_AVATAR: (state: any, avatar: any) => {
      state.avatar = avatar
    },
    SET_ROLES: (state: any, roles: any) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state: any, permissions: any) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }: any, userInfo: any) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then((res: any) => {
          let vue = new Vue()
          vue.$authJwt.signJwt(res.token);
          setToken(res.token)
          commit('SET_TOKEN', res.token);
          resolve(null)
        }).catch((error: any) => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }: any) {
      return new Promise((resolve, reject) => {
        const header = { Authorization: `Bearer ${ state.token }` }
        
        getInfo(header).then((res: any) => {
          const user = res;
          const avatar = user.avatar  ? user.avatar : require("@/assets/images/pic_1.png") ;
          commit('SET_PERMISSIONS', user.permissions);
          commit('SET_ROLES', user.role);
          commit('SET_DEPT', user.dept._id)
          commit('SET_NAME', user.nick_name)
          commit('SET_AVATAR', avatar)
          resolve(user)
        }).catch((error: any) => {
          reject(error)
        })
      })
    },
    
    // 退出系统
    LogOut({ commit, state }: any) {
      return new Promise((resolve, reject) => {
        const header = { Authorization: `Bearer ${ state.token }` }
        logout(header).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          let vue = new Vue()
          vue.$authJwt.signout();
          removeToken()
          resolve(null)
        }).catch((error: any) => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }: any) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        let vue = new Vue()
        vue.$authJwt.signout();
        removeToken()
        resolve(null)
      })
    }
  }
}

export default user
