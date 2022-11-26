// import api from '@/api'
// import qs from 'qs'
// import { Message } from 'element-ui'
import { local } from '@/util/storage'
const state = {
    username: localStorage.username || '',
    token: localStorage.token || '',
    failure_time: localStorage.failure_time || '',
    msgKey: localStorage.msgKey || '',
    permissions: localStorage.permissions || [],
    companyId: localStorage.companyId || '',
    isDesensitization: localStorage.isDesensitization || 0,
    userInfo: localStorage.userInfo || null,
    agentId: localStorage.agentId || '',
    stime: localStorage.stime || '',
    etime: localStorage.etime || '',
    isLogout: false
}

const getters = {
    isLogin: state => {
        let retn = false
        if (state.token) {
            let unix = Date.parse(new Date())
            if (unix < state.failure_time * 1000) {
                retn = true
            }
        }
        return retn
    }
}

const actions = {
    login({commit}, data) {
        return new Promise((resolve, reject) => {
            const userData = {
                username: data.username,
                token: '1',
                permissions: [],
                failure_time: Date.parse(new Date()) / 1000 + 24 * 60 * 60
            }
            commit('setUserData', userData)
            resolve()
            console.log(reject)
        })
    },
    logout({commit}) {
        // 临时
        commit('removeUserData')
        commit('menu/invalidRoutes', null, {root: true})
    }
}

const mutations = {
    setUserData(state, data) {
        localStorage.setItem('username', data.username)
        localStorage.setItem('token', data.token)
        localStorage.setItem('failure_time', data.failure_time)
        localStorage.setItem('msgKey', data.msgKey)
        localStorage.setItem('companyId', data.companyId)
        localStorage.setItem('agentId', data?.userInfo?.agentId ?? '')
        localStorage.setItem('permissions', JSON.stringify(data.permissions))
        localStorage.setItem('isDesensitization', data.isDesensitization)
        local.setItem('userInfo', data?.userInfo ?? '')
        localStorage.setItem('stime', data.stime)
        localStorage.setItem('etime', data.etime)
        localStorage.setItem('sipIP', data?.userInfo?.sipIP ?? '')
        localStorage.setItem('sipPort', data?.userInfo?.sipPort ?? '')
        state.username = data.username
        state.token = data.token
        state.msgKey = data.msgKey
        state.companyId = data.companyId
        state.agentId = data?.userInfo?.agentId ?? ''
        state.failure_time = data.failure_time
        state.permissions = data.permissions
        state.isDesensitization = data.isDesensitization
        state.userInfo = data?.userInfo ?? ''
        state.stime = data.stime
        state.etime = data.etime
    },
    removeUserData(state) {
        localStorage.removeItem('username')
        localStorage.removeItem('token')
        localStorage.removeItem('failure_time')
        localStorage.removeItem('msgKey')
        localStorage.removeItem('componyId')
        localStorage.removeItem('agentId')
        localStorage.removeItem('permissions')
        localStorage.removeItem('isDesensitization')
        local.removeItem('userInfo')
        localStorage.removeItem('stime')
        localStorage.removeItem('etime')
        localStorage.removeItem('agentp')
        localStorage.removeItem('shortName')
        localStorage.removeItem('sipIP')
        localStorage.removeItem('sipPort')
        localStorage.removeItem('loginType')
        state.username = ''
        state.token = ''
        state.failure_time = ''
        state.msgKey = ''
        state.companyId = ''
        state.permissions = []
        state.isDesensitization = 0
        state.userInfo = null
        state.agentId = ''
        state.stime = ''
        state.etime = ''
    },
    isLogout(state, status) {
        state.isLogout = status
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
