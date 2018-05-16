/**
 * @author xujw
 * 2018-4-16 17:43:13
 * Vuex 状态管理相关代码
 */

import Vue from 'vue';
import Vuex from 'vuex';

import api from '../api/api.js';
import Util from '../libs/util.js';
import app from '../main.js';

let axios = Util.ajax;
Vue.use(Vuex);
/* Vuex的store对象*/
const store = new Vuex.Store({
  state: {
    isUserLogin: false,
    token: '',
    user: null,
    dailyTask: null,
    reviewTask: null,
    practiceTask: null,
    glossaryPage: []
  },
  mutations: {
    /**
     * mutations用于修改store中的数据,其中的方法必须为同步方法
     */
    setUserInfo(state, userInfo) {
      state.isUserLogin = true;
      state.user = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    logout(state) {
      localStorage.removeItem('userInfo');
      state.isUserLogin = false;
      state.user = null;
    },
    setToken(state, token) {
      state.token = token;
    },
    setDailyTask(state, dailyTask) {
      state.dailyTask = dailyTask;
    },
    setGlossaryPage(state, data) {
      state.glossaryPage = data;
    },
    setReviewTask(state, task) {
      state.reviewTask = task;
    },
    setPracticeTask(state, task) {
      state.practiceTask = task;
    }
  },
  getters: {
    /* 用于获取store中的数据 */
    getToken: state => {
      return state.token;
    },
    getLoginStatus: state => {
      return state.isUserLogin;
    },
    getUser: state => {
      return state.user;
    },
    getDailyTask: state => {
      return state.dailyTask;
    },
    glossaryPage: state => {
      return state.glossaryPage;
    },
    reviewTask: state => state.reviewTask,
    practiceTask: state => state.practiceTask,
  },
  actions: {
    /* 从服务器读取新的用户信息 */
    sysUserInfo({commit}) {
      axios.get('/user/getOnlineUser')
          .then(res => {
            /* 提交mutations触发setter操作 */
            commit('setUserInfo', res.data);
          })
          .catch(e => {
            app.$Modal.warning(
                {title: '登录已失效', content: '登录超时,请重新登录!'});
            commit('logout');
          });
    },
    getDailyTask({commit}, isRefresh) {
      /* 返回promise以使Action处理完成后能够异步执行后续流程 */
      return new Promise((resolve, reject) => {
        axios
            .get(
                '/task/getDailyTask',
                {params: {refresh: isRefresh ? true : false}})
            .then(res => {
              commit('setDailyTask', res.data);
              /* 回调 */
              resolve();
            })
            .catch(err => {
              reject();
            });
      })
    },
    sysReviewTask({commit}) {
      return new Promise((resolve, reject) => {
        /* 从服务器获取复习任务 */
        axios.get('/task/getReviewTask')
            .then(res => {
              commit('setReviewTask', res.data);
              resolve();
            })
            .catch(err => {
              reject(err);
            });
      });
    },
    sysPracticeTask({commit}) {
      /* 从服务器获取练习任务 */

    },
    getGlossaryPage({commit}, args) {
      axios.get('/glossary/personalGlossaryPage', {params: args})
          .then(res => {
            commit('setGlossaryPage', res.data);
          })
          .catch(err => {
            commit('setGlossaryPage', []);
          })
    }
  }
});
window.onbeforeunload = function(e) {
  // 清除
  // localStorage.removeItem('userInfo');
};
export default store;