import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Routers from './config/router';
import Util from './libs/util';
import App from './views/app.vue';
import MyFooter from './views/footer/footer.vue';
import MainHeader from './views/header/header.vue';
import './res/theme/MyTheme.less';
import 'iview/dist/styles/iview.css';
/* 注册Vue组件 */
Vue.component('MainHeader', MainHeader);
Vue.component('MyFooter', MyFooter);

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(Vuex);
/* 配置vue的http属性为axios,方便全局使用 */
Vue.prototype.$http = Util.ajax;
Vue.prototype.$util = Util;

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: Routers
};
const router = new VueRouter(RouterConfig);
/* Vuex的store对象*/
const store = new Vuex.Store({
  state: {isUserLogin: false, token: '', user: null},
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
    }
  },
  getters: {
    /* 用于获取store中的数据 */
    getToken: state => {
      return state.token
    },
    getLoginStatus: state => {
      return state.isUserLogin
    },
    getUser: state => {
      return state.user
    }
  },
  actions: {
    /* 从服务器读取新的用户信息 */
    sysUserInfo({commit}){
      myApp.$http.get('/user/getOnlineUser').then(res=>{
        commit('setUserInfo',res.data);
      }).catch(e=>{
        myApp.$Modal.warning(
          {title: '登录已失效', content: '登录超时,请重新登录!'});
        commit('logout');
      });
    }
  }
});

function loginCheck() {
  //先从state里面获取用户登录信息
  let userInfo = store.state.user;
  //如果 state 里面获取不到，那么从localStorage里面获取
  if (userInfo == null) {
    userInfo = JSON.parse(localStorage.getItem('userInfo') || null)
    }
  if (userInfo == null) {
    store.state.isUserLogin = false;
    return false;
  } else {
    store.state.isUserLogin = true;
    store.state.user = userInfo;
    return true;
  }
}

/* 页面加载时显示进度条 */
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !loginCheck()) {
    myApp.$Modal.warning(
        {title: '用户未登录', content: '请先完成登录再进行相关操作!'});
    next({path: '/login', query: {redirect: to.fullPath}});
  } else if (loginCheck() && (to.path == '/' || to.path == '/login')) {
    next({path: '/wordsMemory', query: {redirect: to.fullPath}});
  } else {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
  }
});

router.afterEach(() => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});
/* 创建vue实例 */
var myApp = new Vue({el: '#app', router, store, render: h => h(App)});