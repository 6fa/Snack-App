import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  token: window.localStorage.getItem("token"), //初始化时用getItem('token'),刷新页面就无需重新登录
  userName: window.localStorage.getItem("username"),
  userHead: window.localStorage.getItem("userhead"),
  isloaded: window.localStorage.getItem("isloaded")
};
const mutations = {
  LOGIN: (state, token) => {
    state.token = token;
    state.isloaded = true;
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("isloaded", true);
  },
  LOGOUT: state => {
    state.token = null;
    state.isloaded = false;
    window.localStorage.removeItem("token");
    window.localStorage.setItem("isloaded", false);
  },
  USERNAME: (state, name) => {
    state.userName = name;
    window.localStorage.setItem("username", name);
  },
  USERHEAD: (state, img) => {
    state.userHead = img;
    window.localStorage.setItem("userhead", img);
  }
};
const actions = {
  TOLOGIN({ commit }, token) {
    commit("LOGIN", token);
  },
  TOLOGOUT({ commit }) {
    commit("LOGOUT");
  },
  TOUSERNAME({ commit }, name) {
    commit("USERNAME", name);
  },
  TOUSERHEAD({ commit }, img) {
    commit("USERHEAD", img);
  }
};
export default new Vuex.Store({
  state,
  mutations,
  actions
});
