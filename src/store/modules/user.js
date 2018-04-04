import Vue from 'vue'
const state = {
    UserData: {}
}
const actions = {
    getUser({ commit, state }, agentId) {
        Vue.http.get('me').then(res => {
            if (res.data.code === 200) {
                commit('setUser', res.data.data)
            } else {
                console.log('get user data error')
            }
        })
    }
}
// mutations
const mutations = {
    setUser(state, status) {
        state.UserData = status
    }
}

export default {
    state,
    actions,
    mutations
}
